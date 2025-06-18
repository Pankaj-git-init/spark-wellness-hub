
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAIPlanGeneration } from "@/hooks/useAIPlanGeneration";
import { useSubscription } from "@/hooks/useSubscription";
import { WorkoutPlanDisplay } from "@/components/WorkoutPlanDisplay";
import { UpgradeModal } from "@/components/UpgradeModal";
import { PurchaseRegenerationsModal } from "@/components/PurchaseRegenerationsModal";

const Workouts = () => {
  const { generatePlan, isGenerating, isLoading, workoutPlan } = useAIPlanGeneration();
  const { isPro, canRegenerate, useRegeneration, regenerationsRemaining, canUseFreeGeneration, markFreePlanUsed } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  const handleGenerateNewPlan = async () => {
    // Check if user can use free generation (first time)
    if (canUseFreeGeneration('workout')) {
      console.log('Using free workout plan generation');
      await generatePlan('workout', true);
      await markFreePlanUsed('workout');
      return;
    }

    // For subsequent generations, require pro subscription
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }

    if (!canRegenerate) {
      setShowPurchaseModal(true);
      return;
    }

    const canUse = await useRegeneration();
    if (canUse) {
      await generatePlan('workout');
    }
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
    const canGenerateForFree = canUseFreeGeneration('workout');
    
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
                  {canGenerateForFree ? "Generate Free Plan" : "Generate New Plan"}
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
                    {canGenerateForFree 
                      ? "Generate your first workout plan for free to get started with your fitness journey."
                      : "Generate your personalized workout plan to view your daily workout recommendation."
                    }
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
                        {canGenerateForFree ? "Generate Free Workout Plan" : "Generate Workout Plan"}
                      </>
                    )}
                  </Button>
                  {canGenerateForFree && (
                    <p className="text-sm text-green-600 mt-2">
                      ✨ Your first workout plan is completely free!
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <UpgradeModal 
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
        <PurchaseRegenerationsModal 
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
        />
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
            {isPro && (
              <p className="text-xs text-muted-foreground mt-1">
                Regenerations remaining: {regenerationsRemaining}
              </p>
            )}
          </div>
          <Button 
            onClick={handleGenerateNewPlan} 
            disabled={isGenerating}
            variant={isPro && canRegenerate ? "default" : "outline"}
            className={!isPro || !canRegenerate ? "opacity-75" : ""}
          >
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

      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
      <PurchaseRegenerationsModal 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
    </DashboardLayout>
  );
};

export default Workouts;
