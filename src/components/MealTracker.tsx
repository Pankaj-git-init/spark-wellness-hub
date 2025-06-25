
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Utensils } from "lucide-react";

interface MealTrackerProps {
  onMealToggle: (mealId: string, completed: boolean) => void;
  completedMeals: string[];
}

interface MealPlan {
  title: string;
  plan_data: {
    days: Array<{
      day: string;
      meals: {
        breakfast: { name: string; calories: number; description: string };
        lunch: { name: string; calories: number; description: string };
        dinner: { name: string; calories: number; description: string };
        snack1: { name: string; calories: number; description: string };
        snack2: { name: string; calories: number; description: string };
      };
    }>;
  };
}

export const MealTracker = ({ onMealToggle, completedMeals }: MealTrackerProps) => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMealPlan = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('meal_plans')
          .select('title, plan_data')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching meal plan:', error);
          return;
        }

        if (data) {
          const typedMealPlan: MealPlan = {
            title: data.title,
            plan_data: data.plan_data as MealPlan['plan_data']
          };
          setMealPlan(typedMealPlan);
        }
      } catch (error) {
        console.error('Error fetching meal plan:', error);
      }
    };

    fetchMealPlan();
  }, [user]);

  if (!mealPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Today's Meal Plan
          </CardTitle>
          <CardDescription>No meal plan found. Generate a meal plan first.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysMeals = mealPlan.plan_data.days.find(day => day.day === today);

  if (!todaysMeals) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Today's Meal Plan
          </CardTitle>
          <CardDescription>No meals planned for {today}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Check your weekly meal plan for other days!</p>
        </CardContent>
      </Card>
    );
  }

  const mealEntries = Object.entries(todaysMeals.meals);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          Today's Meal Plan - {today}
        </CardTitle>
        <CardDescription>Check off meals as you complete them</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mealEntries.map(([mealType, meal]) => {
          const mealId = `${mealType}-${today}`;
          const isCompleted = completedMeals.includes(mealId);
          
          return (
            <div key={mealId} className="flex items-start space-x-3 p-3 border rounded-lg">
              <Checkbox
                id={mealId}
                checked={isCompleted}
                onCheckedChange={(checked) => onMealToggle(mealId, !!checked)}
                className="mt-1"
              />
              <div className="flex-1 space-y-1">
                <label
                  htmlFor={mealId}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${
                    isCompleted ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  <span className="capitalize font-semibold">{mealType.replace(/\d+/, ' ')}: </span>
                  {meal.name}
                </label>
                <p className="text-xs text-muted-foreground">{meal.description}</p>
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {meal.calories} calories
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Progress: {completedMeals.length} of {mealEntries.length} meals completed
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
