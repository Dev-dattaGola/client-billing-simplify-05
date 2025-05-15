
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from '@/components/common/LoadingScreen';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy load pages
const Login = React.lazy(() => import('@/pages/Login'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Admin = React.lazy(() => import('@/pages/Admin'));
const SuperAdmin = React.lazy(() => import('@/pages/SuperAdmin'));
const Index = React.lazy(() => import('@/pages/Index'));
const LandingPage = React.lazy(() => import('@/pages/LandingPage'));
const Clients = React.lazy(() => import('@/pages/Clients'));
const Cases = React.lazy(() => import('@/pages/Cases'));
const Documents = React.lazy(() => import('@/pages/Documents'));
const FirmManagement = React.lazy(() => import('@/pages/FirmManagement'));

function App() {
  return (
    <HelmetProvider>
      <Helmet 
        titleTemplate="%s | Lawerp500" 
        defaultTitle="Lawerp500"
      />
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<LandingPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <Admin />
              </ProtectedRoute>
            } />
            
            <Route path="/super-admin" element={
              <ProtectedRoute roles={['superadmin']}>
                <SuperAdmin />
              </ProtectedRoute>
            } />
            
            {/* New routes for sidebar items */}
            <Route path="/clients" element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            } />
            
            <Route path="/cases" element={
              <ProtectedRoute>
                <Cases />
              </ProtectedRoute>
            } />
            
            <Route path="/documents" element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            } />
            
            <Route path="/firm-management" element={
              <ProtectedRoute roles={['admin']}>
                <FirmManagement />
              </ProtectedRoute>
            } />
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
