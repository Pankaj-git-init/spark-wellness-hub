
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Utensils, Shuffle, Check, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAIPlanGeneration } from "@/hooks/useAIPlanGeneration";

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: string[];
  completed?: boolean;
}

interface MealPlanData {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
  snacks: Meal[];
}

const MealPlan = () => {
  const { generatePlan, isGenerating, mealPlan } = useAIPlanGeneration();
  const [selectedDay, setSelectedDay] = useState("Monday");

  const getCurrentDayMeals = () => {
    if (!mealPlan) return null;
    
    const dayData = mealPlan.days.find(day => day.day === selectedDay);
    if (!dayData) return null;

    // Convert AI meal plan format to our component format
    return {
      breakfast: [{
        id: `${selectedDay}-b1`,
        name: dayData.meals.breakfast.name,
        time: "8:00 AM",
        calories: dayData.meals.breakfast.calories,
        protein: Math.round(dayData.meals.breakfast.calories * 0.2 / 4), // Estimate protein
        carbs: Math.round(dayData.meals.breakfast.calories * 0.5 / 4), // Estimate carbs
        fat: Math.round(dayData.meals.breakfast.calories * 0.3 / 9), // Estimate fat
        foods: dayData.meals.breakfast.description.split(', '),
        completed: false
      }],
      lunch: [{
        id: `${selectedDay}-l1`,
        name: dayData.meals.lunch.name,
        time: "12:30 PM",
        calories: dayData.meals.lunch.calories,
        protein: Math.round(dayData.meals.lunch.calories * 0.25 / 4),
        carbs: Math.round(dayData.meals.lunch.calories * 0.45 / 4),
        fat: Math.round(dayData.meals.lunch.calories * 0.3 / 9),
        foods: dayData.meals.lunch.description.split(', '),
        completed: false
      }],
      dinner: [{
        id: `${selectedDay}-d1`,
        name: dayData.meals.dinner.name,
        time: "7:00 PM",
        calories: dayData.meals.dinner.calories,
        protein: Math.round(dayData.meals.dinner.calories * 0.3 / 4),
        carbs: Math.round(dayData.meals.dinner.calories * 0.4 / 4),
        fat: Math.round(dayData.meals.dinner.calories * 0.3 / 9),
        foods: dayData.meals.dinner.description.split(', '),
        completed: false
      }],
      snacks: [
        {
          id: `${selectedDay}-s1`,
          name: dayData.meals.snack1.name,
          time: "3:00 PM",
          calories: dayData.meals.snack1.calories,
          protein: Math.round(dayData.meals.snack1.calories * 0.15 / 4),
          carbs: Math.round(dayData.meals.snack1.calories * 0.6 / 4),
          fat: Math.round(dayData.meals.snack1.calories * 0.25 / 9),
          foods: dayData.meals.snack1.description.split(', '),
          completed: false
        },
        {
          id: `${selectedDay}-s2`,
          name: dayData.meals.snack2.name,
          time: "9:00 PM",
          calories: dayData.meals.snack2.calories,
          protein: Math.round(dayData.meals.snack2.calories * 0.15 / 4),
          carbs: Math.round(dayData.meals.snack2.calories * 0.6 / 4),
          fat: Math.round(dayData.meals.snack2.calories * 0.25 / 9),
          foods: dayData.meals.snack2.description.split(', '),
          completed: false
        }
      ]
    };
  };

  const currentMealPlan = getCurrentDayMeals();
  
  // Calculate totals only if meal plan exists
  const totalCalories = currentMealPlan ? Object.values(currentMealPlan).flat().reduce((sum, meal) => sum + meal.calories, 0) : 0;
  const totalProtein = currentMealPlan ? Object.values(currentMealPlan).flat().reduce((sum, meal) => sum + meal.protein, 0) : 0;
  const totalCarbs = currentMealPlan ? Object.values(currentMealPlan).flat().reduce((sum, meal) => sum + meal.carbs, 0) : 0;
  const totalFat = currentMealPlan ? Object.values(currentMealPlan).flat().reduce((sum, meal) => sum + meal.fat, 0) : 0;

  // Dynamic goals based on AI plan
  const calorieGoal = mealPlan?.dailyCalories || 0;
  const proteinGoal = Math.round(calorieGoal * 0.25 / 4); // 25% of calories from protein
  const carbsGoal = Math.round(calorieGoal * 0.45 / 4); // 45% of calories from carbs
  const fatGoal = Math.round(calorieGoal * 0.3 / 9); // 30% of calories from fat

  const handleGenerateNewPlan = async () => {
    await generatePlan('meal');
  };

  const swapMeal = (mealType: keyof MealPlanData, mealId: string) => {
    console.log(`Swapping meal ${mealId} in ${mealType}`);
  };

  const renderMealCard = (meal: Meal, mealType: keyof MealPlanData) => (
    <Card key={meal.id} className={`transition-all ${meal.completed ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{meal.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {meal.time}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          {meal.calories} calories
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{meal.protein}g</div>
            <div className="text-xs text-muted-foreground">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{meal.carbs}g</div>
            <div className="text-xs text-muted-foreground">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">{meal.fat}g</div>
            <div className="text-xs text-muted-foreground">Fat</div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium">Ingredients:</div>
          <div className="text-sm text-muted-foreground">
            {meal.foods.join(", ")}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => swapMeal(mealType, meal.id)}
          className="w-full"
        >
          <Shuffle className="h-4 w-4 mr-2" />
          Swap Meal
        </Button>
      </CardFooter>
    </Card>
  );

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Show generate prompt if no meal plan exists
  if (!mealPlan) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Meal Plan</h1>
              <p className="text-muted-foreground">
                Your personalized nutrition plan for optimal results
              </p>
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
                    Generate your personalized meal plan to view your daily nutrition and meal recommendations.
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
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meal Plan</h1>
            <p className="text-muted-foreground">
              Your personalized nutrition plan for optimal results
            </p>
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

        {/* Day Navigation */}
        <Tabs value={selectedDay} onValueChange={setSelectedDay}>
          <TabsList className="grid w-full grid-cols-7">
            {daysOfWeek.map((day) => (
              <TabsTrigger key={day} value={day} className="text-xs">
                {day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {daysOfWeek.map((day) => (
            <TabsContent key={day} value={day} className="space-y-6">
              {/* Daily Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Calories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalCalories}</div>
                    <div className="text-xs text-muted-foreground mb-2">of {calorieGoal} goal</div>
                    <Progress value={calorieGoal > 0 ? (totalCalories / calorieGoal) * 100 : 0} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-blue-600">Protein</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{totalProtein}g</div>
                    <div className="text-xs text-muted-foreground mb-2">of {proteinGoal}g goal</div>
                    <Progress value={proteinGoal > 0 ? (totalProtein / proteinGoal) * 100 : 0} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-600">Carbs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{totalCarbs}g</div>
                    <div className="text-xs text-muted-foreground mb-2">of {carbsGoal}g goal</div>
                    <Progress value={carbsGoal > 0 ? (totalCarbs / carbsGoal) * 100 : 0} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-orange-600">Fat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{totalFat}g</div>
                    <div className="text-xs text-muted-foreground mb-2">of {fatGoal}g goal</div>
                    <Progress value={fatGoal > 0 ? (totalFat / fatGoal) * 100 : 0} className="h-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Meal Sections */}
              {currentMealPlan && (
                <div className="grid gap-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      🌅 Breakfast
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {currentMealPlan.breakfast.map(meal => renderMealCard(meal, 'breakfast'))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      ☀️ Lunch
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {currentMealPlan.lunch.map(meal => renderMealCard(meal, 'lunch'))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      🌙 Dinner
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {currentMealPlan.dinner.map(meal => renderMealCard(meal, 'dinner'))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      🍎 Snacks
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {currentMealPlan.snacks.map(meal => renderMealCard(meal, 'snacks'))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MealPlan;
