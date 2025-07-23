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
  BarChart3,
  ChevronRight,
  Users,
  AlertTriangle,
  Globe
} from "lucide-react";


const sectors = [
  {
    id: "healthcare",
    name: "Healthcare",
    description: "AI-powered medicine and medical equipment demand forecasting with disease outbreak predictions",
    icon: Heart,
    color: "bg-gradient-to-br from-red-500 to-red-600",
    hoverColor: "hover:from-red-600 hover:to-red-700",
    features: ["Medicine Demand", "Disease Predictions", "Age Group Analysis", "Dosage Forms"],
    stats: { predictions: 0, coverage: "200+ Cities", accuracy: "94%" },
    trending: "Respiratory medications trending +25%"
  },
  {
    id: "automobile",
    name: "Automobile", 
    description: "Vehicle and automotive parts demand forecasting based on market trends and policy changes",
    icon: Car,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    hoverColor: "hover:from-blue-600 hover:to-blue-700",
    features: ["Vehicle Demand", "Fuel Type Analysis", "Regional Trends", "Policy Impact"],
    stats: { predictions: 0, coverage: "150+ Markets", accuracy: "91%" },
    trending: "Electric vehicles surging +40%"
  },
  {
    id: "agriculture",
    name: "Agriculture",
    description: "Agricultural input and crop demand forecasting based on weather patterns and seasonal cycles",
    icon: Sprout,
    color: "bg-gradient-to-br from-green-500 to-green-600", 
    hoverColor: "hover:from-green-600 hover:to-green-700",
    features: ["Crop Demand", "Seasonal Patterns", "Weather Impact", "Market Prices"],
    stats: { predictions: 0, coverage: "100+ Regions", accuracy: "89%" },
    trending: "Fertilizer demand rising +18%"
  },
  {
    id: "retail",
    name: "Retail",
    description: "Consumer goods and retail demand forecasting with shopping behavior and seasonal trend analysis",
    icon: BarChart3,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    hoverColor: "hover:from-purple-600 hover:to-purple-700", 
    features: ["Consumer Trends", "Seasonal Shopping", "Price Elasticity", "Brand Analysis"],
    stats: { predictions: 0, coverage: "300+ Categories", accuracy: "92%" },
    trending: "E-commerce demand +35%"
  },
  {
    id: "energy",
    name: "Energy",
    description: "Power and energy demand forecasting covering renewable sources, grid management and fuel markets",
    icon: Activity,
    color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    hoverColor: "hover:from-yellow-600 hover:to-yellow-700",
    features: ["Power Demand", "Renewable Growth", "Grid Management", "Fuel Prices"],
    stats: { predictions: 0, coverage: "50+ Grids", accuracy: "96%" },
    trending: "Solar capacity +55%"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20 mb-12">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}>
          </div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mr-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold text-white">DemandCast AI</h1>
                <p className="text-orange-200 text-lg">Multi-Sector Intelligence Platform</p>
              </div>
            </div>
            
            <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Select your industry sector to access AI-powered demand forecasting, 
              market analytics, and real-time business intelligence
            </p>
            
            <div className="flex items-center justify-center gap-8 text-gray-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">5</div>
                <div className="text-sm">Industry Sectors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">200+</div>
                <div className="text-sm">Global Locations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">24/7</div>
                <div className="text-sm">Real-time Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-16">
        {/* Interactive Sector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {sectors.map((sector, index) => {
            const Icon = sector.icon;
            // Get sector-specific prediction count
            const sectorPredictions = allPredictions?.filter((p: any) => p.sector === sector.id) || [];
            const predictionCount = sectorPredictions.length;
            
            return (
              <Card 
                key={sector.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 transform border-0 shadow-xl overflow-hidden relative ${sector.hoverColor}`}
                onClick={() => handleSectorSelect(sector.id)}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="w-full h-full bg-repeat" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>
                
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${sector.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">{predictionCount}</div>
                      <div className="text-xs text-gray-500">Active Forecasts</div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {sector.name}
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {sector.description}
                  </p>
                </CardHeader>
                
                <CardContent className="relative z-10 pt-0">
                  {/* Key Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-sm text-gray-700">{sector.stats.coverage}</div>
                      <div className="text-xs text-gray-500">Coverage</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-sm text-gray-700">{sector.stats.accuracy}</div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-sm text-green-600">Live</div>
                      <div className="text-xs text-gray-500">Status</div>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {sector.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs bg-white/80 hover:bg-white transition-colors">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Trending Info */}
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-4 border-l-4 border-blue-400">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Trending:</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">{sector.trending}</p>
                  </div>
                  
                  <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg shadow-lg group-hover:shadow-xl transition-all">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Access {sector.name} Intelligence
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-orange-800">Active Forecasts</CardTitle>
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{allPredictions?.length || 0}</div>
              <p className="text-sm text-orange-600 mt-2">
                AI-generated predictions across all sectors
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-blue-800">System Alerts</CardTitle>
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{allAlerts?.length || 0}</div>
              <p className="text-sm text-blue-600 mt-2">
                {allAlerts?.filter((a: any) => a.severity === 'critical').length || 0} critical alerts
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-green-800">Global Coverage</CardTitle>
              <Globe className="h-6 w-6 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">5</div>
              <p className="text-sm text-green-600 mt-2">
                Industry sectors with worldwide coverage
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}