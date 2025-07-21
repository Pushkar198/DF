import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Car, 
  Sprout, 
  TrendingUp,
  Activity,
  BarChart3
} from "lucide-react";


const sectors = [
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Medicine demand forecasting with disease outbreak predictions",
    icon: Heart,
    color: "bg-red-500",
    features: ["Medicine Demand", "Disease Predictions", "Age Group Analysis", "Dosage Forms"]
  },
  {
    id: "automobile",
    name: "Automobile",
    description: "Vehicle demand forecasting based on market trends and policies",
    icon: Car,
    color: "bg-blue-500",
    features: ["Vehicle Demand", "Fuel Type Analysis", "Regional Trends", "Policy Impact"]
  },
  {
    id: "agriculture",
    name: "Agriculture",
    description: "Agricultural input forecasting based on crop cycles and weather",
    icon: Sprout,
    color: "bg-green-500",
    features: ["Crop Demand", "Seasonal Patterns", "Weather Impact", "Market Prices"]
  },
  {
    id: "retail",
    name: "Retail",
    description: "Consumer goods demand forecasting with shopping trends analysis",
    icon: BarChart3,
    color: "bg-purple-500",
    features: ["Consumer Trends", "Seasonal Shopping", "Price Elasticity", "Brand Analysis"]
  },
  {
    id: "energy",
    name: "Energy",
    description: "Energy demand forecasting with renewable and traditional sources",
    icon: Activity,
    color: "bg-yellow-500",
    features: ["Power Demand", "Renewable Growth", "Grid Management", "Fuel Prices"]
  }
];

export function SectorNavigation() {
  const [location, setLocation] = useLocation();

  const handleSectorSelect = (sectorId: string) => {
    setLocation(`/sectors/${sectorId}`);
  };

  // Get real metrics from API
  const { data: allPredictions } = useQuery({
    queryKey: ['/api/predictions'],
    queryFn: async () => {
      const response = await fetch('/api/predictions');
      if (!response.ok) throw new Error('Failed to fetch predictions');
      return response.json();
    }
  });

  const { data: allAlerts } = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: async () => {
      const response = await fetch('/api/alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json();
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          Demand Forecaster
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          AI-Powered Multi-Sector Demand Forecasting Platform
        </p>
        <p className="text-muted-foreground">
          Select a sector to view comprehensive demand forecasts and market insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {sectors.map((sector) => {
          const Icon = sector.icon;
          return (
            <Card 
              key={sector.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => handleSectorSelect(sector.id)}
            >
              <CardHeader className="text-center">
                <div className={`${sector.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{sector.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  {sector.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {sector.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full">
                  View {sector.name} Forecasts
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Forecasts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allPredictions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              AI-generated predictions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allAlerts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {allAlerts?.filter((a: any) => a.severity === 'critical').length || 0} critical alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Sectors</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Healthcare, Auto, Agriculture
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}