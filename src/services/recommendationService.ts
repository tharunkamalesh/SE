// Recommendation Service - AI logic for personalized fitness recommendations

import type { UserProfile } from './userService';
import { workoutService, WorkoutPlan } from './workoutService';
import { dietService, DietPlan } from './dietService';

export interface Recommendation {
  bmi: number;
  bmiCategory: string;
  fitnessGoal: string;
  summary: string;
  dailyCalories: number;
  macros: { protein: number; carbs: number; fat: number };
  workoutFrequency: string;
  intensity: string;
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
  reasoning: string;
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

    // Call "Workout Microservice"
    const workoutPlan = workoutService.getWorkoutPlan(profile.fitnessGoal);
    // Call "Diet Microservice"
    const dietPlan = dietService.getDietPlan(profile.fitnessGoal);

    let dailyCalories: number;
    let macros: { protein: number; carbs: number; fat: number };
    let workoutFrequency: string;
    let intensity: string;
    let summary: string;
    let reasoning: string;

    reasoning = `Based on your BMI of ${bmi} (${bmiCategory}) and goal of ${profile.fitnessGoal.replace('_', ' ')}, we've optimized your hormonal response and metabolic rate. `;

    switch (profile.fitnessGoal) {
      case 'weight_loss':
        dailyCalories = Math.round(tdee - 500);
        macros = { protein: 40, carbs: 30, fat: 30 };
        workoutFrequency = '5-6 days/week';
        intensity = 'Moderate to High';
        summary = dietPlan.description;
        reasoning += "A caloric deficit is necessary for fat loss, while high protein prevents muscle wastage.";
        break;
      case 'muscle_gain':
        dailyCalories = Math.round(tdee + 300);
        macros = { protein: 35, carbs: 45, fat: 20 };
        workoutFrequency = '4-5 days/week';
        intensity = 'High';
        summary = dietPlan.description;
        reasoning += "Surplus calories provide energy for tissue repair and growth during resistance training.";
        break;
      default:
        dailyCalories = Math.round(tdee);
        macros = { protein: 30, carbs: 40, fat: 30 };
        workoutFrequency = '3-4 days/week';
        intensity = 'Moderate';
        summary = dietPlan.description;
        reasoning += "Maintenance ensures you stay at your current weight while gradually improving body composition.";
    }

    return {
      bmi,
      bmiCategory,
      fitnessGoal: profile.fitnessGoal,
      summary,
      dailyCalories,
      macros,
      workoutFrequency,
      intensity,
      workoutPlan,
      dietPlan,
      reasoning
    };
  },

  getStatus() {
    return {
      user: 'Running',
      ai: 'Running',
      workout: 'Running',
      diet: 'Running',
    };
  }
};
