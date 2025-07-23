import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain, BarChart3, Target, Activity, Zap, Globe, Beaker } from "lucide-react";

interface AIForecastDisplayProps {
  forecast: {
    sector: string;
    region: string;
    timeframe: string;
    predictions: Array<{
      itemName: string;
      composition?: string;
      department: string;
      category: string;
      subcategory: string;
      currentDemand: number;
      predictedDemand: number;
      demandUnit?: string;
      demandChangePercentage: number;
      demandTrend: string;
      confidence: number;
      peakPeriod: string;
      reasoning: string;
      detailedSources?: string[];
      marketFactors: string[];
      marketFactorData?: {
        environmentalImpact: number;
        diseasePrevalence: number;
        healthcareAccess: number;
        economicAffordability: number;
        policySupport: number;
        supplyChainStability: number;
        clinicalEvidence: number;
      };
      recommendations: string[];
    }>;
    confidence: number;
    dataSourcesUsed: string[];
    marketAnalysis: string;
    riskFactors: string[];
    opportunities: string[];
  };
}

export function AIForecastDisplay({ forecast }: AIForecastDisplayProps) {
  const getDemandTrend = (change: number) => {
    if (change > 10) return { color: "text-red-500", icon: TrendingUp, label: "High Increase" };
    if (change > 0) return { color: "text-yellow-500", icon: TrendingUp, label: "Increase" };
    if (change < -10) return { color: "text-red-500", icon: TrendingDown, label: "High Decrease" };
    return { color: "text-blue-500", icon: TrendingDown, label: "Decrease" };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500";
    if (confidence >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Forecast Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  AI Market Analysis
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {forecast.sector.charAt(0).toUpperCase() + forecast.sector.slice(1)} sector forecast for {forecast.region} • {forecast.timeframe}
                </CardDescription>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(forecast.confidence * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Overall Confidence
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Data Sources</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {forecast.dataSourcesUsed.map((source, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-1">
                    {source === 'api' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {source === 'gemini' && <Brain className="w-3 h-3 mr-1" />}
                    {source === 'real-time' && <Activity className="w-3 h-3 mr-1" />}
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                <h4 className="font-semibold text-gray-800">Predictions</h4>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {forecast.predictions.length}
              </div>
              <div className="text-sm text-gray-600">
                Items analyzed with AI insights
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-600" />
                <h4 className="font-semibold text-gray-800">Accuracy</h4>
              </div>
              <div className="space-y-2">
                <Progress value={forecast.confidence * 100} className="h-2" />
                <div className="text-xs text-gray-600">
                  Based on multiple data sources and AI analysis
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Market Analysis Summary</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {forecast.marketAnalysis}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Demand Predictions */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Demand Predictions</h2>
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            {forecast.predictions.length} Items Analyzed
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {forecast.predictions.map((prediction, index) => {
            const trend = getDemandTrend(prediction.demandChangePercentage);
            const TrendIcon = trend.icon;
            const isIncrease = prediction.demandChangePercentage > 0;
            
            return (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className={`absolute top-0 left-0 w-full h-1 ${isIncrease ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`} />
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                        {prediction.itemName}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                          {prediction.department}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-gray-300">
                          {prediction.category}
                        </Badge>
                        {prediction.subcategory && (
                          <Badge variant="secondary" className="text-xs">
                            {prediction.subcategory}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Composition Information */}
                      {prediction.composition && (
                        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Beaker className="w-4 h-4 text-cyan-600" />
                            <span className="text-sm font-semibold text-cyan-800">Active Composition</span>
                          </div>
                          <p className="text-sm text-cyan-700 font-medium bg-white px-3 py-2 rounded border-l-2 border-cyan-400">
                            {prediction.composition}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendIcon className="w-4 h-4" />
                        <span className="font-bold text-sm">
                          {prediction.demandChangePercentage > 0 ? '+' : ''}{prediction.demandChangePercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div 
                        className={`text-xs font-medium px-2 py-1 rounded-full mt-1 ${
                          prediction.confidence >= 0.8 ? 'bg-green-100 text-green-700' :
                          prediction.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        {(prediction.confidence * 100).toFixed(0)}% confidence
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Demand Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Current Demand</div>
                      <div className="text-lg font-bold text-gray-800">
                        {prediction.currentDemand}
                        {prediction.demandUnit && <span className="text-sm text-gray-500 ml-1">{prediction.demandUnit}</span>}
                      </div>
                    </div>
                    <div className={`rounded-lg p-3 ${isIncrease ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="text-xs text-gray-500 mb-1">Predicted Demand</div>
                      <div className={`text-lg font-bold ${isIncrease ? 'text-green-700' : 'text-red-700'}`}>
                        {prediction.predictedDemand}
                        {prediction.demandUnit && <span className="text-sm text-gray-500 ml-1">{prediction.demandUnit}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Peak Period */}
                  <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm font-medium text-blue-800">Peak Period</span>
                    </div>
                    <span className="text-sm text-blue-700 font-medium">{prediction.peakPeriod}</span>
                  </div>

                  {/* AI Reasoning */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-800">AI Analysis</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed bg-purple-50 p-3 rounded-lg border-l-2 border-purple-200">
                      {prediction.reasoning.length > 200 
                        ? `${prediction.reasoning.substring(0, 200)}...` 
                        : prediction.reasoning
                      }
                    </p>
                  </div>

                  {/* Market Factors */}
                  {prediction.marketFactors && prediction.marketFactors.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-semibold text-gray-800">Key Market Factors</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {prediction.marketFactors.slice(0, 3).map((factor, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {prediction.recommendations && prediction.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-800">Recommendations</span>
                      </div>
                      <div className="space-y-1">
                        {prediction.recommendations.slice(0, 2).map((rec, idx) => (
                          <div key={idx} className="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded border-l-2 border-green-200">
                            • {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Risk Factors & Opportunities */}
      {(forecast.riskFactors?.length > 0 || forecast.opportunities?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forecast.riskFactors && forecast.riskFactors.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {forecast.riskFactors.slice(0, 3).map((risk, index) => (
                    <div key={index} className="text-sm text-red-700 bg-white p-2 rounded border-l-2 border-red-300">
                      • {risk}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {forecast.opportunities && forecast.opportunities.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {forecast.opportunities.slice(0, 3).map((opportunity, index) => (
                    <div key={index} className="text-sm text-green-700 bg-white p-2 rounded border-l-2 border-green-300">
                      • {opportunity}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}