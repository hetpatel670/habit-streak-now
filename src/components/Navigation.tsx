
import React from 'react';
import { Home, Plus, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-app-darkblue border-t border-gray-800 flex justify-around items-center px-6">
      <button 
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center ${activeTab === 'home' ? 'text-app-teal' : 'text-gray-500'}`}
      >
        <Home size={24} />
      </button>
      
      <button 
        onClick={() => setActiveTab('add')}
        className={`flex flex-col items-center justify-center ${activeTab === 'add' ? 'text-app-teal' : 'text-gray-500'}`}
      >
        <Plus size={24} />
      </button>
      
      <button 
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center ${activeTab === 'dashboard' ? 'text-app-teal' : 'text-gray-500'}`}
      >
        <User size={24} />
      </button>
    </div>
  );
};

export default Navigation;
