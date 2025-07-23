import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Car,
  Sprout,
  TrendingUp,
  Activity,
  BarChart3,
  AlertTriangle,
  ArrowLeft,
  Download,
  MapPin,
  Calendar,
  Target,
} from "lucide-react";

import { useLocation } from "wouter";
import { AIForecastDisplay } from "@/components/dashboard/ai-forecast-display";
import { LocationPicker } from "@/components/ui/location-picker";

const sectorConfig = {
  healthcare: {
    name: "Healthcare",
    icon: Heart,
    color: "bg-red-500",
    departments: [
      "Emergency Department",
      "Respiratory Department",
      "Cardiac Department",
      "Neurology Department",
      "Orthopedic Department",
      "Pediatric Department",
      "General Medicine",
      "Surgery Department",
      "Intensive Care Unit",
    ],
    categories: [
      "Medicines",
      "Test Kits",
      "Diagnostic Kits",
      "Medical Equipment",
      "Surgical Supplies",
      "Patient Care Items",
    ],
  },
  automobile: {
    name: "Automobile",
    icon: Car,
    color: "bg-blue-500",
    departments: [
      "Sales Department",
      "Service Department",
      "Parts Department",
      "Manufacturing Department",
      "Quality Control",
      "Research & Development",
    ],
    categories: [
      "Vehicles",
      "Spare Parts",
      "Accessories",
      "Service Equipment",
      "Safety Equipment",
    ],
  },
  agriculture: {
    name: "Agriculture",
    icon: Sprout,
    color: "bg-green-500",
    departments: [
      "Crop Production",
      "Animal Husbandry",
      "Farm Management",
      "Irrigation Department",
      "Pest Control",
      "Soil Management",
    ],
    categories: [
      "Seeds",
      "Fertilizers",
      "Pesticides",
      "Farm Equipment",
      "Irrigation Equipment",
    ],
  },
  retail: {
    name: "Retail",
    icon: BarChart3,
    color: "bg-purple-500",
    departments: [
      "Fashion & Apparel",
      "Electronics & Tech",
      "Home & Garden",
      "Food & Beverages",
      "Sports & Fitness",
      "Beauty & Personal Care",
    ],
    categories: [
      "Consumer Goods",
      "Electronics",
      "Clothing",
      "Food Products",
      "Home Appliances",
    ],
  },
  energy: {
    name: "Energy",
    icon: Activity,
    color: "bg-yellow-500",
    departments: [
      "Renewable Energy",
      "Traditional Power",
      "Energy Storage",
      "Grid Management",
      "Energy Efficiency",
      "Oil & Gas",
    ],
    categories: [
      "Solar Equipment",
      "Wind Equipment",
      "Energy Storage",
      "Grid Infrastructure",
      "Fuel Products",
    ],
  },
};

// Location data is now handled by the LocationPicker component

interface SectorDashboardProps {
  sector: string;
}

export default function SectorDashboard() {
  const [, params] = useRoute("/sectors/:sector");
  const [, setLocation] = useLocation();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("30 days");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastForecast, setLastForecast] = useState<any>(null);

  const sector = params?.sector || "healthcare";
  const config = sectorConfig[sector as keyof typeof sectorConfig];

  const generateAIForecast = async () => {
    if (!config || !selectedRegion) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/predictions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sector,
          region: selectedRegion,
          department:
            selectedDepartment === "all" ? undefined : selectedDepartment,
          category: selectedCategory === "all" ? undefined : selectedCategory,
          timeframe: selectedTimeframe,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setLastForecast(result.forecast);
        console.log("AI Forecast generated:", result);
      } else {
        console.error("Failed to generate forecast");
      }
    } catch (error) {
      console.error("Error generating forecast:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!lastForecast) return;

    const csvHeader =
      "Item Name,Category,Current Demand,Predicted Demand,Demand Change %,Confidence %,Peak Period,Reasoning\n";
    const csvRows = lastForecast.predictions
      .map(
        (pred: any) =>
          `"${pred.itemName}","${pred.category}",${pred.currentDemand},${pred.predictedDemand},${pred.demandChangePercentage?.toFixed(1) || 0},${(pred.confidence * 100).toFixed(1)},"${pred.peakPeriod}","${pred.reasoning?.replace(/"/g, '""') || ""}"`,
      )
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const summary = `DemandCast AI - ${config.name} Sector Forecast Report\nRegion: ${selectedRegion}\nGenerated: ${new Date().toLocaleDateString()}\nTotal Predictions: ${lastForecast.predictions.length}\nForecast Confidence: ${(lastForecast.confidence * 100).toFixed(1)}%\nTimeframe: ${lastForecast.timeframe}\n\n`;
    const finalContent = summary + csvContent;

    const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DemandCast-${sector}-${selectedRegion}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fetch sector-specific data
  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: [`/api/predictions`, sector, selectedRegion],
    queryFn: async () => {
      if (!selectedRegion) return [];
      const response = await fetch(
        `/api/predictions?sector=${sector}&region=${selectedRegion}`,
      );
      if (!response.ok) throw new Error("Failed to fetch predictions");
      return response.json();
    },
  });

  const { data: demandItems, isLoading: itemsLoading } = useQuery({
    queryKey: [`/api/demand-items`, sector],
    queryFn: async () => {
      const response = await fetch(`/api/demand-items?sector=${sector}`);
      if (!response.ok) throw new Error("Failed to fetch demand items");
      return response.json();
    },
  });

  const { data: alerts } = useQuery({
    queryKey: [`/api/alerts`, sector],
    queryFn: async () => {
      const response = await fetch(`/api/alerts?sector=${sector}`);
      if (!response.ok) throw new Error("Failed to fetch alerts");
      return response.json();
    },
  });

  const Icon = config?.icon || Heart;

  if (!config) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sector not found</h1>
          <Button onClick={() => setLocation("/sectors")}>
            Back to Sectors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Professional Header Section */}
      <div className="professional-header py-12 mb-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/sectors")}
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="sector-icon-container w-16 h-16 rounded-2xl flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {config.name} Intelligence
                </h1>
                <p className="text-white/80 text-lg">
                  Advanced AI-powered demand forecasting & market analytics
                </p>
                {lastForecast && (
                  <div className="flex gap-3 mt-3">
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30"
                    >
                      ✓ Latest forecast: {lastForecast.timeframe}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-white/10 text-white border-white/30"
                    >
                      {lastForecast.predictions.length} predictions
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastForecast && (
                <Button
                  onClick={downloadReport}
                  variant="secondary"
                  className="gap-2 bg-white text-orange-600 border-white hover:bg-orange-50 hover:text-orange-700 font-semibold shadow-lg"
                >
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Enhanced Filter Section */}
        <Card className="filter-section mb-8 p-6 rounded-xl">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="w-80">
                  <LocationPicker
                    value={selectedRegion}
                    onChange={setSelectedRegion}
                    placeholder="Search for any location worldwide..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="all">All Departments</SelectItem>
                    {config.departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="all">All Categories</SelectItem>
                  {config.categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedTimeframe}
                  onValueChange={setSelectedTimeframe}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15 days">15 days</SelectItem>
                    <SelectItem value="30 days">30 days</SelectItem>
                    <SelectItem value="60 days">60 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={generateAIForecast}
              disabled={isGenerating || !selectedRegion}
              size="lg"
              className="btn-pwc gap-2 shadow-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Generating AI Forecast...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Generate AI Forecast
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Enhanced Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="metric-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {itemsLoading ? "..." : demandItems?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Available in {selectedRegion || "selected location"}
              </p>
            </CardContent>
          </Card>

          <Card className="metric-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Predictions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {predictionsLoading ? "..." : predictions?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Historical forecasts
              </p>
            </CardContent>
          </Card>

          <Card className="metric-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {alerts?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Forecast Display */}
        {lastForecast && (
          <div className="mb-8">
            <AIForecastDisplay forecast={lastForecast} />
          </div>
        )}

        {/* Enhanced Alerts Section */}
        {alerts && alerts.length > 0 && (
          <Card className="sector-card-gradient rounded-xl">
            
          </Card>
        )}
      </div>
    </div>
  );
}
