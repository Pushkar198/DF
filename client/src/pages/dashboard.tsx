import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { DashboardHeader } from "@/components/dashboard/header";
import { ComprehensivePredictions } from "@/components/dashboard/comprehensive-predictions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";


export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState("Mumbai");
  const [comprehensivePredictions, setComprehensivePredictions] = useState<any>(null);
  const queryClient = useQueryClient();

  const generatePredictionsMutation = useMutation({
    mutationFn: async (region: string) => {
      const res = await apiRequest("POST", "/api/predictions/generate", { region });
      return res.json();
    },
    onSuccess: (data) => {
      setComprehensivePredictions(data);
    },
    onError: (error) => {
      console.error("Error generating predictions:", error);
    },
  });

  const handleGeneratePredictions = () => {
    generatePredictionsMutation.mutate(selectedRegion);
  };

  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    setComprehensivePredictions(null); // Clear predictions when region changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader 
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
        />
        
        <ComprehensivePredictions 
          predictions={comprehensivePredictions?.predictions || []}
          region={selectedRegion}
          dataSourcesUsed={comprehensivePredictions?.dataSourcesUsed || []}
          timestamp={comprehensivePredictions?.timestamp || new Date().toISOString()}
          onRefresh={handleGeneratePredictions}
          isLoading={generatePredictionsMutation.isPending}
        />
      </main>
    </div>
  );
}
