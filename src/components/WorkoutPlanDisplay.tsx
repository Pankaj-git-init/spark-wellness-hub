
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Heart, Zap } from "lucide-react";
import { WorkoutPlan } from "@/hooks/useAIPlanGeneration";

interface WorkoutPlanDisplayProps {
  plan: WorkoutPlan;
}

export const WorkoutPlanDisplay = ({ plan }: WorkoutPlanDisplayProps) => {
  const getExerciseIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cardio':
        return <Heart className="h-4 w-4" />;
      case 'strength':
        return <Dumbbell className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{plan.title}</h2>
        <p className="text-muted-foreground mt-2">{plan.overview}</p>
        <Badge variant="secondary" className="mt-2">
          {plan.weeklyGoal}
        </Badge>
      </div>

      <div className="grid gap-4">
        {plan.days.map((day, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {day.day}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{day.focus}</Badge>
                  {day.duration && (
                    <Badge variant="secondary">{day.duration}</Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {day.exercises && day.exercises.length > 0 ? (
                <div className="space-y-3">
                  {day.exercises.map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getExerciseIcon(exercise.type)}
                          <h4 className="font-medium">{exercise.name}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {exercise.type}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                        {exercise.sets && (
                          <span>{exercise.sets} sets</span>
                        )}
                        {exercise.reps && (
                          <span>{exercise.reps} reps</span>
                        )}
                        {exercise.duration && (
                          <span>{exercise.duration}</span>
                        )}
                        {exercise.rest && (
                          <span>Rest: {exercise.rest}</span>
                        )}
                      </div>
                      
                      <p className="text-sm">{exercise.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Rest Day - Focus on recovery and light stretching</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
