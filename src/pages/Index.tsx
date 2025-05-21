
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import Navigation from '@/components/Navigation';
import { useAppContext } from '@/context/AppContext';
import LoadingSpinner from '@/components/LoadingSpinner';

// Import components directly instead of lazy loading to avoid blank screen issues
import LoginPage from '@/components/LoginPage';
import TaskList from '@/components/TaskList';
import NewTaskPage from '@/components/NewTaskPage';
import Dashboard from '@/components/Dashboard';
import Onboarding from '@/components/Onboarding';
import ProfilePage from '@/pages/ProfilePage';

const AppContent = () => {
  const { isLoggedIn, activeTab, setActiveTab, showOnboarding } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  // Add console log for debugging
  console.log('AppContent rendering, isLoggedIn:', isLoggedIn);

  // Add a small delay to ensure Firebase auth state is properly initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn) {
    return <LoginPage />;
  }
  
  // Show onboarding for new users
  if (showOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-app-darkblue relative">
      <div className="pb-16">
        {activeTab === 'home' && <TaskList />}
        {activeTab === 'add' && <NewTaskPage onBack={() => setActiveTab('home')} />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'profile' && <ProfilePage />}
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
      <AppContent />
    </ErrorBoundary>
  );
};

export default Index;
