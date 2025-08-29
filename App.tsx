
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LogEntryModal } from './components/LogEntryModal';
import { AIFeedback } from './components/AIFeedback';
import { analyzeMealImage, getCoachingTip } from './services/geminiService';
import type { Meal, Workout, WaterLog, SleepLog, Goals, LogData } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [meals, setMeals] = useLocalStorage<Meal[]>('kal-ai-meals', []);
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('kal-ai-workouts', []);
  const [waterLogs, setWaterLogs] = useLocalStorage<WaterLog[]>('kal-ai-water', []);
  const [sleepLogs, setSleepLogs] = useLocalStorage<SleepLog[]>('kal-ai-sleep', []);
  const [goals, setGoals] = useLocalStorage<Goals>('kal-ai-goals', {
    calories: 2200, protein: 150, carbs: 250, fat: 70, water: 3000, sleep: 8
  });
  
  const [aiTip, setAiTip] = useState<string>('Log an activity to get your first AI tip!');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartTimestamp = todayStart.getTime();

  const dailyTotals = useMemo(() => {
    const todaysMeals = meals.filter(m => m.timestamp >= todayStartTimestamp);
    const todaysWorkouts = workouts.filter(w => w.timestamp >= todayStartTimestamp);
    const todaysWater = waterLogs.filter(wl => wl.timestamp >= todayStartTimestamp);
    const todaysSleep = sleepLogs.filter(sl => sl.timestamp >= todayStartTimestamp);

    return {
      calories: todaysMeals.reduce((sum, meal) => sum + meal.calories, 0) - todaysWorkouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0),
      protein: todaysMeals.reduce((sum, meal) => sum + meal.protein, 0),
      carbs: todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0),
      fat: todaysMeals.reduce((sum, meal) => sum + meal.fat, 0),
      water: todaysWater.reduce((sum, log) => sum + log.amount, 0),
      sleep: todaysSleep.reduce((sum, log) => sum + log.duration, 0)
    };
  }, [meals, workouts, waterLogs, sleepLogs, todayStartTimestamp]);

  const fetchAiTip = useCallback(async (context: string) => {
    try {
      const tip = await getCoachingTip(context, goals);
      setAiTip(tip);
    } catch (err) {
      console.error("Failed to fetch AI tip:", err);
      // Don't show this error to user, just fallback to a generic message
      setAiTip("Keep up the great work! Consistency is key.");
    }
  }, [goals]);

  const handleAddLog = async (logData: LogData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (logData.type === 'meal' && logData.image) {
        const mealData = await analyzeMealImage(logData.image.base64);
        const newMeal: Meal = { ...mealData, id: crypto.randomUUID(), timestamp: Date.now() };
        setMeals(prev => [...prev, newMeal]);
        await fetchAiTip(`Logged a meal: ${newMeal.foodName} with ${newMeal.calories} calories.`);
      } else if (logData.type === 'workout') {
        const newWorkout: Workout = { id: crypto.randomUUID(), timestamp: Date.now(), ...logData.data };
        setWorkouts(prev => [...prev, newWorkout]);
        await fetchAiTip(`Logged a ${logData.data.name} workout for ${logData.data.duration} minutes.`);
      } else if (logData.type === 'water') {
        const newWaterLog: WaterLog = { id: crypto.randomUUID(), timestamp: Date.now(), amount: logData.data.amount };
        setWaterLogs(prev => [...prev, newWaterLog]);
        await fetchAiTip(`Logged ${logData.data.amount}ml of water.`);
      } else if (logData.type === 'sleep') {
        const newSleepLog: SleepLog = { id: crypto.randomUUID(), timestamp: Date.now(), duration: logData.data.duration };
        setSleepLogs(prev => [...prev, newSleepLog]);
        await fetchAiTip(`Logged ${logData.data.duration} hours of sleep.`);
      }
      setIsLogModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-base-200 text-neutral">
      <Header />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <AIFeedback tip={aiTip} />
        <Dashboard dailyTotals={dailyTotals} goals={goals} onSetGoals={setGoals} />
        
        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="bg-primary hover:bg-primary-focus text-primary-content rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200"
            aria-label="Add new log"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </main>

      {isLogModalOpen && (
        <LogEntryModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          onAddLog={handleAddLog}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default App;
