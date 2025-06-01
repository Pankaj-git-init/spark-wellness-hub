
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star } from "lucide-react";
import { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { PaymentModal } from "@/components/PaymentModal";

const UpgradePro = () => {
  const [showPayment, setShowPayment] = useState(false);
  const { isPro, isLoading } = useSubscription();
  const navigate = useNavigate();

  const basicFeatures = [
    "Generate AI meal plans (once per month)",
    "Generate AI workout plans (once per month)",
    "Basic progress tracking",
    "Access to recipes",
    "Standard support"
  ];

  const proFeatures = [
    "Unlimited AI meal plan regeneration",
    "Unlimited AI workout plan regeneration",
    "Advanced progress analytics",
    "Premium recipes collection",
    "Custom nutrition targets",
    "Priority support",
    "Export plans to PDF",
    "Personalized coaching tips"
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (isPro) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-16">
            <Crown className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">You're Already Pro!</h1>
            <p className="text-muted-foreground mb-6">
              You have access to all premium features.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Upgrade to Pro</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Unlock unlimited AI-powered fitness and nutrition plans
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <Card className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Basic</CardTitle>
                <Badge variant="secondary">Current Plan</Badge>
              </div>
              <CardDescription className="text-3xl font-bold">Free</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {basicFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                <Star className="h-4 w-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  Pro
                </CardTitle>
              </div>
              <CardDescription className="text-3xl font-bold">
                $9.99<span className="text-base font-normal text-muted-foreground">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {proFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                size="lg" 
                className="w-full mt-6"
                onClick={() => setShowPayment(true)}
              >
                <Crown className="h-4 w-4 mr-2" />
                Become Pro Member
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          <p>
            * Cancel anytime. No commitments. Your subscription will automatically renew monthly unless cancelled.
          </p>
        </div>
      </div>

      <PaymentModal 
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
      />
    </DashboardLayout>
  );
};

export default UpgradePro;
