// Diet Service - Stores and returns diet plans

export interface Meal {
  name: string;
  items: string[];
  calories: number;
}

export interface DietDay {
  meals: Meal[];
}

export interface DietPlan {
  name: string;
  description: string;
  sampleDay: DietDay;
  tips: string[];
}

const dietPlans: Record<string, DietPlan> = {
  weight_loss: {
    name: 'Lean & Clean Plan',
    description: 'Calorie-controlled meals focused on high protein and fiber to keep you full.',
    sampleDay: {
      meals: [
        { name: 'Breakfast', items: ['Egg white omelette with spinach', 'Whole grain toast', 'Green tea'], calories: 350 },
        { name: 'Mid-Morning Snack', items: ['Greek yogurt with berries', 'Handful of almonds'], calories: 200 },
        { name: 'Lunch', items: ['Grilled chicken salad', 'Quinoa', 'Olive oil dressing'], calories: 450 },
        { name: 'Afternoon Snack', items: ['Apple slices with peanut butter'], calories: 180 },
        { name: 'Dinner', items: ['Baked salmon', 'Steamed broccoli', 'Sweet potato'], calories: 500 },
      ],
    },
    tips: [
      'Drink at least 3L of water daily',
      'Avoid sugary drinks and processed snacks',
      'Eat slowly and mindfully',
      'Prep meals in advance to avoid temptation',
    ],
  },
  muscle_gain: {
    name: 'Mass Builder Plan',
    description: 'Calorie-surplus meals rich in protein and complex carbs for muscle recovery and growth.',
    sampleDay: {
      meals: [
        { name: 'Breakfast', items: ['4 whole eggs scrambled', 'Oatmeal with banana', 'Protein shake'], calories: 700 },
        { name: 'Mid-Morning Snack', items: ['Protein bar', 'Trail mix'], calories: 400 },
        { name: 'Lunch', items: ['Grilled steak', 'Brown rice', 'Mixed vegetables'], calories: 650 },
        { name: 'Post-Workout', items: ['Whey protein shake', 'Banana', 'Rice cakes'], calories: 350 },
        { name: 'Dinner', items: ['Chicken breast', 'Pasta', 'Avocado salad'], calories: 700 },
      ],
    },
    tips: [
      'Eat every 3 hours to maintain anabolic state',
      'Consume protein within 30 min post-workout',
      "Don't skip complex carbs — they fuel growth",
      'Get 7-9 hours of sleep for recovery',
    ],
  },
  maintenance: {
    name: 'Balanced Nutrition Plan',
    description: 'Well-rounded meals with balanced macronutrients for sustained energy.',
    sampleDay: {
      meals: [
        { name: 'Breakfast', items: ['Avocado toast with eggs', 'Fruit smoothie'], calories: 450 },
        { name: 'Lunch', items: ['Turkey wrap', 'Mixed greens', 'Hummus'], calories: 500 },
        { name: 'Afternoon Snack', items: ['Cottage cheese with fruit'], calories: 200 },
        { name: 'Dinner', items: ['Grilled fish', 'Roasted vegetables', 'Quinoa'], calories: 550 },
      ],
    },
    tips: [
      'Listen to your hunger cues',
      'Include all food groups in your diet',
      'Moderate portions — no need to restrict',
      'Stay hydrated throughout the day',
    ],
  },
  endurance: {
    name: 'Endurance Fuel Plan',
    description: 'Carb-focused nutrition for sustained energy during long training sessions.',
    sampleDay: {
      meals: [
        { name: 'Breakfast', items: ['Overnight oats with honey', 'Banana', 'Orange juice'], calories: 500 },
        { name: 'Pre-Workout', items: ['Energy bar', 'Electrolyte drink'], calories: 250 },
        { name: 'Lunch', items: ['Whole wheat pasta', 'Grilled chicken', 'Tomato sauce'], calories: 600 },
        { name: 'Afternoon Snack', items: ['PB&J sandwich', 'Sports drink'], calories: 350 },
        { name: 'Dinner', items: ['Lean beef stir-fry', 'Brown rice', 'Steamed greens'], calories: 550 },
      ],
    },
    tips: [
      'Load carbs before long training sessions',
      'Replenish electrolytes during exercise',
      'Avoid high-fiber foods right before workouts',
      'Include anti-inflammatory foods like berries and turmeric',
    ],
  },
};

export const dietService = {
  getDietPlan(goal: string): DietPlan {
    return dietPlans[goal] || dietPlans.maintenance;
  },
};
