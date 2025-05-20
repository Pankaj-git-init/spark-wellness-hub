
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Utensils, Clock, Heart, Flame } from "lucide-react";

const Dashboard = () => {
  // Mock data
  const userData = {
    name: "John Doe",
    weight: 78,
    targetWeight: 70,
    goal: "Weight Loss",
    progress: 40,
    dailyCalories: 2100,
    protein: 150,
    carbs: 180,
    fat: 60,
    waterIntake: 5,
    completedWorkouts: 18,
    streakDays: 7
  };
  
  const todaysMeals = [
    { id: 1, name: "Oatmeal with Berries", time: "8:00 AM", calories: 320, completed: true },
    { id: 2, name: "Chicken Salad", time: "12:30 PM", calories: 450, completed: false },
    { id: 3, name: "Protein Shake", time: "3:00 PM", calories: 220, completed: false },
    { id: 4, name: "Grilled Salmon with Veggies", time: "7:00 PM", calories: 550, completed: false }
  ];
  
  const todaysWorkouts = [
    { id: 1, name: "Morning Cardio", duration: "30 mins", calories: 250, completed: true },
    { id: 2, name: "Evening Strength Training", duration: "45 mins", calories: 320, completed: false }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button>Generate New Plan</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <Card className="col-span-full md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Progress</CardTitle>
              <CardDescription>Current weight loss journey</CardDescription>
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
                      strokeDashoffset={250 - (userData.progress / 100) * 250}
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
                      <p className="text-3xl font-bold">{userData.progress}%</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current Weight</span>
                    <span className="font-medium">{userData.weight} kg</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Target Weight</span>
                    <span className="font-medium">{userData.targetWeight} kg</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Goal</span>
                    <span className="font-medium">{userData.goal}</span>
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
              <CardDescription>Personalized recommendations based on your progress</CardDescription>
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
                    <p className="font-medium">Great progress on your workouts!</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      You've been consistent with your routine. Consider increasing intensity to accelerate progress.
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
                    <p className="font-medium">Nutrition Tip</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Try adding more protein to your breakfast to help control appetite throughout the day.
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
                    <p className="font-medium">Weekly Goal Update</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      You're on track to reach your target weight by September 15th! Keep up the good work.
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
                  <CardDescription>{todaysMeals.reduce((total, meal) => total + meal.calories, 0)} calories planned</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="space-y-3">
                {todaysMeals.map(meal => (
                  <div key={meal.id} className="flex items-center space-x-3 rounded-md border p-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${meal.completed ? "line-through opacity-70" : ""}`}>
                          {meal.name}
                        </p>
                        <span className="text-sm font-medium">{meal.calories} cal</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{meal.time}</p>
                    </div>
                    <Button variant={meal.completed ? "outline" : "default"} size="sm">
                      {meal.completed ? "Logged" : "Log Meal"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button variant="outline" className="w-full" size="sm">
                View Full Meal Plan
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
                  <CardDescription>{todaysWorkouts.reduce((total, workout) => total + workout.calories, 0)} calories to burn</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="space-y-3">
                {todaysWorkouts.map(workout => (
                  <div key={workout.id} className="flex items-center space-x-3 rounded-md border p-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${workout.completed ? "line-through opacity-70" : ""}`}>
                          {workout.name}
                        </p>
                        <span className="text-sm font-medium">{workout.calories} cal</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{workout.duration}</p>
                    </div>
                    <Button variant={workout.completed ? "outline" : "default"} size="sm">
                      {workout.completed ? "Completed" : "Start"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button variant="outline" className="w-full" size="sm">
                View All Workouts
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
              <div className="text-2xl font-bold">{userData.dailyCalories}</div>
              <p className="text-xs text-muted-foreground">calories per day</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary/20">
                <div className="h-full bg-secondary" style={{ width: "65%" }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">65% of daily goal consumed</p>
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
                  <div className="text-muted-foreground">{userData.protein}g</div>
                </div>
                <div>
                  <div className="font-medium">Carbs</div>
                  <div className="text-muted-foreground">{userData.carbs}g</div>
                </div>
                <div>
                  <div className="font-medium">Fat</div>
                  <div className="text-muted-foreground">{userData.fat}g</div>
                </div>
              </div>
              <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: "35%" }} />
                <div className="h-full bg-secondary" style={{ width: "40%" }} />
                <div className="h-full bg-destructive/60" style={{ width: "25%" }} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Workout Streak</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-between">
              <div className="flex items-center">
                <Flame className="h-6 w-6 text-orange-500 mr-2" />
                <span className="text-2xl font-bold">{userData.streakDays} days</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
              <div className="mt-3 flex w-full justify-between">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className={`h-8 w-8 rounded-full ${
                      day <= userData.streakDays
                        ? "bg-primary/90 text-primary-foreground"
                        : "bg-muted"
                    } flex items-center justify-center text-xs`}
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
                <span className="text-2xl font-bold">{userData.waterIntake}</span>
                <span className="text-sm text-muted-foreground ml-1">/ 8 glasses</span>
              </div>
              <div className="mt-4 flex items-end w-full h-12 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
                  <div
                    key={glass}
                    className={`flex-1 rounded-t-sm ${
                      glass <= userData.waterIntake ? "bg-blue-500" : "bg-muted"
                    }`}
                    style={{
                      height: `${(glass <= userData.waterIntake ? 100 : 30)}%`
                    }}
                  />
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Log Water
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
