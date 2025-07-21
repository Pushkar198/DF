import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, 
  Car, 
  Sprout, 
  TrendingUp,
  Activity,
  BarChart3,
  AlertTriangle,
  ArrowLeft,
  Download
} from "lucide-react";

import { useLocation } from "wouter";
import { AIForecastDisplay } from "@/components/dashboard/ai-forecast-display";

const sectorConfig = {
  healthcare: {
    name: "Healthcare",
    icon: Heart,
    color: "bg-red-500",
    categories: ["Medicine", "Vaccine", "Diagnostic", "Equipment"],
    subcategories: {
      medicine: ["Tablet", "Syrup", "Injection", "Topical"],
      vaccine: ["Injection", "Oral"],
      diagnostic: ["Kit", "Device"],
      equipment: ["Monitoring", "Treatment"]
    }
  },
  automobile: {
    name: "Automobile", 
    icon: Car,
    color: "bg-blue-500",
    categories: ["Vehicle", "Parts", "Service", "Infrastructure"],
    subcategories: {
      vehicle: ["2-wheeler", "4-wheeler", "Commercial"],
      parts: ["Engine", "Battery", "Tires"],
      service: ["Insurance", "Maintenance"],
      infrastructure: ["Charging", "Service Centers"]
    }
  },
  agriculture: {
    name: "Agriculture",
    icon: Sprout, 
    color: "bg-green-500",
    categories: ["Seeds", "Fertilizers", "Machinery", "Pesticides"],
    subcategories: {
      seeds: ["Cereal", "Cash Crop", "Oilseed"],
      fertilizers: ["Nitrogen", "Phosphorus", "Potassium", "Organic"],
      machinery: ["Power", "Harvesting", "Sowing", "Irrigation"],
      pesticides: ["Insecticide", "Fungicide", "Herbicide", "Organic"]
    }
  }
};

interface SectorDashboardProps {
  sector: string;
}

export default function SectorDashboard() {
  const [, params] = useRoute("/sectors/:sector");
  const [, setLocation] = useLocation();
  const [selectedRegion, setSelectedRegion] = useState("Mumbai");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastForecast, setLastForecast] = useState<any>(null);

  const sector = params?.sector || "healthcare";
  const config = sectorConfig[sector as keyof typeof sectorConfig];

  const generateAIForecast = async () => {
    if (!config) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/predictions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector,
          region: selectedRegion,
          timeframe: "30 days"
        })
      });

      if (response.ok) {
        const result = await response.json();
        setLastForecast(result.forecast);
        console.log('AI Forecast generated:', result);
      } else {
        console.error('Failed to generate forecast');
      }
    } catch (error) {
      console.error('Error generating forecast:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!lastForecast) return;

    // Create CSV content
    const csvHeader = 'Item Name,Category,Current Demand,Predicted Demand,Demand Change %,Confidence %,Peak Period,Reasoning\n';
    const csvRows = lastForecast.predictions.map((pred: any) => 
      `"${pred.itemName}","${pred.category}",${pred.currentDemand},${pred.predictedDemand},${pred.demandChange.toFixed(1)},${(pred.confidence * 100).toFixed(1)},"${pred.peakPeriod}","${pred.reasoning.replace(/"/g, '""')}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    
    // Add summary at the top
    const summary = `DemandCast AI - ${config.name} Sector Forecast Report\n` +
                   `Region: ${selectedRegion}\n` +
                   `Generated: ${new Date().toLocaleDateString()}\n` +
                   `Total Predictions: ${lastForecast.predictions.length}\n` +
                   `Forecast Confidence: ${(lastForecast.confidence * 100).toFixed(1)}%\n` +
                   `Timeframe: ${lastForecast.timeframe}\n\n`;

    const finalContent = summary + csvContent;

    const blob = new Blob([finalContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DemandCast-${sector}-${selectedRegion}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fetch sector-specific data
  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: [`/api/predictions`, sector, selectedRegion],
    queryFn: async () => {
      const response = await fetch(`/api/predictions?sector=${sector}&region=${selectedRegion}`);
      if (!response.ok) throw new Error('Failed to fetch predictions');
      return response.json();
    },
  });

  const { data: demandItems, isLoading: itemsLoading } = useQuery({
    queryKey: [`/api/demand-items`, sector],
    queryFn: async () => {
      const response = await fetch(`/api/demand-items?sector=${sector}`);
      if (!response.ok) throw new Error('Failed to fetch demand items');
      return response.json();
    },
  });

  const { data: alerts } = useQuery({
    queryKey: [`/api/alerts`, sector],
    queryFn: async () => {
      const response = await fetch(`/api/alerts?sector=${sector}`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
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
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setLocation("/sectors")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className={`${config.color} w-12 h-12 rounded-full flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{config.name} Demand Forecasting</h1>
            <p className="text-muted-foreground">
              AI-powered demand predictions for {config.name.toLowerCase()} sector
            </p>
            {lastForecast && (
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  🤖 AI Analysis: {lastForecast.dataSourcesUsed.join(', ')} data
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Confidence: {(lastForecast.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button 
            onClick={generateAIForecast}
            disabled={isGenerating}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating AI Forecast...
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate AI Forecast
              </>
            )}
          </Button>
          
          <Button 
            onClick={downloadReport}
            variant="outline"
            disabled={!lastForecast}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="Mumbai">Mumbai, Maharashtra</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Bangalore">Bangalore, Karnataka</SelectItem>
              <SelectItem value="Chennai">Chennai, Tamil Nadu</SelectItem>
              <SelectItem value="Kolkata">Kolkata, West Bengal</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad, Telangana</SelectItem>
              <SelectItem value="Pune">Pune, Maharashtra</SelectItem>
              <SelectItem value="Ahmedabad">Ahmedabad, Gujarat</SelectItem>
              <SelectItem value="Surat">Surat, Gujarat</SelectItem>
              <SelectItem value="Jaipur">Jaipur, Rajasthan</SelectItem>
              <SelectItem value="Lucknow">Lucknow, Uttar Pradesh</SelectItem>
              <SelectItem value="Kanpur">Kanpur, Uttar Pradesh</SelectItem>
              <SelectItem value="Nagpur">Nagpur, Maharashtra</SelectItem>
              <SelectItem value="Indore">Indore, Madhya Pradesh</SelectItem>
              <SelectItem value="Thane">Thane, Maharashtra</SelectItem>
              <SelectItem value="Bhopal">Bhopal, Madhya Pradesh</SelectItem>
              <SelectItem value="Visakhapatnam">Visakhapatnam, Andhra Pradesh</SelectItem>
              <SelectItem value="Pimpri-Chinchwad">Pimpri-Chinchwad, Maharashtra</SelectItem>
              <SelectItem value="Patna">Patna, Bihar</SelectItem>
              <SelectItem value="Vadodara">Vadodara, Gujarat</SelectItem>
              <SelectItem value="Ghaziabad">Ghaziabad, Uttar Pradesh</SelectItem>
              <SelectItem value="Ludhiana">Ludhiana, Punjab</SelectItem>
              <SelectItem value="Agra">Agra, Uttar Pradesh</SelectItem>
              <SelectItem value="Nashik">Nashik, Maharashtra</SelectItem>
              <SelectItem value="Faridabad">Faridabad, Haryana</SelectItem>
              <SelectItem value="Meerut">Meerut, Uttar Pradesh</SelectItem>
              <SelectItem value="Rajkot">Rajkot, Gujarat</SelectItem>
              <SelectItem value="Kalyan-Dombivali">Kalyan-Dombivali, Maharashtra</SelectItem>
              <SelectItem value="Vasai-Virar">Vasai-Virar, Maharashtra</SelectItem>
              <SelectItem value="Varanasi">Varanasi, Uttar Pradesh</SelectItem>
              <SelectItem value="Srinagar">Srinagar, Jammu and Kashmir</SelectItem>
              <SelectItem value="Aurangabad">Aurangabad, Maharashtra</SelectItem>
              <SelectItem value="Dhanbad">Dhanbad, Jharkhand</SelectItem>
              <SelectItem value="Amritsar">Amritsar, Punjab</SelectItem>
              <SelectItem value="Navi Mumbai">Navi Mumbai, Maharashtra</SelectItem>
              <SelectItem value="Allahabad">Allahabad, Uttar Pradesh</SelectItem>
              <SelectItem value="Ranchi">Ranchi, Jharkhand</SelectItem>
              <SelectItem value="Howrah">Howrah, West Bengal</SelectItem>
              <SelectItem value="Coimbatore">Coimbatore, Tamil Nadu</SelectItem>
              <SelectItem value="Jabalpur">Jabalpur, Madhya Pradesh</SelectItem>
              <SelectItem value="Gwalior">Gwalior, Madhya Pradesh</SelectItem>
              <SelectItem value="Vijayawada">Vijayawada, Andhra Pradesh</SelectItem>
              <SelectItem value="Jodhpur">Jodhpur, Rajasthan</SelectItem>
              <SelectItem value="Madurai">Madurai, Tamil Nadu</SelectItem>
              <SelectItem value="Raipur">Raipur, Chhattisgarh</SelectItem>
              <SelectItem value="Kota">Kota, Rajasthan</SelectItem>
              <SelectItem value="Guwahati">Guwahati, Assam</SelectItem>
              <SelectItem value="Chandigarh">Chandigarh</SelectItem>
              <SelectItem value="Solapur">Solapur, Maharashtra</SelectItem>
              <SelectItem value="Hubli-Dharwad">Hubli-Dharwad, Karnataka</SelectItem>
              <SelectItem value="Mysore">Mysore, Karnataka</SelectItem>
              <SelectItem value="Tiruchirappalli">Tiruchirappalli, Tamil Nadu</SelectItem>
              <SelectItem value="Bareilly">Bareilly, Uttar Pradesh</SelectItem>
              <SelectItem value="Aligarh">Aligarh, Uttar Pradesh</SelectItem>
              <SelectItem value="Tiruppur">Tiruppur, Tamil Nadu</SelectItem>
              <SelectItem value="Gurgaon">Gurgaon, Haryana</SelectItem>
              <SelectItem value="Moradabad">Moradabad, Uttar Pradesh</SelectItem>
              <SelectItem value="Jalandhar">Jalandhar, Punjab</SelectItem>
              <SelectItem value="Bhubaneswar">Bhubaneswar, Odisha</SelectItem>
              <SelectItem value="Salem">Salem, Tamil Nadu</SelectItem>
              <SelectItem value="Mira-Bhayandar">Mira-Bhayandar, Maharashtra</SelectItem>
              <SelectItem value="Warangal">Warangal, Telangana</SelectItem>
              <SelectItem value="Thiruvananthapuram">Thiruvananthapuram, Kerala</SelectItem>
              <SelectItem value="Guntur">Guntur, Andhra Pradesh</SelectItem>
              <SelectItem value="Bhiwandi">Bhiwandi, Maharashtra</SelectItem>
              <SelectItem value="Saharanpur">Saharanpur, Uttar Pradesh</SelectItem>
              <SelectItem value="Gorakhpur">Gorakhpur, Uttar Pradesh</SelectItem>
              <SelectItem value="Bikaner">Bikaner, Rajasthan</SelectItem>
              <SelectItem value="Amravati">Amravati, Maharashtra</SelectItem>
              <SelectItem value="Noida">Noida, Uttar Pradesh</SelectItem>
              <SelectItem value="Jamshedpur">Jamshedpur, Jharkhand</SelectItem>
              <SelectItem value="Bhilai">Bhilai, Chhattisgarh</SelectItem>
              <SelectItem value="Cuttack">Cuttack, Odisha</SelectItem>
              <SelectItem value="Firozabad">Firozabad, Uttar Pradesh</SelectItem>
              <SelectItem value="Kochi">Kochi, Kerala</SelectItem>
              <SelectItem value="Nellore">Nellore, Andhra Pradesh</SelectItem>
              <SelectItem value="Bhavnagar">Bhavnagar, Gujarat</SelectItem>
              <SelectItem value="Dehradun">Dehradun, Uttarakhand</SelectItem>
              <SelectItem value="Durgapur">Durgapur, West Bengal</SelectItem>
              <SelectItem value="Asansol">Asansol, West Bengal</SelectItem>
              <SelectItem value="Rourkela">Rourkela, Odisha</SelectItem>
              <SelectItem value="Nanded">Nanded, Maharashtra</SelectItem>
              <SelectItem value="Kolhapur">Kolhapur, Maharashtra</SelectItem>
              <SelectItem value="Ajmer">Ajmer, Rajasthan</SelectItem>
              <SelectItem value="Akola">Akola, Maharashtra</SelectItem>
              <SelectItem value="Gulbarga">Gulbarga, Karnataka</SelectItem>
              <SelectItem value="Jamnagar">Jamnagar, Gujarat</SelectItem>
              <SelectItem value="Ujjain">Ujjain, Madhya Pradesh</SelectItem>
              <SelectItem value="Loni">Loni, Uttar Pradesh</SelectItem>
              <SelectItem value="Siliguri">Siliguri, West Bengal</SelectItem>
              <SelectItem value="Jhansi">Jhansi, Uttar Pradesh</SelectItem>
              <SelectItem value="Ulhasnagar">Ulhasnagar, Maharashtra</SelectItem>
              <SelectItem value="Jammu">Jammu, Jammu and Kashmir</SelectItem>
              <SelectItem value="Sangli-Miraj">Sangli-Miraj, Maharashtra</SelectItem>
              <SelectItem value="Mangalore">Mangalore, Karnataka</SelectItem>
              <SelectItem value="Erode">Erode, Tamil Nadu</SelectItem>
              <SelectItem value="Belgaum">Belgaum, Karnataka</SelectItem>
              <SelectItem value="Ambattur">Ambattur, Tamil Nadu</SelectItem>
              <SelectItem value="Tirunelveli">Tirunelveli, Tamil Nadu</SelectItem>
              <SelectItem value="Malegaon">Malegaon, Maharashtra</SelectItem>
              <SelectItem value="Gaya">Gaya, Bihar</SelectItem>
              <SelectItem value="Jalgaon">Jalgaon, Maharashtra</SelectItem>
              <SelectItem value="Udaipur">Udaipur, Rajasthan</SelectItem>
              <SelectItem value="Maheshtala">Maheshtala, West Bengal</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {config.categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Forecasts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              For {selectedRegion}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alerts?.filter(a => a.severity === 'critical').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Tracked</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demandItems?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {config.name} products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {predictions?.length ? 
                Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length * 100) + '%' 
                : '0%'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Prediction accuracy
            </p>
          </CardContent>
        </Card>
      </div>



      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate New Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create AI-powered demand predictions using real-time data
            </p>
            <Button className="w-full">
              Generate Forecast
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Analyze trends and patterns in demand data
            </p>
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Download CSV report with AI forecast data
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={downloadReport}
              disabled={!lastForecast}
            >
              <Download className="w-4 h-4 mr-2" />
              {lastForecast ? 'Download CSV Report' : 'Generate AI Forecast First'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Forecast Display */}
      {lastForecast && (
        <div className="mt-6">
          <AIForecastDisplay forecast={lastForecast} />
        </div>
      )}
    </div>
  );
}