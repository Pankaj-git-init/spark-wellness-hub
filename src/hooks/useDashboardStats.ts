
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  dailyCalories: number;
  targetCalories: number;
  workoutStreak: number;
  waterGlasses: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    dailyCalories: 0,
    targetCalories: 0,
    workoutStreak: 0,
    waterGlasses: 0,
    macros: { protein: 0, carbs: 0, fat: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Fetch today's progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      // Fetch latest meal plan for calories
      const { data: mealPlan } = await supabase
        .from('meal_plans')
        .select('daily_calories, plan_data')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Calculate workout streak
      const { data: recentProgress } = await supabase
        .from('user_progress')
        .select('date, workouts_completed')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      let workoutStreak = 0;
      if (recentProgress) {
        // Start from today and count backwards
        for (let i = 0; i < recentProgress.length; i++) {
          const dayData = recentProgress[i];
          if (dayData.workouts_completed && dayData.workouts_completed.length > 0) {
            workoutStreak++;
          } else {
            break;
          }
        }
      }

      // Calculate macros from meal plan
      let macros = { protein: 0, carbs: 0, fat: 0 };
      if (mealPlan?.plan_data) {
        const planData = mealPlan.plan_data as any;
        if (planData.days) {
          const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
          const todayMeals = planData.days.find((day: any) => day.day === todayName);
          
          if (todayMeals?.meals) {
            // Estimate macros from calories (rough estimation)
            const calories = mealPlan.daily_calories || 0;
            macros = {
              protein: Math.round(calories * 0.3 / 4), // 30% from protein (4 cal/g)
              carbs: Math.round(calories * 0.4 / 4),   // 40% from carbs (4 cal/g)  
              fat: Math.round(calories * 0.3 / 9)      // 30% from fat (9 cal/g)
            };
          }
        }
      }

      setStats({
        dailyCalories: mealPlan?.daily_calories || 0,
        targetCalories: mealPlan?.daily_calories || 2000,
        workoutStreak,
        waterGlasses: progressData?.water_glasses || 0,
        macros
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logWater = async (glasses: number) => {
    if (!user) return false;

    const today = new Date().toISOString().split('T')[0];

    try {
      // Get existing water count
      const { data: existingData } = await supabase
        .from('user_progress')
        .select('water_glasses')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      const currentGlasses = existingData?.water_glasses || 0;
      const newTotal = currentGlasses + glasses;

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          date: today,
          water_glasses: newTotal,
        });

      if (error) throw error;

      // Update local state
      setStats(prev => ({
        ...prev,
        waterGlasses: newTotal
      }));

      toast({
        title: "Water logged successfully",
        description: `Added ${glasses} glass${glasses > 1 ? 'es' : ''}. Total: ${newTotal}/8`,
      });

      return true;
    } catch (error) {
      console.error('Error logging water:', error);
      toast({
        title: "Error logging water",
        description: "Unable to save your water intake",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  return {
    stats,
    isLoading,
    logWater,
    refetch: fetchDashboardStats,
  };
};
