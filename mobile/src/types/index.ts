export interface AuthData {
  email: string;
  name: string;
  loggedInAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  goalWeight: number;
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  plan: 'free' | 'pro';
  bmi: number;
  tdee: number;
  calorieGoal: number;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

export interface FoodEntry {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  timestamp: string;
}

export interface Macro {
  label: string;
  consumed: number;
  target: number;
  color: string;
  unit: string;
}
