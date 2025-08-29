
export interface Meal {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
}

export interface Workout {
  id: string;
  name: string;
  duration: number; // in minutes
  caloriesBurned: number;
  timestamp: number;
}

export interface WaterLog {
  id: string;
  amount: number; // in ml
  timestamp: number;
}

export interface SleepLog {
  id: string;
  duration: number; // in hours
  timestamp: number;
}

export interface Goals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  sleep: number;
}

export type LogData = 
  | { type: 'meal'; image: { base64: string; name: string }; }
  | { type: 'workout'; data: Omit<Workout, 'id' | 'timestamp'>; }
  | { type: 'water'; data: { amount: number }; }
  | { type: 'sleep'; data: { duration: number }; };
