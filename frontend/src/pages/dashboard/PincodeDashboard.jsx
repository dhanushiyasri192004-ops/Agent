import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  MapPin,
  ClipboardList,
  Store,
  FileCheck,
  PlusCircle,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  LayoutDashboard,
  Compass,
  Briefcase,
  Users,
  CheckSquare,
  Bell,
  Megaphone,
  Settings,
  Star,
  ChevronRight,
  ChevronDown,
  Search,
  DollarSign,
  Download,
  AlertCircle,
  Eye,
  Trash2,
  Calendar,
  Lock,
  ShieldAlert,
  Info,
  Layers,
  CheckCircle2,
  ArrowRight,
  X,
  Check,
  Plus
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import api from '../../services/api.js';

const PincodeDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract active tab from query parameters
  const getActiveTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'dashboard';
  };
  const activeTab = getActiveTab();

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sub-tabs states
  const [visitsSubTab, setVisitsSubTab] = useState('plan'); // plan, visited, all
  const [supportSubTab, setSupportSubTab] = useState('all'); // all, open, progress, resolved, closed
  const [tasksSubTab, setTasksSubTab] = useState('all'); // all, progress, completed
  const [reportsSubTab, setReportsSubTab] = useState('daily'); // daily, weekly, monthly, custom
  const [notifSubTab, setNotifSubTab] = useState('all'); // all, unread, important
  const [announceSubTab, setAnnounceSubTab] = useState('all'); // all, unread, important
  const [settingsSubTab, setSettingsSubTab] = useState('profile'); // profile, personal, docs, bank, password, notifications, privacy

  // Wizard state for registration
  const [registerStep, setRegisterStep] = useState(1);
  const [registerData, setRegisterData] = useState({
    shopName: 'Vignesh Provision Store',
    businessCategory: 'Grocery',
    shopAddress: '123, Anna Salai, Chennai - 600005',
    landmark: 'Near Bus Stop',
    gps: '13.0827° N, 80.2707° E',
    ownerName: 'Vignesh Kumar',
    mobile: '+91 98765 43210',
    alternateNumber: '+91 91234 56789',
    email: 'vigneshkumar@gmail.com',
    plan: 'Monthly Plan',
    paymentMode: 'UPI',
    amount: '299',
    paymentStatus: 'Success',
    paymentDate: 'UPI123456789'
  });

  // customer queries state
  const [customerQueries, setCustomerQueries] = useState([
    { ticketId: 'QRY1001', customer: 'Kumar', shop: 'Kumar Medicals', issue: 'Subscription Issue', priority: 'High', status: 'Open' },
    { ticketId: 'QRY1002', customer: 'Selvi', shop: 'Selvi Textiles', issue: 'Payment Failed', priority: 'Medium', status: 'In Progress' },
    { ticketId: 'QRY1003', customer: 'Murugan', shop: 'Sri Murugan Stores', issue: 'App Not Working', priority: 'High', status: 'Open' },
    { ticketId: 'QRY1004', customer: 'Vignesh', shop: 'Vignesh Provision Store', issue: 'Renewal Issue', priority: 'Low', status: 'Resolved' },
    { ticketId: 'QRY1005', customer: 'Arul', shop: 'Arul Electronics', issue: 'Invoice Required', priority: 'Medium', status: 'In Progress' }
  ]);

  // Tasks state
  const [tasksList, setTasksList] = useState([
    { id: 1, text: 'Verify 5 shops in North Street', due: 'Due: 24 May 2025', status: 'In Progress' },
    { id: 2, text: 'Collect documents from new vendors', due: 'Due: 25 May 2025', status: 'Pending' },
    { id: 3, text: 'Shop visit and verification in 1st Avenue', due: 'Due: 26 May 2025', status: 'Pending' },
    { id: 4, text: 'Attend government awareness program', due: 'Due: 25 May 2025', status: 'Pending' },
    { id: 5, text: 'Submit daily report', due: 'Due: Daily', status: 'Completed' }
  ]);

  // Reports state
  const [reportsList, setReportsList] = useState([
    { id: 1, date: '24 May 2025', visits: 12, registered: 8, collected: '₹ 2,386', status: 'Submitted' },
    { id: 2, date: '23 May 2025', visits: 10, registered: 6, collected: '₹ 1,850', status: 'Approved' },
    { id: 3, date: '22 May 2025', visits: 11, registered: 5, collected: '₹ 1,950', status: 'Approved' },
    { id: 4, date: '21 May 2025', visits: 9, registered: 4, collected: '₹ 1,200', status: 'Approved' },
    { id: 5, date: '20 May 2025', visits: 8, registered: 5, collected: '₹ 1,000', status: 'Approved' }
  ]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await api.get('/api/dashboard/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching pincode metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterInput = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const todayVisits = metrics?.todayVisits || 0;
  const registeredShopsCount = metrics?.registeredShopsCount || 0;
  const pendingVerificationCount = metrics?.pendingVerificationCount || 0;
  const reportsSubmittedCount = metrics?.reportsSubmittedCount || 0;

  const [shopsList, setShopsList] = useState([
    { id: 1, name: 'Sri Murugan Stores', address: 'Anna Salai', time: '10:00 AM', status: 'Pending', owner: 'Ramasamy M', phone: '+91 98765 43210' },
    { id: 2, name: 'Kumar Medicals', address: 'Anna Salai', time: '10:45 AM', status: 'Visited', owner: 'Kumar S', phone: '+91 98765 12345' },
    { id: 3, name: 'Selvi Textiles', address: 'Anagha Street', time: '11:30 AM', status: 'Visited', owner: 'Selvi R', phone: '+91 98765 67890' },
    { id: 4, name: 'Arul Electronics', address: '2nd Avenue', time: '12:15 PM', status: 'Pending', owner: 'Arul P', phone: '+91 98765 99999' },
    { id: 5, name: 'Vignesh Provision Store', address: '3rd Avenue', time: '01:00 PM', status: 'Pending', owner: 'Vignesh K', phone: '+91 98765 88888' }
  ]);

  // Visit Workflow Modal State
  const [selectedVisitShop, setSelectedVisitShop] = useState(null);
  const [visitModalStep, setVisitModalStep] = useState(1);
  const [isShopInterested, setIsShopInterested] = useState(null);
  const [notInterestedReason, setNotInterestedReason] = useState('Not Interested');
  const [onboardCategory, setOnboardCategory] = useState('Grocery');
  const [onboardSubCategory, setOnboardSubCategory] = useState('Retail Store');
  const [onboardLicense, setOnboardLicense] = useState('');
  const [onboardFile, setOnboardFile] = useState(null);

  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [newVisitData, setNewVisitData] = useState({
    name: '',
    address: '',
    owner: '',
    phone: '',
    time: '12:00 PM'
  });

  const openVisitModal = (shop) => {
    setSelectedVisitShop(shop);
    setVisitModalStep(1);
    setIsShopInterested(null);
    setNotInterestedReason('Not Interested');
    setOnboardFile(null);
  };

  const recentActivities = [
    { text: 'Shop registered - Kumar Medicals', address: 'Anna Salai', time: '11:15 AM' },
    { text: 'Payment collected - Selvi Textiles', amount: '₹ 1,200', time: '12:20 PM' },
    { text: 'Query resolved - Sri Murugan Stores', service: 'Service Request', time: '01:05 PM' },
    { text: 'Photo uploaded - Kumar Medicals', type: 'Shop Verification', time: '01:30 PM' },
    { text: 'Task completed - Visit 5 Shops', location: 'North Street', time: '02:00 PM' }
  ];

  const notificationsFeed = [
    { text: 'New task assigned by District Agent', time: 'Just now', type: 'task', isNew: true },
    { text: 'Shop subscription expiring soon', time: '1 Hour ago', type: 'alert', isNew: true },
    { text: 'Payment received from Kumar Medicals', time: '2 Hours ago', type: 'payment', isNew: false },
    { text: 'Your daily report has been approved', time: 'Yesterday', type: 'report', isNew: false },
    { text: 'Government awareness program on 25 May', time: 'Yesterday', type: 'announcement', isNew: false }
  ];

  const targetAchievementData = [
    { name: '1 May', target: 20, achieved: 12 },
    { name: '8 May', target: 80, achieved: 65 },
    { name: '15 May', target: 180, achieved: 145 },
    { name: '22 May', target: 280, achieved: 220 },
    { name: '31 May', target: 400, achieved: 320 }
  ];

  const performanceVisitsData = [
    { name: '18 May', visits: 8 },
    { name: '19 May', visits: 10 },
    { name: '20 May', visits: 12 },
    { name: '21 May', visits: 15 },
    { name: '22 May', visits: 11 },
    { name: '23 May', visits: 14 },
    { name: '24 May', visits: 20 }
  ];

  const performancePaymentsData = [
    { name: '18 May', payments: 15000 },
    { name: '19 May', payments: 28000 },
    { name: '20 May', payments: 39000 },
    { name: '21 May', payments: 45000 },
    { name: '22 May', payments: 52000 },
    { name: '23 May', payments: 58000 },
    { name: '24 May', payments: 68450 }
  ];

  return (
    <div className="space-y-6">
      
      {/* 01. DASHBOARD VIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Good Morning, Ramesh Kumar! 👋</h1>
              <p className="text-sm text-slate-500 mt-1 font-semibold">Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 text-sm font-bold shadow-sm">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>24 May 2025</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Today's Target</span>
                  <span className="block text-2xl font-black text-slate-800 mt-1.5">20 Shops</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5" />
                </div>
              </div>
              <Link to="/pincode-dashboard?tab=visits" className="text-xs text-blue-600 font-bold hover:underline mt-4 flex items-center gap-1">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Shops Visited</span>
                  <span className="block text-2xl font-black text-slate-800 mt-1.5">12 <span className="text-xs text-emerald-500 font-bold ml-1">60%</span></span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
              <Link to="/pincode-dashboard?tab=visits" className="text-xs text-blue-600 font-bold hover:underline mt-4 flex items-center gap-1">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Shops Registered</span>
                  <span className="block text-2xl font-black text-slate-800 mt-1.5">8 <span className="text-xs text-blue-500 font-bold ml-1">40%</span></span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
              </div>
              <Link to="/pincode-dashboard?tab=register" className="text-xs text-blue-600 font-bold hover:underline mt-4 flex items-center gap-1">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Queries</span>
                  <span className="block text-2xl font-black text-slate-800 mt-1.5">5</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
              <Link to="/pincode-dashboard?tab=support" className="text-xs text-blue-600 font-bold hover:underline mt-4 flex items-center gap-1">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Tasks Pending</span>
                  <span className="block text-2xl font-black text-slate-800 mt-1.5">3</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>
              </div>
              <Link to="/pincode-dashboard?tab=tasks" className="text-xs text-blue-600 font-bold hover:underline mt-4 flex items-center gap-1">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Progress Overview & Plan Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Circular representation & statistics */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-800">Progress Overview</h3>
              <div className="flex flex-col sm:flex-row items-center gap-8 justify-around">
                <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 rounded-full border-[10px] border-slate-100"></div>
                  <div className="absolute inset-0 rounded-full border-[10px] border-blue-600 border-r-transparent border-b-transparent animate-spin-slow"></div>
                  <div className="text-center">
                    <span className="block text-3xl font-black text-slate-800">60%</span>
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold">Completed</span>
                  </div>
                </div>
                <div className="space-y-4 flex-1 w-full max-w-sm font-sans">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500">Shops Visited</span>
                      <span className="text-slate-800">12 / 20</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500">Shops Registered</span>
                      <span className="text-slate-800">8 / 20</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500">Payments Collected</span>
                      <span className="text-slate-800">₹ 2,386 / ₹ 5,000</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500">Tasks Completed</span>
                      <span className="text-slate-800">2 / 5</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Plan Panel */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-800">Today's Plan (20 Shops)</h3>
                  <Link to="/pincode-dashboard?tab=visits" className="text-xs text-blue-600 hover:underline font-bold">View All</Link>
                </div>
                <div className="space-y-3.5">
                  {shopsList.slice(0, 4).map((shop, idx) => (
                    <div
                      key={idx}
                      onClick={() => openVisitModal(shop)}
                      className="flex items-center justify-between text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0 cursor-pointer hover:bg-slate-50/80 p-1.5 rounded-lg transition"
                    >
                      <div>
                        <h4 className="font-extrabold text-slate-700">{shop.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{shop.address} • {shop.time}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${shop.status === 'Visited' ? 'bg-emerald-50 text-emerald-600' : shop.status === 'Pending Approval' ? 'bg-blue-50 text-blue-600' : shop.status === 'Not Interested' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                        {shop.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="w-full bg-blue-600 hover:bg-blue-755 text-white font-bold py-2.5 rounded-lg text-xs text-center block mt-4 transition shadow-sm"
                onClick={() => {
                  const firstPending = shopsList.find(s => s.status === 'Pending') || shopsList[0];
                  openVisitModal(firstPending);
                }}
              >
                Start Next Visit
              </button>
            </div>
          </div>

          {/* Quick Actions & Activities Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick Actions Panel */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <h3 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3 flex-1">
                <Link
                  to="/pincode-dashboard?tab=register"
                  className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2"
                >
                  <PlusCircle className="w-6 h-6 text-blue-600" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase">Register Shop</span>
                </Link>
                <Link
                  to="/pincode-dashboard?tab=visits"
                  className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2"
                >
                  <Upload className="w-6 h-6 text-emerald-600" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase">Upload Photo</span>
                </Link>
                <Link
                  to="/pincode-dashboard?tab=support"
                  className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2"
                >
                  <Users className="w-6 h-6 text-amber-600" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase">Raise Query</span>
                </Link>
                <Link
                  to="/pincode-dashboard?tab=reports"
                  className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2"
                >
                  <FileCheck className="w-6 h-6 text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase">Submit Report</span>
                </Link>
              </div>
            </div>

            {/* Recent activities */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-800">Recent Activities</h3>
                <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
              </div>
              <div className="space-y-4">
                {recentActivities.map((act, idx) => (
                  <div key={idx} className="flex gap-3 text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-700 leading-snug">{act.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 02. ASSIGNED AREA VIEW */}
      {activeTab === 'area' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Assigned Area</h1>
            <p className="text-sm text-slate-500 mt-1 font-semibold">Your designated geographical territory and limits.</p>
          </div>

          <div className="bg-blue-950/20 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-450 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-700">My Assigned Area Details</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Pincode: <span className="text-slate-800 font-bold">600005</span> • District: <span className="text-slate-800 font-bold">Chennai</span> • Division: <span className="text-slate-800 font-bold">Chennai Division</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800">Area Map</h3>
              <div className="bg-blue-50 border border-blue-100 rounded-xl h-72 flex flex-col items-center justify-center text-blue-500 space-y-2 relative overflow-hidden">
                {/* Decorative Grid Lines */}
                <div className="absolute inset-0 opacity-15" style={{
                  backgroundImage: 'radial-gradient(circle, #000 10%, transparent 11%)',
                  backgroundSize: '24px 24px'
                }}></div>
                
                {/* Simulated boundary polygon */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-500/10 border-2 border-blue-500 rounded-2xl flex items-center justify-center">
                  <span className="text-[10px] text-blue-600 font-black tracking-widest uppercase">Target Boundary</span>
                </div>
                
                {/* Markers */}
                <div className="absolute top-1/3 left-1/3 w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 animate-ping"></div>
                <div className="absolute top-1/3 left-1/3 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px] font-bold"></div>
                
                {[
                  { top: '35%', left: '42%', label: 'Sri Murugan Stores' },
                  { top: '60%', left: '30%', label: 'Kumar Medicals' },
                  { top: '50%', left: '65%', label: 'Arul Electronics' }
                ].map((pin, idx) => (
                  <div key={idx} className="absolute flex flex-col items-center" style={{ top: pin.top, left: pin.left }}>
                    <MapPin className="w-5 h-5 text-red-500 fill-red-500" />
                    <div className="bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                      {pin.label}
                    </div>
                  </div>
                ))}
                
                <button className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow hover:bg-blue-755 transition z-10" onClick={() => alert('Map coverage visualized!')}>
                  View Full Map
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800 font-sans">Area Statistics</h3>
                <div className="space-y-3.5 text-xs font-bold text-slate-500">
                  <div
                    onClick={() => navigate('/pincode-dashboard?tab=visits')}
                    className="flex justify-between border-b border-slate-100 pb-2 cursor-pointer hover:text-blue-600 transition"
                  >
                    <span>Total Shops in Area</span>
                    <span className="text-slate-800 font-extrabold">156</span>
                  </div>
                  <div
                    onClick={() => navigate('/pincode-dashboard?tab=visits')}
                    className="flex justify-between border-b border-slate-100 pb-2 cursor-pointer hover:text-emerald-600 transition"
                  >
                    <span>Active Shops</span>
                    <span className="text-emerald-600 font-extrabold">138</span>
                  </div>
                  <div
                    onClick={() => navigate('/pincode-dashboard?tab=visits')}
                    className="flex justify-between border-b border-slate-100 pb-2 cursor-pointer hover:text-rose-600 transition"
                  >
                    <span>Inactive Shops</span>
                    <span className="text-rose-600 font-extrabold">18</span>
                  </div>
                  <div
                    onClick={() => navigate('/vendor-management')}
                    className="flex justify-between border-b border-slate-100 pb-2 cursor-pointer hover:text-blue-600 transition"
                  >
                    <span>Vendors</span>
                    <span className="text-slate-800 font-extrabold">132</span>
                  </div>
                  <div
                    onClick={() => navigate('/pincode-dashboard?tab=support')}
                    className="flex justify-between border-b border-slate-100 pb-2 cursor-pointer hover:text-blue-600 transition"
                  >
                    <span>Customers</span>
                    <span className="text-slate-800 font-extrabold">125</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 text-xs font-bold text-slate-500">
                <h3 className="text-sm font-bold text-slate-800 mb-1">Pincode Info</h3>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Pincode</span>
                  <span className="text-slate-800">600005</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Area Name</span>
                  <span className="text-slate-800">Anna Salai, T. Nagar</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Assigned On</span>
                  <span className="text-slate-800">10 Jan 2025</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800">Route Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                <span className="block text-slate-400 text-xs font-bold uppercase">Total Route</span>
                <span className="block text-xl font-black text-slate-800 mt-1">20 Shops</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                <span className="block text-slate-400 text-xs font-bold uppercase">Distance</span>
                <span className="block text-xl font-black text-slate-800 mt-1">18.6 km</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                <span className="block text-slate-400 text-xs font-bold uppercase">Estimated Time</span>
                <span className="block text-xl font-black text-slate-800 mt-1">2h 45m</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 03. SHOP VISITS VIEW */}
      {activeTab === 'visits' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Shop Visits</h1>
              <p className="text-sm text-slate-500 mt-1 font-semibold">Track daily visits and route plans.</p>
            </div>
            <button
              onClick={() => {
                setNewVisitData({ name: '', address: '', owner: '', phone: '', time: '12:00 PM' });
                setShowAddVisitModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-755 text-white px-4 py-2 rounded-lg text-xs font-bold shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Shop Visit
            </button>
          </div>

          {/* Sub tabs */}
          <div className="flex gap-2 border-b border-slate-200 pb-3 text-xs font-bold text-slate-400">
            <span className={`cursor-pointer pb-3 px-3 transition-all ${visitsSubTab === 'plan' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-650'}`} onClick={() => setVisitsSubTab('plan')}>Today's Plan</span>
            <span className={`cursor-pointer pb-3 px-3 transition-all ${visitsSubTab === 'visited' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-650'}`} onClick={() => setVisitsSubTab('visited')}>Visited</span>
            <span className={`cursor-pointer pb-3 px-3 transition-all ${visitsSubTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-650'}`} onClick={() => setVisitsSubTab('all')}>All Shops</span>
          </div>

          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <span className="block text-blue-600 text-[11px] font-black uppercase">Assigned</span>
              <span className="block text-2xl font-black text-blue-800 mt-1">20</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
              <span className="block text-emerald-600 text-[11px] font-black uppercase">Visited</span>
              <span className="block text-2xl font-black text-emerald-800 mt-1">12</span>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
              <span className="block text-amber-600 text-[11px] font-black uppercase">Pending</span>
              <span className="block text-2xl font-black text-amber-800 mt-1">4</span>
            </div>
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
              <span className="block text-rose-600 text-[11px] font-black uppercase">Remaining</span>
              <span className="block text-2xl font-black text-rose-800 mt-1">4</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="py-3 px-4">SHOP NAME</th>
                    <th className="py-3 px-4">ADDRESS</th>
                    <th className="py-3 px-4">VISIT TIME</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {shopsList
                    .filter(s => {
                      if (visitsSubTab === 'visited') return s.status === 'Visited';
                      if (visitsSubTab === 'plan') return s.status !== 'Visited';
                      return true;
                    })
                    .map((shop, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-extrabold text-slate-800">{shop.name}</td>
                        <td className="py-3.5 px-4 font-semibold">{shop.address}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-500">{shop.time}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${shop.status === 'Visited' ? 'bg-emerald-50 text-emerald-600' : shop.status === 'Pending Approval' ? 'bg-blue-50 text-blue-600' : shop.status === 'Not Interested' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                            {shop.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            className="bg-blue-600 hover:bg-blue-755 text-white px-3.5 py-1 rounded text-[10px] font-bold transition shadow-sm"
                            onClick={() => openVisitModal(shop)}
                          >
                            {shop.status === 'Visited' ? 'View Details' : 'Start Visit'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
              <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold transition" onClick={() => alert('Showing full route map overlay!')}>
                View Route Map
              </button>
              <button className="bg-blue-600 hover:bg-blue-755 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm" onClick={() => alert('All shops marked as visited!')}>
                Mark All Visited
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 04. REGISTER SHOP / VENDOR */}
      {activeTab === 'register' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#034ea2]">New Business Tie-up</h1>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Register a new partner business for admin approval.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Business Tie-up request submitted successfully for admin approval!');
            }} className="space-y-4">
              
              {/* Select Category */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Select Category *</label>
                <select
                  required
                  value={registerData.businessCategory}
                  onChange={(e) => setRegisterData({ ...registerData, businessCategory: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                >
                  <option value="">Choose Category</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Medical">Medical</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Sub-category / Type */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="Sub-category / Type *"
                  className="w-full border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Business Name */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="Business Name *"
                  value={registerData.shopName}
                  onChange={(e) => setRegisterData({ ...registerData, shopName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Pincode */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="Pincode *"
                  defaultValue={user?.agentInfo?.pincode || '641001'}
                  className="w-full border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Full Address */}
              <div>
                <textarea
                  required
                  rows={2}
                  placeholder="Full Address *"
                  value={registerData.shopAddress}
                  onChange={(e) => setRegisterData({ ...registerData, shopAddress: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Business License Number (Optional) */}
              <div>
                <input
                  type="text"
                  placeholder="Business License Number (Optional)"
                  className="w-full border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Upload Copy / Proof */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700">Business License Copy / Proof</label>
                <label className="border-2 border-dashed border-slate-300 hover:border-blue-600 bg-slate-50/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition group">
                  <div className="w-10 h-10 bg-[#034ea2] text-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#034ea2]">Select image from Gallery</span>
                  <input type="file" className="hidden" accept="image/*,.pdf" />
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#034ea2] hover:bg-[#023875] text-white font-bold py-3.5 rounded-lg text-sm shadow-md transition duration-200 mt-4"
              >
                Submit Request
              </button>

            </form>
          </div>
        </div>
      )}

      {/* 06. CUSTOMER SUPPORT */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Customer Support</h1>
              <p className="text-sm text-slate-500 mt-1 font-semibold">Manage client and vendor queries in one dashboard.</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow hover:bg-blue-755 transition" onClick={() => alert('Create query ticket')}>
              Raise New Query
            </button>
          </div>

          <div className="flex gap-2 border-b border-slate-200 pb-3 text-xs font-bold text-slate-400">
            {['all', 'open', 'progress', 'resolved', 'closed'].map((tab) => (
              <span key={tab} className={`cursor-pointer pb-3.5 px-3 transition-all uppercase ${supportSubTab === tab ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'hover:text-slate-650'}`} onClick={() => setSupportSubTab(tab)}>
                {tab === 'progress' ? 'In Progress' : tab}
              </span>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="py-3 px-4">TICKET ID</th>
                    <th className="py-3 px-4">CUSTOMER</th>
                    <th className="py-3 px-4">SHOP</th>
                    <th className="py-3 px-4">ISSUE</th>
                    <th className="py-3 px-4">PRIORITY</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {customerQueries
                    .filter(q => {
                      if (supportSubTab === 'open') return q.status === 'Open';
                      if (supportSubTab === 'progress') return q.status === 'In Progress';
                      if (supportSubTab === 'resolved') return q.status === 'Resolved';
                      if (supportSubTab === 'closed') return q.status === 'Closed';
                      return true;
                    })
                    .map((q, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 text-blue-600 font-extrabold">{q.ticketId}</td>
                        <td className="py-3.5 px-4">{q.customer}</td>
                        <td className="py-3.5 px-4">{q.shop}</td>
                        <td className="py-3.5 px-4 font-semibold">{q.issue}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${q.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : q.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-500'}`}>
                            {q.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${q.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : q.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-650'}`}>
                            {q.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button className="text-blue-600 hover:underline text-xs" onClick={() => alert(`Details for ticket: ${q.ticketId}`)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 07. TASK MANAGEMENT */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Task Management</h1>
              <p className="text-sm text-slate-500 mt-1 font-semibold">Review checklists and verify task assignments.</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow hover:bg-blue-755 transition" onClick={() => alert('New Task assignment dialog')}>
              New Task
            </button>
          </div>

          <div className="flex gap-2 border-b border-slate-200 pb-3 text-xs font-bold text-slate-400">
            <span className={`cursor-pointer pb-3.5 px-3 transition-all uppercase ${tasksSubTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'hover:text-slate-650'}`} onClick={() => setTasksSubTab('all')}>All Tasks</span>
            <span className={`cursor-pointer pb-3.5 px-3 transition-all uppercase ${tasksSubTab === 'progress' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'hover:text-slate-650'}`} onClick={() => setTasksSubTab('progress')}>In Progress</span>
            <span className={`cursor-pointer pb-3.5 px-3 transition-all uppercase ${tasksSubTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'hover:text-slate-650'}`} onClick={() => setTasksSubTab('completed')}>Completed</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="space-y-3.5">
              {tasksList
                .filter(t => {
                  if (tasksSubTab === 'progress') return t.status === 'In Progress' || t.status === 'Pending';
                  if (tasksSubTab === 'completed') return t.status === 'Completed';
                  return true;
                })
                .map((task) => (
                  <div key={task.id} className="flex items-center justify-between text-xs border-b border-slate-100 pb-3.5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'Completed'}
                        onChange={() => {
                          setTasksList(tasksList.map(t => t.id === task.id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
                        }}
                        className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded cursor-pointer focus:ring-blue-500"
                      />
                      <div>
                        <p className={`font-bold leading-snug ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.text}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{task.due}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : task.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-550'}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 08. REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Reports</h1>
            <p className="text-sm text-slate-500 mt-1 font-semibold">Generate and submit daily work logs.</p>
          </div>

          <div className="flex gap-2 border-b border-slate-200 pb-3 text-xs font-bold text-slate-400">
            {['daily', 'weekly', 'monthly', 'custom'].map((tab) => (
              <span key={tab} className={`cursor-pointer pb-3.5 px-3 transition-all uppercase ${reportsSubTab === tab ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'hover:text-slate-650'}`} onClick={() => setReportsSubTab(tab)}>
                {tab} Report
              </span>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <select className="border border-slate-200 rounded-lg p-2.5 text-xs font-bold outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500">
                  <option>24 May 2025</option>
                  <option>23 May 2025</option>
                  <option>22 May 2025</option>
                </select>
                <button className="bg-blue-600 hover:bg-blue-755 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition shadow" onClick={() => alert('Generating report data...')}>
                  Generate
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="border border-slate-150 p-4 rounded-xl">
                <span className="block text-slate-400 text-xs font-bold uppercase">Shops Visited</span>
                <span className="block text-xl font-black text-slate-800 mt-1">12</span>
              </div>
              <div className="border border-slate-150 p-4 rounded-xl">
                <span className="block text-slate-400 text-xs font-bold uppercase">Shops Registered</span>
                <span className="block text-xl font-black text-slate-800 mt-1">8</span>
              </div>
              <div className="border border-slate-150 p-4 rounded-xl">
                <span className="block text-slate-400 text-xs font-bold uppercase">Payments Collected</span>
                <span className="block text-xl font-black text-slate-800 mt-1">₹ 2,386</span>
              </div>
              <div className="border border-slate-150 p-4 rounded-xl">
                <span className="block text-slate-400 text-xs font-bold uppercase">Customer Meetings</span>
                <span className="block text-xl font-black text-slate-800 mt-1">3</span>
              </div>
            </div>

            <h3 className="text-sm font-extrabold text-slate-800 border-t border-slate-100 pt-4">Recent Reports</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="py-3 px-4">REPORT DATE</th>
                    <th className="py-3 px-4">SHOPS VISITED</th>
                    <th className="py-3 px-4">SHOPS REGISTERED</th>
                    <th className="py-3 px-4">PAYMENTS COLLECTED</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {reportsList.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-extrabold text-slate-805">{rep.date}</td>
                      <td className="py-3.5 px-4">{rep.visits}</td>
                      <td className="py-3.5 px-4">{rep.registered}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{rep.collected}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${rep.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button className="text-slate-400 hover:text-slate-700" onClick={() => alert('Download triggered!')}>
                          <Download className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
              <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg text-xs font-bold transition" onClick={() => alert('Exporting all logs...')}>
                Download All
              </button>
              <button className="bg-blue-600 hover:bg-blue-755 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition shadow" onClick={() => alert('Daily Report successfully submitted!')}>
                Submit Daily Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 09. PERFORMANCE VIEW */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Performance</h1>
              <p className="text-sm text-slate-500 mt-1 font-semibold">Your monthly performance charts and ratings.</p>
            </div>
            <select className="border border-slate-200 rounded-lg p-2 text-xs font-bold bg-white outline-none">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white border border-slate-250 rounded-xl p-5 shadow-sm relative">
              <span className="block text-slate-450 text-[10px] uppercase font-bold tracking-wider">Shops Registered</span>
              <span className="block text-2xl font-black text-slate-800 mt-1.5">32</span>
              <span className="text-[10px] text-emerald-500 font-bold block mt-1.5">▲ 12% vs last month</span>
            </div>
            <div className="bg-white border border-slate-250 rounded-xl p-5 shadow-sm relative">
              <span className="block text-slate-450 text-[10px] uppercase font-bold tracking-wider">Shops Visited</span>
              <span className="block text-2xl font-black text-slate-800 mt-1.5">88</span>
              <span className="text-[10px] text-emerald-500 font-bold block mt-1.5">▲ 10% vs last month</span>
            </div>
            <div className="bg-white border border-slate-250 rounded-xl p-5 shadow-sm relative">
              <span className="block text-slate-450 text-[10px] uppercase font-bold tracking-wider">Payments Collected</span>
              <span className="block text-2xl font-black text-slate-800 mt-1.5">₹ 68,450</span>
              <span className="text-[10px] text-emerald-500 font-bold block mt-1.5">▲ 18% vs last month</span>
            </div>
            <div className="bg-white border border-slate-250 rounded-xl p-5 shadow-sm relative">
              <span className="block text-slate-450 text-[10px] uppercase font-bold tracking-wider">Target Achievement</span>
              <span className="block text-2xl font-black text-slate-800 mt-1.5">80%</span>
              <span className="text-[10px] text-blue-500 font-bold block mt-1.5">On Target</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800">Daily Shop Visits</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceVisitsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800">Payments Collection (₹)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performancePaymentsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="payments" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2 text-center flex flex-col justify-center items-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Customer Satisfaction</span>
              <span className="text-3xl font-black text-slate-800 block flex items-center gap-1.5 mt-2">
                4.5 <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </span>
              <span className="text-xs text-emerald-500 font-extrabold block mt-1">Excellent</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2 text-center flex flex-col justify-center items-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Ranking</span>
              <span className="text-3xl font-black text-blue-600 block mt-2">#3 / 48</span>
              <span className="text-xs text-slate-500 font-extrabold block mt-1">In Your District</span>
            </div>
          </div>
        </div>
      )}

      {/* 10. NOTIFICATIONS VIEW */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Notifications</h1>
              <p className="text-sm text-slate-500 mt-1 font-semibold">Stay updated with regional alerts.</p>
            </div>
            <button className="text-xs text-blue-600 font-bold hover:underline" onClick={() => alert('All notifications marked read')}>
              Mark all read
            </button>
          </div>

          <div className="flex gap-2 border-b border-slate-200 pb-3 text-xs font-bold text-slate-400">
            <span className={`cursor-pointer pb-3 px-3 uppercase ${notifSubTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'hover:text-slate-650'}`} onClick={() => setNotifSubTab('all')}>All</span>
            <span className={`cursor-pointer pb-3 px-3 uppercase ${notifSubTab === 'unread' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'hover:text-slate-650'}`} onClick={() => setNotifSubTab('unread')}>Unread (2)</span>
            <span className={`cursor-pointer pb-3 px-3 uppercase ${notifSubTab === 'important' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'hover:text-slate-650'}`} onClick={() => setNotifSubTab('important')}>Important</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            {notificationsFeed.map((notif, idx) => (
              <div key={idx} className="flex gap-3 items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0 text-xs font-bold">
                <div className="flex gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.isNew ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                  <div>
                    <p className="text-slate-700">{notif.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{notif.time}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 text-[10px]" onClick={() => alert('Notification cleared')}>Dismiss</button>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-4 flex justify-center">
              <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-650 px-4 py-2 rounded-lg text-xs font-bold transition w-full" onClick={() => alert('All notifications loaded')}>
                View All Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. ANNOUNCEMENTS VIEW */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Announcements</h1>
            <p className="text-sm text-slate-500 mt-1 font-semibold">Broad announcements from admin and regional leadership.</p>
          </div>

          <div className="flex gap-2 border-b border-slate-200 pb-3 text-xs font-bold text-slate-400">
            <span className={`cursor-pointer pb-3 px-3 uppercase ${announceSubTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'hover:text-slate-650'}`} onClick={() => setAnnounceSubTab('all')}>All</span>
            <span className={`cursor-pointer pb-3 px-3 uppercase ${announceSubTab === 'unread' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'hover:text-slate-650'}`} onClick={() => setAnnounceSubTab('unread')}>Unread</span>
            <span className={`cursor-pointer pb-3 px-3 uppercase ${announceSubTab === 'important' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'hover:text-slate-650'}`} onClick={() => setAnnounceSubTab('important')}>Important</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border border-slate-150 p-4 rounded-xl bg-slate-50/50 space-y-2 relative">
              <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase absolute top-4 right-4">New</span>
              <h4 className="font-extrabold text-slate-850">Government Awareness Program</h4>
              <p className="text-[10px] text-slate-400 font-bold">Posted by Admin • 24 May 2025</p>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed pt-1">
                Government awareness program will be conducted on 25 May 2025. All agents must participate.
              </p>
            </div>

            <div className="border border-slate-150 p-4 rounded-xl bg-slate-50/50 space-y-2">
              <h4 className="font-extrabold text-slate-850">Monthly Meeting</h4>
              <p className="text-[10px] text-slate-400 font-bold">Posted by Regional Management • 22 May 2025</p>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed pt-1">
                Special review meeting will be held on 30 May 2025 at 10:00 AM.
              </p>
            </div>

            <div className="border border-slate-150 p-4 rounded-xl bg-slate-50/50 space-y-2">
              <h4 className="font-extrabold text-slate-850">New Subscription Offer</h4>
              <p className="text-[10px] text-slate-400 font-bold">Posted by Admin • 20 May 2025</p>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed pt-1">
                Special discount offer for yearly subscription. Inform all vendors.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-650 px-4 py-2 rounded-lg text-xs font-bold transition w-full" onClick={() => alert('Showing all historical announcements')}>
                View All Announcements
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. SETTINGS & PROFILE */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Settings & Profile</h1>
            <p className="text-sm text-slate-500 mt-1 font-semibold">Manage profile, configure notifications, and view policy details.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sidebar navigation list for settings sub-categories */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 h-fit divide-y divide-slate-150">
              {[
                { key: 'profile', label: 'Profile', icon: Settings },
                { key: 'personal', label: 'Personal Details', icon: ClipboardList },
                { key: 'docs', label: 'Documents', icon: FileText },
                { key: 'bank', label: 'Bank Details', icon: Briefcase },
                { key: 'password', label: 'Change Password', icon: Lock },
                { key: 'notifications', label: 'Notification Settings', icon: Bell },
                { key: 'privacy', label: 'Privacy Policy', icon: ShieldAlert }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSettingsSubTab(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-left transition ${settingsSubTab === item.key ? 'text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Content card */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile sub tab details */}
              {settingsSubTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 overflow-hidden relative group mb-3">
                      <Users className="w-full h-full text-slate-400 p-4" />
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-sm">Ramesh Kumar</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">ramesh.agent@gmail.com</p>
                    <p className="text-[10px] text-blue-650 font-black uppercase mt-1">Pincode Agent • 600005</p>
                  </div>

                  <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-850">Profile Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                      <div>
                        <span className="text-slate-400">Name</span>
                        <p className="text-slate-800 mt-1">Ramesh Kumar</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Mobile Number</span>
                        <p className="text-slate-800 mt-1">+91 98765 63210</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Email ID</span>
                        <p className="text-slate-800 mt-1">ramesh.agent@email.com</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Pincode</span>
                        <p className="text-slate-800 mt-1">600005</p>
                      </div>
                      <div>
                        <span className="text-slate-400">District</span>
                        <p className="text-slate-800 mt-1">Chennai</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Division</span>
                        <p className="text-slate-800 mt-1">Chennai Division</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Joined On</span>
                        <p className="text-slate-800 mt-1">10 Jan 2025</p>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-4 flex justify-end">
                      <button className="bg-blue-600 hover:bg-blue-755 text-white px-5 py-2 rounded-lg text-xs font-bold shadow transition" onClick={() => alert('Profile updated!')}>
                        Update Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Other settings tab fallbacks */}
              {settingsSubTab !== 'profile' && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center py-10 space-y-3">
                  <Settings className="w-10 h-10 text-blue-600 mx-auto animate-spin-slow" />
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-widest text-xs">Configuration View: {settingsSubTab}</h4>
                  <p className="text-[11px] text-slate-400 font-bold max-w-xs mx-auto">This panel contains simulator settings for custom user permissions and credentials.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* VISIT WORKFLOW MODAL */}
      {selectedVisitShop && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#034ea2]">Shop Visit & Onboarding Workflow</h3>
                <p className="text-xs text-slate-500 font-semibold">{selectedVisitShop.name} • {selectedVisitShop.address}</p>
              </div>
              <button onClick={() => setSelectedVisitShop(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: MEET OWNER & EXPLAIN BENEFITS */}
            {visitModalStep === 1 && (
              <div className="space-y-4">
                <div className="bg-blue-50/70 border border-blue-100 p-3.5 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Shop Owner: <strong className="text-slate-900">{selectedVisitShop.owner || 'Owner'}</strong></span>
                    <span className="text-blue-600">{selectedVisitShop.phone || '+91 98765 43210'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold">Assigned Pincode: 641001 (Coimbatore District)</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Explain Platform Benefits Checklist:</h4>
                  <div className="space-y-2 text-xs font-semibold text-slate-700">
                    <label className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                      <span>⚡ Instant Business Tie-up & Digital Presence</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                      <span>🛍️ Direct Access to Local Pincode Customers</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                      <span>💳 Easy Payments & Digital Sales Analytics</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                      <span>📢 Free Marketing & Govt Scheme Support</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => setVisitModalStep(2)}
                  className="w-full bg-[#034ea2] hover:bg-[#023875] text-white font-bold py-3 rounded-lg text-xs shadow-md transition"
                >
                  Proceed to Shop Owner Decision ➔
                </button>
              </div>
            )}

            {/* STEP 2: IS SHOP INTERESTED? */}
            {visitModalStep === 2 && (
              <div className="space-y-5 text-center py-2">
                <div>
                  <h4 className="text-base font-extrabold text-slate-800">Is the Shop Owner Interested?</h4>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Select the shop owner's response after platform briefing.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={() => {
                      setIsShopInterested(false);
                      setVisitModalStep(3);
                    }}
                    className="border-2 border-rose-200 hover:border-rose-500 bg-rose-50/40 p-5 rounded-xl flex flex-col items-center gap-2 transition text-rose-700 font-extrabold text-xs"
                  >
                    <span className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-lg">❌</span>
                    <span>No - Not Interested</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsShopInterested(true);
                      setVisitModalStep(3);
                    }}
                    className="border-2 border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 p-5 rounded-xl flex flex-col items-center gap-2 transition text-emerald-700 font-extrabold text-xs"
                  >
                    <span className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">✅</span>
                    <span>Yes - Interested & Onboard</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3A: IF NO - MARK REASON */}
            {visitModalStep === 3 && !isShopInterested && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">Mark Reason for Non-Interest</h4>
                  <p className="text-xs text-slate-500 font-semibold">Record the reason to update agent activity log.</p>
                </div>

                <div className="space-y-1.5 text-xs font-bold text-slate-700">
                  <label className="block text-slate-650 mb-1">Select Reason *</label>
                  <select
                    value={notInterestedReason}
                    onChange={(e) => setNotInterestedReason(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 outline-none bg-white font-bold"
                  >
                    <option value="Not Interested">Not Interested at this time</option>
                    <option value="Already using competitor">Already using another platform</option>
                    <option value="Busy - Call later">Owner busy - Request call back later</option>
                    <option value="Price too high">Pricing / Plan concerns</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setShopsList(prev => prev.map(s => s.name === selectedVisitShop.name ? { ...s, status: notInterestedReason === 'Busy - Call later' ? 'Call Later' : 'Not Interested' } : s));
                    setVisitModalStep(4);
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-lg text-xs shadow-md transition"
                >
                  Save Status & Complete Visit
                </button>
              </div>
            )}

            {/* STEP 3B: IF YES - COLLECT DETAILS & UPLOAD PROOF */}
            {visitModalStep === 3 && isShopInterested && (
              <div className="space-y-4 text-xs font-bold text-slate-700">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">New Business Tie-up Request</h4>
                  <p className="text-xs text-slate-500 font-semibold">Collect shop info and upload license proof for admin approval.</p>
                </div>

                <div>
                  <label className="block mb-1">Select Category *</label>
                  <select
                    value={onboardCategory}
                    onChange={(e) => setOnboardCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold outline-none bg-white"
                  >
                    <option value="Grocery">Grocery</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Medical">Medical</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Sub-category / Type *</label>
                  <input
                    type="text"
                    value={onboardSubCategory}
                    onChange={(e) => setOnboardSubCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Business License Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. LIC-998811"
                    value={onboardLicense}
                    onChange={(e) => setOnboardLicense(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Business License Copy / Proof *</label>
                  <label className="border-2 border-dashed border-slate-300 hover:border-blue-600 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition">
                    <Upload className="w-6 h-6 text-[#034ea2] mb-1" />
                    <span className="text-[11px] text-[#034ea2]">
                      {onboardFile ? onboardFile.name : 'Select image / PDF from Gallery'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setOnboardFile(e.target.files[0])}
                    />
                  </label>
                </div>

                <button
                  onClick={() => {
                    setShopsList(prev => prev.map(s => s.name === selectedVisitShop.name ? { ...s, status: 'Pending Approval' } : s));
                    setVisitModalStep(4);
                  }}
                  className="w-full bg-[#034ea2] hover:bg-[#023875] text-white font-bold py-3 rounded-lg text-xs shadow-md transition"
                >
                  Submit Registration Request (Status: Pending Approval)
                </button>
              </div>
            )}

            {/* STEP 4: CONFIRMATION & COMPLETION */}
            {visitModalStep === 4 && (
              <div className="space-y-4 text-center py-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">
                  <Check className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-800">Visit Workflow Completed</h4>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">
                    {isShopInterested
                      ? 'Shop registration request submitted successfully! Current status: Pending Admin Approval.'
                      : `Shop visit recorded. Status updated to: ${notInterestedReason === 'Busy - Call later' ? 'Call Later' : 'Not Interested'}.`}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVisitShop(null)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs shadow transition"
                >
                  Close & Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ADD SHOP VISIT MODAL */}
      {showAddVisitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-800">Add New Shop Visit</h3>
              <button onClick={() => setShowAddVisitModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Shop Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Balaji Groceries"
                  value={newVisitData.name}
                  onChange={(e) => setNewVisitData({ ...newVisitData, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block mb-1">Address *</label>
                <input
                  type="text"
                  placeholder="e.g. 45, North Street"
                  value={newVisitData.address}
                  onChange={(e) => setNewVisitData({ ...newVisitData, address: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block mb-1">Owner Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Balaji S"
                  value={newVisitData.owner}
                  onChange={(e) => setNewVisitData({ ...newVisitData, owner: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block mb-1">Phone Number *</label>
                <input
                  type="text"
                  placeholder="e.g. +91 99887 76655"
                  value={newVisitData.phone}
                  onChange={(e) => setNewVisitData({ ...newVisitData, phone: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block mb-1">Scheduled Time *</label>
                <input
                  type="text"
                  placeholder="e.g. 02:30 PM"
                  value={newVisitData.time}
                  onChange={(e) => setNewVisitData({ ...newVisitData, time: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAddVisitModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newVisitData.name || !newVisitData.address || !newVisitData.owner || !newVisitData.phone) {
                    alert('Please fill in all required fields!');
                    return;
                  }
                  const newVisit = {
                    id: shopsList.length + 1,
                    name: newVisitData.name,
                    address: newVisitData.address,
                    owner: newVisitData.owner,
                    phone: newVisitData.phone,
                    time: newVisitData.time,
                    status: 'Pending'
                  };
                  setShopsList([...shopsList, newVisit]);
                  setShowAddVisitModal(false);
                  alert('New shop visit successfully scheduled!');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                Save Visit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PincodeDashboard;
