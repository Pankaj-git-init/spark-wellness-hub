
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type SubscriptionType = 'basic' | 'pro';

export interface Subscription {
  id: string;
  user_id: string;
  subscription_type: SubscriptionType;
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

  const isPro = subscription?.subscription_type === 'pro';
  const isBasic = subscription?.subscription_type === 'basic';

  return {
    subscription,
    isLoading,
    isPro,
    isBasic,
    upgradeToPro,
  };
};
