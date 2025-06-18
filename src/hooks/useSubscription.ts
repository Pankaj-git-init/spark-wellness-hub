
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type SubscriptionType = 'basic' | 'pro';

export interface Subscription {
  id: string;
  user_id: string;
  subscription_type: SubscriptionType;
  regenerations_used: number;
  regenerations_limit: number;
  last_reset_date: string;
  free_meal_plan_used: boolean;
  free_workout_plan_used: boolean;
  created_at: string;
  updated_at: string;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Loading subscription for user:', user.id);
        
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading subscription:', error);
          throw error;
        }

        if (!data) {
          // Create a basic subscription if none exists
          console.log('No subscription found, creating basic subscription');
          const { data: newSubscription, error: createError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: user.id,
              subscription_type: 'basic'
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating subscription:', createError);
            throw createError;
          }

          setSubscription(newSubscription);
        } else {
          console.log('Loaded subscription:', data);
          setSubscription(data);
        }
      } catch (error) {
        console.error('Failed to load subscription:', error);
        toast({
          title: "Error",
          description: "Failed to load subscription status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [user, toast]);

  const upgradeToPro = async () => {
    if (!user || !subscription) {
      return false;
    }

    try {
      console.log('Upgrading subscription to pro for user:', user.id);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          subscription_type: 'pro',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error upgrading subscription:', error);
        throw error;
      }

      console.log('Subscription upgraded successfully:', data);
      setSubscription(data);
      return true;
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
      toast({
        title: "Upgrade Failed",
        description: "Failed to upgrade subscription. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const markFreePlanUsed = async (planType: 'meal' | 'workout') => {
    if (!user || !subscription) {
      return false;
    }

    try {
      console.log(`Marking free ${planType} plan as used for user:`, user.id);
      
      const updateField = planType === 'meal' ? 'free_meal_plan_used' : 'free_workout_plan_used';
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          [updateField]: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error(`Error marking free ${planType} plan as used:`, error);
        throw error;
      }

      console.log(`Free ${planType} plan marked as used successfully:`, data);
      setSubscription(data);
      return true;
    } catch (error) {
      console.error(`Failed to mark free ${planType} plan as used:`, error);
      return false;
    }
  };

  const useRegeneration = async () => {
    if (!user || !subscription || !isPro) {
      return false;
    }

    if (subscription.regenerations_used >= subscription.regenerations_limit) {
      toast({
        title: "Regeneration Limit Reached",
        description: `You have used all ${subscription.regenerations_limit} regenerations. Purchase more to continue.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('Using regeneration for user:', user.id);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          regenerations_used: subscription.regenerations_used + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error using regeneration:', error);
        throw error;
      }

      console.log('Regeneration used successfully:', data);
      setSubscription(data);
      return true;
    } catch (error) {
      console.error('Failed to use regeneration:', error);
      toast({
        title: "Error",
        description: "Failed to use regeneration. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const purchaseRegenerations = async () => {
    if (!user || !subscription) {
      return false;
    }

    try {
      console.log('Purchasing regenerations for user:', user.id);
      
      // Add 3 more regenerations to the limit
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          regenerations_limit: subscription.regenerations_limit + 3,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error purchasing regenerations:', error);
        throw error;
      }

      // Record the purchase
      const { error: purchaseError } = await supabase
        .from('regeneration_purchases')
        .insert({
          user_id: user.id,
          regenerations_added: 3,
          amount_paid: 9.99
        });

      if (purchaseError) {
        console.error('Error recording purchase:', purchaseError);
        // Don't throw here as the main update succeeded
      }

      console.log('Regenerations purchased successfully:', data);
      setSubscription(data);
      toast({
        title: "Purchase Successful!",
        description: "You have successfully purchased 3 more regenerations.",
      });
      return true;
    } catch (error) {
      console.error('Failed to purchase regenerations:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase regenerations. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const isPro = subscription?.subscription_type === 'pro';
  const isBasic = subscription?.subscription_type === 'basic';
  const canRegenerate = isPro && subscription && subscription.regenerations_used < subscription.regenerations_limit;
  const regenerationsRemaining = subscription ? subscription.regenerations_limit - subscription.regenerations_used : 0;
  const canUseFreeGeneration = (planType: 'meal' | 'workout') => {
    if (!subscription) return false;
    if (planType === 'meal') return !subscription.free_meal_plan_used;
    if (planType === 'workout') return !subscription.free_workout_plan_used;
    return false;
  };

  return {
    subscription,
    isLoading,
    isPro,
    isBasic,
    canRegenerate,
    regenerationsRemaining,
    canUseFreeGeneration,
    upgradeToPro,
    useRegeneration,
    purchaseRegenerations,
    markFreePlanUsed,
  };
};
