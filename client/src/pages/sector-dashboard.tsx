import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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
import { ForecastModal } from "@/components/ui/forecast-modal";

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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentLoadingStep, setCurrentLoadingStep] = useState("");

  const sector = params?.sector || "healthcare";
  const config = sectorConfig[sector as keyof typeof sectorConfig];

  const generateAIForecast = async () => {
    if (!config || !selectedRegion) return;

    setIsGenerating(true);
    setLoadingProgress(0);
    setCurrentLoadingStep("data-collection");

    try {
      // Simulate progress steps
      const progressSteps = [
        { step: "data-collection", progress: 20, delay: 800 },
        { step: "source-integration", progress: 40, delay: 1000 },
        { step: "ai-analysis", progress: 60, delay: 1200 },
        { step: "prediction-generation", progress: 80, delay: 1000 },
        { step: "report-compilation", progress: 95, delay: 500 },
      ];

      // Start the API call
      const forecastPromise = fetch("/api/predictions/generate", {
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

      // Simulate loading progress
      for (const { step, progress, delay } of progressSteps) {
        setCurrentLoadingStep(step);
        setLoadingProgress(progress);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Wait for API response
      const response = await forecastPromise;
      setLoadingProgress(100);

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
      setLoadingProgress(0);
      setCurrentLoadingStep("");
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
      {/* Professional Header Section - Exact Match */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/sectors")}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className={`w-16 h-16 rounded-2xl ${config.color} flex items-center justify-center`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">
                  {config.name}
                </h1>
                <Badge className="bg-green-500 text-white border-0 px-3 py-1 text-xs font-semibold">
                  Live
                </Badge>
              </div>
              <p className="text-white/80 text-lg mb-3">
                AI-Powered Demand Intelligence & Market Analytics
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Real-time Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-sm">Gemini AI Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Forecast Configuration Card - Exact Match */}
        <Card className="bg-white shadow-lg border-0 rounded-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Forecast Configuration
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Configure your AI-powered demand forecasting parameters
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
                <LocationPicker
                  value={selectedRegion}
                  onChange={setSelectedRegion}
                  placeholder="Search any location worldwide..."
                />
                <p className="text-xs text-gray-500">
                  Global location search with real-time data
                </p>
              </div>

              {/* Department Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Department
                </div>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
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
                <p className="text-xs text-gray-500">
                  {config.departments.length} departments available
                </p>
              </div>

              {/* Category Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <BarChart3 className="h-4 w-4" />
                  Category
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
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
                <p className="text-xs text-gray-500">
                  {config.categories.length} categories tracked
                </p>
              </div>

              {/* Forecast Period Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Forecast Period
                </div>
                <Select
                  value={selectedTimeframe}
                  onValueChange={setSelectedTimeframe}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="30 Days Forecast" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15 days">15 Days Forecast</SelectItem>
                    <SelectItem value="30 days">30 Days Forecast</SelectItem>
                    <SelectItem value="60 days">60 Days Forecast</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Short to long-term predictions
                </p>
              </div>
            </div>

            {/* AI Engine Status - Exact Match */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">AI Engine Ready</span>
              </div>
              <Button
                onClick={generateAIForecast}
                disabled={isGenerating || !selectedRegion}
                size="lg"
                className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating AI Forecast...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Generate AI Forecast
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards - Exact Match */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Total Items</p>
                  <div className="text-2xl font-bold text-gray-900">
                    {itemsLoading ? "..." : demandItems?.length || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Available inventory items
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">AI Predictions</p>
                  <div className="text-2xl font-bold text-gray-900">
                    {predictionsLoading ? "..." : predictions?.length || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Historical forecasts
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">System Alerts</p>
                  <div className="text-2xl font-bold text-red-600">
                    {alerts?.length || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Requires attention
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Button Section */}
        {lastForecast && (
          <div className="flex justify-end mb-8">
            <Button
              onClick={downloadReport}
              variant="outline"
              size="lg"
              className="bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-semibold px-6 py-3 rounded-xl shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        )}

        {/* AI Forecast Modal */}
        <ForecastModal 
          open={isGenerating}
          sector={config.name}
          region={selectedRegion}
          currentStep={currentLoadingStep}
          progress={loadingProgress}
        />

        {/* AI Forecast Display */}
        {!isGenerating && lastForecast && (
          <div className="mb-8">
            <AIForecastDisplay forecast={lastForecast} />
          </div>
        )}

        {/* Alerts Section */}
        {alerts && alerts.length > 0 && (
          <Card className="bg-white shadow-lg border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert: any) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                    <div>
                      <p className="font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                    <Badge 
                      className={`${
                        alert.severity === 'critical' ? 'bg-red-500' : 
                        alert.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                      } text-white`}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
