
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Check, Zap } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface PurchaseRegenerationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PurchaseRegenerationsModal = ({ isOpen, onClose }: PurchaseRegenerationsModalProps) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const { purchaseRegenerations } = useSubscription();

  const handlePurchase = async () => {
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(async () => {
      const success = await purchaseRegenerations();
      if (success) {
        setStep('success');
      } else {
        setStep('details');
      }
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    setStep('details');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Purchase More Regenerations
              </DialogTitle>
              <DialogDescription>
                Get 3 more plan regenerations to continue customizing your fitness journey
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">3 Additional Regenerations</span>
                      <p className="text-sm text-muted-foreground">
                        Regenerate your meal and workout plans 3 more times
                      </p>
                    </div>
                    <span className="font-bold text-lg">₹799</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <h4 className="font-medium">What you get:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 3 more meal plan regenerations</li>
                  <li>• 3 more workout plan regenerations</li>
                  <li>• Instant activation</li>
                  <li>• No expiration date</li>
                </ul>
              </div>
              
              <Button onClick={handlePurchase} className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Purchase for ₹799
              </Button>
            </div>
          </>
        )}
        
        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-muted-foreground">Please wait while we process your purchase...</p>
          </div>
        )}
        
        {step === 'success' && (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-green-600">Purchase Successful!</h3>
            <p className="text-muted-foreground mb-4">
              You now have 3 additional regenerations available.
            </p>
            <Button onClick={handleClose} className="w-full">
              Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
