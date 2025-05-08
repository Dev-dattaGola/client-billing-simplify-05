
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import { Toaster } from './components/ui/toaster';
import Chatbot from './components/chatbot/Chatbot';
import ChatbotButton from './components/chatbot/ChatbotButton';

import './App.css';

import LandingPage from './pages/LandingPage';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Cases from './pages/Cases';
import Documents from './pages/Documents';
import Files from './pages/Files';
import Medical from './pages/Medical';
import Billing from './pages/Billing';
import Calculator from './pages/Calculator';
import Reports from './pages/Reports';
import Calendar from './pages/Calendar';
import Messages from './pages/Messages';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import Depositions from './pages/Depositions';
import Attorneys from './pages/Attorneys';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <AuthProvider>
            <UserProvider>
              <ChatbotProvider>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/home" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Dashboard - accessible to all authenticated users */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  
                  {/* Client management - accessible to admin and attorney */}
                  <Route 
                    path="/clients/*" 
                    element={
                      <ProtectedRoute requiredPermissions={['view:clients', 'access:all']}>
                        <Clients />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Case management - accessible to admin and attorney */}
                  <Route 
                    path="/cases/*" 
                    element={
                      <ProtectedRoute requiredPermissions={['view:cases', 'access:all']}>
                        <Cases />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Documents - accessible to all, but functionality differs by role */}
                  <Route 
                    path="/documents/*" 
                    element={
                      <ProtectedRoute requiredPermissions={['view:documents', 'access:all']}>
                        <Documents />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* File management - accessible to admin and attorney */}
                  <Route 
                    path="/files/*" 
                    element={
                      <ProtectedRoute requiredPermissions={['view:documents', 'access:all']}>
                        <Files />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Medical records - accessible to admin and attorney */}
                  <Route 
                    path="/medical/*" 
                    element={
                      <ProtectedRoute requiredPermissions={['view:medical', 'access:all']}>
                        <Medical />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Billing - accessible to admin and attorney */}
                  <Route 
                    path="/billing/*" 
                    element={
                      <ProtectedRoute requiredPermissions={['view:billing', 'access:all']}>
                        <Billing />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Calculator - accessible to admin and attorney */}
                  <Route 
                    path="/calculator" 
                    element={
                      <ProtectedRoute requiredPermissions={['view:cases', 'access:all']}>
                        <Calculator />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Reports - accessible to admin and attorney */}
                  <Route 
                    path="/reports/*" 
                    element={
                      <ProtectedRoute requiredPermissions={['view:cases', 'access:all']}>
                        <Reports />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Calendar - accessible to all, but functionality differs by role */}
                  <Route 
                    path="/calendar/*" 
                    element={
                      <ProtectedRoute requiredPermissions={['view:calendar', 'view:appointments', 'access:all']}>
                        <Calendar />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Messages - accessible to all */}
                  <Route 
                    path="/messages/*" 
                    element={
                      <ProtectedRoute requiredPermissions={['view:messages', 'access:all']}>
                        <Messages />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Admin panel - accessible only to admin */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute requiredPermissions={['manage:users', 'access:all']}>
                        <Admin />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Settings - accessible to all authenticated users */}
                  <Route 
                    path="/settings/*" 
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Depositions - accessible to admin and attorney */}
                  <Route 
                    path="/depositions/*" 
                    element={
                      <ProtectedRoute requiredPermissions={['view:depositions', 'access:all']}>
                        <Depositions />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Attorneys - accessible to admin */}
                  <Route 
                    path="/attorneys/*" 
                    element={
                      <ProtectedRoute requiredPermissions={['manage:users', 'access:all']}>
                        <Attorneys />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Chatbot />
                <ChatbotButton />
              </ChatbotProvider>
            </UserProvider>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
