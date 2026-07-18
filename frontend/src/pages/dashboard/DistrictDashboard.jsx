import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  TrendingUp,
  MapPin,
  Users,
  Store,
  FileCheck,
  Clock,
  Award
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

const DistrictDashboard = () => {
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
      console.error('Error fetching district metrics:', error);
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

  const pincodesCount = metrics?.pincodesCount || 24;
  const pincodeAgentsCount = metrics?.pincodeAgentsCount || 85;
  const shopsCount = metrics?.shopsRegisteredCount || 210;
  const reportsCount = metrics?.reportsSubmittedCount || 18;

  const lineChartData = [
    { name: 'May 12', performance: 25 },
    { name: 'May 13', performance: 48 },
    { name: 'May 14', performance: 38 },
    { name: 'May 15', performance: 62 },
    { name: 'May 16', performance: 55 },
    { name: 'May 17', performance: 72 },
    { name: 'May 18', performance: 90 },
  ];

  const pieData = [
    { name: 'Active', value: 70, color: '#10b981' },
    { name: 'Inactive', value: 8, color: '#94a3b8' },
    { name: 'Suspended', value: 7, color: '#ef4444' },
  ];

  const reportsPieData = [
    { name: 'Submitted', value: 20, color: '#10b981' },
    { name: 'Pending', value: 10, color: '#f59e0b' },
    { name: 'Rejected', value: 5, color: '#ef4444' },
  ];

  const mockPincodeOverview = [
    { pin: '641001', shops: 120 },
    { pin: '641002', shops: 98 },
    { pin: '641003', shops: 85 },
    { pin: '641004', shops: 75 },
    { pin: '641005', shops: 66 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Welcome back, Coimbatore District Agent 👋</h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">District level progress monitoring dashboard.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{pincodesCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Pincodes</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{pincodeAgentsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Pincode Agents</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-500">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{shopsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Shops Registered</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{reportsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Reports Submitted</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-600">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* District Performance Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">District Performance</h3>
            <span className="text-xs text-forge-gold font-bold uppercase border border-forge-gold/30 bg-amber-50 px-2 py-0.5 rounded">This Week</span>
          </div>
          <div className="flex-1 h-60 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 8 }} />
                <Line type="monotone" dataKey="performance" stroke="#d9a32c" name="Performance" strokeWidth={2.5} dot={{ fill: '#d9a32c' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pincode Overview List */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Pincode Overview</h3>
              <button className="text-xs text-forge-gold hover:underline font-bold">View All</button>
            </div>
            <div className="space-y-4">
              {mockPincodeOverview.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-forge-gold" />
                    <span className="font-bold text-slate-700">{p.pin}</span>
                  </div>
                  <span className="font-bold text-slate-400">{p.shops} Shops</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Middle Row: Pincode Agent Distribution, Reports Overview, Top Pincodes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pincode Agent Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 w-full text-left mb-4">Pincode Agent Distribution</h3>
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
          <div className="w-full flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm mt-4">
            {pieData.map((p, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span className="text-slate-500 font-bold">{p.name} ({p.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reports Overview */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 w-full text-left mb-4">Reports Overview</h3>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportsPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {reportsPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm mt-4">
            {reportsPieData.map((p, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span className="text-slate-500 font-bold">{p.name} ({p.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Pincodes */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Top Performing Pincodes</h3>
            <span className="text-xs text-forge-gold font-bold uppercase">This Week</span>
          </div>
          <div className="space-y-3.5 flex-1">
            {[
              { rank: 1, pin: '641001', score: '94%' },
              { rank: 2, pin: '641002', score: '86%' },
              { rank: 3, pin: '641003', score: '78%' },
              { rank: 4, pin: '641004', score: '65%' },
              { rank: 5, pin: '641005', score: '55%' }
            ].map((p) => (
              <div key={p.rank} className="flex items-center gap-3 text-sm">
                <span className="w-5 font-bold text-slate-400 text-center">{p.rank}</span>
                <span className="flex-1 font-bold text-slate-700">{p.pin}</span>
                <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-forge-gold h-full rounded-full" style={{ width: p.score }}></div>
                </div>
                <span className="w-8 font-bold text-right text-forge-gold">{p.score}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DistrictDashboard;
