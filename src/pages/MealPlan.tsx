import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  MealPlan as MealPlanType,
  useAIPlanGeneration
} from "@/hooks/useAIPlanGeneration";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeModal } from "@/components/UpgradeModal";
import { PurchaseRegenerationsModal } from "@/components/PurchaseRegenerationsModal";

interface Meal {
  name: string;
  calories: number;
  description: string;
}

interface DailyMeals {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack1: Meal;
  snack2: Meal;
}

interface DailyPlan {
  day: string;
  meals: DailyMeals;
}

interface MealPlan {
  title: string;
  overview: string;
  dailyCalories: number;
  days: DailyPlan[];
}

const MealPlan = () => {
  const { generatePlan, isGenerating, isLoading, mealPlan } = useAIPlanGeneration();
  const { isPro, canRegenerate, useRegeneration, regenerationsRemaining } = useSubscription();
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  const handleGenerateNewPlan = async () => {
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
      await generatePlan('meal');
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

  // Show generate prompt if no meal plan exists
  if (!mealPlan) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Meal Plan</h1>
              <p className="text-muted-foreground">Your personalized AI meal plan based on your goals</p>
            </div>
            <Button onClick={handleGenerateNewPlan} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Utensils className="h-4 w-4 mr-2" />
                  Generate New Plan
                </>
              )}
            </Button>
          </div>

          <Card className="text-center py-16">
            <CardContent>
              <div className="space-y-4">
                <Utensils className="h-16 w-16 mx-auto text-muted-foreground" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">No Meal Plan Generated Yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Generate your personalized meal plan to view your daily meal recommendation.
                  </p>
                  <Button onClick={handleGenerateNewPlan} disabled={isGenerating} size="lg">
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Meal Plan...
                      </>
                    ) : (
                      <>
                        <Utensils className="h-4 w-4 mr-2" />
                        Generate Meal Plan
                      </>
                    )}
                  </Button>
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

  // Get current day data
  const currentDayData = mealPlan.days.find(day => day.day === selectedDay);
  
  // Calculate nutrition for current day
  const currentDayNutrition = currentDayData ? {
    calories: Object.values(currentDayData.meals).reduce((sum, meal) => sum + meal.calories, 0),
    protein: Math.round(Object.values(currentDayData.meals).reduce((sum, meal) => sum + meal.calories, 0) * 0.3 / 4), // 30% from protein
    carbs: Math.round(Object.values(currentDayData.meals).reduce((sum, meal) => sum + meal.calories, 0) * 0.4 / 4), // 40% from carbs
    fat: Math.round(Object.values(currentDayData.meals).reduce((sum, meal) => sum + meal.calories, 0) * 0.3 / 9), // 30% from fat
  } : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meal Plan</h1>
            <p className="text-muted-foreground">{mealPlan.title}</p>
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

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{mealPlan.overview}</p>
            <Badge variant="secondary" className="mt-2">
              Daily Target: {mealPlan.dailyCalories} calories
            </Badge>
          </CardContent>
        </Card>

        {/* Day Selection Tabs */}
        <Tabs value={selectedDay} onValueChange={setSelectedDay}>
          <TabsList className="grid w-full grid-cols-7">
            {mealPlan.days.map((day) => (
              <TabsTrigger key={day.day} value={day.day} className="text-xs">
                {day.day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {mealPlan.days.map((day) => (
            <TabsContent key={day.day} value={day.day} className="space-y-6">
              {/* Nutrition Summary for Selected Day */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Calories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{currentDayNutrition.calories}</div>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Protein</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{currentDayNutrition.protein}g</div>
                    <p className="text-xs text-muted-foreground">30% of calories</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Carbs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{currentDayNutrition.carbs}g</div>
                    <p className="text-xs text-muted-foreground">40% of calories</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Fat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{currentDayNutrition.fat}g</div>
                    <p className="text-xs text-muted-foreground">30% of calories</p>
                  </CardContent>
                </Card>
              </div>

              {/* Meals for Selected Day */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(day.meals).map(([mealType, meal]) => (
                  <Card key={mealType}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 capitalize">
                        <Utensils className="h-5 w-5" />
                        {mealType.replace(/\d+/, ' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold">{meal.name}</h4>
                        <p className="text-sm text-muted-foreground">{meal.description}</p>
                      </div>
                      <Badge variant="secondary">{meal.calories} calories</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
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

export default MealPlan;
