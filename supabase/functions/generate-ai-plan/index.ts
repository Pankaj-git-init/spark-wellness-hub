
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { planType, userId } = await req.json();

    console.log('Generating plan for user:', userId, 'Plan type:', planType);

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Profile data:', profile);

    // Generate prompts based on plan type
    let prompt = '';
    if (planType === 'meal') {
      prompt = `Create a detailed 7-day meal plan for a person with the following characteristics:
- Age: ${profile.age} years
- Weight: ${profile.weight} kg
- Height: ${profile.height} cm
- Fitness Goal: ${profile.fitness_goal}
- Dietary Preference: ${profile.dietary_preference}

Please provide:
1. A structured 7-day meal plan with breakfast, lunch, dinner, and 2 snacks each day
2. Include calorie estimates for each meal
3. Consider the dietary preferences and fitness goals
4. Make it practical and easy to follow
5. Include variety throughout the week

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Format the response as JSON with this structure:
{
  "title": "Personalized 7-Day Meal Plan",
  "overview": "Brief overview of the plan",
  "dailyCalories": estimated daily calories,
  "days": [
    {
      "day": "Monday",
      "meals": {
        "breakfast": {"name": "meal name", "calories": 000, "description": "brief description"},
        "lunch": {"name": "meal name", "calories": 000, "description": "brief description"},
        "dinner": {"name": "meal name", "calories": 000, "description": "brief description"},
        "snack1": {"name": "snack name", "calories": 000, "description": "brief description"},
        "snack2": {"name": "snack name", "calories": 000, "description": "brief description"}
      }
    }
  ]
}`;
    } else if (planType === 'workout') {
      prompt = `Create a detailed 7-day workout plan for a person with the following characteristics:
- Age: ${profile.age} years
- Weight: ${profile.weight} kg
- Height: ${profile.height} cm
- Fitness Goal: ${profile.fitness_goal}

Please provide:
1. A structured 7-day workout plan appropriate for their fitness goal
2. Include different types of exercises (cardio, strength, flexibility)
3. Specify sets, reps, and duration for each exercise
4. Consider rest days
5. Make it progressive and achievable

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Format the response as JSON with this structure:
{
  "title": "Personalized 7-Day Workout Plan",
  "overview": "Brief overview of the plan",
  "weeklyGoal": "Weekly fitness objective",
  "days": [
    {
      "day": "Monday",
      "focus": "workout focus (e.g., Upper Body, Cardio, Rest)",
      "duration": "estimated duration in minutes",
      "exercises": [
        {
          "name": "exercise name",
          "type": "cardio/strength/flexibility",
          "sets": 3,
          "reps": "10-12",
          "duration": "30 seconds",
          "rest": "60 seconds",
          "description": "brief description or form tips"
        }
      ]
    }
  ]
}`;
    }

    console.log('Calling Gemini API...');

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', await geminiResponse.text());
      throw new Error('Failed to generate plan with Gemini AI');
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response received');

    const generatedText = geminiData.candidates[0].content.parts[0].text;
    
    // Clean and parse the JSON response
    let planData;
    try {
      // Remove any markdown code block formatting and extra text
      let cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
      
      // Find the JSON start and end
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        cleanedText = cleanedText.substring(jsonStart, jsonEnd);
      }
      
      console.log('Cleaned text for parsing:', cleanedText);
      planData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Generated text:', generatedText);
      throw new Error('Failed to parse generated plan');
    }

    console.log('Plan generated successfully');

    return new Response(
      JSON.stringify({ plan: planData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-ai-plan function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
