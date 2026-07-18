import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  Clock
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PincodeDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/api/dashboard/metrics', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching pincode metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-forge-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const todayVisits = metrics?.todayVisits || 6;
  const registeredShopsCount = metrics?.registeredShopsCount || 3;
  const pendingVerificationCount = metrics?.pendingVerificationCount || 2;
  const reportsSubmittedCount = metrics?.reportsSubmittedCount || 1;

  const lineChartData = metrics?.shopTrends || [
    { day: 'Mon', value: 2 },
    { day: 'Tue', value: 4 },
    { day: 'Wed', value: 3 },
    { day: 'Thu', value: 6 },
    { day: 'Fri', value: 5 },
    { day: 'Sat', value: 4 },
  ];

  const pieData = [
    { name: 'Verified', value: metrics?.verificationStatus?.verified || 13, color: '#10b981' },
    { name: 'Pending', value: metrics?.verificationStatus?.pending || 5, color: '#f59e0b' },
    { name: 'Rejected', value: metrics?.verificationStatus?.rejected || 2, color: '#ef4444' },
  ];

  const mockTimeline = [
    { time: '09:30 AM', action: 'Visited Murugan Stores' },
    { time: '11:15 AM', action: 'Collected shop details - New City Store' },
    { time: '01:20 PM', action: 'Uploaded documents - Royal Traders' },
    { time: '04:45 PM', action: 'Submitted daily report' },
  ];

  const mockRecentShops = [
    { name: 'Murugan Stores', status: 'Verified', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { name: 'Kannan Provision Store', status: 'Verified', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { name: 'Royal Traders', status: 'Verified', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { name: 'New City Store', status: 'Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Welcome back, 641001 Pincode Agent 👋</h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">Today's shop registration status.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{todayVisits}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Today's Visits</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{registeredShopsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Shops Registered</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-500">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{pendingVerificationCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Pending Verification</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{reportsSubmittedCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Reports Submitted</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-600">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Timeline & verification Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Activity Timeline */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-4">Today's Activity Timeline</h3>
            <div className="space-y-4">
              {mockTimeline.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <span className="text-xs text-forge-gold w-16 text-right shrink-0 pt-0.5">{item.time}</span>
                  <div className="w-0.5 bg-slate-100 relative">
                    <div className="absolute top-1 left-[-3px] w-2 h-2 rounded-full bg-forge-gold"></div>
                  </div>
                  <span className="font-bold text-slate-700 flex-1">{item.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shop Verification Status Pie Chart */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 w-full text-left mb-4">Shop Verification Status</h3>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full flex items-center justify-around text-sm mt-4">
            {pieData.map((p, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span className="text-slate-500 font-bold">{p.name} ({p.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Shops List */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Recent Shops</h3>
              <button className="text-xs text-forge-gold hover:underline font-bold">View All</button>
            </div>
            <div className="space-y-4">
              {mockRecentShops.map((shop, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-forge-gold" />
                    <span className="font-bold text-slate-700">{shop.name}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold ${shop.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {shop.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Shop Registration Trend Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Shop Registration Trend</h3>
            <span className="text-xs text-forge-gold font-bold uppercase">This Week</span>
          </div>
          <div className="flex-1 h-52 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 8 }} />
                <Line type="monotone" dataKey="value" stroke="#d9a32c" name="Shops" strokeWidth={2.5} dot={{ fill: '#d9a32c' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <Link
              to="/shop-registration"
              className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2"
            >
              <PlusCircle className="w-6 h-6 text-forge-gold" />
              <span className="text-xs font-bold text-slate-700 uppercase">Tie-Up New Shop</span>
            </Link>
            <Link
              to="/shop-registration"
              className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2"
            >
              <Store className="w-6 h-6 text-forge-gold" />
              <span className="text-xs font-bold text-slate-700 uppercase">Register Shop</span>
            </Link>
            <Link
              to="/shop-registration"
              className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2"
            >
              <Upload className="w-6 h-6 text-forge-gold" />
              <span className="text-xs font-bold text-slate-700 uppercase">Upload Documents</span>
            </Link>
            <Link
              to="/reports"
              className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2"
            >
              <FileCheck className="w-6 h-6 text-forge-gold" />
              <span className="text-xs font-bold text-slate-700 uppercase">Submit Daily Report</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default PincodeDashboard;
