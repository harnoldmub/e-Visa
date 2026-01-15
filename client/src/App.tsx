import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { PublicLayout } from "@/components/public-layout";
import { AdminLayout } from "@/components/admin-layout";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import ApplyPage from "@/pages/apply";
import TrackPage from "@/pages/track";
import VerifyPage from "@/pages/verify";
import AdminLoginPage from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin") && location !== "/admin/login";

  if (isAdminRoute) {
    return (
      <AdminLayout>
        <Switch>
          <Route path="/admin/dashboard" component={AdminDashboard} />
          {/* Add other admin routes here */}
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    );
  }

  // Special case for Admin Login which shouldn't have the sidebar but also not the public header usually, 
  // or maybe it should be just a clean page. Let's keep it simple.
  if (location === "/admin/login" || location === "/admin") {
    return (
      <Switch>
        <Route path="/admin" component={AdminLoginPage} />
        <Route path="/admin/login" component={AdminLoginPage} />
      </Switch>
    );
  }

  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/apply" component={ApplyPage} />
        <Route path="/track" component={TrackPage} />
        <Route path="/verify" component={VerifyPage} />
        <Route path="/verify/:code" component={VerifyPage} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="evisa-rdc-theme">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
