import { Card, CardContent } from "@/components/ui/card";
import { ChartLine, AlertTriangle, Shield, Pill } from "lucide-react";

interface KeyMetricsProps {
  metrics?: {
    activePredictions: number;
    highRiskAlerts: number;
    avgConfidence: number;
    medicinesRecommended: number;
  };
}

export function KeyMetrics({ metrics }: KeyMetricsProps) {
  const defaultMetrics = {
    activePredictions: 0,
    highRiskAlerts: 0,
    avgConfidence: 0,
    medicinesRecommended: 0,
  };

  const data = metrics || defaultMetrics;

  const metricCards = [
    {
      title: "Active Predictions",
      value: data.activePredictions,
      icon: ChartLine,
      color: "bg-blue-500",
      change: "+12%",
      changeLabel: "from last week",
    },
    {
      title: "High Risk Alerts",
      value: data.highRiskAlerts,
      icon: AlertTriangle,
      color: "bg-red-500",
      change: "+2",
      changeLabel: "since yesterday",
    },
    {
      title: "Avg. Confidence",
      value: `${data.avgConfidence}%`,
      icon: Shield,
      color: "bg-green-500",
      change: "+5%",
      changeLabel: "improved accuracy",
    },
    {
      title: "Medicines Recommended",
      value: data.medicinesRecommended,
      icon: Pill,
      color: "bg-orange-500",
      change: "+23",
      changeLabel: "this week",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricCards.map((metric, index) => (
        <Card key={index} className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div className={`w-12 h-12 ${metric.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 ${metric.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-green-600 font-medium">{metric.change}</span>
              <span className="text-sm text-gray-500 ml-2">{metric.changeLabel}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
