import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { OrganizationsPage } from "@/pages/admin/OrganizationsPage";
import { SubscriptionsPage } from "@/pages/admin/SubscriptionsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } />
          <Route path="/admin/organizations" element={
            <AdminLayout>
              <OrganizationsPage />
            </AdminLayout>
          } />
          <Route path="/admin/subscriptions" element={
            <AdminLayout>
              <SubscriptionsPage />
            </AdminLayout>
          } />
          <Route path="/admin/analytics" element={
            <AdminLayout>
              <div className="p-6">Call Analytics Page</div>
            </AdminLayout>
          } />
          <Route path="/admin/credits" element={
            <AdminLayout>
              <div className="p-6">Credit Management Page</div>
            </AdminLayout>
          } />
          <Route path="/admin/system" element={
            <AdminLayout>
              <div className="p-6">System Health Page</div>
            </AdminLayout>
          } />
          <Route path="/admin/settings" element={
            <AdminLayout>
              <div className="p-6">Settings Page</div>
            </AdminLayout>
          } />
          <Route path="/admin/users" element={
            <AdminLayout>
              <div className="p-6">Users Page</div>
            </AdminLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
