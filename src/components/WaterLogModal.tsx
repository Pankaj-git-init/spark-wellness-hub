
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface WaterLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogWater: (glasses: number) => Promise<boolean>;
  currentGlasses: number;
}

export const WaterLogModal = ({ isOpen, onClose, onLogWater, currentGlasses }: WaterLogModalProps) => {
  const [glasses, setGlasses] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (glasses <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number of glasses",
        variant: "destructive",
      });
      return;
    }

    const newTotal = currentGlasses + glasses;
    if (newTotal > 8) {
      toast({
        title: "Daily limit exceeded",
        description: "You can't log more than 8 glasses per day",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const success = await onLogWater(glasses);
    setIsLoading(false);
    
    if (success) {
      onClose();
      setGlasses(1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Water Intake</DialogTitle>
          <DialogDescription>
            How many glasses of water did you drink? (Current: {currentGlasses}/8 glasses)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="glasses">Number of glasses</Label>
            <Input
              id="glasses"
              type="number"
              min="1"
              max={8 - currentGlasses}
              value={glasses}
              onChange={(e) => setGlasses(parseInt(e.target.value) || 1)}
              placeholder="Enter glasses count"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging..." : "Log Water"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
