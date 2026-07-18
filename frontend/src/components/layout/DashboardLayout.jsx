import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice.js';
import {
  LayoutDashboard,
  Users,
  MapPin,
  ClipboardList,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  FileCheck,
  Search,
  ChevronDown,
  ChevronRight,
  Shield,
  Calendar,
  CheckSquare,
  Megaphone,
  FolderKanban,
  Handshake,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Collapsible sidebar menu states
  const [managementOpen, setManagementOpen] = useState(true);
  const [govProjectsOpen, setGovProjectsOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchNotifications();
  }, [user, navigate]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getDashboardPath = (role) => {
    if (role === 'State Agent' || role === 'Admin') return '/state-dashboard';
    if (role === 'Divisional Agent') return '/divisional-dashboard';
    if (role === 'District Agent') return '/district-dashboard';
    if (role === 'Pincode Agent') return '/pincode-dashboard';
    return '/';
  };

  const getLocationLabel = () => {
    if (!user) return '';
    if (user.role === 'Admin') return 'All India';
    const info = user.agentInfo;
    if (!info) return '';

    if (user.role === 'State Agent') return info.state;
    if (user.role === 'Divisional Agent') return `${info.division}, ${info.state}`;
    if (user.role === 'District Agent') return `${info.district}, ${info.division}`;
    if (user.role === 'Pincode Agent') return `${info.pincode}, ${info.district}`;
    return '';
  };

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800 font-sans">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className={`w-64 bg-[#0a192f] flex flex-col z-30 transition-transform duration-300 fixed inset-y-0 left-0 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-widest text-white">AGENT</h2>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-5 overflow-y-auto custom-scrollbar select-none text-slate-300">
          
          {/* Main Dashboard Link */}
          <div className="space-y-1">
            <Link
              to={getDashboardPath(user?.role)}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                location.pathname === getDashboardPath(user?.role)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Section: MANAGEMENT */}
          <div className="space-y-1">
            <p className="px-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Management</p>
            
            {/* Agent Management Collapsible Group */}
            <div className="space-y-1">
              <button
                onClick={() => setManagementOpen(!managementOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4.5 h-4.5" />
                  <span>Agent Management</span>
                </div>
                {managementOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {managementOpen && (
                <div className="pl-6 space-y-1.5 mt-1 border-l border-slate-800 ml-6">
                  <Link
                    to="/divisional-agents"
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                      location.pathname === '/divisional-agents' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    Divisional Agents
                  </Link>
                  <Link
                    to="/district-agents"
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                      location.pathname === '/district-agents' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    District Agents
                  </Link>
                  <Link
                    to="/pincode-agents"
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                      location.pathname === '/pincode-agents' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    Pincode Agents
                  </Link>
                </div>
              )}
            </div>

            {/* Vendor Management Collapsible */}
            <div className="space-y-1">
              <button
                onClick={() => setVendorOpen(!vendorOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4.5 h-4.5" />
                  <span>Vendor Management</span>
                </div>
                {vendorOpen ? <ChevronDown className="w-4.5 h-4.5" /> : <ChevronRight className="w-4.5 h-4.5" />}
              </button>
              {vendorOpen && (
                <div className="pl-6 space-y-1.5 mt-1 border-l border-slate-800 ml-6">
                  <Link
                    to="/vendor-management"
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                      location.pathname === '/vendor-management' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    Vendor Overview
                  </Link>
                  <Link
                    to="/vendor-management"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2 rounded-md text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/30"
                  >
                    Vendor List
                  </Link>
                  <Link
                    to="/vendor-management"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2 rounded-md text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/30"
                  >
                    Vendor Queries
                  </Link>
                  <Link
                    to="/vendor-management"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2 rounded-md text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/30"
                  >
                    Complaints
                  </Link>
                  <Link
                    to="/vendor-management"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2 rounded-md text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/30"
                  >
                    Service Requests
                  </Link>
                  <Link
                    to="/vendor-management"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2 rounded-md text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/30"
                  >
                    Vendor Feedback
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Section: REPORTS & ANALYTICS */}
          <div className="space-y-1">
            <p className="px-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Reports & Analytics</p>
            
            {/* Reports */}
            <div className="space-y-1">
              <button
                onClick={() => setReportsOpen(!reportsOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4.5 h-4.5" />
                  <span>Reports</span>
                </div>
                {reportsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {reportsOpen && (
                <div className="pl-6 space-y-1.5 mt-1 border-l border-slate-800 ml-6">
                  <Link
                    to="/reports"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2 rounded-md text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/30"
                  >
                    Daily Reports
                  </Link>
                </div>
              )}
            </div>

            {/* Analytics */}
            <Link
              to="/analytics"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                location.pathname === '/analytics' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              <span>Analytics</span>
            </Link>

            {/* Performance */}
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4.5 h-4.5" />
                <span>Performance</span>
              </div>
            </button>
          </div>

          {/* Section: OTHER */}
          <div className="space-y-1">
            <p className="px-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Other</p>

            {/* Task Management */}
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-4.5 h-4.5" />
                <span>Task Management</span>
              </div>
            </button>

            {/* Calendar */}
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition">
              <div className="flex items-center gap-3">
                <Calendar className="w-4.5 h-4.5" />
                <span>Calendar</span>
              </div>
            </button>

            {/* Notifications */}
            <Link
              to="/notifications"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                location.pathname === '/notifications' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4.5 h-4.5" />
                <span>Notifications</span>
              </div>
              {unreadCount > 0 ? (
                <span className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                  {unreadCount}
                </span>
              ) : (
                <span className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">12</span>
              )}
            </Link>

            {/* Announcements */}
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition">
              <div className="flex items-center gap-3">
                <Megaphone className="w-4.5 h-4.5" />
                <span>Announcements</span>
              </div>
            </button>

            {/* Settings */}
            <Link
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                location.pathname === '/settings' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              <span>Settings</span>
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                location.pathname === '/profile' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <User className="w-4.5 h-4.5" />
              <span>Profile</span>
            </Link>
          </div>

        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#f8fafc]">
        
        {/* TOP BAR / HEADER */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 md:hidden text-slate-500 hover:text-slate-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-base bg-slate-100 border border-slate-200/80 px-4 py-2 rounded-full text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-slate-800 font-extrabold">{getLocationLabel() || 'Forge System'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            
            {/* SEARCH */}
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-forge-gold focus:outline-none w-60 transition-all"
              />
            </div>

            {/* NOTIFICATIONS DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200 transition relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-forge-gold rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotificationsDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-40">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] text-forge-gold hover:underline font-bold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications found.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((noti) => (
                        <div
                          key={noti._id}
                          className={`p-4 text-xs transition hover:bg-slate-50 ${!noti.isRead ? 'bg-slate-50/80 font-medium' : ''}`}
                        >
                          <p className="text-slate-700">{noti.message}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {new Date(noti.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotificationsDropdown(false)}
                    className="p-3 text-center text-[10px] font-bold text-slate-500 hover:text-forge-gold bg-slate-50 block border-t border-slate-100 transition"
                  >
                    View All Notifications
                  </Link>
                </div>
              )}
            </div>

            {/* QUICK PROFILE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-50 transition text-left"
              >
                <div className="w-8 h-8 rounded-full bg-forge-gold/10 border border-forge-gold/30 flex items-center justify-center font-bold text-sm text-forge-gold">
                  {user?.name?.charAt(0)}
                </div>
                <div className="hidden lg:block min-w-0 pr-1">
                  <p className="text-xs font-bold text-slate-800 truncate leading-none">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-40 py-1">
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* MAIN BODY SCENE */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
