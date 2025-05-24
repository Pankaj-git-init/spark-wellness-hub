
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    weight: "",
    height: "",
    fitness_goal: "weight-loss",
    dietary_preference: "no-preference"
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.full_name || !formData.age)) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to continue",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 2 && (!formData.weight || !formData.height)) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to continue",
        variant: "destructive",
      });
      return;
    }
    
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to complete your profile",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          fitness_goal: formData.fitness_goal,
          dietary_preference: formData.dietary_preference,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        toast({
          title: "Profile Update Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile completed!",
          description: "Your personalized plan is ready",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Profile Update Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12C13.7909 12 12 10.2091 12 8C12 5.79086 13.7909 4 16 4Z" className="fill-primary" />
                <path d="M8 18C5.79086 18 4 16.2091 4 14C4 11.7909 5.79086 10 8 10C10.2091 10 12 11.7909 12 14C12 16.2091 10.2091 18 8 18Z" className="fill-primary" />
                <path d="M18 16C16.9391 16 15.9217 15.5786 15.1716 14.8284C14.4214 14.0783 14 13.0609 14 12L18 8C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10L22 12C22 13.0609 21.5786 14.0783 20.8284 14.8284C20.0783 15.5786 19.0609 16 18 16Z" className="fill-primary/70" />
                <path d="M6 8C7.0609 8 8.07828 8.42143 8.82843 9.17157C9.57857 9.92172 10 10.9391 10 12L6 16C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14L2 12C2 10.9391 2.42143 9.92172 3.17157 9.17157C3.92172 8.42143 4.96957 8 6 8Z" className="fill-primary/70" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">Help us create a personalized plan for you</p>
          
          <div className="flex justify-center items-center gap-2 mt-6">
            <div className={`h-2 w-2 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`}></div>
            <div className={`h-2 w-2 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            <div className={`h-2 w-2 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Let's start with your name and age</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="full_name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="Enter your name"
                      value={formData.full_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="age" className="text-sm font-medium">
                      Age
                    </label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </CardFooter>
              </>
            )}

            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Physical Information</CardTitle>
                  <CardDescription>Tell us about your current physical status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="weight" className="text-sm font-medium">
                      Weight (kg)
                    </label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.1"
                      placeholder="Enter your weight"
                      value={formData.weight}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="height" className="text-sm font-medium">
                      Height (cm)
                    </label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      step="0.1"
                      placeholder="Enter your height"
                      value={formData.height}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </CardFooter>
              </>
            )}

            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Goals & Preferences</CardTitle>
                  <CardDescription>Let us know what you want to achieve</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="fitness_goal" className="text-sm font-medium">
                      Fitness Goal
                    </label>
                    <Select
                      value={formData.fitness_goal}
                      onValueChange={(value) => handleSelectChange("fitness_goal", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight-loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle-gain">Build Muscle</SelectItem>
                        <SelectItem value="maintain">Maintain Weight</SelectItem>
                        <SelectItem value="endurance">Improve Endurance</SelectItem>
                        <SelectItem value="flexibility">Increase Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dietary_preference" className="text-sm font-medium">
                      Dietary Preference
                    </label>
                    <Select
                      value={formData.dietary_preference}
                      onValueChange={(value) => handleSelectChange("dietary_preference", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your dietary preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-preference">No Preference</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Profile..." : "Complete Setup"}
                  </Button>
                </CardFooter>
              </>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
