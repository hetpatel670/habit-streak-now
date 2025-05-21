
import React, { lazy, Suspense } from 'react';
import { AppProvider } from '@/context/AppContext';
import Navigation from '@/components/Navigation';
import { useAppContext } from '@/context/AppContext';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load components to improve initial load time
const LoginPage = lazy(() => import('@/components/LoginPage'));
const TaskList = lazy(() => import('@/components/TaskList'));
const NewTaskPage = lazy(() => import('@/components/NewTaskPage'));
const Dashboard = lazy(() => import('@/components/Dashboard'));
const Onboarding = lazy(() => import('@/components/Onboarding'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

const AppContent = () => {
  const { isLoggedIn, activeTab, setActiveTab, showOnboarding } = useAppContext();

  // Add console log for debugging
  console.log('AppContent rendering, isLoggedIn:', isLoggedIn);

  if (!isLoggedIn) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage />
      </Suspense>
    );
  }
  
  // Show onboarding for new users
  if (showOnboarding) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Onboarding />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-app-darkblue relative">
      <div className="pb-16">
        <Suspense fallback={<LoadingSpinner />}>
          {activeTab === 'home' && <TaskList />}
          {activeTab === 'add' && <NewTaskPage onBack={() => setActiveTab('home')} />}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'profile' && <ProfilePage />}
        </Suspense>
      </div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

// Add ErrorBoundary to handle any errors during lazy loading
import ErrorBoundary from '@/components/ErrorBoundary';

const Index = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default Index;
