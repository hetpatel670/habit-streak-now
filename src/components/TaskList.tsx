
import React from 'react';
import TaskItem from './TaskItem';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { Plus } from 'lucide-react';

const TaskList = () => {
  const { tasks, user, currentStreak } = useAppContext();

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="text-pink-400 text-2xl mr-2">🔥</span>
          <h2 className="text-2xl font-bold text-white">Today</h2>
        </div>
        <div className="text-app-purple text-lg font-bold">
          {currentStreak}-Day Streak
        </div>
      </div>

      <Button 
        className="w-full bg-app-teal hover:bg-app-teal/90 text-black font-medium mb-6 rounded-xl h-14"
      >
        <Plus className="mr-2" size={20} /> Add Task
      </Button>

      <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar pb-20">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      {user && (
        <div className="mt-auto pt-4 pb-2 text-center">
          <span className="text-pink-400">🔥</span> 
          <span className="text-white"> {user.points} Points</span>
        </div>
      )}
    </div>
  );
};

export default TaskList;
