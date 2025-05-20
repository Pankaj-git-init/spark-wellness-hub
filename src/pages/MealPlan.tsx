
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Meal {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  completed: boolean;
}

interface MealDay {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

const MealPlan = () => {
  const { toast } = useToast();
  
  // Mock meal plan data
  const initialMealPlan: MealDay[] = [
    {
      day: "Monday",
      breakfast: {
        id: 1,
        name: "Greek Yogurt with Berries",
        calories: 320,
        protein: 24,
        carbs: 32,
        fat: 10,
        ingredients: ["Greek yogurt", "Mixed berries", "Honey", "Granola"],
        completed: false
      },
      lunch: {
        id: 2,
        name: "Grilled Chicken Salad",
        calories: 420,
        protein: 35,
        carbs: 25,
        fat: 18,
        ingredients: ["Grilled chicken breast", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil dressing"],
        completed: false
      },
      dinner: {
        id: 3,
        name: "Baked Salmon with Quinoa",
        calories: 580,
        protein: 42,
        carbs: 48,
        fat: 22,
        ingredients: ["Salmon fillet", "Quinoa", "Asparagus", "Lemon", "Olive oil", "Herbs"],
        completed: false
      },
      snacks: [
        {
          id: 4,
          name: "Apple with Almond Butter",
          calories: 210,
          protein: 6,
          carbs: 25,
          fat: 12,
          ingredients: ["Apple", "Almond butter"],
          completed: false
        }
      ],
      totalCalories: 1530,
      totalProtein: 107,
      totalCarbs: 130,
      totalFat: 62
    },
    {
      day: "Tuesday",
      breakfast: {
        id: 5,
        name: "Veggie Omelette",
        calories: 350,
        protein: 28,
        carbs: 15,
        fat: 22,
        ingredients: ["Eggs", "Bell peppers", "Spinach", "Onions", "Feta cheese"],
        completed: false
      },
      lunch: {
        id: 6,
        name: "Turkey Wrap",
        calories: 410,
        protein: 30,
        carbs: 38,
        fat: 15,
        ingredients: ["Turkey slices", "Whole wheat wrap", "Lettuce", "Tomato", "Avocado", "Mustard"],
        completed: false
      },
      dinner: {
        id: 7,
        name: "Beef Stir Fry",
        calories: 520,
        protein: 38,
        carbs: 45,
        fat: 20,
        ingredients: ["Lean beef strips", "Brown rice", "Broccoli", "Carrots", "Bell peppers", "Stir fry sauce"],
        completed: false
      },
      snacks: [
        {
          id: 8,
          name: "Greek Yogurt with Honey",
          calories: 180,
          protein: 18,
          carbs: 15,
          fat: 5,
          ingredients: ["Greek yogurt", "Honey", "Cinnamon"],
          completed: false
        }
      ],
      totalCalories: 1460,
      totalProtein: 114,
      totalCarbs: 113,
      totalFat: 62
    },
    {
      day: "Wednesday",
      breakfast: {
        id: 9,
        name: "Smoothie Bowl",
        calories: 380,
        protein: 22,
        carbs: 48,
        fat: 12,
        ingredients: ["Protein powder", "Banana", "Berries", "Almond milk", "Chia seeds"],
        completed: false
      },
      lunch: {
        id: 10,
        name: "Mediterranean Bowl",
        calories: 450,
        protein: 18,
        carbs: 55,
        fat: 20,
        ingredients: ["Quinoa", "Chickpeas", "Cucumber", "Cherry tomatoes", "Feta cheese", "Olives", "Tzatziki"],
        completed: false
      },
      dinner: {
        id: 11,
        name: "Grilled Tilapia with Vegetables",
        calories: 410,
        protein: 40,
        carbs: 25,
        fat: 15,
        ingredients: ["Tilapia fillet", "Zucchini", "Yellow squash", "Cherry tomatoes", "Garlic", "Lemon"],
        completed: false
      },
      snacks: [
        {
          id: 12,
          name: "Trail Mix",
          calories: 220,
          protein: 8,
          carbs: 18,
          fat: 14,
          ingredients: ["Mixed nuts", "Dried cranberries", "Dark chocolate chips"],
          completed: false
        }
      ],
      totalCalories: 1460,
      totalProtein: 88,
      totalCarbs: 146,
      totalFat: 61
    },
    {
      day: "Thursday",
      breakfast: {
        id: 13,
        name: "Overnight Oats",
        calories: 340,
        protein: 18,
        carbs: 45,
        fat: 10,
        ingredients: ["Rolled oats", "Almond milk", "Protein powder", "Banana", "Peanut butter"],
        completed: false
      },
      lunch: {
        id: 14,
        name: "Tuna Salad Sandwich",
        calories: 420,
        protein: 32,
        carbs: 35,
        fat: 18,
        ingredients: ["Tuna", "Whole grain bread", "Greek yogurt", "Celery", "Red onion", "Lettuce"],
        completed: false
      },
      dinner: {
        id: 15,
        name: "Chicken Stir Fry",
        calories: 480,
        protein: 38,
        carbs: 42,
        fat: 16,
        ingredients: ["Chicken breast", "Brown rice", "Mixed vegetables", "Low-sodium soy sauce", "Garlic", "Ginger"],
        completed: false
      },
      snacks: [
        {
          id: 16,
          name: "Protein Bar",
          calories: 200,
          protein: 15,
          carbs: 20,
          fat: 9,
          ingredients: ["Protein Bar"],
          completed: false
        }
      ],
      totalCalories: 1440,
      totalProtein: 103,
      totalCarbs: 142,
      totalFat: 53
    },
    {
      day: "Friday",
      breakfast: {
        id: 17,
        name: "Avocado Toast with Egg",
        calories: 390,
        protein: 22,
        carbs: 38,
        fat: 18,
        ingredients: ["Whole grain bread", "Avocado", "Eggs", "Cherry tomatoes", "Everything bagel seasoning"],
        completed: false
      },
      lunch: {
        id: 18,
        name: "Chicken Quinoa Bowl",
        calories: 450,
        protein: 35,
        carbs: 48,
        fat: 12,
        ingredients: ["Grilled chicken", "Quinoa", "Roasted sweet potatoes", "Kale", "Tahini dressing"],
        completed: false
      },
      dinner: {
        id: 19,
        name: "Shrimp and Zucchini Pasta",
        calories: 420,
        protein: 30,
        carbs: 45,
        fat: 13,
        ingredients: ["Shrimp", "Whole wheat pasta", "Zucchini", "Cherry tomatoes", "Garlic", "Olive oil", "Parmesan"],
        completed: false
      },
      snacks: [
        {
          id: 20,
          name: "Cottage Cheese with Fruit",
          calories: 180,
          protein: 20,
          carbs: 12,
          fat: 5,
          ingredients: ["Cottage cheese", "Mixed berries", "Cinnamon"],
          completed: false
        }
      ],
      totalCalories: 1440,
      totalProtein: 107,
      totalCarbs: 143,
      totalFat: 48
    },
    {
      day: "Saturday",
      breakfast: {
        id: 21,
        name: "Protein Pancakes",
        calories: 380,
        protein: 26,
        carbs: 40,
        fat: 12,
        ingredients: ["Protein pancake mix", "Banana", "Egg whites", "Berries", "Sugar-free syrup"],
        completed: false
      },
      lunch: {
        id: 22,
        name: "Turkey Burger with Sweet Potato",
        calories: 480,
        protein: 35,
        carbs: 48,
        fat: 18,
        ingredients: ["Turkey patty", "Whole grain bun", "Lettuce", "Tomato", "Onion", "Baked sweet potato"],
        completed: false
      },
      dinner: {
        id: 23,
        name: "Grilled Steak with Vegetables",
        calories: 520,
        protein: 40,
        carbs: 30,
        fat: 25,
        ingredients: ["Lean steak", "Grilled vegetables", "Quinoa", "Olive oil", "Herbs"],
        completed: false
      },
      snacks: [
        {
          id: 24,
          name: "Protein Shake",
          calories: 180,
          protein: 25,
          carbs: 10,
          fat: 3,
          ingredients: ["Protein powder", "Almond milk", "Ice"],
          completed: false
        }
      ],
      totalCalories: 1560,
      totalProtein: 126,
      totalCarbs: 128,
      totalFat: 58
    },
    {
      day: "Sunday",
      breakfast: {
        id: 25,
        name: "Egg White Breakfast Burrito",
        calories: 350,
        protein: 28,
        carbs: 35,
        fat: 12,
        ingredients: ["Egg whites", "Whole wheat tortilla", "Bell peppers", "Onions", "Salsa", "Low-fat cheese"],
        completed: false
      },
      lunch: {
        id: 26,
        name: "Chicken Caesar Salad",
        calories: 440,
        protein: 38,
        carbs: 20,
        fat: 22,
        ingredients: ["Grilled chicken", "Romaine lettuce", "Cherry tomatoes", "Parmesan cheese", "Caesar dressing"],
        completed: false
      },
      dinner: {
        id: 27,
        name: "Baked Cod with Roasted Vegetables",
        calories: 380,
        protein: 35,
        carbs: 25,
        fat: 15,
        ingredients: ["Cod fillet", "Broccoli", "Carrots", "Bell peppers", "Olive oil", "Lemon", "Herbs"],
        completed: false
      },
      snacks: [
        {
          id: 28,
          name: "Rice Cakes with Almond Butter",
          calories: 220,
          protein: 8,
          carbs: 22,
          fat: 12,
          ingredients: ["Rice cakes", "Almond butter", "Banana slices"],
          completed: false
        }
      ],
      totalCalories: 1390,
      totalProtein: 109,
      totalCarbs: 102,
      totalFat: 61
    }
  ];
  
  const [mealPlan, setMealPlan] = useState<MealDay[]>(initialMealPlan);
  
  const handleRegenerateMeal = (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', mealIndex: number = 0) => {
    toast({
      title: "Regenerating meal",
      description: "Your AI meal plan is being updated",
    });
    
    // This would call an AI service in a real app
    // For now, let's just simulate a change by adding "New" to the meal name
    const updatedMealPlan = [...mealPlan];
    
    if (mealType === 'snacks') {
      updatedMealPlan[dayIndex][mealType][mealIndex] = {
        ...updatedMealPlan[dayIndex][mealType][mealIndex],
        name: "New " + updatedMealPlan[dayIndex][mealType][mealIndex].name
      };
    } else {
      updatedMealPlan[dayIndex][mealType] = {
        ...updatedMealPlan[dayIndex][mealType],
        name: "New " + updatedMealPlan[dayIndex][mealType].name
      };
    }
    
    setMealPlan(updatedMealPlan);
  };
  
  const handleMarkCompleted = (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', mealIndex: number = 0) => {
    const updatedMealPlan = [...mealPlan];
    
    if (mealType === 'snacks') {
      updatedMealPlan[dayIndex][mealType][mealIndex].completed = !updatedMealPlan[dayIndex][mealType][mealIndex].completed;
    } else {
      updatedMealPlan[dayIndex][mealType].completed = !updatedMealPlan[dayIndex][mealType].completed;
    }
    
    setMealPlan(updatedMealPlan);
    
    toast({
      title: updatedMealPlan[dayIndex][mealType === 'snacks' ? mealType : mealType].completed 
        ? "Meal logged" 
        : "Meal unmarked",
      description: updatedMealPlan[dayIndex][mealType === 'snacks' ? mealType : mealType].completed 
        ? "Great job staying on track!" 
        : "You can log this meal later",
    });
  };

  const renderMealCard = (meal: Meal, dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', mealIndex: number = 0) => {
    return (
      <Card key={meal.id} className={meal.completed ? "opacity-75" : ""}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className={`text-lg ${meal.completed ? "line-through" : ""}`}>{meal.name}</CardTitle>
              <CardDescription>{meal.calories} calories</CardDescription>
            </div>
            <div>
              <Badge variant="outline">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Protein</span>
                <span>{meal.protein}g</span>
              </div>
              <Progress value={(meal.protein / (meal.protein + meal.carbs + meal.fat)) * 100} className="h-1" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Carbs</span>
                <span>{meal.carbs}g</span>
              </div>
              <Progress value={(meal.carbs / (meal.protein + meal.carbs + meal.fat)) * 100} className="h-1" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Fat</span>
                <span>{meal.fat}g</span>
              </div>
              <Progress value={(meal.fat / (meal.protein + meal.carbs + meal.fat)) * 100} className="h-1" />
            </div>
          </div>
          
          <div className="mt-3">
            <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
            <div className="flex flex-wrap gap-1">
              {meal.ingredients.map((ingredient, index) => (
                <Badge key={index} variant="secondary" className="font-normal text-xs">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleRegenerateMeal(dayIndex, mealType, mealType === 'snacks' ? mealIndex : undefined)}
          >
            <X className="mr-1 h-4 w-4" /> Swap Meal
          </Button>
          <Button 
            size="sm"
            variant={meal.completed ? "outline" : "default"}
            onClick={() => handleMarkCompleted(dayIndex, mealType, mealType === 'snacks' ? mealIndex : undefined)}
          >
            {meal.completed ? "Logged" : "Log Meal"}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meal Plan</h1>
            <p className="text-muted-foreground">Your AI-generated meal plan based on your goals</p>
          </div>
          <Button onClick={() => {
            toast({
              title: "Regenerating meal plan",
              description: "Your complete AI meal plan is being updated",
            });
          }}>
            Regenerate Plan
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Weekly Nutrition Summary</CardTitle>
            <CardDescription>Overview of your weekly meal plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Avg. Daily Calories</div>
                  <div className="text-2xl font-bold mt-1">
                    {Math.round(mealPlan.reduce((acc, day) => acc + day.totalCalories, 0) / 7)}
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Avg. Daily Protein</div>
                  <div className="text-2xl font-bold mt-1">
                    {Math.round(mealPlan.reduce((acc, day) => acc + day.totalProtein, 0) / 7)}g
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Avg. Daily Carbs</div>
                  <div className="text-2xl font-bold mt-1">
                    {Math.round(mealPlan.reduce((acc, day) => acc + day.totalCarbs, 0) / 7)}g
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Avg. Daily Fat</div>
                  <div className="text-2xl font-bold mt-1">
                    {Math.round(mealPlan.reduce((acc, day) => acc + day.totalFat, 0) / 7)}g
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Macronutrient Ratio</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted flex">
                  {/* Protein bar */}
                  <div 
                    className="h-full bg-primary" 
                    style={{ 
                      width: `${Math.round(mealPlan.reduce((acc, day) => acc + day.totalProtein, 0) * 4 / 
                        (mealPlan.reduce((acc, day) => acc + day.totalProtein, 0) * 4 + 
                         mealPlan.reduce((acc, day) => acc + day.totalCarbs, 0) * 4 + 
                         mealPlan.reduce((acc, day) => acc + day.totalFat, 0) * 9) * 100)}%` 
                    }} 
                  />
                  {/* Carbs bar */}
                  <div 
                    className="h-full bg-secondary" 
                    style={{ 
                      width: `${Math.round(mealPlan.reduce((acc, day) => acc + day.totalCarbs, 0) * 4 / 
                        (mealPlan.reduce((acc, day) => acc + day.totalProtein, 0) * 4 + 
                         mealPlan.reduce((acc, day) => acc + day.totalCarbs, 0) * 4 + 
                         mealPlan.reduce((acc, day) => acc + day.totalFat, 0) * 9) * 100)}%` 
                    }} 
                  />
                  {/* Fat bar */}
                  <div 
                    className="h-full bg-destructive/60" 
                    style={{ 
                      width: `${Math.round(mealPlan.reduce((acc, day) => acc + day.totalFat, 0) * 9 / 
                        (mealPlan.reduce((acc, day) => acc + day.totalProtein, 0) * 4 + 
                         mealPlan.reduce((acc, day) => acc + day.totalCarbs, 0) * 4 + 
                         mealPlan.reduce((acc, day) => acc + day.totalFat, 0) * 9) * 100)}%` 
                    }} 
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Protein: {Math.round(mealPlan.reduce((acc, day) => acc + day.totalProtein, 0) * 4 / 
                    (mealPlan.reduce((acc, day) => acc + day.totalProtein, 0) * 4 + 
                     mealPlan.reduce((acc, day) => acc + day.totalCarbs, 0) * 4 + 
                     mealPlan.reduce((acc, day) => acc + day.totalFat, 0) * 9) * 100)}%</span>
                  <span>Carbs: {Math.round(mealPlan.reduce((acc, day) => acc + day.totalCarbs, 0) * 4 / 
                    (mealPlan.reduce((acc, day) => acc + day.totalProtein, 0) * 4 + 
                     mealPlan.reduce((acc, day) => acc + day.totalCarbs, 0) * 4 + 
                     mealPlan.reduce((acc, day) => acc + day.totalFat, 0) * 9) * 100)}%</span>
                  <span>Fat: {Math.round(mealPlan.reduce((acc, day) => acc + day.totalFat, 0) * 9 / 
                    (mealPlan.reduce((acc, day) => acc + day.totalProtein, 0) * 4 + 
                     mealPlan.reduce((acc, day) => acc + day.totalCarbs, 0) * 4 + 
                     mealPlan.reduce((acc, day) => acc + day.totalFat, 0) * 9) * 100)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="Monday">
          <TabsList className="mb-4 w-full max-w-full overflow-x-auto flex flex-nowrap">
            {mealPlan.map((day) => (
              <TabsTrigger key={day.day} value={day.day} className="flex-shrink-0">
                {day.day}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {mealPlan.map((day, dayIndex) => (
            <TabsContent key={day.day} value={day.day} className="space-y-4 relative">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{day.day}</h2>
                <div className="text-sm flex items-center gap-2 text-muted-foreground">
                  <span>{day.totalCalories} calories</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{day.totalProtein}g protein</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderMealCard(day.breakfast, dayIndex, 'breakfast')}
                {renderMealCard(day.lunch, dayIndex, 'lunch')}
                {renderMealCard(day.dinner, dayIndex, 'dinner')}
                
                {day.snacks.map((snack, index) => 
                  renderMealCard(snack, dayIndex, 'snacks', index)
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MealPlan;
