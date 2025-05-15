
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { Toaster } from "@/components/ui/toaster";
import LoadingScreen from '@/components/common/LoadingScreen';

// Lazy load pages
const LoginPage = React.lazy(() => import('@/pages/Login'));
const RegisterPage = React.lazy(() => import('@/pages/Register'));
const DashboardPage = React.lazy(() => import('@/pages/Dashboard'));
const ClientsPage = React.lazy(() => import('@/pages/Clients'));
const CasesPage = React.lazy(() => import('@/pages/Cases'));
const DocumentsPage = React.lazy(() => import('@/pages/Documents'));
const MedicalPage = React.lazy(() => import('@/pages/Medical'));
const BillingPage = React.lazy(() => import('@/pages/Billing'));
const ReportsPage = React.lazy(() => import('@/pages/Reports'));
const CalendarPage = React.lazy(() => import('@/pages/Calendar'));
const AdminPage = React.lazy(() => import('@/pages/Admin'));
const DepositionsPage = React.lazy(() => import('@/pages/Depositions'));
const FirmManagementPage = React.lazy(() => import('@/pages/FirmManagement'));
const SettingsPage = React.lazy(() => import('@/pages/Settings'));
const SuperAdminPage = React.lazy(() => import('@/pages/SuperAdmin'));

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/cases" element={<CasesPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/medical" element={<MedicalPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/depositions" element={<DepositionsPage />} />
                <Route path="/firm-management" element={<FirmManagementPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/super-admin" element={<SuperAdminPage />} />
              </Routes>
            </Suspense>
          </Router>
          <Toaster />
        </AuthProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
