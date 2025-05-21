import React from 'react';
import TaskItem from './TaskItem';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TaskList = () => {
  const { tasks, user, currentStreak, setActiveTab } = useAppContext();

  const handleAddTaskClick = () => {
    setActiveTab('add');
  };

  const getMotivationalMessage = () => {
    if (tasks.length === 0) {
      return "Start your journey by adding your first task!";
    }
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    if (completedTasks === tasks.length) {
      return "Amazing work! You've completed all tasks! 🎉";
    }
    if (completedTasks > tasks.length / 2) {
      return "You're doing great! Keep going! 💪";
    }
    return "You've got this! Take it one task at a time 🌟";
  };

  const completionPercentage = tasks.length > 0
    ? (tasks.filter(task => task.isCompleted).length / tasks.length) * 100
    : 0;

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

      <div className="mb-6 bg-app-lightblue p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">Daily Progress</span>
          <span className="text-app-teal">{Math.round(completionPercentage)}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2 bg-gray-700">
          <div
            className="h-full bg-app-teal transition-all duration-500 ease-in-out rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </Progress>
      </div>

      <Button 
        className="w-full bg-app-teal hover:bg-app-teal/90 text-black font-medium mb-6 rounded-xl h-14"
        onClick={handleAddTaskClick}
      >
        <Plus className="mr-2" size={20} /> Add Task
      </Button>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="bg-app-lightblue p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold text-white mb-3">Welcome to Your Daily Planner!</h3>
            <p className="text-gray-400 mb-4">Break down your goals into small, achievable tasks and build lasting habits.</p>
            <Button
              onClick={handleAddTaskClick}
              className="bg-app-teal hover:bg-app-teal/90 text-black w-full"
            >
              Create Your First Task
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-app-lightblue p-4 rounded-lg mb-4">
            <p className="text-white text-center font-medium">{getMotivationalMessage()}</p>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar pb-20">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </>
      )}

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