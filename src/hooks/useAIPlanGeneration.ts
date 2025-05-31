
import { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load existing plans from database
  useEffect(() => {
    const loadExistingPlans = async () => {
      if (!user) {
        console.log('No user found, skipping plan loading');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Loading existing plans for user:', user.id);

        // Load meal plan
        const { data: mealPlanData, error: mealError } = await supabase
          .from('meal_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (mealError) {
          console.error('Error loading meal plan:', mealError);
        } else if (mealPlanData) {
          console.log('Loaded meal plan:', mealPlanData);
          setMealPlan(mealPlanData.plan_data as unknown as MealPlan);
        } else {
          console.log('No meal plan found for user');
        }

        // Load workout plan
        const { data: workoutPlanData, error: workoutError } = await supabase
          .from('workout_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (workoutError) {
          console.error('Error loading workout plan:', workoutError);
        } else if (workoutPlanData) {
          console.log('Loaded workout plan:', workoutPlanData);
          setWorkoutPlan(workoutPlanData.plan_data as unknown as WorkoutPlan);
        } else {
          console.log('No workout plan found for user');
        }

      } catch (error) {
        console.error('Error loading plans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingPlans();
  }, [user]);

  const saveMealPlan = async (plan: MealPlan) => {
    if (!user) {
      console.error('No user found, cannot save meal plan');
      return false;
    }

    try {
      console.log('Saving meal plan to database for user:', user.id);
      console.log('Plan data:', plan);

      // First, try to update existing plan
      const { data: updateData, error: updateError } = await supabase
        .from('meal_plans')
        .update({
          title: plan.title,
          overview: plan.overview,
          daily_calories: plan.dailyCalories,
          plan_data: plan as any,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select();

      if (updateError) {
        console.log('Update failed, trying insert:', updateError);
        
        // If update fails, try insert
        const { data: insertData, error: insertError } = await supabase
          .from('meal_plans')
          .insert({
            user_id: user.id,
            title: plan.title,
            overview: plan.overview,
            daily_calories: plan.dailyCalories,
            plan_data: plan as any
          })
          .select();

        if (insertError) {
          console.error('Insert also failed:', insertError);
          throw insertError;
        }

        console.log('Meal plan inserted successfully:', insertData);
        return true;
      }

      console.log('Meal plan updated successfully:', updateData);
      return true;
    } catch (error) {
      console.error('Failed to save meal plan:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save meal plan. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const saveWorkoutPlan = async (plan: WorkoutPlan) => {
    if (!user) {
      console.error('No user found, cannot save workout plan');
      return false;
    }

    try {
      console.log('Saving workout plan to database for user:', user.id);
      console.log('Plan data:', plan);

      // First, try to update existing plan
      const { data: updateData, error: updateError } = await supabase
        .from('workout_plans')
        .update({
          title: plan.title,
          overview: plan.overview,
          weekly_goal: plan.weeklyGoal,
          plan_data: plan as any,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select();

      if (updateError) {
        console.log('Update failed, trying insert:', updateError);
        
        // If update fails, try insert
        const { data: insertData, error: insertError } = await supabase
          .from('workout_plans')
          .insert({
            user_id: user.id,
            title: plan.title,
            overview: plan.overview,
            weekly_goal: plan.weeklyGoal,
            plan_data: plan as any
          })
          .select();

        if (insertError) {
          console.error('Insert also failed:', insertError);
          throw insertError;
        }

        console.log('Workout plan inserted successfully:', insertData);
        return true;
      }

      console.log('Workout plan updated successfully:', updateData);
      return true;
    } catch (error) {
      console.error('Failed to save workout plan:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save workout plan. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

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
        const saveSuccess = await saveMealPlan(data.plan);
        if (saveSuccess) {
          toast({
            title: "Meal Plan Generated!",
            description: "Your personalized meal plan has been saved",
          });
        }
      } else {
        setWorkoutPlan(data.plan);
        const saveSuccess = await saveWorkoutPlan(data.plan);
        if (saveSuccess) {
          toast({
            title: "Workout Plan Generated!",
            description: "Your personalized workout plan has been saved",
          });
        }
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
    isLoading,
    mealPlan,
    workoutPlan,
    setMealPlan,
    setWorkoutPlan,
  };
};
