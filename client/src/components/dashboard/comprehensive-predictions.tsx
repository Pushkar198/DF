import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Shield, 
  Pill, 
  Database,
  Activity
} from "lucide-react";

interface ComprehensivePrediction {
  disease: string;
  confidence: number;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
  preventiveMeasures: string[];
  recommendedMedicines: {
    name: string;
    dosage: string;
    usage: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  dataSourcesUsed: string[];
}

interface ComprehensivePredictionsProps {
  predictions: ComprehensivePrediction[];
  region: string;
  dataSourcesUsed: string[];
  timestamp: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function ComprehensivePredictions({ 
  predictions, 
  region, 
  dataSourcesUsed, 
  timestamp, 
  onRefresh, 
  isLoading 
}: ComprehensivePredictionsProps) {
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!predictions || predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Disease Predictions - {region}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              No predictions available. Generate new predictions to see comprehensive analysis.
            </div>
            {onRefresh && (
              <Button 
                onClick={onRefresh} 
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing with Gemini AI...
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Generate AI Predictions
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Comprehensive AI Disease Predictions - {region}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Analysis completed at {new Date(timestamp).toLocaleString()}
          </p>
        </div>
        {onRefresh && (
          <Button onClick={onRefresh} disabled={isLoading} size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        )}
      </div>

      {/* Data Sources Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Database className="h-4 w-4" />
            Data Sources Used
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {dataSourcesUsed.map((source, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {source}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {predictions.map((prediction, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{prediction.disease}</CardTitle>
                <Badge className={getRiskLevelColor(prediction.riskLevel)}>
                  {prediction.riskLevel.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className={getConfidenceColor(prediction.confidence)}>
                    {prediction.confidence}% confidence
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{prediction.timeframe}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="analysis" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="prevention">Prevention</TabsTrigger>
                  <TabsTrigger value="medicines">Medicines</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">AI Analysis</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {prediction.reasoning}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Data Sources</h4>
                    <div className="flex flex-wrap gap-1">
                      {prediction.dataSourcesUsed.map((source, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="prevention" className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <Shield className="h-4 w-4 text-green-600" />
                      Preventive Measures
                    </h4>
                    <div className="space-y-2">
                      {prediction.preventiveMeasures.map((measure, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{measure}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="medicines" className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <Pill className="h-4 w-4 text-blue-600" />
                      Recommended Medicines
                    </h4>
                    <div className="space-y-3">
                      {prediction.recommendedMedicines.map((medicine, idx) => (
                        <div key={idx} className="border rounded-lg p-3 bg-blue-50">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{medicine.name}</h5>
                            <Badge className={getPriorityColor(medicine.priority)}>
                              {medicine.priority}
                            </Badge>
                          </div>
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="font-medium">Dosage:</span> {medicine.dosage}
                            </div>
                            <div>
                              <span className="font-medium">Usage:</span> {medicine.usage}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>AI Analysis Summary:</strong> {predictions.length} disease predictions generated 
          using {dataSourcesUsed.length} real-time data sources. 
          {predictions.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length > 0 && (
            <span className="text-orange-600 font-medium">
              {" "}High-risk predictions detected - immediate attention recommended.
            </span>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}