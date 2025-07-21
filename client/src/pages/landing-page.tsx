import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  Globe, 
  Brain, 
  Activity,
  Users,
  BarChart3,
  AlertTriangle,
  ChevronRight,
  Play
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DemandCast AI</h1>
                <p className="text-xs text-gray-500">Multi-Sector Demand Forecasting</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
              <Link href="/dashboard">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Launch Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-orange-100 text-orange-800">
              Powered by Google Gemini AI
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered Demand Forecasting
              <span className="block text-orange-500">Across All Sectors</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our AI-powered platform analyzes real-time data, market trends, and environmental patterns 
              to forecast demand across Healthcare, Automobile, and Agriculture sectors with precision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/sectors">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8 py-3">
                  <Play className="w-5 h-5 mr-2" />
                  Start Forecasting
                </Button>
              </Link>
              <Link href="/analytics">
                <Button size="lg" variant="outline" className="px-8 py-3">
                  View Analytics
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Multi-Sector Demand Intelligence
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive analysis using multiple data sources for accurate demand forecasting
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Real-Time Forecasts</CardTitle>
                <CardDescription>
                  Short and long-term demand forecasts based on live market and environmental data
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Market Intelligence</CardTitle>
                <CardDescription>
                  Market trends, policy changes, and economic indicators analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Social Sentiment</CardTitle>
                <CardDescription>
                  Market-related news and social media sentiment analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Global Coverage</CardTitle>
                <CardDescription>
                  Location-based predictions for regions worldwide
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Early Warning System</CardTitle>
                <CardDescription>
                  Automated alerts and notifications for high-demand predictions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Comprehensive reporting and trend analysis for administrators
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Our AI Predictions Work
            </h2>
            <p className="text-xl text-gray-600">
              Multi-source data analysis for accurate demand forecasting across sectors
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
              <p className="text-gray-600">
                Gather market data, economic indicators, weather patterns, and social sentiment
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Google Gemini AI processes patterns and correlations in the data
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Prediction Generation</h3>
              <p className="text-gray-600">
                Generate 15, 30, and 90-day demand forecasts with confidence scores
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Alert & Action</h3>
              <p className="text-gray-600">
                Send alerts and provide actionable recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Forecast Market Demand?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join professionals across healthcare, automobile, and agriculture sectors
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Access Public Dashboard
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" variant="outline" className="px-8 py-3 text-white border-white hover:bg-white hover:text-orange-600">
                Administrator Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">DemandCast AI</span>
          </div>
          <p className="text-gray-400 mb-4">
            AI-powered demand forecasting platform powered by Google Gemini
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 DemandCast AI. Built for multi-sector demand intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}