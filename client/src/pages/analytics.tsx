import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Calendar,
  Download,
  Filter,
  Globe,
  AlertTriangle,
  Users,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedRegion, setSelectedRegion] = useState("global");

  // Fetch real-time data from API
  const { data: predictions } = useQuery({
    queryKey: ['/api/predictions'],
    queryFn: async () => {
      const response = await fetch('/api/predictions');
      if (!response.ok) throw new Error('Failed to fetch predictions');
      return response.json();
    }
  });

  const { data: alerts } = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: async () => {
      const response = await fetch('/api/alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json();
    }
  });

  // Mock data for charts
  const predictionTrends = [
    { month: 'Jan', predictions: 45, accuracy: 87 },
    { month: 'Feb', predictions: 52, accuracy: 89 },
    { month: 'Mar', predictions: 38, accuracy: 92 },
    { month: 'Apr', predictions: 61, accuracy: 85 },
    { month: 'May', predictions: 73, accuracy: 91 },
    { month: 'Jun', predictions: 68, accuracy: 88 }
  ];

  const diseaseDistribution = [
    { name: 'Influenza', value: 35, color: '#8884d8' },
    { name: 'Norovirus', value: 25, color: '#82ca9d' },
    { name: 'RSV', value: 20, color: '#ffc658' },
    { name: 'COVID-19', value: 15, color: '#ff7300' },
    { name: 'Other', value: 5, color: '#8dd1e1' }
  ];

  const regionalData = [
    { region: 'North America', predictions: 234, alerts: 12, accuracy: 89 },
    { region: 'Europe', predictions: 189, alerts: 8, accuracy: 92 },
    { region: 'Asia', predictions: 298, alerts: 15, accuracy: 87 },
    { region: 'South America', predictions: 145, alerts: 6, accuracy: 85 },
    { region: 'Africa', predictions: 178, alerts: 9, accuracy: 88 },
    { region: 'Oceania', predictions: 67, alerts: 3, accuracy: 91 }
  ];

  const riskLevelData = [
    { timeframe: '30 Days', critical: 8, high: 23, medium: 45, low: 67 },
    { timeframe: '90 Days', critical: 15, high: 38, medium: 72, low: 89 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">DemandCast AI</h1>
                    <p className="text-xs text-orange-500">Analytics Dashboard</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/admin">
                <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100">
                  Admin Portal
                </span>
              </Link>
              <a href="#trends" className="text-orange-500 font-medium px-3 py-2 rounded-md bg-orange-50">
                Analytics
              </a>
              <Link href="/dashboard">
                <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100">
                  Public Dashboard
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Analytics & Insights</h2>
              <p className="mt-1 text-sm text-gray-500">
                Comprehensive analysis of prediction patterns, accuracy, and global health trends
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Predictions</p>
                  <p className="text-2xl font-bold text-gray-900">{predictions?.length || 0}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Activity className="w-3 h-3 mr-1" />
                    AI-generated forecasts
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {predictions?.length ? 
                      Math.round(predictions.reduce((sum: number, p: any) => sum + (p.confidence || 0), 0) / predictions.length * 100) : 0}%
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    AI confidence score
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {alerts?.filter((a: any) => a.severity === 'critical').length || 0}
                  </p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    High priority items
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sectors</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Globe className="w-3 h-3 mr-1" />
                    Multi-sector coverage
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Prediction Trends</TabsTrigger>
            <TabsTrigger value="distribution">Disease Distribution</TabsTrigger>
            <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Volume Trends</CardTitle>
                  <CardDescription>Number of predictions generated over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predictionTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="predictions" stroke="#f97316" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accuracy Trends</CardTitle>
                  <CardDescription>Prediction accuracy percentage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={predictionTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[80, 95]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="accuracy" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Disease Type Distribution</CardTitle>
                  <CardDescription>Breakdown of predicted diseases by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={diseaseDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {diseaseDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Seasonal Patterns</CardTitle>
                  <CardDescription>Disease occurrence patterns by season</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { season: "Winter", diseases: ["Influenza", "Norovirus", "RSV"], count: 156 },
                      { season: "Spring", diseases: ["Allergies", "Respiratory"], count: 89 },
                      { season: "Summer", diseases: ["Food-borne", "Vector-borne"], count: 67 },
                      { season: "Fall", diseases: ["Influenza", "Respiratory"], count: 134 }
                    ].map((season, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{season.season}</h4>
                          <p className="text-sm text-gray-500">{season.diseases.join(", ")}</p>
                        </div>
                        <Badge variant="secondary">{season.count} predictions</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance Analysis</CardTitle>
                <CardDescription>Prediction activity and accuracy by geographic region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="predictions" fill="#f97316" />
                      <Bar dataKey="alerts" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regionalData.map((region, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{region.region}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Predictions:</span>
                            <span className="font-medium">{region.predictions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Alerts:</span>
                            <span className="font-medium">{region.alerts}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Accuracy:</span>
                            <span className="font-medium text-green-600">{region.accuracy}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Level Distribution</CardTitle>
                  <CardDescription>Breakdown of predictions by risk level and timeframe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={riskLevelData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timeframe" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="critical" stackId="a" fill="#ef4444" />
                        <Bar dataKey="high" stackId="a" fill="#f97316" />
                        <Bar dataKey="medium" stackId="a" fill="#eab308" />
                        <Bar dataKey="low" stackId="a" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment Summary</CardTitle>
                  <CardDescription>Current risk status across all monitored regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">23</p>
                        <p className="text-sm text-red-700">Critical Risk</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">61</p>
                        <p className="text-sm text-orange-700">High Risk</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">117</p>
                        <p className="text-sm text-yellow-700">Medium Risk</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">156</p>
                        <p className="text-sm text-green-700">Low Risk</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Top Risk Factors</h4>
                      <div className="space-y-2">
                        {[
                          { factor: "High humidity conditions", impact: "87%" },
                          { factor: "Social media health concerns", impact: "73%" },
                          { factor: "Seasonal pattern alignment", impact: "65%" },
                          { factor: "Population density", impact: "58%" }
                        ].map((factor, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{factor.factor}</span>
                            <Badge variant="secondary">{factor.impact}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}