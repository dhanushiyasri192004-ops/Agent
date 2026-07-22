import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// Dashboard Pages
import StateDashboard from './pages/dashboard/StateDashboard.jsx';
import DivisionalDashboard from './pages/dashboard/DivisionalDashboard.jsx';
import DistrictDashboard from './pages/dashboard/DistrictDashboard.jsx';
import PincodeDashboard from './pages/dashboard/PincodeDashboard.jsx';
import Analytics from './pages/dashboard/Analytics.jsx';

// Agent Pages
import DivisionalAgents from './pages/agent/DivisionalAgents.jsx';
import DistrictAgents from './pages/agent/DistrictAgents.jsx';
import PincodeAgents from './pages/agent/PincodeAgents.jsx';

// Shop Pages
import ShopRegistration from './pages/shop/ShopRegistration.jsx';
import ShopList from './pages/shop/ShopList.jsx';

// Other Pages
import Reports from './pages/reports/Reports.jsx';
import Notifications from './pages/notifications/Notifications.jsx';
import VendorManagement from './pages/vendor/VendorManagement.jsx';
import Performance from './pages/dashboard/Performance.jsx';
import TaskManagement from './pages/task/TaskManagement.jsx';
import CalendarPage from './pages/calendar/CalendarPage.jsx';
import Announcements from './pages/announcements/Announcements.jsx';
import SettingsProfile from './pages/settings/SettingsProfile.jsx';

// Layout
import DashboardLayout from './components/layout/DashboardLayout.jsx';

// Guard for authenticated routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { user } = useSelector((state) => state.auth);

  // Dynamic homepage redirect based on role
  const getHomeRedirect = () => {
    if (!user) return <Navigate to="/login" replace />;
    switch (user.role) {
      case 'State Agent':
      case 'Admin':
        return <Navigate to="/state-dashboard" replace />;
      case 'Divisional Agent':
        return <Navigate to="/divisional-dashboard" replace />;
      case 'District Agent':
        return <Navigate to="/district-dashboard" replace />;
      case 'Pincode Agent':
        return <Navigate to="/pincode-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/state-dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <StateDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/divisional-dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <DivisionalDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/district-dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <DistrictDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pincode-dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <PincodeDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/performance"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Performance />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Agent Hierarchy management */}
        <Route
          path="/divisional-agents"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <DivisionalAgents />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/district-agents"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <DistrictAgents />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pincode-agents"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <PincodeAgents />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/vendor-management"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <VendorManagement />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Shop management */}
        <Route
          path="/shop-registration"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ShopRegistration />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/shops"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ShopList />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Shared hierarchy functions */}
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Notifications />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <TaskManagement />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <CalendarPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Announcements />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings-profile"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <SettingsProfile />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Root Redirect handler */}
        <Route path="/" element={getHomeRedirect()} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
