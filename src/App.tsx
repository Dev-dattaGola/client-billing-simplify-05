
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <HelmetProvider>
      <Helmet 
        titleTemplate="%s | LYZ Law Firm" 
        defaultTitle="LYZ Law Firm"
      />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
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
              
              {/* Redirect home to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Fallback for unknown routes */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
