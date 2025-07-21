import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HistoricalTrendsProps {
  selectedRegion: string;
}

export function HistoricalTrends({ selectedRegion }: HistoricalTrendsProps) {
  // Mock trend data for demonstration
  const trendData = [
    { month: 'Jan', predictions: 12 },
    { month: 'Feb', predictions: 19 },
    { month: 'Mar', predictions: 8 },
    { month: 'Apr', predictions: 15 },
    { month: 'May', predictions: 24 },
    { month: 'Jun', predictions: 18 },
  ];

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Historical Trends</CardTitle>
        <p className="text-sm text-gray-500">Disease patterns over time</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="predictions" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ fill: '#f97316', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center space-x-1">
              {getTrendIcon(15)}
              <p className={`text-lg font-semibold ${getTrendColor(15)}`}>↑ 15%</p>
            </div>
            <p className="text-sm text-gray-500">Last Month</p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1">
              {getTrendIcon(-8)}
              <p className={`text-lg font-semibold ${getTrendColor(-8)}`}>↓ 8%</p>
            </div>
            <p className="text-sm text-gray-500">Last Quarter</p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1">
              {getTrendIcon(23)}
              <p className={`text-lg font-semibold ${getTrendColor(23)}`}>↑ 23%</p>
            </div>
            <p className="text-sm text-gray-500">Last Year</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
