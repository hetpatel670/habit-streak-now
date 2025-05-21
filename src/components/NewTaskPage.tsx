
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';
import { ChevronLeft } from 'lucide-react';

interface NewTaskPageProps {
  onBack: () => void;
}

const NewTaskPage = ({ onBack }: NewTaskPageProps) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [reminderTime, setReminderTime] = useState('');
  
  const { addTask } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      name,
      frequency,
      reminderTime,
      isCompleted: false
    });
    onBack();
  };
  
  const suggestTask = () => {
    // Mock task suggestion - in real app this would call OpenRouter API
    const suggestions = [
      "Meditate for 5 minutes",
      "Write in journal",
      "Review goals for the day",
      "Take a short walk",
      "Do 10 pushups"
    ];
    setName(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-app-teal"
        >
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-xl font-bold text-white ml-2">New Task</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-gray-400 mb-2">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Call Mom"
            className="h-14 bg-app-lightblue border-none text-white rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Frequency</label>
          <div className="relative">
            <Input
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="daily"
              className="h-14 bg-app-lightblue border-none text-white rounded-lg"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <ChevronLeft size={20} className="rotate-180 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Reminder</label>
          <div className="relative">
            <Input
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              placeholder="5:00 PM"
              className="h-14 bg-app-lightblue border-none text-white rounded-lg"
            />
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="h-14 mt-4 rounded-lg bg-indigo-600 text-white"
          onClick={suggestTask}
        >
          Suggest Task
        </Button>

        <div className="mt-auto">
          <div className="py-6">
            <h3 className="text-xl font-bold text-white">Small steps,</h3>
            <h3 className="text-xl font-bold text-white">big results.</h3>
          </div>

          <Button 
            type="submit"
            className="w-full bg-app-teal hover:bg-app-teal/90 text-black font-medium rounded-lg h-14"
          >
            Add Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskPage;
