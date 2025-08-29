import React, { useState } from 'react';
import type { Goals } from '../types';

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoals: Goals;
  onSave: (newGoals: Goals) => void;
}

const GoalSliderInput: React.FC<{ 
  label: string; 
  unit: string; 
  value: number; 
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}> = ({ label, unit, value, onChange, min, max, step }) => (
    <div>
        <div className="flex justify-between items-baseline">
            <label htmlFor={label} className="block text-sm font-medium text-gray-700">{label}</label>
            <span className="text-sm text-gray-500">{value} {unit}</span>
        </div>
        <div className="flex items-center space-x-4 mt-1">
            <input
                type="range"
                id={label}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
             <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
                className="w-24 border border-gray-300 rounded-md shadow-sm py-1 px-2 text-center focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
        </div>
    </div>
);


export const GoalsModal: React.FC<GoalsModalProps> = ({ isOpen, onClose, currentGoals, onSave }) => {
  const [goals, setGoals] = useState<Goals>(currentGoals);

  const handleSave = () => {
    onSave(goals);
    onClose();
  };
  
  const updateGoal = (key: keyof Goals, value: number) => {
    setGoals(prev => ({ ...prev, [key]: value }));
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Set Your Daily Goals</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="mt-6 space-y-6">
            <GoalSliderInput label="Calories" unit="kcal" value={goals.calories} onChange={v => updateGoal('calories', v)} min={1000} max={5000} step={50} />
            <GoalSliderInput label="Water" unit="ml" value={goals.water} onChange={v => updateGoal('water', v)} min={1000} max={6000} step={100} />
            <GoalSliderInput label="Sleep" unit="hours" value={goals.sleep} onChange={v => updateGoal('sleep', v)} min={4} max={12} step={0.5} />
            <GoalSliderInput label="Protein" unit="g" value={goals.protein} onChange={v => updateGoal('protein', v)} min={50} max={300} step={5} />
            <GoalSliderInput label="Carbs" unit="g" value={goals.carbs} onChange={v => updateGoal('carbs', v)} min={50} max={500} step={10} />
            <GoalSliderInput label="Fat" unit="g" value={goals.fat} onChange={v => updateGoal('fat', v)} min={20} max={200} step={5} />
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleSave}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
          >
            Save Goals
          </button>
          <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};