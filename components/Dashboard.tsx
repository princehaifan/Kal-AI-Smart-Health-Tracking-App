import React, { useState } from 'react';
import type { Goals } from '../types';
import { GoalsModal } from './GoalsModal';

interface DashboardProps {
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
    sleep: number;
  };
  goals: Goals;
  onSetGoals: (newGoals: Goals) => void;
}

interface ProgressCardProps {
  title: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
  showTrend?: boolean;
}

const TrendIndicator: React.FC<{ value: number; goal: number }> = ({ value, goal }) => {
  const now = new Date();
  // Use a "waking hours" window (e.g., 6am to 10pm) for a more realistic trend
  const startHour = 6;
  const endHour = 22;
  const totalMinutesInDayWindow = (endHour - startHour) * 60;
  
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // If outside of the waking hours window, don't show an indicator
  if (currentHour < startHour || currentHour >= endHour) {
    return null;
  }

  const minutesPassedInWindow = (currentHour - startHour) * 60 + currentMinute;
  const dayPercentage = minutesPassedInWindow / totalMinutesInDayWindow;
  
  const progressPercentage = goal > 0 ? value / goal : 0;
  
  // Don't show an indicator if the goal is already met
  if (progressPercentage >= 1) {
      return null;
  }

  const difference = progressPercentage - dayPercentage;
  const tolerance = 0.05; // 5% tolerance

  // Ahead of schedule
  if (difference > tolerance) {
    return (
      <span className="flex items-center text-green-500" title="On track to meet your goal">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </span>
    );
  }

  // Behind schedule
  if (difference < -tolerance) {
    return (
      <span className="flex items-center text-red-500" title="Falling behind on your goal">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </span>
    );
  }

  return null; // On track, within tolerance
};

const ProgressCard: React.FC<ProgressCardProps> = ({ title, value, goal, unit, color, showTrend = false }) => {
  const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const progressColor = color;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center">
           <div className="flex items-center space-x-1.5">
            <h3 className="font-semibold text-neutral">{title}</h3>
            {showTrend && <TrendIndicator value={value} goal={goal} />}
          </div>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
        <p className="text-3xl font-bold text-neutral mt-2">{Math.round(value)} <span className="text-xl font-medium text-gray-400">/ {goal}</span></p>
      </div>
      <div className="w-full bg-base-200 rounded-full h-2.5 mt-4">
        <div className={progressColor} style={{ width: `${percentage}%`, height: '100%', borderRadius: '9999px', transition: 'width 0.5s ease-in-out' }}></div>
      </div>
    </div>
  );
};


export const Dashboard: React.FC<DashboardProps> = ({ dailyTotals, goals, onSetGoals }) => {
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);

  return (
    <div className="mt-6">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-neutral">Today's Dashboard</h2>
        <button 
          onClick={() => setIsGoalsModalOpen(true)}
          className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Set Goals
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProgressCard title="Calories" value={dailyTotals.calories} goal={goals.calories} unit="kcal" color="bg-accent" showTrend={true} />
        <ProgressCard title="Water" value={dailyTotals.water} goal={goals.water} unit="ml" color="bg-secondary" showTrend={true} />
        <ProgressCard title="Sleep" value={dailyTotals.sleep} goal={goals.sleep} unit="hours" color="bg-indigo-500" />
      </div>
      <div className="mt-4 bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-neutral mb-4">Macronutrients</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <ProgressCard title="Protein" value={dailyTotals.protein} goal={goals.protein} unit="g" color="bg-red-500" showTrend={true} />
           <ProgressCard title="Carbs" value={dailyTotals.carbs} goal={goals.carbs} unit="g" color="bg-green-500" showTrend={true} />
           <ProgressCard title="Fat" value={dailyTotals.fat} goal={goals.fat} unit="g" color="bg-yellow-500" showTrend={true} />
        </div>
      </div>
      {isGoalsModalOpen && (
        <GoalsModal 
          isOpen={isGoalsModalOpen} 
          onClose={() => setIsGoalsModalOpen(false)}
          currentGoals={goals}
          onSave={onSetGoals}
        />
      )}
    </div>
  );
};