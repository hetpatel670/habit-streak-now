
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Task, User, Badge } from '../types';

interface AppContextType {
  tasks: Task[];
  user: User | null;
  badges: Badge[];
  isLoggedIn: boolean;
  currentStreak: number;
  completedTasksPercentage: number;
  addTask: (task: Omit<Task, 'id'>) => void;
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
  deleteTask: (id: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
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
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Drink water', frequency: 'daily', isCompleted: true },
    { id: '2', name: 'Stretch 5 minutes', frequency: 'daily', isCompleted: true },
    { id: '3', name: 'Read 10 pages', frequency: 'every-3-hours', isCompleted: false },
    { id: '4', name: 'Call Mom', frequency: 'daily', reminderTime: '5:00 PM', isCompleted: true },
  ]);
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(5);
  const [completedTasksPercentage, setCompletedTasksPercentage] = useState(80);
  
  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: 'Hydration Hero', icon: '💧', description: 'Complete water drinking tasks 7 days in a row', earned: true },
    { id: '2', name: 'Early Reader', icon: '📚', description: 'Read in the morning for 5 days', earned: true },
    { id: '3', name: 'Productive Week', icon: '🎯', description: 'Complete all tasks for a full week', earned: true },
  ]);

  // Calculate completed tasks percentage
  useEffect(() => {
    if (tasks.length === 0) {
      setCompletedTasksPercentage(0);
      return;
    }
    
    const completedCount = tasks.filter(task => task.isCompleted).length;
    const percentage = (completedCount / tasks.length) * 100;
    setCompletedTasksPercentage(Math.round(percentage));
  }, [tasks]);
  
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const completeTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, isCompleted: true } : task
      )
    );
  };

  const uncompleteTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, isCompleted: false } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const login = async (email: string, password: string) => {
    // This would be replaced by actual Firebase authentication
    console.log('Logging in with:', email, password);
    
    // Mock successful login
    setUser({
      id: '123',
      email,
      points: 240,
      currentStreak: 5
    });
    setIsLoggedIn(true);
  };

  const loginWithGoogle = async () => {
    // This would be replaced by actual Firebase Google authentication
    console.log('Logging in with Google');
    
    // Mock successful login
    setUser({
      id: '123',
      email: 'user@example.com',
      points: 240,
      currentStreak: 5
    });
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AppContext.Provider value={{
      tasks,
      user,
      badges,
      isLoggedIn,
      currentStreak,
      completedTasksPercentage,
      addTask,
      completeTask,
      uncompleteTask,
      deleteTask,
      login,
      logout,
      loginWithGoogle
    }}>
      {children}
    </AppContext.Provider>
  );
};
