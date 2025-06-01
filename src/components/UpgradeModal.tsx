
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal = ({ isOpen, onClose }: UpgradeModalProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/upgrade-pro');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Lock className="h-5 w-5 text-yellow-500" />
            Pro Feature Required
          </DialogTitle>
          <DialogDescription className="text-center">
            You need to be a Pro subscriber to enjoy this feature
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center py-4">
          <Crown className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Unlimited Plan Regeneration</h3>
          <p className="text-muted-foreground mb-6">
            Pro members can regenerate their meal and workout plans as many times as they want.
          </p>
          
          <div className="space-y-3">
            <Button onClick={handleUpgrade} className="w-full" size="lg">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
