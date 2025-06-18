
-- Add columns to track free plan generations
ALTER TABLE public.subscriptions 
ADD COLUMN free_meal_plan_used BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN free_workout_plan_used BOOLEAN NOT NULL DEFAULT FALSE;
