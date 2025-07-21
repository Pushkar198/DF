import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain } from "lucide-react";

interface AIForecastDisplayProps {
  forecast: {
    sector: string;
    region: string;
    timeframe: string;
    predictions: Array<{
      itemName: string;
      category: string;
      currentDemand: number;
      predictedDemand: number;
      demandChange: number;
      confidence: number;
      peakPeriod: string;
      reasoning: string;
      marketFactors: string[];
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
          const trend = getDemandTrend(prediction.demandChange);
          const TrendIcon = trend.icon;
          
          return (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{prediction.itemName}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {prediction.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                  <span className={`text-sm font-medium ${trend.color}`}>
                    {prediction.demandChange > 0 ? '+' : ''}{prediction.demandChange.toFixed(1)}%
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
                    <span className="font-medium">{prediction.currentDemand}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Predicted Demand:</span>
                    <span className="font-medium">{prediction.predictedDemand}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Peak Period:</span>
                    <span className="font-medium">{prediction.peakPeriod}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    <strong>AI Reasoning:</strong> {prediction.reasoning}
                  </p>
                  
                  {prediction.marketFactors.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-medium">Market Factors:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {prediction.marketFactors.map((factor, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
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