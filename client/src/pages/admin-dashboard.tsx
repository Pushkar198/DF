import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Activity, 
  Database,
  Settings,
  TrendingUp,
  AlertTriangle,
  Globe,
  BarChart3,
  Shield,
  Calendar,
  Filter,
  Download
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function AdminDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const { data: systemMetrics } = useQuery({
    queryKey: ["/api/admin/metrics"],
    refetchInterval: 30000,
  });

  const { data: globalPredictions } = useQuery({
    queryKey: ["/api/admin/predictions", selectedTimeframe],
    refetchInterval: 30000,
  });

  const { data: systemAlerts } = useQuery({
    queryKey: ["/api/admin/alerts"],
    refetchInterval: 10000,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
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
                    <h1 className="text-xl font-bold text-gray-900">PredictMed AI</h1>
                    <p className="text-xs text-orange-500">Administrator Portal</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#overview" className="text-orange-500 font-medium px-3 py-2 rounded-md bg-orange-50">
                Overview
              </a>
              <Link href="/analytics">
                <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100">
                  Analytics
                </span>
              </Link>
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
              <h2 className="text-3xl font-bold text-gray-900">System Administration</h2>
              <p className="mt-1 text-sm text-gray-500">
                Monitor global disease predictions, system health, and platform analytics
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Predictions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemMetrics?.totalPredictions || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">↑ 12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Regions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemMetrics?.activeRegions || 24}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">↑ 3 new regions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Risk Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemMetrics?.highRiskAlerts || 8}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="text-xs text-red-600 mt-2">↑ 2 critical alerts</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">99.9%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="predictions">Global Predictions</TabsTrigger>
            <TabsTrigger value="alerts">System Alerts</TabsTrigger>
            <TabsTrigger value="data">Data Sources</TabsTrigger>
            <TabsTrigger value="users">User Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Global Disease Predictions</CardTitle>
                    <CardDescription>
                      AI-generated predictions across all monitored regions
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select 
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="30">Next 30 Days</option>
                      <option value="90">Next 90 Days</option>
                    </select>
                    <Button size="sm" variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock prediction data */}
                  {[
                    { region: "California, USA", disease: "Influenza A", risk: "high", confidence: 87 },
                    { region: "London, UK", disease: "Norovirus", risk: "medium", confidence: 73 },
                    { region: "Tokyo, Japan", disease: "RSV", risk: "low", confidence: 65 },
                    { region: "Mumbai, India", disease: "Dengue", risk: "critical", confidence: 92 },
                  ].map((prediction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          prediction.risk === 'critical' ? 'bg-red-500' :
                          prediction.risk === 'high' ? 'bg-orange-500' :
                          prediction.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{prediction.disease}</h4>
                          <p className="text-sm text-gray-500">{prediction.region}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={prediction.risk === 'critical' ? 'destructive' : 'secondary'}>
                          {prediction.confidence}% Confidence
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">Next {selectedTimeframe} days</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts & Notifications</CardTitle>
                <CardDescription>
                  Real-time system status and critical alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "critical", title: "High Risk Outbreak Detected", location: "Mumbai, India", time: "2 minutes ago" },
                    { type: "warning", title: "Data Source Anomaly", location: "Weather API - Europe", time: "15 minutes ago" },
                    { type: "info", title: "Prediction Model Updated", location: "Global", time: "1 hour ago" },
                    { type: "success", title: "Database Backup Completed", location: "System", time: "2 hours ago" },
                  ].map((alert, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === 'critical' ? 'bg-red-500' :
                        alert.type === 'warning' ? 'bg-yellow-500' :
                        alert.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <p className="text-sm text-gray-500">{alert.location}</p>
                      </div>
                      <span className="text-xs text-gray-400">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Source Status</CardTitle>
                <CardDescription>
                  Monitor the health and connectivity of all data sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Weather API", status: "active", lastUpdate: "2 min ago", records: "1.2M" },
                    { name: "Social Media Stream", status: "active", lastUpdate: "5 min ago", records: "890K" },
                    { name: "Health Records DB", status: "active", lastUpdate: "1 min ago", records: "2.4M" },
                    { name: "Environmental Sensors", status: "warning", lastUpdate: "15 min ago", records: "560K" },
                    { name: "News Feed API", status: "active", lastUpdate: "3 min ago", records: "125K" },
                    { name: "Historical Data", status: "active", lastUpdate: "1 hour ago", records: "5.8M" },
                  ].map((source, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{source.name}</h4>
                          <div className={`w-2 h-2 rounded-full ${
                            source.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                        </div>
                        <p className="text-sm text-gray-500">Last update: {source.lastUpdate}</p>
                        <p className="text-xs text-gray-400">{source.records} records</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Usage Analytics</CardTitle>
                <CardDescription>
                  Monitor user activity and platform engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">24,567</p>
                    <p className="text-sm text-gray-500">Total Page Views</p>
                    <p className="text-xs text-green-600">↑ 18% this week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">1,342</p>
                    <p className="text-sm text-gray-500">Active Users</p>
                    <p className="text-xs text-green-600">↑ 23% this week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">4.2</p>
                    <p className="text-sm text-gray-500">Avg. Session Time (min)</p>
                    <p className="text-xs text-blue-600">→ Stable</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Recent Activity</h4>
                  {[
                    { action: "Dashboard accessed", location: "California, USA", time: "Just now" },
                    { action: "Prediction generated", location: "London, UK", time: "2 min ago" },
                    { action: "Alert dismissed", location: "Tokyo, Japan", time: "5 min ago" },
                    { action: "Analytics viewed", location: "Sydney, Australia", time: "8 min ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.location}</p>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}