
import React from 'react';
import { Task } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { Check } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { completeTask, uncompleteTask } = useAppContext();

  const handleToggle = () => {
    if (task.isCompleted) {
      uncompleteTask(task.id);
    } else {
      completeTask(task.id);
    }
  };

  return (
    <div className="flex items-center p-4 bg-app-lightblue rounded-lg mb-3">
      <button 
        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 border-2 ${
          task.isCompleted 
            ? 'bg-app-teal border-app-teal' 
            : 'border-gray-400 bg-transparent'
        }`}
        onClick={handleToggle}
      >
        {task.isCompleted && <Check size={18} color="black" />}
      </button>
      <div className="flex-1">
        <h3 className="font-medium text-white">{task.name}</h3>
        {task.frequency === 'every-3-hours' && (
          <p className="text-sm text-gray-400">every 3 hours</p>
        )}
      </div>
      {task.reminderTime && (
        <div className="text-gray-400 text-sm">
          {task.reminderTime}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
