
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface MealPlan {
  title: string;
  overview: string;
  dailyCalories: number;
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
}

export interface WorkoutPlan {
  title: string;
  overview: string;
  weeklyGoal: string;
  days: Array<{
    day: string;
    focus: string;
    duration: string;
    exercises: Array<{
      name: string;
      type: string;
      sets?: number;
      reps?: string;
      duration?: string;
      rest?: string;
      description: string;
    }>;
  }>;
}

export const useAIPlanGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const generatePlan = async (planType: 'meal' | 'workout') => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to generate plans",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Generating plan:', planType);
      
      const { data, error } = await supabase.functions.invoke('generate-ai-plan', {
        body: {
          planType,
          userId: user.id,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data || !data.plan) {
        throw new Error('No plan data received');
      }

      console.log('Plan generated successfully:', data.plan);

      if (planType === 'meal') {
        setMealPlan(data.plan);
        toast({
          title: "Meal Plan Generated!",
          description: "Your personalized meal plan is ready",
        });
      } else {
        setWorkoutPlan(data.plan);
        toast({
          title: "Workout Plan Generated!",
          description: "Your personalized workout plan is ready",
        });
      }

    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePlan,
    isGenerating,
    mealPlan,
    workoutPlan,
    setMealPlan,
    setWorkoutPlan,
  };
};
