
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Clock } from "lucide-react";
import { MealPlan } from "@/hooks/useAIPlanGeneration";

interface MealPlanDisplayProps {
  plan: MealPlan;
}

export const MealPlanDisplay = ({ plan }: MealPlanDisplayProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{plan.title}</h2>
        <p className="text-muted-foreground mt-2">{plan.overview}</p>
        <Badge variant="secondary" className="mt-2">
          Daily Target: {plan.dailyCalories} calories
        </Badge>
      </div>

      <div className="grid gap-4">
        {plan.days.map((day, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                {day.day}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(day.meals).map(([mealType, meal]) => (
                  <div key={mealType} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{mealType.replace(/\d+/, ' ')}</h4>
                      <Badge variant="outline" className="text-xs">
                        {meal.calories} cal
                      </Badge>
                    </div>
                    <h5 className="font-semibold text-sm">{meal.name}</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      {meal.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
