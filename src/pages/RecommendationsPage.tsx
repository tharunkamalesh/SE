import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { recommendationService } from '@/services/recommendationService';
import { workoutService } from '@/services/workoutService';
import { dietService } from '@/services/dietService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Flame, Dumbbell, Apple, ArrowLeft } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const RecommendationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const profile = user ? userService.getProfile(user.id) : null;

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="glass-card max-w-md w-full text-center p-8">
          <p className="text-muted-foreground mb-4">Please fill in your fitness profile first.</p>
          <Button onClick={() => navigate('/input')} className="fitness-gradient text-primary-foreground">Go to Profile Form</Button>
        </Card>
      </div>
    );
  }

  const rec = recommendationService.generate(profile);
  const workout = workoutService.getWorkoutPlan(profile.fitnessGoal);
  const diet = dietService.getDietPlan(profile.fitnessGoal);

  const bmiColor = rec.bmi < 18.5 ? 'text-yellow-500' : rec.bmi < 25 ? 'text-primary' : rec.bmi < 30 ? 'text-orange-500' : 'text-destructive';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* Overview */}
          <motion.div variants={item}>
            <Card className="glass-card overflow-hidden">
              <div className="fitness-gradient p-6">
                <h2 className="text-2xl font-display font-bold text-primary-foreground">Your Personalized Plan</h2>
                <p className="text-primary-foreground/80 mt-1">{rec.summary}</p>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-secondary">
                    <Activity className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className={`text-2xl font-bold ${bmiColor}`}>{rec.bmi}</p>
                    <p className="text-xs text-muted-foreground">BMI ({rec.bmiCategory})</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-secondary">
                    <Flame className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold text-foreground">{rec.dailyCalories}</p>
                    <p className="text-xs text-muted-foreground">Daily Calories</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-secondary">
                    <Dumbbell className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-lg font-bold text-foreground">{rec.workoutFrequency}</p>
                    <p className="text-xs text-muted-foreground">Workout Frequency</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-secondary">
                    <Apple className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-lg font-bold text-foreground">{rec.intensity}</p>
                    <p className="text-xs text-muted-foreground">Intensity</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Macro Split</h4>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Protein {rec.macros.protein}%</Badge>
                    <Badge variant="secondary">Carbs {rec.macros.carbs}%</Badge>
                    <Badge variant="secondary">Fat {rec.macros.fat}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Workout Plan */}
          <motion.div variants={item}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2"><Dumbbell className="h-5 w-5 text-primary" />{workout.name}</CardTitle>
                <CardDescription>{workout.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workout.days.map(day => (
                    <div key={day.day} className="p-4 rounded-lg bg-secondary">
                      <h4 className="font-semibold text-foreground">{day.day}</h4>
                      <p className="text-sm text-primary font-medium mb-2">{day.focus}</p>
                      {day.exercises.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">Rest & Recovery</p>
                      ) : (
                        <ul className="space-y-1">
                          {day.exercises.map((ex, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {ex.name} — {ex.sets}×{ex.reps}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Diet Plan */}
          <motion.div variants={item}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2"><Apple className="h-5 w-5 text-primary" />{diet.name}</CardTitle>
                <CardDescription>{diet.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold text-foreground mb-3">Sample Day</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {diet.sampleDay.meals.map((meal, i) => (
                    <div key={i} className="p-4 rounded-lg bg-secondary">
                      <div className="flex justify-between items-center mb-1">
                        <h5 className="font-semibold text-foreground text-sm">{meal.name}</h5>
                        <Badge variant="outline" className="text-xs">{meal.calories} kcal</Badge>
                      </div>
                      <ul className="space-y-0.5">
                        {meal.items.map((it, j) => (
                          <li key={j} className="text-sm text-muted-foreground">• {it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <h4 className="font-semibold text-foreground mb-2">Tips</h4>
                <ul className="space-y-1">
                  {diet.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground">✓ {tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
