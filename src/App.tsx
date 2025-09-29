import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { OrganizationsPage } from "@/pages/admin/OrganizationsPage";
import { SubscriptionsPage } from "@/pages/admin/SubscriptionsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/organizations" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <OrganizationsPage />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/subscriptions" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <SubscriptionsPage />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <div className="p-6">Call Analytics Page</div>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/system" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <div className="p-6">System Health Page</div>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <div className="p-6">Settings Page</div>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <div className="p-6">Users Page</div>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
