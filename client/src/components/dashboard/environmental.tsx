import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Thermometer, Droplets, Wind, Users, Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EnvironmentalData } from "@shared/schema";

interface EnvironmentalFactorsProps {
  data?: EnvironmentalData;
  selectedRegion: string;
}

export function EnvironmentalFactors({ data, selectedRegion }: EnvironmentalFactorsProps) {
  const { data: predictions } = useQuery({
    queryKey: ["/api/predictions", selectedRegion],
  });

  if (!data) {
    return (
      <div className="space-y-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Environmental Factors</CardTitle>
            <p className="text-sm text-gray-500">Current conditions affecting predictions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const factors = [
    {
      icon: Thermometer,
      label: "Temperature",
      value: `${data.temperature}°F`,
      color: "text-orange-500",
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${data.humidity}%`,
      color: "text-blue-500",
    },
    {
      icon: Wind,
      label: "Air Quality",
      value: data.airQuality || "Unknown",
      color: "text-gray-500",
    },
    {
      icon: Users,
      label: "Population Density",
      value: data.populationDensity || "Unknown",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Environmental Factors</CardTitle>
          <p className="text-sm text-gray-500">Current conditions affecting predictions</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <factor.icon className={`w-4 h-4 ${factor.color}`} />
                  <span className="text-sm font-medium text-gray-900">{factor.label}</span>
                </div>
                <span className="text-sm text-gray-600">{factor.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <p className="text-sm text-gray-500">Powered by Google Gemini</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-500 bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-700">
                {predictions?.length > 0 
                  ? `Based on current environmental conditions and historical patterns, there's an increased risk of respiratory infections. Consider preventive measures for vulnerable populations.`
                  : 'No current predictions available. Environmental conditions are being monitored.'
                }
              </p>
              <p className="text-xs text-gray-500 mt-2">Updated 2 hours ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
