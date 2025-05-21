import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Task, User, Badge } from '../types';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut, 
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import {
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  off,
  push,
  serverTimestamp
} from 'firebase/database';
import { auth, database } from '../config/firebase';
import { suggestTask } from '@/utils/openRouterApi';

interface AppContextType {
  tasks: Task[];
  user: User | null;
  badges: Badge[];
  isLoggedIn: boolean;
  currentStreak: number;
  completedTasksPercentage: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  uncompleteTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  getSuggestedTask: () => Promise<string>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [completedTasksPercentage, setCompletedTasksPercentage] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  
  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: 'Hydration Hero', icon: '💧', description: 'Complete water drinking tasks 7 days in a row', earned: false },
    { id: '2', name: 'Early Reader', icon: '📚', description: 'Read in the morning for 5 days', earned: false },
    { id: '3', name: 'Productive Week', icon: '🎯', description: 'Complete all tasks for a full week', earned: false },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser.uid);
        setUser(userData);
        setIsLoggedIn(true);
        setupTaskListener(firebaseUser.uid);
        setupStreakListener(firebaseUser.uid);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setTasks([]);
        setCurrentStreak(0);
      }
    });

    return () => {
      unsubscribe();
      if (auth.currentUser) {
        const tasksRef = ref(database, `users/${auth.currentUser.uid}/tasks`);
        off(tasksRef);
      }
    };
  }, []);

  const fetchUserData = async (uid: string): Promise<User> => {
    try {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        const newUser = {
          id: uid,
          email: auth.currentUser?.email || '',
          points: 0,
          currentStreak: 0,
          createdAt: serverTimestamp()
        };
        await set(userRef, newUser);
        return newUser;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return {
        id: uid,
        email: auth.currentUser?.email || '',
        points: 0,
        currentStreak: 0
      };
    }
  };

  const setupTaskListener = (uid: string) => {
    const tasksRef = ref(database, `users/${uid}/tasks`);
    onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const tasksData = snapshot.val();
        const tasksList = Object.entries(tasksData).map(([id, data]: [string, any]) => ({
          id,
          ...data
        }));
        setTasks(tasksList);
        updateCompletionPercentage(tasksList);
      } else {
        setTasks([]);
        setCompletedTasksPercentage(0);
      }
    });
  };

  const setupStreakListener = (uid: string) => {
    const streakRef = ref(database, `users/${uid}/streak`);
    onValue(streakRef, (snapshot) => {
      if (snapshot.exists()) {
        setCurrentStreak(snapshot.val().current || 0);
      }
    });
  };

  const updateCompletionPercentage = (tasksList: Task[]) => {
    if (tasksList.length === 0) {
      setCompletedTasksPercentage(0);
      return;
    }
    const completedCount = tasksList.filter(task => task.isCompleted).length;
    const percentage = (completedCount / tasksList.length) * 100;
    setCompletedTasksPercentage(Math.round(percentage));
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!auth.currentUser) return;
    
    try {
      const tasksRef = ref(database, `users/${auth.currentUser.uid}/tasks`);
      const newTaskRef = push(tasksRef);
      
      await set(newTaskRef, {
        ...task,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const completeTask = async (id: string) => {
    if (!auth.currentUser) return;
    
    try {
      const taskRef = ref(database, `users/${auth.currentUser.uid}/tasks/${id}`);
      await update(taskRef, { 
        isCompleted: true,
        completedAt: serverTimestamp()
      });

      // Update user points
      const userRef = ref(database, `users/${auth.currentUser.uid}`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const currentPoints = userSnapshot.val().points || 0;
        await update(userRef, { points: currentPoints + 10 });
        setUser(prev => prev ? { ...prev, points: currentPoints + 10 } : null);
      }

      checkAndUpdateStreak();
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  };

  const uncompleteTask = async (id: string) => {
    if (!auth.currentUser) return;
    
    try {
      const taskRef = ref(database, `users/${auth.currentUser.uid}/tasks/${id}`);
      await update(taskRef, { 
        isCompleted: false,
        completedAt: null
      });
    } catch (error) {
      console.error('Error uncompleting task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    if (!auth.currentUser) return;
    
    try {
      const taskRef = ref(database, `users/${auth.currentUser.uid}/tasks/${id}`);
      await remove(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const checkAndUpdateStreak = async () => {
    if (!auth.currentUser) return;
    
    try {
      const tasksSnapshot = await get(ref(database, `users/${auth.currentUser.uid}/tasks`));
      if (!tasksSnapshot.exists()) return;

      const allTasks = Object.values(tasksSnapshot.val()) as Task[];
      const allCompleted = allTasks.every(task => task.isCompleted);

      if (allCompleted) {
        const streakRef = ref(database, `users/${auth.currentUser.uid}/streak`);
        const streakSnapshot = await get(streakRef);
        
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        let newStreak = 1;
        if (streakSnapshot.exists()) {
          const lastCompletedDate = new Date(streakSnapshot.val().lastCompletedDate);
          lastCompletedDate.setHours(0, 0, 0, 0);
          
          const timeDiff = now.getTime() - lastCompletedDate.getTime();
          const daysDiff = timeDiff / (1000 * 3600 * 24);
          
          if (daysDiff === 1) {
            newStreak = (streakSnapshot.val().current || 0) + 1;
          } else if (daysDiff === 0) {
            newStreak = streakSnapshot.val().current || 1;
          }
        }

        await set(streakRef, {
          current: newStreak,
          lastCompletedDate: now.toISOString()
        });

        setCurrentStreak(newStreak);
        
        // Update badges based on streak
        if (newStreak >= 7) {
          const updatedBadges = badges.map(badge => 
            badge.id === '1' ? { ...badge, earned: true } : badge
          );
          setBadges(updatedBadges);
        }
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      const userRef = ref(database, `users/${uid}`);
      await set(userRef, {
        id: uid,
        email,
        points: 0,
        currentStreak: 0,
        createdAt: serverTimestamp()
      });

      const streakRef = ref(database, `users/${uid}/streak`);
      await set(streakRef, {
        current: 0,
        lastCompletedDate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      const uid = userCredential.user.uid;
      const email = userCredential.user.email || '';
      
      const userRef = ref(database, `users/${uid}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        await set(userRef, {
          id: uid,
          email,
          points: 0,
          currentStreak: 0,
          createdAt: serverTimestamp()
        });

        const streakRef = ref(database, `users/${uid}/streak`);
        await set(streakRef, {
          current: 0,
          lastCompletedDate: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        const tasksRef = ref(database, `users/${auth.currentUser.uid}/tasks`);
        off(tasksRef);
      }
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const getSuggestedTask = async () => {
    return suggestTask(auth.currentUser?.uid);
  };

  return (
    <AppContext.Provider value={{
      tasks,
      user,
      badges,
      isLoggedIn,
      currentStreak,
      completedTasksPercentage,
      activeTab,
      setActiveTab,
      addTask,
      completeTask,
      uncompleteTask,
      deleteTask,
      login,
      register,
      logout,
      loginWithGoogle,
      getSuggestedTask
    }}>
      {children}
    </AppContext.Provider>
  );
};