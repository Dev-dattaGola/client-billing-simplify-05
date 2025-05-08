
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { ClientProvider } from './contexts/ClientContext';
import { ChatbotProvider } from './contexts/ChatbotContext';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Clients from './pages/Clients'; // Use regular pages for Clients
import Cases from './frontend/pages/Cases';
import Calendar from './frontend/pages/Calendar';
import Documents from './frontend/pages/Documents';
import Files from './frontend/pages/Files';
import Reports from './frontend/pages/Reports';
import Medical from './pages/Medical';
import Billing from './pages/Billing';
import Messages from './pages/Messages';
import Depositions from './pages/Depositions';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Attorneys from './pages/Attorneys';
import Patients from './pages/Patients';
import Calculator from './pages/Calculator';
import SuperAdmin from './frontend/pages/SuperAdmin';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';

// Component imports
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UserProvider>
            <ClientProvider>
              <ChatbotProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
                    <Route path="/cases" element={<ProtectedRoute><Cases /></ProtectedRoute>} />
                    <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
                    <Route path="/files" element={<ProtectedRoute><Files /></ProtectedRoute>} />
                    <Route path="/medical" element={<ProtectedRoute><Medical /></ProtectedRoute>} />
                    <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
                    <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                    <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                    <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute requiredPermissions={["admin:access"]} roles={["admin"]}><Admin /></ProtectedRoute>} />
                    <Route path="/attorneys" element={<ProtectedRoute requiredPermissions={["manage:users"]} roles={["admin", "superadmin"]}><Attorneys /></ProtectedRoute>} />
                    <Route path="/depositions" element={<ProtectedRoute><Depositions /></ProtectedRoute>} />
                    <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/super-admin" element={<ProtectedRoute requiredPermissions={["manage:system"]} roles={["superadmin"]}><SuperAdmin /></ProtectedRoute>} />
                    
                    {/* 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>

                  {/* Toast notifications */}
                  <Toaster />
                </BrowserRouter>
              </ChatbotProvider>
            </ClientProvider>
          </UserProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
