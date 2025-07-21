import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Worm, Rat, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Prediction, Disease } from "@shared/schema";

interface PredictionDashboardProps {
  predictions?: Prediction[];
  selectedRegion: string;
}

export function PredictionDashboard({ predictions, selectedRegion }: PredictionDashboardProps) {
  const { data: diseases } = useQuery({
    queryKey: ["/api/diseases"],
  });

  const getDiseaseIcon = (diseaseId: number) => {
    const disease = diseases?.find((d: Disease) => d.id === diseaseId);
    const diseaseName = disease?.name.toLowerCase() || '';
    
    if (diseaseName.includes('influenza') || diseaseName.includes('flu')) {
      return <Worm className="w-5 h-5 text-red-500" />;
    } else if (diseaseName.includes('virus') || diseaseName.includes('rsv')) {
      return <Rat className="w-5 h-5 text-yellow-500" />;
    } else {
      return <Shield className="w-5 h-5 text-green-500" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-red-400';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDiseaseName = (diseaseId: number) => {
    const disease = diseases?.find((d: Disease) => d.id === diseaseId);
    return disease?.name || 'Unknown Disease';
  };

  if (!predictions) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Current Predictions</CardTitle>
          <p className="text-sm text-gray-500">AI-generated disease outbreak forecasts</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Current Predictions</CardTitle>
        <p className="text-sm text-gray-500">AI-generated disease outbreak forecasts</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {predictions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No predictions available for {selectedRegion}</p>
              <p className="text-sm text-gray-400 mt-2">Click refresh to generate new predictions</p>
            </div>
          ) : (
            predictions.map((prediction) => (
              <div key={prediction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-opacity-10 rounded-full flex items-center justify-center">
                    {getDiseaseIcon(prediction.diseaseId)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{getDiseaseName(prediction.diseaseId)}</h4>
                    <p className="text-sm text-gray-500">{prediction.region}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${getRiskColor(prediction.riskLevel)} rounded-full`}></div>
                    <Badge variant={prediction.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                      {Math.round(prediction.confidence * 100)}% Confidence
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{prediction.timeframe}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
