import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain, BarChart3 } from "lucide-react";

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
    <div className="space-y-6">
      {/* Forecast Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Market Analysis
              </CardTitle>
              <CardDescription>
                {forecast.sector.charAt(0).toUpperCase() + forecast.sector.slice(1)} sector forecast for {forecast.region} - {forecast.timeframe}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              Overall Confidence: {(forecast.confidence * 100).toFixed(0)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold mb-2">Data Sources Used</h4>
              <div className="flex flex-wrap gap-1">
                {forecast.dataSourcesUsed.map((source, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {source === 'api' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {source === 'gemini' && <Brain className="w-3 h-3 mr-1" />}
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Analysis Confidence</h4>
              <Progress value={forecast.confidence * 100} className="w-full" />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <strong>Market Analysis:</strong> {forecast.marketAnalysis}
          </div>
        </CardContent>
      </Card>

      {/* Demand Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forecast.predictions.map((prediction, index) => {
          const trend = getDemandTrend(prediction.demandChangePercentage);
          const TrendIcon = trend.icon;
          
          return (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{prediction.itemName}</CardTitle>
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {prediction.department}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {prediction.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    {prediction.subcategory}
                  </Badge>
                </div>
                {/* Show composition for healthcare sector */}
                {prediction.composition && forecast.sector === 'healthcare' && (
                  <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                    <strong>Composition:</strong> {prediction.composition}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                  <span className={`text-sm font-medium ${trend.color}`}>
                    {prediction.demandChangePercentage > 0 ? '+' : ''}{prediction.demandChangePercentage.toFixed(1)}% ({prediction.demandTrend})
                  </span>
                  <span className="text-xs text-muted-foreground">vs current</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Confidence:</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getConfidenceColor(prediction.confidence)}`} />
                    <span className="text-sm font-medium">{(prediction.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Demand:</span>
                    <span className="font-medium">
                      {prediction.currentDemand.toLocaleString()} {prediction.demandUnit || 'units'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Predicted Demand:</span>
                    <span className="font-medium">
                      {prediction.predictedDemand.toLocaleString()} {prediction.demandUnit || 'units'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Peak Period:</span>
                    <span className="font-medium">{prediction.peakPeriod}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <h4 className="text-xs font-semibold text-blue-800 mb-2">🤖 AI Reasoning & Comprehensive Analysis</h4>
                    <p className="text-xs text-gray-700 leading-relaxed mb-2">
                      <strong>Primary Analysis:</strong> {prediction.reasoning}
                    </p>
                    
                    {/* Additional justifications if available */}
                    {prediction.marketFactors && prediction.marketFactors.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <p className="text-xs font-medium text-blue-700 mb-1">Supporting Market Evidence:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {prediction.marketFactors.slice(0, 3).map((factor, i) => {
                            const cleanFactor = factor.split(' → ')[0] || factor;
                            return (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>{cleanFactor}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    
                    {/* Risk assessment */}
                    {prediction.riskLevel && (
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <p className="text-xs">
                          <span className="font-medium text-blue-700">Risk Assessment:</span>
                          <span className={`ml-1 font-semibold ${
                            prediction.riskLevel === 'High' ? 'text-red-600' : 
                            prediction.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {prediction.riskLevel} Risk Level
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Show detailed sources if available */}
                  {prediction.detailedSources && prediction.detailedSources.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-medium">Data Sources:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {prediction.detailedSources.map((source, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-green-50">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Market Factor Analysis - Human Readable */}
                  {prediction.marketFactorData && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium">Market Factor Analysis</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        {Object.entries(prediction.marketFactorData).map(([factor, value]) => {
                          const factorLabel = factor.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                          const getFactorDescription = (val: number) => {
                            if (val >= 85) return { desc: 'Excellent', color: 'text-green-700', bg: 'bg-green-50' };
                            if (val >= 70) return { desc: 'Good', color: 'text-green-600', bg: 'bg-green-50' };
                            if (val >= 55) return { desc: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50' };
                            if (val >= 40) return { desc: 'Below Average', color: 'text-orange-600', bg: 'bg-orange-50' };
                            return { desc: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
                          };
                          
                          const factorInfo = getFactorDescription(value);
                          
                          return (
                            <div key={factor} className={`p-2 rounded-lg ${factorInfo.bg} border-l-4 border-l-gray-300`}>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">{factorLabel}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`font-semibold ${factorInfo.color}`}>{factorInfo.desc}</span>
                                  <span className="text-xs text-gray-500">({value}%)</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {prediction.marketFactors.length > 0 && (
                    <div className="mb-3">
                      <span className="text-xs font-medium">Market Factors:</span>
                      <div className="mt-2 space-y-2">
                        {prediction.marketFactors.map((factor, i) => {
                          // Parse Factor → Reason → Source → Link format
                          const parts = factor.split(' → ');
                          if (parts.length >= 3) {
                            const [factorName, reason, source, link] = parts;
                            return (
                              <div key={i} className="p-2 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                                <div className="text-xs space-y-1">
                                  <div className="font-semibold text-blue-800">{factorName}</div>
                                  <div className="text-gray-700">{reason}</div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="font-medium text-green-700">Source:</span>
                                    <span className="text-green-600">{source}</span>
                                    {link && (
                                      <a 
                                        href={link.startsWith('http') ? link : `https://${link}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                      >
                                        View Source
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            // Fallback for factors not in the new format
                            return (
                              <Badge key={i} variant="outline" className="text-xs">
                                {factor}
                              </Badge>
                            );
                          }
                        })}
                      </div>
                    </div>
                  )}
                  
                  {prediction.recommendations.length > 0 && (
                    <div>
                      <span className="text-xs font-medium">Recommendations:</span>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        {prediction.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-orange-500 mt-0.5">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Risk Factors and Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forecast.riskFactors.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Risk Factors:</strong>
              <ul className="mt-1 space-y-1">
                {forecast.riskFactors.map((risk, index) => (
                  <li key={index} className="text-sm">• {risk}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {forecast.opportunities.length > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Opportunities:</strong>
              <ul className="mt-1 space-y-1">
                {forecast.opportunities.map((opp, index) => (
                  <li key={index} className="text-sm">• {opp}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}