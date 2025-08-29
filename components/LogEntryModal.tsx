
import React, { useState, useCallback } from 'react';
import type { LogData } from '../types';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLog: (logData: LogData) => void;
  isLoading: boolean;
  error: string | null;
}

type LogType = 'meal' | 'workout' | 'water' | 'sleep';

// Fix: Use React.ReactElement instead of JSX.Element to resolve namespace issue.
const tabs: { id: LogType; label: string; icon: React.ReactElement }[] = [
  { id: 'meal', label: 'Meal', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" /></svg> },
  { id: 'workout', label: 'Workout', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5 10a1 1 0 011-1h3a1 1 0 110 2H6a1 1 0 01-1-1zm6 0a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z" clipRule="evenodd" /></svg> },
  { id: 'water', label: 'Water', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8 6a.75.75 0 01-.75-.75v-2.5a.75.75 0 011.5 0v2.5A.75.75 0 0110 16zM9.5 9a.5.5 0 00-1 0v.5a.5.5 0 001 0V9z" clipRule="evenodd" /></svg>},
  { id: 'sleep', label: 'Sleep', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 9a1 1 0 01-1-1V6a1 1 0 012 0v2a1 1 0 01-1 1zm13-1a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1zM4 11a1 1 0 100 2h12a1 1 0 100-2H4zM4 15a1 1 0 100 2h3a1 1 0 100-2H4zm5-1a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" /></svg> },
];

export const LogEntryModal: React.FC<LogEntryModalProps> = ({ isOpen, onClose, onAddLog, isLoading, error }) => {
  const [activeTab, setActiveTab] = useState<LogType>('meal');
  const [image, setImage] = useState<{ base64: string; name: string } | null>(null);
  const [workoutName, setWorkoutName] = useState('Running');
  const [workoutDuration, setWorkoutDuration] = useState(30);
  const [caloriesBurned, setCaloriesBurned] = useState(300);
  const [waterAmount, setWaterAmount] = useState(250);
  const [sleepDuration, setSleepDuration] = useState(8);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ base64: (reader.result as string).split(',')[1], name: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let logData: LogData | null = null;
    switch (activeTab) {
      case 'meal':
        if (image) logData = { type: 'meal', image };
        break;
      case 'workout':
        logData = { type: 'workout', data: { name: workoutName, duration: workoutDuration, caloriesBurned } };
        break;
      case 'water':
        logData = { type: 'water', data: { amount: waterAmount } };
        break;
      case 'sleep':
        logData = { type: 'sleep', data: { duration: sleepDuration } };
        break;
    }
    if (logData) {
      onAddLog(logData);
    }
  };

  if (!isOpen) return null;
  
  const renderFormContent = () => {
    switch (activeTab) {
      case 'meal':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">Meal Photo</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-focus focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">{image ? image.name : 'PNG, JPG, GIF up to 10MB'}</p>
              </div>
            </div>
          </div>
        );
      case 'workout':
        return (
          <div className="space-y-4">
             <div>
                <label htmlFor="workout-name" className="block text-sm font-medium text-gray-700">Activity</label>
                <input type="text" id="workout-name" value={workoutName} onChange={e => setWorkoutName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
             </div>
             <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                <input type="number" id="duration" value={workoutDuration} onChange={e => setWorkoutDuration(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
             </div>
             <div>
                <label htmlFor="calories-burned" className="block text-sm font-medium text-gray-700">Calories Burned (kcal)</label>
                <input type="number" id="calories-burned" value={caloriesBurned} onChange={e => setCaloriesBurned(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
             </div>
          </div>
        );
      case 'water':
        return (
             <div>
                <label htmlFor="water-amount" className="block text-sm font-medium text-gray-700">Amount (ml)</label>
                <input type="number" id="water-amount" value={waterAmount} onChange={e => setWaterAmount(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
             </div>
        );
      case 'sleep':
        return (
             <div>
                <label htmlFor="sleep-duration" className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                <input type="number" id="sleep-duration" value={sleepDuration} onChange={e => setSleepDuration(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
             </div>
        );
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Log</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {renderFormContent()}
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              disabled={isLoading || (activeTab === 'meal' && !image)}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging...' : `Log ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </button>
            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
