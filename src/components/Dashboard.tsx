
import React from 'react';
import { useAppContext } from '@/context/AppContext';

const Dashboard = () => {
  const { currentStreak, badges, completedTasksPercentage } = useAppContext();

  // Mock weekly data - in a real app, this would come from Firestore
  const weeklyData = [
    { day: 'M', height: 40 },
    { day: 'T', height: 60 },
    { day: 'W', height: 45 },
    { day: 'T', height: 80 },
    { day: 'F', height: 50 },
    { day: 'S', height: 85 },
  ];

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
      </div>

      <div className="mt-6 bg-app-lightblue p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <span className="text-pink-400 text-2xl mr-2">🔥</span>
          <h3 className="text-xl font-medium text-white">{currentStreak}-Day Streak</h3>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-white mb-3">Task Completion</h3>
        <div className="bg-app-lightblue rounded-lg p-4">
          <div className="flex justify-between items-end h-44 mb-2">
            {weeklyData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-10 bg-blue-500 rounded-t-md" 
                  style={{ 
                    height: `${item.height}%`,
                    backgroundColor: index === 3 ? '#06D6D6' : (index === 5 ? '#06D6D6' : '#5B5FC7') 
                  }}
                ></div>
                <div className="text-gray-400 mt-2">{item.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className="bg-app-lightblue rounded-lg p-3 flex flex-col items-center">
            <div className="text-3xl mb-1">{badge.icon}</div>
            <div className="text-xs text-center text-white">{badge.name}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-app-lightblue p-4 rounded-lg">
        <div className="text-xl font-bold text-white mb-1">{completedTasksPercentage}% tasks</div>
        <div className="text-xl font-bold text-white">completed</div>
        <div className="text-gray-400">this week</div>
      </div>
    </div>
  );
};

export default Dashboard;
