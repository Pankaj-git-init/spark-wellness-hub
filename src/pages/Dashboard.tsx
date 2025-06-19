import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Utensils, Clock, Heart, Flame, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAIPlanGeneration } from "@/hooks/useAIPlanGeneration";
import { MealPlanDisplay } from "@/components/MealPlanDisplay";
import { WorkoutPlanDisplay } from "@/components/WorkoutPlanDisplay";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { WaterLogModal } from "@/components/WaterLogModal";
import { useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { stats, isLoading: statsLoading, logWater } = useDashboardStats();
  const [showWaterModal, setShowWaterModal] = useState(false);
  const { 
    generatePlan, 
    isGenerating, 
    mealPlan, 
    workoutPlan,
    setMealPlan,
    setWorkoutPlan 
  } = useAIPlanGeneration();

  // Fetch user profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Check if user has completed profile
  const hasCompleteProfile = profile && profile.age && profile.weight && profile.height && profile.fitness_goal;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        
        {!hasCompleteProfile ? (
          // Show empty state when no profile data
          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            <Card className="col-span-full">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Welcome to FitAI!</CardTitle>
                <CardDescription>Complete your profile to get started with personalized plans</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Progress Recorded Till Now</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  To get started with your fitness journey, we need some basic information about you. 
                  This will help us create personalized meal plans and workout routines.
                </p>
                <Button onClick={() => navigate("/profile-setup")} size="lg">
                  Complete Your Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Show dashboard with data when profile is complete
          <div className="space-y-4 sm:space-y-6">
            {/* Display generated plans */}
            {(mealPlan || workoutPlan) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mealPlan && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Utensils className="h-5 w-5" />
                          Your Meal Plan
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setMealPlan(null)}
                        >
                          Close
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-96 overflow-y-auto">
                      <MealPlanDisplay plan={mealPlan} />
                    </CardContent>
                  </Card>
                )}
                
                {workoutPlan && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Your Workout Plan
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setWorkoutPlan(null)}
                        >
                          Close
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-96 overflow-y-auto">
                      <WorkoutPlanDisplay plan={workoutPlan} />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Progress section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <Card className="col-span-full md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">My Progress</CardTitle>
                  <CardDescription>Current {profile.fitness_goal?.replace('-', ' ')} journey</CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="flex items-center justify-center my-4">
                    <div className="relative">
                      <svg className="h-36 w-36" viewBox="0 0 100 100">
                        <circle
                          className="text-muted stroke-current"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-primary stroke-current"
                          strokeWidth="8"
                          strokeDasharray={250}
                          strokeDashoffset={250 - (0 / 100) * 250}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-bold">0%</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Current Weight</span>
                        <span className="font-medium">{profile.weight} kg</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Height</span>
                        <span className="font-medium">{profile.height} cm</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Age</span>
                        <span className="font-medium">{profile.age} years</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Goal</span>
                        <span className="font-medium capitalize">{profile.fitness_goal?.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Log Today's Weight
                  </Button>
                </CardFooter>
              </Card>

              <Card className="col-span-full md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">AI Insights</CardTitle>
                  <CardDescription>Personalized recommendations based on your profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border bg-card p-3">
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 4C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12C13.7909 12 12 10.2091 12 8C12 5.79086 13.7909 4 16 4Z" className="fill-primary" />
                          <path d="M8 18C5.79086 18 4 16.2091 4 14C4 11.7909 5.79086 10 8 10C10.2091 10 12 11.7909 12 14C12 16.2091 10.2091 18 8 18Z" className="fill-primary" />
                          <path d="M18 16C16.9391 16 15.9217 15.5786 15.1716 14.8284C14.4214 14.0783 14 13.0609 14 12L18 8C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10L22 12C22 13.0609 21.5786 14.0783 20.8284 14.8284C20.0783 15.5786 19.0609 16 18 16Z" className="fill-primary/70" />
                          <path d="M6 8C7.0609 8 8.07828 8.42143 8.82843 9.17157C9.57857 9.92172 10 10.9391 10 12L6 16C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14L2 12C2 10.9391 2.42143 9.92172 3.17157 9.17157C3.92172 8.42143 4.96957 8 6 8Z" className="fill-primary/70" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Welcome to your fitness journey!</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          Based on your {profile.fitness_goal?.replace('-', ' ')} goal, we'll create a personalized plan for you.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border bg-card p-3">
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 4C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12C13.7909 12 12 10.2091 12 8C12 5.79086 13.7909 4 16 4Z" className="fill-primary" />
                          <path d="M8 18C5.79086 18 4 16.2091 4 14C4 11.7909 5.79086 10 8 10C10.2091 10 12 11.7909 12 14C12 16.2091 10.2091 18 8 18Z" className="fill-primary" />
                          <path d="M18 16C16.9391 16 15.9217 15.5786 15.1716 14.8284C14.4214 14.0783 14 13.0609 14 12L18 8C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10L22 12C22 13.0609 21.5786 14.0783 20.8284 14.8284C20.0783 15.5786 19.0609 16 18 16Z" className="fill-primary/70" />
                          <path d="M6 8C7.0609 8 8.07828 8.42143 8.82843 9.17157C9.57857 9.92172 10 10.9391 10 12L6 16C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14L2 12C2 10.9391 2.42143 9.92172 3.17157 9.17157C3.92172 8.42143 4.96957 8 6 8Z" className="fill-primary/70" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Dietary Preference</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          We'll include {profile.dietary_preference?.replace('-', ' ')} options in your meal plans.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border bg-card p-3">
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 4C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12C13.7909 12 12 10.2091 12 8C12 5.79086 13.7909 4 16 4Z" className="fill-primary" />
                          <path d="M8 18C5.79086 18 4 16.2091 4 14C4 11.7909 5.79086 10 8 10C10.2091 10 12 11.7909 12 14C12 16.2091 10.2091 18 8 18Z" className="fill-primary" />
                          <path d="M18 16C16.9391 16 15.9217 15.5786 15.1716 14.8284C14.4214 14.0783 14 13.0609 14 12L18 8C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10L22 12C22 13.0609 21.5786 14.0783 20.8284 14.8284C20.0783 15.5786 19.0609 16 18 16Z" className="fill-primary/70" />
                          <path d="M6 8C7.0609 8 8.07828 8.42143 8.82843 9.17157C9.57857 9.92172 10 10.9391 10 12L6 16C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14L2 12C2 10.9391 2.42143 9.92172 3.17157 9.17157C3.92172 8.42143 4.96957 8 6 8Z" className="fill-primary/70" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">AI-Powered Plans</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          Click "Generate New Plans" to create personalized workout and meal plans using AI!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <Utensils className="mr-2 h-5 w-5" />
                        Today's Meals
                      </CardTitle>
                      <CardDescription>
                        {mealPlan ? "AI-generated meal plan available" : "No meal plan yet"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="text-center py-8">
                    <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {mealPlan ? "Your personalized meal plan is ready above" : "Visit the meal plan page to generate your first meal plan"}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm" 
                    onClick={() => navigate('/meal-plan')}
                  >
                    Go to Meal Plan
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <Clock className="mr-2 h-5 w-5" />
                        Today's Workouts
                      </CardTitle>
                      <CardDescription>
                        {workoutPlan ? "AI-generated workout plan available" : "No workout plan yet"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {workoutPlan ? "Your personalized workout plan is ready above" : "Visit the workouts page to generate your first workout plan"}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm" 
                    onClick={() => navigate('/workouts')}
                  >
                    Go to Workout Plan
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? "--" : stats.dailyCalories}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {statsLoading ? "Loading..." : `Target: ${stats.targetCalories} cal`}
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary/20">
                    <div 
                      className="h-full bg-secondary transition-all duration-300" 
                      style={{ 
                        width: `${statsLoading ? 0 : Math.min((stats.dailyCalories / stats.targetCalories) * 100, 100)}%` 
                      }} 
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {statsLoading ? "Start tracking your meals" : "From your meal plan"}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Macros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium">Protein</div>
                      <div className="text-muted-foreground">
                        {statsLoading ? "--g" : `${stats.macros.protein}g`}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Carbs</div>
                      <div className="text-muted-foreground">
                        {statsLoading ? "--g" : `${stats.macros.carbs}g`}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Fat</div>
                      <div className="text-muted-foreground">
                        {statsLoading ? "--g" : `${stats.macros.fat}g`}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: "30%" }} />
                    <div className="h-full bg-secondary transition-all duration-300" style={{ width: "40%" }} />
                    <div className="h-full bg-destructive/60 transition-all duration-300" style={{ width: "30%" }} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Workout Streak</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-between">
                  <div className="flex items-center">
                    <Flame className={`h-6 w-6 mr-2 ${stats.workoutStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                    <span className="text-2xl font-bold">
                      {statsLoading ? "--" : stats.workoutStreak} day{stats.workoutStreak !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {statsLoading ? "Loading..." : stats.workoutStreak > 0 ? "Keep it up!" : "Start your journey!"}
                  </p>
                  <div className="mt-3 flex w-full justify-between">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div
                        key={day}
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs transition-colors ${
                          day <= stats.workoutStreak ? 'bg-orange-500 text-white' : 'bg-muted'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">
                      {statsLoading ? "--" : stats.waterGlasses}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">/ 8 glasses</span>
                  </div>
                  <div className="mt-4 flex items-end w-full h-12 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
                      <div
                        key={glass}
                        className={`flex-1 rounded-t-sm transition-colors ${
                          glass <= stats.waterGlasses ? 'bg-blue-500' : 'bg-muted'
                        }`}
                        style={{ height: "30%" }}
                      />
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full"
                    onClick={() => setShowWaterModal(true)}
                    disabled={stats.waterGlasses >= 8}
                  >
                    {stats.waterGlasses >= 8 ? "Daily Goal Reached!" : "Log Water"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <WaterLogModal
        isOpen={showWaterModal}
        onClose={() => setShowWaterModal(false)}
        onLogWater={logWater}
        currentGlasses={stats.waterGlasses}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
