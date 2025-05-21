import { Task } from '@/types';

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Cache for storing previous suggestions
const suggestionCache = new Set<string>();

// Default suggestions if API fails
const defaultSuggestions = [
  "Do 10 minutes of mindful breathing",
  "Take a 5-minute stretching break",
  "Drink a glass of water",
  "Write down 3 things you're grateful for",
  "Take a short walk",
  "Do 10 desk exercises",
  "Clean your workspace for 2 minutes",
  "Practice good posture for 5 minutes"
];

export const suggestTask = async (previousTasks: Task[] = []): Promise<string> => {
  try {
    // Analyze previous tasks to make contextual suggestions
    const taskTypes = previousTasks.reduce((acc, task) => {
      const type = categorizeTask(task.name);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const prompt = generateSmartPrompt(taskTypes);

    const response = await Promise.race([
      fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "HTTP-Referer": "daily-micro-task-planner",
          "X-Title": "Daily Micro-Task Planner",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1:free",
          "messages": [
            {
              "role": "system",
              "content": "You are a helpful task suggestion AI that provides quick, engaging, and achievable micro-tasks."
            },
            {
              "role": "user",
              "content": prompt
            }
          ]
        })
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
    ]);

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json() as OpenRouterResponse;
    const suggestion = data.choices[0]?.message?.content?.trim();
    
    if (!suggestion || suggestionCache.has(suggestion)) {
      return getRandomUniqueTask();
    }
    
    suggestionCache.add(suggestion);
    return suggestion;
  } catch (error) {
    console.error("Error suggesting task:", error);
    return getRandomUniqueTask();
  }
};

function categorizeTask(taskName: string): string {
  const categories = {
    health: ['exercise', 'stretch', 'walk', 'workout', 'yoga'],
    mindfulness: ['meditate', 'breathe', 'relax', 'mindful'],
    productivity: ['work', 'study', 'read', 'write', 'plan'],
    wellbeing: ['water', 'sleep', 'rest', 'break']
  };

  const lowercaseTask = taskName.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowercaseTask.includes(keyword))) {
      return category;
    }
  }
  return 'other';
}

function generateSmartPrompt(taskTypes: Record<string, number>): string {
  const mostFrequentCategory = Object.entries(taskTypes)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  return `Suggest a simple daily task for habit-building related to ${mostFrequentCategory || 'general wellness'}. Task should be specific, achievable in under 5 minutes, and motivating. Just provide the task name only.`;
}

function getRandomUniqueTask(): string {
  const availableTasks = defaultSuggestions.filter(task => !suggestionCache.has(task));
  if (availableTasks.length === 0) {
    suggestionCache.clear();
    return defaultSuggestions[Math.floor(Math.random() * defaultSuggestions.length)];
  }
  const task = availableTasks[Math.floor(Math.random() * availableTasks.length)];
  suggestionCache.add(task);
  return task;
}