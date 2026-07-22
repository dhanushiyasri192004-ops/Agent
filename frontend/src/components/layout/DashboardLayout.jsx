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
  CalendarCheck,
  CheckSquare,
  Megaphone,
  FolderKanban,
  Handshake,
  TrendingUp,
  Compass,
  Briefcase
} from 'lucide-react';
import axios from 'axios';

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Attendance states (Scoped per logged-in user)
  const [showAttendanceDropdown, setShowAttendanceDropdown] = useState(false);
  const [attendanceMonth, setAttendanceMonth] = useState(new Date());
  const [presentDays, setPresentDays] = useState([]);

  const getAttendanceKey = (u) => {
    if (!u) return 'attendance_present_days_guest';
    return `attendance_present_days_${u._id || u.email}`;
  };

  useEffect(() => {
    if (!user) return;
    const storageKey = getAttendanceKey(user);
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      saved = [];
    }

    // Initialize per-user weekday attendance history if empty for this user
    if (saved.length === 0) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const currentDate = today.getDate();
      const initialDays = [];

      for (let d = 1; d <= currentDate; d++) {
        const dateObj = new Date(year, month, d);
        if (dateObj.getDay() !== 0) { // Mon-Sat
          initialDays.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
        }
      }
      saved = initialDays;
      localStorage.setItem(storageKey, JSON.stringify(saved));
    }

    setPresentDays(saved);
  }, [user?.email, user?._id]);

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const toggleDayPresent = (dateString) => {
    if (presentDays.includes(dateString)) {
      return; // Lock attendance once marked
    }
    const updated = [...presentDays, dateString];
    setPresentDays(updated);
    if (user) {
      localStorage.setItem(getAttendanceKey(user), JSON.stringify(updated));
    }
  };

  const todayStr = getTodayStr();
  const isTodayPresent = presentDays.includes(todayStr);

  // Collapsible sidebar menu states
  const [managementOpen, setManagementOpen] = useState(true);
  const [govProjectsOpen, setGovProjectsOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

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
      <aside className={`w-64 bg-[#0a1628] flex flex-col z-30 transition-transform duration-300 fixed inset-y-0 left-0 md:sticky md:top-0 md:h-screen md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800/60">
          <div className="w-9 h-9 rounded-lg bg-[#f5c518] flex items-center justify-center font-black text-slate-950 shadow-md">
            F
          </div>
          <div>
            <h2 className="text-white font-extrabold text-xs tracking-wider leading-none uppercase">FORGE INDIA</h2>
            <span className="text-[9px] text-[#f5c518] font-bold block mt-0.5 tracking-wider uppercase">CONNECT</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-5 overflow-y-auto custom-scrollbar select-none text-slate-400">
          
          {user?.role === 'Pincode Agent' ? (
            <div className="space-y-1">
              {/* Main Dashboard Link */}
              <Link
                to="/pincode-dashboard"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  location.pathname === '/pincode-dashboard' && (!location.search || location.search === '' || location.search.includes('tab=dashboard'))
                    ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/pincode-dashboard?tab=area"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  location.search === '?tab=area'
                    ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Compass className="w-4.5 h-4.5" />
                <span>Assigned Area</span>
              </Link>

              <Link
                to="/pincode-dashboard?tab=visits"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  location.search === '?tab=visits'
                    ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <MapPin className="w-4.5 h-4.5" />
                <span>Shop Visits</span>
              </Link>

              <Link
                to="/pincode-dashboard?tab=register"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  location.search === '?tab=register'
                    ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Store className="w-4.5 h-4.5" />
                <span>Register Shop / Vendor</span>
              </Link>

              <Link
                to="/pincode-dashboard?tab=support"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  location.search === '?tab=support'
                    ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Users className="w-4.5 h-4.5" />
                <span>Customer Support</span>
              </Link>

              <Link
                to="/pincode-dashboard?tab=tasks"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  location.search === '?tab=tasks'
                    ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <CheckSquare className="w-4.5 h-4.5" />
                <span>Task Management</span>
              </Link>

              <Link
                to="/pincode-dashboard?tab=reports"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  location.search === '?tab=reports'
                    ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <ClipboardList className="w-4.5 h-4.5" />
                <span>Reports</span>
              </Link>

              <Link
                to="/pincode-dashboard?tab=performance"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  location.search === '?tab=performance'
                    ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <TrendingUp className="w-4.5 h-4.5" />
                <span>Performance</span>
              </Link>

              <Link
                to="/pincode-dashboard?tab=notifications"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  location.search === '?tab=notifications'
                    ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4.5 h-4.5" />
                  <span>Notifications</span>
                </div>
                <span className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">12</span>
              </Link>

              <Link
                to="/pincode-dashboard?tab=announcements"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  location.search === '?tab=announcements'
                    ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Megaphone className="w-4.5 h-4.5" />
                <span>Announcements</span>
              </Link>

              <Link
                to="/pincode-dashboard?tab=settings"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  location.search === '?tab=settings'
                    ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Settings className="w-4.5 h-4.5" />
                <span>Settings & Profile</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Main Dashboard Link */}
              <div className="space-y-1">
                <Link
                  to={getDashboardPath(user?.role)}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                    location.pathname === getDashboardPath(user?.role)
                      ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
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
                {user?.role !== 'Pincode Agent' && (
                  <div className="space-y-1">
                    <button
                      onClick={() => setManagementOpen(!managementOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4.5 h-4.5" />
                        <span>Agent Management</span>
                      </div>
                      {managementOpen ? <ChevronDown className="w-4.5 h-4.5" /> : <ChevronRight className="w-4.5 h-4.5" />}
                    </button>
                    {managementOpen && (
                      <div className="pl-6 space-y-1.5 mt-1 border-l border-slate-800 ml-6">
                        {(user?.role === 'State Agent' || user?.role === 'Admin') && (
                          <Link
                            to="/district-agents"
                            onClick={() => setSidebarOpen(false)}
                            className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                              location.pathname === '/district-agents' ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                            }`}
                          >
                            District Agents
                          </Link>
                        )}
                        {(user?.role === 'State Agent' || user?.role === 'District Agent' || user?.role === 'Admin') && (
                          <Link
                            to="/divisional-agents"
                            onClick={() => setSidebarOpen(false)}
                            className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                              location.pathname === '/divisional-agents' ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                            }`}
                          >
                            Divisional Agents
                          </Link>
                        )}
                        {(user?.role === 'State Agent' || user?.role === 'District Agent' || user?.role === 'Divisional Agent' || user?.role === 'Admin') && (
                          <Link
                            to="/pincode-agents"
                            onClick={() => setSidebarOpen(false)}
                            className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                              location.pathname === '/pincode-agents' ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                            }`}
                          >
                            Pincode Agents
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )}

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
                        to="/vendor-management?tab=list"
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                          (location.pathname === '/vendor-management' && location.search === '?tab=list') ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                        }`}
                      >
                        Vendor List
                      </Link>
                      <Link
                        to="/vendor-management?tab=queries"
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                          (location.pathname === '/vendor-management' && location.search === '?tab=queries') ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                        }`}
                      >
                        Vendor Queries
                      </Link>
                      <Link
                        to="/vendor-management?tab=complaints"
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                          (location.pathname === '/vendor-management' && location.search === '?tab=complaints') ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                        }`}
                      >
                        Complaints
                      </Link>
                      <Link
                        to="/vendor-management?tab=services"
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                          (location.pathname === '/vendor-management' && location.search === '?tab=services') ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                        }`}
                      >
                        Service Requests
                      </Link>
                      <Link
                        to="/vendor-management?tab=feedback"
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                          (location.pathname === '/vendor-management' && location.search === '?tab=feedback') ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                        }`}
                      >
                        Vendor Feedback
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Section: REPORTS & ANALYTICS */}
              <div className="space-y-1">
                <p className="px-4 text-[11px] font-black text-slate-550 uppercase tracking-widest">Reports & Analytics</p>

                {/* Reports Group */}
                <div className="space-y-1">
                  <button
                    onClick={() => setReportsOpen(!reportsOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <ClipboardList className="w-4.5 h-4.5" />
                      <span>Reports</span>
                    </div>
                    {reportsOpen ? <ChevronDown className="w-4.5 h-4.5" /> : <ChevronRight className="w-4.5 h-4.5" />}
                  </button>
                  {reportsOpen && (
                    <div className="pl-6 space-y-1.5 mt-1 border-l border-slate-800 ml-6">
                      {(user?.role === 'State Agent' || user?.role === 'Admin') && (
                        <Link
                          to="/reports?tab=all"
                          onClick={() => setSidebarOpen(false)}
                          className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                            (location.pathname === '/reports' && (!location.search || location.search === '' || location.search === '?tab=all' || location.search === '?tab=overview' || location.search === '?tab=dashboard')) ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                          }`}
                        >
                          All Reports
                        </Link>
                      )}
                      {(user?.role === 'State Agent' || user?.role === 'District Agent' || user?.role === 'Divisional Agent' || user?.role === 'Admin') && (
                        <Link
                          to="/reports?tab=divisional"
                          onClick={() => setSidebarOpen(false)}
                          className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                            (location.pathname === '/reports' && (location.search === '?tab=divisional' || location.search === '?tab=agent' || location.search === '?tab=district')) ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                          }`}
                        >
                          Divisional Reports
                        </Link>
                      )}
                      {(user?.role === 'State Agent' || user?.role === 'Admin') && (
                        <Link
                          to="/reports?tab=district"
                          onClick={() => setSidebarOpen(false)}
                          className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                            (location.pathname === '/reports' && location.search === '?tab=district') ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                          }`}
                        >
                          District Reports
                        </Link>
                      )}
                      <Link
                        to="/reports?tab=pincode"
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                          (location.pathname === '/reports' && location.search === '?tab=pincode') ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                        }`}
                      >
                        Pincode Reports
                      </Link>
                      <Link
                        to="/reports?tab=vendor"
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                          (location.pathname === '/reports' && location.search === '?tab=vendor') ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                        }`}
                      >
                        Vendors Reports
                      </Link>
                      <Link
                        to="/reports?tab=queries"
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 rounded-md text-xs font-bold transition ${
                          (location.pathname === '/reports' && (location.search === '?tab=queries' || location.search === '?tab=support')) ? 'text-slate-950 bg-[#f5c518] shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                        }`}
                      >
                        Queries Reports
                      </Link>
                    </div>
                  )}
                </div>

                {/* Analytics */}
                <Link
                  to="/analytics"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                    location.pathname === '/analytics' ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <BarChart3 className="w-4.5 h-4.5" />
                  <span>Analytics</span>
                </Link>

                {/* Performance */}
                <Link
                  to="/performance"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                    location.pathname === '/performance' ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <TrendingUp className="w-4.5 h-4.5" />
                  <span>Performance</span>
                </Link>
              </div>

              {/* Section: OTHER */}
              <div className="space-y-1">
                <p className="px-4 text-[11px] font-black text-slate-550 uppercase tracking-widest">Other</p>

                {/* Task Management */}
                <Link
                  to="/tasks"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                    location.pathname === '/tasks' ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <CheckSquare className="w-4.5 h-4.5" />
                  <span>Task Management</span>
                </Link>

                {/* Calendar */}
                <Link
                  to="/calendar"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                    location.pathname === '/calendar' ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Calendar className="w-4.5 h-4.5" />
                  <span>Calendar</span>
                </Link>

                {/* Notifications */}
                <Link
                  to="/notifications"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                    location.pathname === '/notifications' ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4.5 h-4.5" />
                    <span>Notifications</span>
                  </div>
                  <span className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">12</span>
                </Link>

                {/* Announcements */}
                <Link
                  to="/announcements"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                    location.pathname === '/announcements' ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Megaphone className="w-4.5 h-4.5" />
                  <span>Announcements</span>
                </Link>

                {/* Settings & Profile */}
                <Link
                  to="/settings-profile"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                    location.pathname === '/settings-profile' ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Settings className="w-4.5 h-4.5" />
                  <span>Settings & Profile</span>
                </Link>
              </div>
            </>
          )}

        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-slate-800/60 space-y-1">
          {user?.role === 'Pincode Agent' && (
            <Link
              to="/pincode-dashboard?tab=support"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                location.search === '?tab=support'
                  ? 'bg-[#f5c518] text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              <span>Help & Support</span>
            </Link>
          )}
          <button
            onClick={() => setShowLogoutModal(true)}
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

            {/* ATTENDANCE WIDGET */}
            <div className="relative">
              <button
                onClick={() => setShowAttendanceDropdown(!showAttendanceDropdown)}
                className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition relative"
                title={isTodayPresent ? "Today marked as Present" : "Mark today's attendance"}
              >
                <CalendarCheck className={`w-5 h-5 ${isTodayPresent ? 'text-emerald-600' : 'text-amber-500'}`} />
                <span className={`absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${isTodayPresent ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              </button>

              {showAttendanceDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50">
                  <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">Attendance Tracker</span>
                      <span className="text-[10px] text-blue-600 font-bold block">{user?.name || user?.email || 'User'} ({user?.role || 'Agent'})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setAttendanceMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                        className="p-1 hover:bg-slate-100 rounded border border-slate-200 transition"
                        title="Previous Month"
                      >
                        <ChevronRight className="w-3 h-3 rotate-180 text-slate-600" />
                      </button>
                      <span className="text-[10px] bg-slate-100 text-slate-750 font-bold px-2 py-0.5 rounded">
                        {attendanceMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => setAttendanceMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                        className="p-1 hover:bg-slate-100 rounded border border-slate-200 transition"
                        title="Next Month"
                      >
                        <ChevronRight className="w-3 h-3 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {!isTodayPresent && (
                    <button
                      onClick={() => toggleDayPresent(todayStr)}
                      className="w-full mb-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-xs transition duration-150 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <CalendarCheck className="w-4 h-4" /> Mark Present Today
                    </button>
                  )}

                  {/* Calendar Grid */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 uppercase">
                      <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 justify-items-center">
                      {(() => {
                        const year = attendanceMonth.getFullYear();
                        const month = attendanceMonth.getMonth();
                        const firstDayIdx = new Date(year, month, 1).getDay();
                        const daysInMonth = new Date(year, month + 1, 0).getDate();
                        
                        const grid = [];
                        for (let i = 0; i < firstDayIdx; i++) {
                          grid.push(<div key={`empty-${i}`} className="w-9 h-9"></div>);
                        }
                        for (let d = 1; d <= daysInMonth; d++) {
                          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                          const isPresent = presentDays.includes(dateStr);
                          const isToday = d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                          
                          grid.push(
                            <button
                              key={`day-${d}`}
                              onClick={() => toggleDayPresent(dateStr)}
                              disabled={isPresent}
                              className={`w-9 h-9 rounded-lg text-xs font-black flex items-center justify-center transition border ${
                                isPresent
                                  ? 'bg-emerald-500 text-white border-emerald-600 cursor-default'
                                  : 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100'
                              } ${isToday ? 'ring-2 ring-blue-500 border-blue-600' : ''}`}
                              title={isPresent ? `Marked Present on ${d}` : `Click to mark Present on ${d}`}
                            >
                              {d}
                            </button>
                          );
                        }
                        return grid;
                      })()}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>Present Days:</span>
                    <span className="text-slate-800 font-black">
                      {presentDays.filter(d => d.startsWith(`${attendanceMonth.getFullYear()}-${String(attendanceMonth.getMonth() + 1).padStart(2, '0')}`)).length} days
                    </span>
                  </div>
                </div>
              )}
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
                    to="/settings-profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition"
                  >
                    <Settings className="w-4 h-4" />
                    Settings & Profile
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-600 hover:text-red-650 hover:bg-red-50 transition text-left"
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
        <main className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto pb-20">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal Overlay */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
              <LogOut className="w-8 h-8 rotate-180" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-850">Confirm Logout</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Are you sure you want to logout? <br /> You will be logged out from the system.
              </p>
            </div>
            <div className="flex gap-3 text-xs font-bold pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-xl transition font-extrabold"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl shadow-md transition font-extrabold flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardLayout;
