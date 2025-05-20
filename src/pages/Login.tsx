
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - replace with Supabase Auth
    setTimeout(() => {
      toast({
        title: "Login Successful",
        description: "Welcome back to FitAI!",
      });
      
      // For demo, we'll just navigate to dashboard
      navigate("/dashboard");
      setIsLoading(false);
    }, 1500);
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
          <h1 className="text-3xl font-bold">FitAI</h1>
          <p className="text-muted-foreground mt-2">Your AI-powered diet & workout companion</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your email to sign in to your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full mb-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-sm text-center mt-2">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
