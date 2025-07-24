import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Database, 
  Globe, 
  TrendingUp, 
  Zap, 
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";

interface LoadingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'pending' | 'active' | 'completed';
  duration?: number;
}

interface ForecastLoaderProps {
  sector: string;
  region: string;
  currentStep: string;
  progress: number;
}

export function ForecastLoader({ sector, region, currentStep, progress }: ForecastLoaderProps) {
  const steps: LoadingStep[] = [
    {
      id: 'data-collection',
      title: 'Collecting Real-Time Data',
      description: `Gathering market trends, environmental factors, and ${sector} specific data from multiple sources`,
      icon: Database,
      status: currentStep === 'data-collection' ? 'active' : 
             progress > 20 ? 'completed' : 'pending'
    },
    {
      id: 'source-integration',
      title: 'Integrating Data Sources',
      description: `Processing weather data, news feeds, economic indicators, and ${sector} market analysis for ${region}`,
      icon: Globe,
      status: currentStep === 'source-integration' ? 'active' : 
             progress > 40 ? 'completed' : 'pending'
    },
    {
      id: 'ai-analysis',
      title: 'AI Pattern Analysis',
      description: `Analyzing demand patterns, seasonal trends, and market dynamics using Gemini 2.0 Flash`,
      icon: Brain,
      status: currentStep === 'ai-analysis' ? 'active' : 
             progress > 60 ? 'completed' : 'pending'
    },
    {
      id: 'prediction-generation',
      title: 'Generating Predictions',
      description: `Creating sector-specific demand forecasts with confidence scores and recommendations`,
      icon: TrendingUp,
      status: currentStep === 'prediction-generation' ? 'active' : 
             progress > 80 ? 'completed' : 'pending'
    },
    {
      id: 'report-compilation',
      title: 'Compiling Results',
      description: `Finalizing forecasts, risk analysis, and actionable insights for ${sector} sector`,
      icon: BarChart3,
      status: currentStep === 'report-compilation' ? 'active' : 
             progress > 95 ? 'completed' : 'pending'
    }
  ];

  const getStepIcon = (step: LoadingStep) => {
    if (step.status === 'completed') return CheckCircle;
    if (step.status === 'active') return Zap;
    return Clock;
  };

  const getStepColor = (step: LoadingStep) => {
    if (step.status === 'completed') return 'text-green-500';
    if (step.status === 'active') return 'text-blue-500';
    return 'text-gray-400';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Brain className="w-6 h-6 text-blue-500 animate-pulse" />
              <h3 className="text-lg font-semibold">AI Demand Forecasting</h3>
            </div>
            <p className="text-sm text-gray-600">
              Generating {sector} predictions for {region}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Loading Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const StepIcon = getStepIcon(step);
              const stepColor = getStepColor(step);
              
              return (
                <div key={step.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 ${stepColor}`}>
                    <StepIcon className={`w-5 h-5 ${step.status === 'active' ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${stepColor}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </div>
                  </div>
                  {step.status === 'active' && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Action */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {steps.find(s => s.status === 'active')?.title || 'Processing...'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}