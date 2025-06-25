
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProgressData {
  id: string;
  date: string;
  weight?: number;
  workouts_completed: string[];
  water_glasses?: number;
}

export const useProgress = () => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setProgressData(data || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast({
        title: "Error fetching progress",
        description: "Unable to load your progress data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logWeight = async (weight: number, date?: string) => {
    if (!user) return;

    const targetDate = date || new Date().toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          date: targetDate,
          weight: weight,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setProgressData(prev => {
        const filtered = prev.filter(p => p.date !== targetDate);
        return [data, ...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });

      toast({
        title: "Weight logged successfully",
        description: `Weight of ${weight}kg recorded for ${targetDate}`,
      });

      return true;
    } catch (error) {
      console.error('Error logging weight:', error);
      toast({
        title: "Error logging weight",
        description: "Unable to save your weight data",
        variant: "destructive",
      });
      return false;
    }
  };

  const logWorkout = async (workoutName: string, completed: boolean, date?: string) => {
    if (!user) return;

    const targetDate = date || new Date().toISOString().split('T')[0];

    try {
      // First, try to get existing data for the date
      const { data: existingData, error: fetchError } = await supabase
        .from('user_progress')
        .select('workouts_completed')
        .eq('user_id', user.id)
        .eq('date', targetDate)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching existing data:', fetchError);
        throw fetchError;
      }

      const currentWorkouts = existingData?.workouts_completed || [];
      
      let updatedWorkouts;
      if (completed) {
        // Add workout if not already present
        updatedWorkouts = currentWorkouts.includes(workoutName) 
          ? currentWorkouts 
          : [...currentWorkouts, workoutName];
      } else {
        // Remove workout
        updatedWorkouts = currentWorkouts.filter((w: string) => w !== workoutName);
      }

      // Use upsert to insert or update the record
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          date: targetDate,
          workouts_completed: updatedWorkouts,
        }, {
          onConflict: 'user_id,date'
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting workout data:', error);
        throw error;
      }

      // Update local state
      setProgressData(prev => {
        const filtered = prev.filter(p => p.date !== targetDate);
        return [data, ...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });

      toast({
        title: completed ? "Workout completed" : "Workout unchecked",
        description: `${workoutName} ${completed ? 'marked as completed' : 'unmarked'}`,
      });

      return true;
    } catch (error) {
      console.error('Error logging workout:', error);
      toast({
        title: "Error updating workout",
        description: "Unable to save your workout progress",
        variant: "destructive",
      });
      return false;
    }
  };

  const logWater = async (glasses: number, date?: string) => {
    if (!user) return;

    const targetDate = date || new Date().toISOString().split('T')[0];

    try {
      // Get existing data for the date
      const { data: existingData } = await supabase
        .from('user_progress')
        .select('water_glasses')
        .eq('user_id', user.id)
        .eq('date', targetDate)
        .maybeSingle();

      const currentGlasses = existingData?.water_glasses || 0;
      const newTotal = currentGlasses + glasses;

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          date: targetDate,
          water_glasses: newTotal,
        }, {
          onConflict: 'user_id,date'
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setProgressData(prev => {
        const filtered = prev.filter(p => p.date !== targetDate);
        return [data, ...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });

      toast({
        title: "Water logged successfully",
        description: `${glasses} glasses added. Total: ${newTotal} glasses today`,
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

  const getTodaysProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    return progressData.find(p => p.date === today);
  };

  const getWeightData = () => {
    return progressData
      .filter(p => p.weight)
      .map(p => ({
        date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: p.weight,
        target: 70.0, // This could be made dynamic based on user profile
      }))
      .reverse()
      .slice(-8); // Last 8 entries
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  return {
    progressData,
    isLoading,
    logWeight,
    logWorkout,
    logWater,
    getTodaysProgress,
    getWeightData,
    refetch: fetchProgress,
  };
};
