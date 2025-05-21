import { Task } from '@/types';
import { database } from '@/config/firebase';
import { ref, get } from 'firebase/database';

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

const suggestionCache = new Set<string>();

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

export const suggestTask = async (userId?: string): Promise<string> => {
  try {
    let previousTasks: Task[] = [];
    
    if (userId) {
      const tasksRef = ref(database, `users/${userId}/tasks`);
      const snapshot = await get(tasksRef);
      if (snapshot.exists()) {
        previousTasks = Object.values(snapshot.val());
      }
    }

    const taskTypes = previousTasks.reduce((acc, task) => {
      const type = categorizeTask(task.name);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const userPreferences = await getUserPreferences(userId);
    const prompt = generateSmartPrompt(taskTypes, userPreferences);

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
          "model": "anthropic/claude-2:1",
          "messages": [
            {
              "role": "system",
              "content": "You are a highly engaging task suggestion AI that provides quick, personalized, and achievable micro-tasks. Focus on user's patterns and preferences."
            },
            {
              "role": "user",
              "content": prompt
            }
          ],
          "temperature": 0.7,
          "max_tokens": 50
        })
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 2000)
      )
    ]);

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json() as OpenRouterResponse;
    const suggestion = data.choices[0]?.message?.content?.trim();
    
    if (!suggestion || suggestionCache.has(suggestion)) {
      return getRandomUniqueTask(userPreferences);
    }
    
    suggestionCache.add(suggestion);
    return suggestion;
  } catch (error) {
    console.error("Error suggesting task:", error);
    return getRandomUniqueTask();
  }
};

async function getUserPreferences(userId?: string): Promise<any> {
  if (!userId) return {};
  
  try {
    const prefsRef = ref(database, `users/${userId}/preferences`);
    const snapshot = await get(prefsRef);
    return snapshot.exists() ? snapshot.val() : {};
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return {};
  }
}

function categorizeTask(taskName: string): string {
  const categories = {
    health: ['exercise', 'stretch', 'walk', 'workout', 'yoga', 'water', 'sleep'],
    mindfulness: ['meditate', 'breathe', 'relax', 'mindful', 'gratitude'],
    productivity: ['work', 'study', 'read', 'write', 'plan', 'organize'],
    creativity: ['draw', 'paint', 'music', 'write', 'create'],
    social: ['call', 'message', 'connect', 'share', 'help'],
    learning: ['learn', 'study', 'practice', 'research', 'explore']
  };

  const lowercaseTask = taskName.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowercaseTask.includes(keyword))) {
      return category;
    }
  }
  return 'other';
}

function generateSmartPrompt(taskTypes: Record<string, number>, userPreferences: any): string {
  const mostFrequentCategory = Object.entries(taskTypes)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  const timeOfDay = new Date().getHours();
  const timeContext = timeOfDay < 12 ? 'morning' : 
                     timeOfDay < 17 ? 'afternoon' : 'evening';

  const preferredDuration = userPreferences.preferredDuration || '5 minutes';
  const interests = userPreferences.interests || [];

  return `Suggest a quick ${preferredDuration} task for ${timeContext} related to ${mostFrequentCategory || 'wellness'}${
    interests.length ? ` considering interests in ${interests.join(', ')}` : ''
  }. Task should be specific, achievable, and motivating. Provide only the task name.`;
}

function getRandomUniqueTask(userPreferences?: any): string {
  let availableTasks = defaultSuggestions.filter(task => !suggestionCache.has(task));
  
  if (userPreferences?.preferredCategories?.length) {
    availableTasks = availableTasks.filter(task => 
      userPreferences.preferredCategories.some((category: string) => 
        task.toLowerCase().includes(category.toLowerCase())
      )
    );
  }

  if (availableTasks.length === 0) {
    suggestionCache.clear();
    return defaultSuggestions[Math.floor(Math.random() * defaultSuggestions.length)];
  }

  const task = availableTasks[Math.floor(Math.random() * availableTasks.length)];
  suggestionCache.add(task);
  return task;
}