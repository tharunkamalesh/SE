// Recommendation Service - AI logic for personalized fitness recommendations

import type { UserProfile } from './userService';

export interface Recommendation {
  bmi: number;
  bmiCategory: string;
  fitnessGoal: string;
  summary: string;
  dailyCalories: number;
  macros: { protein: number; carbs: number; fat: number };
  workoutFrequency: string;
  intensity: string;
}

function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function estimateBMR(weight: number, heightCm: number, age: number): number {
  // Mifflin-St Jeor
  return 10 * weight + 6.25 * heightCm - 5 * age + 5;
}

const activityMultipliers: Record<string, number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9,
};

export const recommendationService = {
  generate(profile: UserProfile): Recommendation {
    const bmi = calculateBMI(profile.weight, profile.height);
    const bmiCategory = getBMICategory(bmi);
    const bmr = estimateBMR(profile.weight, profile.height, profile.age);
    const tdee = bmr * (activityMultipliers[profile.activityLevel] || 1.55);

    let dailyCalories: number;
    let macros: { protein: number; carbs: number; fat: number };
    let workoutFrequency: string;
    let intensity: string;
    let summary: string;

    switch (profile.fitnessGoal) {
      case 'weight_loss':
        dailyCalories = Math.round(tdee - 500);
        macros = { protein: 40, carbs: 30, fat: 30 };
        workoutFrequency = '5-6 days/week';
        intensity = 'Moderate to High';
        summary = 'Your plan focuses on a caloric deficit with high protein to preserve muscle while losing fat. Combine cardio with strength training for optimal results.';
        break;
      case 'muscle_gain':
        dailyCalories = Math.round(tdee + 300);
        macros = { protein: 35, carbs: 45, fat: 20 };
        workoutFrequency = '4-5 days/week';
        intensity = 'High';
        summary = 'Your plan uses a caloric surplus with emphasis on progressive overload. Focus on compound movements and adequate protein intake for muscle hypertrophy.';
        break;
      case 'endurance':
        dailyCalories = Math.round(tdee + 100);
        macros = { protein: 25, carbs: 55, fat: 20 };
        workoutFrequency = '5-6 days/week';
        intensity = 'Moderate';
        summary = 'Your plan prioritizes cardiovascular conditioning with carb-rich nutrition for sustained energy. Gradually increase workout duration and intensity.';
        break;
      default: // maintenance
        dailyCalories = Math.round(tdee);
        macros = { protein: 30, carbs: 40, fat: 30 };
        workoutFrequency = '3-4 days/week';
        intensity = 'Moderate';
        summary = 'Your plan maintains current fitness with balanced nutrition. Focus on consistency and progressive challenge to prevent plateaus.';
    }

    return { bmi, bmiCategory, fitnessGoal: profile.fitnessGoal, summary, dailyCalories, macros, workoutFrequency, intensity };
  },
};
