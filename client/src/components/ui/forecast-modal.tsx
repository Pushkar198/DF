import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { ForecastLoader } from "./forecast-loader";

interface ForecastModalProps {
  open: boolean;
  sector: string;
  region: string;
  currentStep: string;
  progress: number;
}

export function ForecastModal({ 
  open, 
  sector, 
  region, 
  currentStep, 
  progress 
}: ForecastModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent 
        className="max-w-2xl bg-transparent border-0 shadow-none p-0 pointer-events-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <ForecastLoader 
          sector={sector}
          region={region}
          currentStep={currentStep}
          progress={progress}
        />
      </DialogContent>
    </Dialog>
  );
}