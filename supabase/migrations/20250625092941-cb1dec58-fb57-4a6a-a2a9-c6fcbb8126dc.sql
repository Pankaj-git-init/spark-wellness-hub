
-- Add meals_completed column to user_progress table
ALTER TABLE public.user_progress 
ADD COLUMN meals_completed TEXT[] DEFAULT '{}';
