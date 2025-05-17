
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Clients from './pages/Clients';
import Cases from './pages/Cases';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';
import Billing from './pages/Billing';
import Documents from './pages/Documents';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Medical from './pages/Medical';
import Calculator from './pages/Calculator';
import Admin from './pages/Admin';
import Depositions from './pages/Depositions';
import Attorneys from './pages/Attorneys';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ChatbotProvider } from './contexts/ChatbotContext';

function App() {
  console.log("App rendering");
  
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <UserProvider>
            <ChatbotProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* ProtectedRoutes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/clients/*" element={
                  <ProtectedRoute>
                    <Clients />
                  </ProtectedRoute>
                } />
                <Route path="/cases/*" element={
                  <ProtectedRoute>
                    <Cases />
                  </ProtectedRoute>
                } />
                <Route path="/calendar" element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                } />
                <Route path="/documents" element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                <Route path="/billing" element={
                  <ProtectedRoute>
                    <Billing />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />

                {/* Additional routes */}
                <Route path="/medical" element={
                  <ProtectedRoute>
                    <Medical />
                  </ProtectedRoute>
                } />
                <Route path="/calculator" element={
                  <ProtectedRoute>
                    <Calculator />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } />
                <Route path="/depositions/*" element={
                  <ProtectedRoute>
                    <Depositions />
                  </ProtectedRoute>
                } />
                <Route path="/attorneys/*" element={
                  <ProtectedRoute>
                    <Attorneys />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ChatbotProvider>
          </UserProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default React.memo(App);
