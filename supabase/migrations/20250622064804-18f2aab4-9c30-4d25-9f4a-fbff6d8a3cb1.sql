
-- Add water_glasses column to user_progress table
ALTER TABLE public.user_progress 
ADD COLUMN water_glasses integer DEFAULT 0;
