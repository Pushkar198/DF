import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Alert } from "@shared/schema";

interface AlertsAndNotificationsProps {
  alerts?: Alert[];
}

export function AlertsAndNotifications({ alerts }: AlertsAndNotificationsProps) {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest("PATCH", `/api/alerts/${alertId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <Info className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  if (!alerts) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Alerts & Notifications</CardTitle>
          <p className="text-sm text-gray-500">Real-time system updates and warnings</p>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-6 flex items-start space-x-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-full mt-2" />
                  <Skeleton className="h-3 w-3/4 mt-1" />
                  <div className="mt-2 flex items-center space-x-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Alerts & Notifications</CardTitle>
        <p className="text-sm text-gray-500">Real-time system updates and warnings</p>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-200">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No alerts at this time</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="py-6 flex items-start space-x-4">
                <div className="w-8 h-8 bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                  {getAlertIcon(alert.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(alert.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </Badge>
                    {!alert.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsReadMutation.mutate(alert.id)}
                        disabled={markAsReadMutation.isPending}
                        className="text-orange-500 hover:text-orange-600"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
