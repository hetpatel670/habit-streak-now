
import React from 'react';
import { AppProvider } from '@/context/AppContext';
import LoginPage from '@/components/LoginPage';
import TaskList from '@/components/TaskList';
import NewTaskPage from '@/components/NewTaskPage';
import Dashboard from '@/components/Dashboard';
import Navigation from '@/components/Navigation';
import { useAppContext } from '@/context/AppContext';

const AppContent = () => {
  const { isLoggedIn, activeTab, setActiveTab } = useAppContext();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-app-darkblue relative">
      <div className="pb-16">
        {activeTab === 'home' && <TaskList />}
        {activeTab === 'add' && <NewTaskPage onBack={() => setActiveTab('home')} />}
        {activeTab === 'dashboard' && <Dashboard />}
      </div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
