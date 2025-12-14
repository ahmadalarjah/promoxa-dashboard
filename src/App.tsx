import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import FinancialManagement from './pages/FinancialManagement';
import PlanManagement from './pages/PlanManagement';
import ReferralManagement from './pages/ReferralManagement';
import CommunityManagement from './pages/CommunityManagement';
import NotificationManagement from './pages/NotificationManagement';
import SupportManagement from './pages/SupportManagement';
import PromoCodeManagement from './pages/PromoCodeManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

function AppContent() {
  try {
    const { isAuthenticated, isLoading } = useAuth();
    
    const [sidebarOpen, setSidebarOpen] = useState(true);

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
      return <Login />;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/finance" element={<FinancialManagement />} />
              <Route path="/plans" element={<PlanManagement />} />
              <Route path="/referrals" element={<ReferralManagement />} />
              <Route path="/community" element={<CommunityManagement />} />
              <Route path="/notifications" element={<NotificationManagement />} />
              <Route path="/support" element={<SupportManagement />} />
              <Route path="/promo-codes" element={<PromoCodeManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <ToastContainer position="top-right" />
      </div>
    );
  } catch (error) {
    console.error('Error in AppContent:', error);
    return <div>Error loading app: {error.message}</div>;
  }
}

export default App;
