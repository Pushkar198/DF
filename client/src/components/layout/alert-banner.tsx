import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

export function AlertBanner() {
  const [dismissed, setDismissed] = useState(false);

  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 10000,
  });

  const criticalAlerts = alerts?.filter(alert => alert.severity === 'critical') || [];
  const latestCriticalAlert = criticalAlerts[0];

  if (dismissed || !latestCriticalAlert) {
    return null;
  }

  return (
    <Alert className="bg-red-500 text-white border-red-600 rounded-none">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-medium">High Risk Alert:</span>
          <span>{latestCriticalAlert.description}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDismissed(true)}
          className="text-white hover:bg-red-600 h-auto p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
