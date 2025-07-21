import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Activity, 
  Bell, 
  ChartLine, 
  MapPin, 
  Pill, 
  History, 
  Menu,
  Home,
  Settings,
  AlertTriangle,
  Info,
  CheckCircle
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export function Navbar() {
  const queryClient = useQueryClient();
  
  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 10000,
  });

  const alertCount = alerts?.filter((alert: any) => !alert.isRead)?.length || 0;
  
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
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <Info className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PredictMed AI</h1>
                  <p className="text-xs text-gray-500">Disease Prediction Platform</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </span>
            </Link>
            <Link href="/dashboard">
              <span className="text-orange-500 font-medium px-3 py-2 rounded-md bg-orange-50 flex items-center space-x-2 cursor-pointer">
                <ChartLine className="w-4 h-4" />
                <span>Dashboard</span>
              </span>
            </Link>
            <Link href="/analytics">
              <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
                <History className="w-4 h-4" />
                <span>Analytics</span>
              </span>
            </Link>
            <Link href="/admin">
              <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </span>
            </Link>
          </nav>

          {/* Notifications and Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {alertCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs p-0"
                    >
                      {alertCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <p className="text-xs text-gray-500">
                    {alertCount > 0 ? `${alertCount} unread alerts` : 'No new alerts'}
                  </p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {!alerts || alerts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications at this time
                    </div>
                  ) : (
                    alerts.slice(0, 5).map((alert: any) => (
                      <DropdownMenuItem 
                        key={alert.id}
                        className="p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          if (!alert.isRead) {
                            markAsReadMutation.mutate(alert.id);
                          }
                        }}
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <div className="flex-shrink-0">
                            {getAlertIcon(alert.severity)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {alert.title}
                              </p>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(alert.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {alert.description}
                            </p>
                            {!alert.isRead && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                {alerts && alerts.length > 5 && (
                  <div className="p-3 border-t">
                    <Link href="/dashboard">
                      <span className="text-sm text-orange-500 hover:text-orange-600 cursor-pointer">
                        View all notifications
                      </span>
                    </Link>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
