
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Utensils, Shuffle, Check } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

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
  const [mealPlan, setMealPlan] = useState<MealPlanData>({
    breakfast: [
      {
        id: "b1",
        name: "Greek Yogurt Bowl",
        time: "8:00 AM",
        calories: 320,
        protein: 20,
        carbs: 35,
        fat: 8,
        foods: ["Greek yogurt", "Blueberries", "Granola", "Honey"],
        completed: false
      }
    ],
    lunch: [
      {
        id: "l1",
        name: "Grilled Chicken Salad",
        time: "12:30 PM",
        calories: 450,
        protein: 35,
        carbs: 25,
        fat: 22,
        foods: ["Grilled chicken", "Mixed greens", "Cherry tomatoes", "Avocado", "Olive oil dressing"],
        completed: false
      }
    ],
    dinner: [
      {
        id: "d1",
        name: "Salmon with Quinoa",
        time: "7:00 PM",
        calories: 520,
        protein: 40,
        carbs: 45,
        fat: 18,
        foods: ["Baked salmon", "Quinoa", "Steamed broccoli", "Lemon"],
        completed: false
      }
    ],
    snacks: [
      {
        id: "s1",
        name: "Apple with Almond Butter",
        time: "3:00 PM",
        calories: 180,
        protein: 6,
        carbs: 20,
        fat: 12,
        foods: ["Apple", "Almond butter"],
        completed: false
      }
    ]
  });

  const totalCalories = Object.values(mealPlan).flat().reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = Object.values(mealPlan).flat().reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = Object.values(mealPlan).flat().reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = Object.values(mealPlan).flat().reduce((sum, meal) => sum + meal.fat, 0);

  const calorieGoal = 1800;
  const proteinGoal = 140;
  const carbsGoal = 180;
  const fatGoal = 60;

  const swapMeal = (mealType: keyof MealPlanData, mealId: string) => {
    // Mock meal swap - in real app, this would call AI service
    console.log(`Swapping meal ${mealId} in ${mealType}`);
  };

  const toggleMealCompleted = (mealType: keyof MealPlanData, mealId: string) => {
    setMealPlan(prev => ({
      ...prev,
      [mealType]: prev[mealType].map(meal => 
        meal.id === mealId ? { ...meal, completed: !meal.completed } : meal
      )
    }));
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
              onClick={() => toggleMealCompleted(mealType, meal.id)}
              className={meal.completed ? 'text-green-600' : ''}
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Today's Meal Plan</h1>
            <p className="text-muted-foreground">
              Your personalized nutrition plan for optimal results
            </p>
          </div>
          <Button>
            <Utensils className="h-4 w-4 mr-2" />
            Generate New Plan
          </Button>
        </div>

        {/* Daily Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCalories}</div>
              <div className="text-xs text-muted-foreground mb-2">of {calorieGoal} goal</div>
              <Progress value={(totalCalories / calorieGoal) * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-600">Protein</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalProtein}g</div>
              <div className="text-xs text-muted-foreground mb-2">of {proteinGoal}g goal</div>
              <Progress value={(totalProtein / proteinGoal) * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600">Carbs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalCarbs}g</div>
              <div className="text-xs text-muted-foreground mb-2">of {carbsGoal}g goal</div>
              <Progress value={(totalCarbs / carbsGoal) * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-600">Fat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{totalFat}g</div>
              <div className="text-xs text-muted-foreground mb-2">of {fatGoal}g goal</div>
              <Progress value={(totalFat / fatGoal) * 100} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Meal Sections */}
        <div className="grid gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🌅 Breakfast
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mealPlan.breakfast.map(meal => renderMealCard(meal, 'breakfast'))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              ☀️ Lunch
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mealPlan.lunch.map(meal => renderMealCard(meal, 'lunch'))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🌙 Dinner
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mealPlan.dinner.map(meal => renderMealCard(meal, 'dinner'))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🍎 Snacks
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mealPlan.snacks.map(meal => renderMealCard(meal, 'snacks'))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MealPlan;
