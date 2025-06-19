
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WeightLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (weight: number) => Promise<boolean>;
  currentWeight?: number;
}

export const WeightLogModal = ({ isOpen, onClose, onSubmit, currentWeight }: WeightLogModalProps) => {
  const [weight, setWeight] = useState(currentWeight?.toString() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    
    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 500) {
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit(weightNum);
    setIsSubmitting(false);
    
    if (success) {
      onClose();
    }
  };

  const handleClose = () => {
    setWeight(currentWeight?.toString() || "");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Today's Weight</DialogTitle>
          <DialogDescription>
            Enter your current weight in kilograms.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Weight
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="1"
                  max="500"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="pr-8"
                  placeholder="75.5"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  kg
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Weight"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
