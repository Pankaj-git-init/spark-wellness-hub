
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Loader2 } from "lucide-react";
import { useAIPlanGeneration } from "@/hooks/useAIPlanGeneration";
import { WorkoutPlanDisplay } from "@/components/WorkoutPlanDisplay";

const Workouts = () => {
  const { generatePlan, isGenerating, isLoading, workoutPlan } = useAIPlanGeneration();
  
  const handleGenerateNewPlan = async () => {
    await generatePlan('workout');
  };

  // Show loading state while fetching existing plans
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show generate prompt if no workout plan exists
  if (!workoutPlan) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Workout Plan</h1>
              <p className="text-muted-foreground">Your personalized AI workout plan based on your goals</p>
            </div>
            <Button onClick={handleGenerateNewPlan} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Dumbbell className="h-4 w-4 mr-2" />
                  Generate New Plan
                </>
              )}
            </Button>
          </div>

          <Card className="text-center py-16">
            <CardContent>
              <div className="space-y-4">
                <Dumbbell className="h-16 w-16 mx-auto text-muted-foreground" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">No Workout Plan Generated Yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Generate your personalized workout plan to view your daily workout recommendation.
                  </p>
                  <Button onClick={handleGenerateNewPlan} disabled={isGenerating} size="lg">
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Workout Plan...
                      </>
                    ) : (
                      <>
                        <Dumbbell className="h-4 w-4 mr-2" />
                        Generate Workout Plan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workout Plan</h1>
            <p className="text-muted-foreground">Your personalized AI workout plan based on your goals</p>
          </div>
          <Button onClick={handleGenerateNewPlan} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Regenerate Plan"
            )}
          </Button>
        </div>

        <WorkoutPlanDisplay plan={workoutPlan} />
      </div>
    </DashboardLayout>
  );
};

export default Workouts;
