import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { recommendationService } from '@/services/recommendationService';
import { progressService } from '@/services/progressService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Flame, Dumbbell, Target, LogOut, ClipboardList, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profile = user ? userService.getProfile(user.id) : null;
  const rec = profile ? recommendationService.generate(profile) : null;
  const progressData = user ? progressService.getEntries(user.id) : [];

  const goalLabels: Record<string, string> = {
    weight_loss: 'Weight Loss',
    muscle_gain: 'Muscle Gain',
    maintenance: 'Maintenance',
    endurance: 'Endurance',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="fitness-gradient p-2 rounded-lg">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-display font-bold text-foreground">FitAI</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">Hey, {user?.name}!</span>
            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* Quick Actions */}
          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="glass-card cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/input')}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="fitness-gradient p-3 rounded-xl">
                  <ClipboardList className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{profile ? 'Update Profile' : 'Set Up Profile'}</h3>
                  <p className="text-sm text-muted-foreground">{profile ? 'Modify your fitness details' : 'Enter your details to get started'}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/recommendations')}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="fitness-gradient p-3 rounded-xl">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">View Plan</h3>
                  <p className="text-sm text-muted-foreground">See your workout & diet recommendations</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          {rec && (
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Activity, label: 'BMI', value: rec.bmi.toString(), sub: rec.bmiCategory },
                { icon: Flame, label: 'Daily Calories', value: rec.dailyCalories.toLocaleString(), sub: 'kcal/day' },
                { icon: Dumbbell, label: 'Workouts', value: rec.workoutFrequency, sub: rec.intensity },
                { icon: Target, label: 'Goal', value: goalLabels[rec.fitnessGoal] || rec.fitnessGoal, sub: 'Current focus' },
              ].map((stat, i) => (
                <Card key={i} className="glass-card">
                  <CardContent className="p-4 text-center">
                    <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Progress Chart */}
          {progressData.length > 0 && (
            <motion.div variants={item}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" /> Progress Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))',
                          }}
                        />
                        <Line type="monotone" dataKey="weight" stroke="hsl(145, 72%, 40%)" strokeWidth={2} dot={{ fill: 'hsl(145, 72%, 40%)' }} name="Weight (kg)" />
                        <Line type="monotone" dataKey="bmi" stroke="hsl(165, 80%, 45%)" strokeWidth={2} dot={{ fill: 'hsl(165, 80%, 45%)' }} name="BMI" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!profile && (
            <motion.div variants={item}>
              <Card className="glass-card border-dashed">
                <CardContent className="p-8 text-center">
                  <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">Get Started</h3>
                  <p className="text-muted-foreground mb-4">Fill in your fitness profile to receive AI-powered personalized recommendations.</p>
                  <Button onClick={() => navigate('/input')} className="fitness-gradient text-primary-foreground font-semibold hover:opacity-90">
                    Create Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
