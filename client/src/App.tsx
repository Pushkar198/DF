import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/pages/landing-page";
import SectorDashboard from "@/pages/sector-dashboard";
import Analytics from "@/pages/analytics";
import NotFound from "@/pages/not-found";
import { SectorNavigation } from "@/components/ui/sector-navigation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/sectors" component={SectorNavigation} />
      <Route path="/sectors/:sector" component={SectorDashboard} />
      <Route path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
