
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { X, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
  completed: boolean;
}

interface Workout {
  id: number;
  name: string;
  type: "strength" | "cardio" | "yoga" | "hiit";
  duration: number;
  caloriesBurn: number;
  exercises: Exercise[];
  completed: boolean;
}

interface WorkoutDay {
  day: string;
  workouts: Workout[];
  totalDuration: number;
  totalCaloriesBurn: number;
}

const Workouts = () => {
  const { toast } = useToast();
  
  // Mock workout plan data
  const initialWorkoutPlan: WorkoutDay[] = [
    {
      day: "Monday",
      workouts: [
        {
          id: 1,
          name: "Push Day - Upper Body",
          type: "strength",
          duration: 45,
          caloriesBurn: 320,
          exercises: [
            {
              id: 101,
              name: "Bench Press",
              sets: 3,
              reps: 10,
              weight: 60,
              restTime: 90,
              completed: false
            },
            {
              id: 102,
              name: "Shoulder Press",
              sets: 3,
              reps: 12,
              weight: 40,
              restTime: 60,
              completed: false
            },
            {
              id: 103,
              name: "Tricep Pushdowns",
              sets: 3,
              reps: 15,
              weight: 30,
              restTime: 60,
              completed: false
            },
            {
              id: 104,
              name: "Chest Flies",
              sets: 3,
              reps: 12,
              weight: 12,
              restTime: 60,
              completed: false
            },
          ],
          completed: false
        },
        {
          id: 2,
          name: "Light Cardio",
          type: "cardio",
          duration: 20,
          caloriesBurn: 180,
          exercises: [
            {
              id: 105,
              name: "Treadmill Walking",
              sets: 1,
              reps: 1,
              duration: 20,
              restTime: 0,
              completed: false
            }
          ],
          completed: false
        }
      ],
      totalDuration: 65,
      totalCaloriesBurn: 500
    },
    {
      day: "Tuesday",
      workouts: [
        {
          id: 3,
          name: "Pull Day - Back & Biceps",
          type: "strength",
          duration: 50,
          caloriesBurn: 350,
          exercises: [
            {
              id: 106,
              name: "Pull-ups",
              sets: 3,
              reps: 8,
              restTime: 90,
              completed: false
            },
            {
              id: 107,
              name: "Barbell Rows",
              sets: 3,
              reps: 10,
              weight: 50,
              restTime: 90,
              completed: false
            },
            {
              id: 108,
              name: "Lat Pulldowns",
              sets: 3,
              reps: 12,
              weight: 45,
              restTime: 60,
              completed: false
            },
            {
              id: 109,
              name: "Bicep Curls",
              sets: 3,
              reps: 15,
              weight: 15,
              restTime: 60,
              completed: false
            }
          ],
          completed: false
        }
      ],
      totalDuration: 50,
      totalCaloriesBurn: 350
    },
    {
      day: "Wednesday",
      workouts: [
        {
          id: 4,
          name: "HIIT Session",
          type: "hiit",
          duration: 30,
          caloriesBurn: 380,
          exercises: [
            {
              id: 110,
              name: "Burpees",
              sets: 4,
              reps: 15,
              restTime: 30,
              completed: false
            },
            {
              id: 111,
              name: "Mountain Climbers",
              sets: 4,
              reps: 30,
              restTime: 30,
              completed: false
            },
            {
              id: 112,
              name: "Kettlebell Swings",
              sets: 4,
              reps: 20,
              weight: 16,
              restTime: 30,
              completed: false
            },
            {
              id: 113,
              name: "Jump Squats",
              sets: 4,
              reps: 15,
              restTime: 30,
              completed: false
            }
          ],
          completed: false
        },
        {
          id: 5,
          name: "Core Workout",
          type: "strength",
          duration: 20,
          caloriesBurn: 150,
          exercises: [
            {
              id: 114,
              name: "Planks",
              sets: 3,
              reps: 1,
              duration: 60,
              restTime: 45,
              completed: false
            },
            {
              id: 115,
              name: "Russian Twists",
              sets: 3,
              reps: 20,
              restTime: 45,
              completed: false
            },
            {
              id: 116,
              name: "Leg Raises",
              sets: 3,
              reps: 15,
              restTime: 45,
              completed: false
            }
          ],
          completed: false
        }
      ],
      totalDuration: 50,
      totalCaloriesBurn: 530
    },
    {
      day: "Thursday",
      workouts: [
        {
          id: 6,
          name: "Legs Day",
          type: "strength",
          duration: 55,
          caloriesBurn: 420,
          exercises: [
            {
              id: 117,
              name: "Squats",
              sets: 4,
              reps: 10,
              weight: 70,
              restTime: 120,
              completed: false
            },
            {
              id: 118,
              name: "Leg Press",
              sets: 3,
              reps: 12,
              weight: 100,
              restTime: 90,
              completed: false
            },
            {
              id: 119,
              name: "Walking Lunges",
              sets: 3,
              reps: 20,
              weight: 20,
              restTime: 60,
              completed: false
            },
            {
              id: 120,
              name: "Calf Raises",
              sets: 3,
              reps: 20,
              weight: 40,
              restTime: 60,
              completed: false
            },
            {
              id: 121,
              name: "Leg Curls",
              sets: 3,
              reps: 12,
              weight: 35,
              restTime: 60,
              completed: false
            }
          ],
          completed: false
        }
      ],
      totalDuration: 55,
      totalCaloriesBurn: 420
    },
    {
      day: "Friday",
      workouts: [
        {
          id: 7,
          name: "Upper Body Push/Pull",
          type: "strength",
          duration: 50,
          caloriesBurn: 350,
          exercises: [
            {
              id: 122,
              name: "Incline Dumbbell Press",
              sets: 3,
              reps: 10,
              weight: 20,
              restTime: 90,
              completed: false
            },
            {
              id: 123,
              name: "Seated Cable Rows",
              sets: 3,
              reps: 12,
              weight: 50,
              restTime: 90,
              completed: false
            },
            {
              id: 124,
              name: "Lateral Raises",
              sets: 3,
              reps: 15,
              weight: 10,
              restTime: 60,
              completed: false
            },
            {
              id: 125,
              name: "Face Pulls",
              sets: 3,
              reps: 15,
              weight: 25,
              restTime: 60,
              completed: false
            },
            {
              id: 126,
              name: "Tricep Extensions",
              sets: 3,
              reps: 15,
              weight: 15,
              restTime: 60,
              completed: false
            }
          ],
          completed: false
        },
        {
          id: 8,
          name: "Moderate Cardio",
          type: "cardio",
          duration: 25,
          caloriesBurn: 220,
          exercises: [
            {
              id: 127,
              name: "Stationary Bike",
              sets: 1,
              reps: 1,
              duration: 25,
              restTime: 0,
              completed: false
            }
          ],
          completed: false
        }
      ],
      totalDuration: 75,
      totalCaloriesBurn: 570
    },
    {
      day: "Saturday",
      workouts: [
        {
          id: 9,
          name: "Yoga Flow",
          type: "yoga",
          duration: 45,
          caloriesBurn: 180,
          exercises: [
            {
              id: 128,
              name: "Sun Salutations",
              sets: 1,
              reps: 10,
              restTime: 0,
              completed: false
            },
            {
              id: 129,
              name: "Warrior Sequences",
              sets: 1,
              reps: 1,
              duration: 15,
              restTime: 0,
              completed: false
            },
            {
              id: 130,
              name: "Balance Poses",
              sets: 1,
              reps: 1,
              duration: 10,
              restTime: 0,
              completed: false
            },
            {
              id: 131,
              name: "Seated Poses",
              sets: 1,
              reps: 1,
              duration: 10,
              restTime: 0,
              completed: false
            }
          ],
          completed: false
        }
      ],
      totalDuration: 45,
      totalCaloriesBurn: 180
    },
    {
      day: "Sunday",
      workouts: [
        {
          id: 10,
          name: "Active Recovery",
          type: "cardio",
          duration: 40,
          caloriesBurn: 220,
          exercises: [
            {
              id: 132,
              name: "Brisk Walking",
              sets: 1,
              reps: 1,
              duration: 40,
              restTime: 0,
              completed: false
            }
          ],
          completed: false
        }
      ],
      totalDuration: 40,
      totalCaloriesBurn: 220
    }
  ];
  
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>(initialWorkoutPlan);
  
  const handleRegenerateWorkout = (dayIndex: number, workoutIndex: number) => {
    toast({
      title: "Regenerating workout",
      description: "Your AI workout is being updated",
    });
    
    // This would call an AI service in a real app
    // For now, let's just simulate a change by adding "New" to the workout name
    const updatedWorkoutPlan = [...workoutPlan];
    updatedWorkoutPlan[dayIndex].workouts[workoutIndex] = {
      ...updatedWorkoutPlan[dayIndex].workouts[workoutIndex],
      name: "New " + updatedWorkoutPlan[dayIndex].workouts[workoutIndex].name
    };
    
    setWorkoutPlan(updatedWorkoutPlan);
  };
  
  const handleMarkWorkoutCompleted = (dayIndex: number, workoutIndex: number) => {
    const updatedWorkoutPlan = [...workoutPlan];
    updatedWorkoutPlan[dayIndex].workouts[workoutIndex].completed = !updatedWorkoutPlan[dayIndex].workouts[workoutIndex].completed;
    
    // If workout is marked as completed, mark all exercises as completed too
    if (updatedWorkoutPlan[dayIndex].workouts[workoutIndex].completed) {
      updatedWorkoutPlan[dayIndex].workouts[workoutIndex].exercises.forEach(exercise => {
        exercise.completed = true;
      });
    }
    
    setWorkoutPlan(updatedWorkoutPlan);
    
    toast({
      title: updatedWorkoutPlan[dayIndex].workouts[workoutIndex].completed 
        ? "Workout completed" 
        : "Workout unmarked",
      description: updatedWorkoutPlan[dayIndex].workouts[workoutIndex].completed 
        ? "Great job on your workout!" 
        : "You can complete this workout later",
    });
  };
  
  const handleMarkExerciseCompleted = (dayIndex: number, workoutIndex: number, exerciseIndex: number) => {
    const updatedWorkoutPlan = [...workoutPlan];
    updatedWorkoutPlan[dayIndex].workouts[workoutIndex].exercises[exerciseIndex].completed = 
      !updatedWorkoutPlan[dayIndex].workouts[workoutIndex].exercises[exerciseIndex].completed;
    
    // Check if all exercises are completed
    const allExercisesCompleted = updatedWorkoutPlan[dayIndex].workouts[workoutIndex].exercises.every(ex => ex.completed);
    
    // If all exercises are completed, mark the workout as completed too
    if (allExercisesCompleted) {
      updatedWorkoutPlan[dayIndex].workouts[workoutIndex].completed = true;
    } else {
      updatedWorkoutPlan[dayIndex].workouts[workoutIndex].completed = false;
    }
    
    setWorkoutPlan(updatedWorkoutPlan);
  };
  
  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'bg-blue-500 text-white';
      case 'cardio':
        return 'bg-red-500 text-white';
      case 'hiit':
        return 'bg-orange-500 text-white';
      case 'yoga':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  const getWorkoutCompletion = (workoutExercises: Exercise[]) => {
    const totalExercises = workoutExercises.length;
    const completedExercises = workoutExercises.filter(ex => ex.completed).length;
    return totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workout Plan</h1>
            <p className="text-muted-foreground">Your personalized AI workout plan based on your goals</p>
          </div>
          <Button onClick={() => {
            toast({
              title: "Regenerating workout plan",
              description: "Your complete AI workout plan is being updated",
            });
          }}>
            Regenerate Plan
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Weekly Workout Summary</CardTitle>
            <CardDescription>Overview of your weekly workout plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Weekly Workouts</div>
                  <div className="text-2xl font-bold mt-1">
                    {workoutPlan.reduce((acc, day) => acc + day.workouts.length, 0)}
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Total Duration</div>
                  <div className="text-2xl font-bold mt-1">
                    {workoutPlan.reduce((acc, day) => acc + day.totalDuration, 0)} mins
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Total Calories Burn</div>
                  <div className="text-2xl font-bold mt-1">
                    {workoutPlan.reduce((acc, day) => acc + day.totalCaloriesBurn, 0)}
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Completion Rate</div>
                  <div className="text-2xl font-bold mt-1">
                    {Math.round(workoutPlan.reduce((acc, day) => 
                      acc + day.workouts.filter(workout => workout.completed).length, 0) / 
                      workoutPlan.reduce((acc, day) => acc + day.workouts.length, 0) * 100) || 0}%
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Workout Type Distribution</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted flex">
                  {/* Count workouts by type */}
                  {(() => {
                    const allWorkouts = workoutPlan.flatMap(day => day.workouts);
                    const totalWorkouts = allWorkouts.length;
                    
                    const typeCount = {
                      strength: allWorkouts.filter(w => w.type === 'strength').length,
                      cardio: allWorkouts.filter(w => w.type === 'cardio').length,
                      hiit: allWorkouts.filter(w => w.type === 'hiit').length,
                      yoga: allWorkouts.filter(w => w.type === 'yoga').length,
                    };
                    
                    return (
                      <>
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${(typeCount.strength / totalWorkouts) * 100}%` }} 
                        />
                        <div 
                          className="h-full bg-red-500" 
                          style={{ width: `${(typeCount.cardio / totalWorkouts) * 100}%` }} 
                        />
                        <div 
                          className="h-full bg-orange-500" 
                          style={{ width: `${(typeCount.hiit / totalWorkouts) * 100}%` }} 
                        />
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${(typeCount.yoga / totalWorkouts) * 100}%` }} 
                        />
                      </>
                    );
                  })()}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-1" />
                    <span>Strength</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-1" />
                    <span>Cardio</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-orange-500 mr-1" />
                    <span>HIIT</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-1" />
                    <span>Yoga</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="Monday">
          <TabsList className="mb-4 w-full max-w-full overflow-x-auto flex flex-nowrap">
            {workoutPlan.map((day) => (
              <TabsTrigger key={day.day} value={day.day} className="flex-shrink-0">
                {day.day}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {workoutPlan.map((day, dayIndex) => (
            <TabsContent key={day.day} value={day.day} className="space-y-4 relative">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{day.day}</h2>
                <div className="text-sm flex items-center gap-2 text-muted-foreground">
                  <span>{day.totalDuration} mins</span>
                  <span>·</span>
                  <span>{day.totalCaloriesBurn} calories</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {day.workouts.map((workout, workoutIndex) => (
                  <Card key={workout.id} className={workout.completed ? "opacity-75 border-green-500/50" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className={`text-lg ${workout.completed ? "line-through" : ""}`}>{workout.name}</CardTitle>
                          <CardDescription>
                            {workout.duration} mins · {workout.caloriesBurn} calories
                          </CardDescription>
                        </div>
                        <Badge className={getWorkoutTypeColor(workout.type)}>
                          {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                        </Badge>
                      </div>
                      
                      <Progress 
                        value={getWorkoutCompletion(workout.exercises)} 
                        className="h-1 mt-2" 
                      />
                    </CardHeader>
                    <CardContent className="pb-0">
                      <div className="space-y-3">
                        {workout.exercises.map((exercise, exerciseIndex) => (
                          <div 
                            key={exercise.id} 
                            className={`p-3 rounded-md border ${exercise.completed ? "bg-muted/30" : ""}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`font-medium ${exercise.completed ? "line-through opacity-70" : ""}`}>
                                  {exercise.name}
                                </p>
                                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                  <span>{exercise.sets} sets</span>
                                  <span>·</span>
                                  <span>
                                    {exercise.reps} {exercise.reps > 1 ? "reps" : "rep"}
                                    {exercise.duration ? ` (${exercise.duration} sec)` : ""}
                                  </span>
                                  {exercise.weight && (
                                    <>
                                      <span>·</span>
                                      <span>{exercise.weight} kg</span>
                                    </>
                                  )}
                                  <span>·</span>
                                  <span>{exercise.restTime} sec rest</span>
                                </div>
                              </div>
                              <div>
                                <Button 
                                  variant={exercise.completed ? "outline" : "default"} 
                                  size="sm"
                                  onClick={() => handleMarkExerciseCompleted(dayIndex, workoutIndex, exerciseIndex)}
                                >
                                  {exercise.completed ? "Completed" : "Done"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRegenerateWorkout(dayIndex, workoutIndex)}
                      >
                        <X className="mr-1 h-4 w-4" /> Swap Workout
                      </Button>
                      <Button 
                        size="sm"
                        variant={workout.completed ? "outline" : "default"}
                        onClick={() => handleMarkWorkoutCompleted(dayIndex, workoutIndex)}
                        className={workout.completed ? "border-green-500 text-green-500 hover:bg-green-500/10" : ""}
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        {workout.completed ? "Completed" : "Complete All"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Workouts;
