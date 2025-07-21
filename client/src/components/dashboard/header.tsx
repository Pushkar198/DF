import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Database, Activity, CheckCircle } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface DashboardHeaderProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export function DashboardHeader({ selectedRegion, onRegionChange }: DashboardHeaderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [lastPredictionTime, setLastPredictionTime] = useState<Date | null>(null);

  const { data: regions } = useQuery({
    queryKey: ["/api/regions"],
    queryFn: () => fetch("/api/regions").then(res => res.json()),
  });

  const generatePredictionsMutation = useMutation({
    mutationFn: async (region: string) => {
      const res = await apiRequest("POST", "/api/predictions/generate", { region });
      return res.json();
    },
    onSuccess: (data) => {
      setLastPredictionTime(new Date());
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "AI Analysis Complete",
        description: `Generated ${data.predictions?.length || 0} disease predictions for ${selectedRegion}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRefresh = () => {
    generatePredictionsMutation.mutate(selectedRegion);
  };

  // Group regions by country for better organization
  const groupedRegions = regions?.regions ? { India: regions.regions } : {};

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Disease Prediction Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">AI-powered insights for regional disease forecasting</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {/* Region Selector */}
          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {groupedRegions && Object.entries(groupedRegions).map(([country, regionList]: [string, any]) => (
                <div key={country}>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                    {country}
                  </div>
                  {regionList.map((region: string) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
          

        </div>
      </div>
    </div>
  );
}
