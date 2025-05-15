
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
import Reports from './pages/Reports';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Files from './pages/Files';
import Medical from './pages/Medical';
import Calculator from './pages/Calculator';
import Admin from './pages/Admin';
import Depositions from './pages/Depositions';
import Attorneys from './pages/Attorneys';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { ClientProvider } from './contexts/ClientContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ChatbotProvider } from './contexts/ChatbotContext';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <UserProvider>
            <ClientProvider>
              <ChatbotProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
                  <Route path="/clients/:id" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
                  <Route path="/clients/new" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
                  <Route path="/clients/:id/edit" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
                  
                  <Route path="/cases" element={<ProtectedRoute><Cases /></ProtectedRoute>} />
                  <Route path="/cases/:id" element={<ProtectedRoute><Cases /></ProtectedRoute>} />
                  <Route path="/cases/create" element={<ProtectedRoute><Cases /></ProtectedRoute>} />
                  <Route path="/cases/:id/edit" element={<ProtectedRoute><Cases /></ProtectedRoute>} />
                  
                  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                  <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                  <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                  {/* Adding missing routes */}
                  <Route path="/files" element={<ProtectedRoute><Files /></ProtectedRoute>} />
                  <Route path="/medical" element={<ProtectedRoute><Medical /></ProtectedRoute>} />
                  <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                  <Route path="/depositions/*" element={<ProtectedRoute><Depositions /></ProtectedRoute>} />
                  <Route path="/attorneys" element={<ProtectedRoute><Attorneys /></ProtectedRoute>} />
                  <Route path="/attorneys/:id" element={<ProtectedRoute><Attorneys /></ProtectedRoute>} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ChatbotProvider>
            </ClientProvider>
          </UserProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
