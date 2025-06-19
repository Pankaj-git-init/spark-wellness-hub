
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface WorkoutTrackerProps {
  onWorkoutToggle: (workoutName: string, completed: boolean) => void;
  completedWorkouts: string[];
}

interface WorkoutPlan {
  title: string;
  plan_data: {
    days: Array<{
      day: string;
      exercises: Array<{
        name: string;
        sets?: number;
        reps?: string;
        duration?: string;
        rest?: string;
      }>;
    }>;
  };
}

export const WorkoutTracker = ({ onWorkoutToggle, completedWorkouts }: WorkoutTrackerProps) => {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('workout_plans')
          .select('title, plan_data')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching workout plan:', error);
          return;
        }

        if (data) {
          setWorkoutPlan(data);
        }
      } catch (error) {
        console.error('Error fetching workout plan:', error);
      }
    };

    fetchWorkoutPlan();
  }, [user]);

  if (!workoutPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Workouts</CardTitle>
          <CardDescription>No workout plan found. Generate a workout plan first.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysWorkout = workoutPlan.plan_data.days.find(day => day.day === today);

  if (!todaysWorkout || !todaysWorkout.exercises || todaysWorkout.exercises.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Workouts</CardTitle>
          <CardDescription>No workouts scheduled for {today}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Take a rest day or do some light activity!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Workouts - {today}</CardTitle>
        <CardDescription>Check off exercises as you complete them</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {todaysWorkout.exercises.map((exercise, index) => {
          const exerciseId = `${exercise.name}-${index}`;
          const isCompleted = completedWorkouts.includes(exerciseId);
          
          return (
            <div key={exerciseId} className="flex items-start space-x-3 p-3 border rounded-lg">
              <Checkbox
                id={exerciseId}
                checked={isCompleted}
                onCheckedChange={(checked) => onWorkoutToggle(exerciseId, !!checked)}
                className="mt-1"
              />
              <div className="flex-1 space-y-1">
                <label
                  htmlFor={exerciseId}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${
                    isCompleted ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {exercise.name}
                </label>
                <div className="flex flex-wrap gap-1">
                  {exercise.sets && (
                    <Badge variant="secondary" className="text-xs">
                      {exercise.sets} sets
                    </Badge>
                  )}
                  {exercise.reps && (
                    <Badge variant="secondary" className="text-xs">
                      {exercise.reps} reps
                    </Badge>
                  )}
                  {exercise.duration && (
                    <Badge variant="secondary" className="text-xs">
                      {exercise.duration}
                    </Badge>
                  )}
                  {exercise.rest && (
                    <Badge variant="secondary" className="text-xs">
                      Rest: {exercise.rest}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Progress: {completedWorkouts.length} of {todaysWorkout.exercises.length} exercises completed
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
