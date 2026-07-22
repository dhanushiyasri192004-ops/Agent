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



  const assignedDistrict = metrics?.district || user?.agentInfo?.district || user?.district || (user?.name?.includes('Salem') ? 'Salem District' : 'Salem District');
  const displayDistrictTitle = assignedDistrict.toLowerCase().includes('agent') ? assignedDistrict : `${assignedDistrict} Agent`;

  const pincodesCount = metrics?.pincodesCount || 0;
  const pincodeAgentsCount = metrics?.pincodeAgentsCount || 0;
  const shopsCount = metrics?.shopsRegisteredCount || 0;
  const reportsCount = metrics?.reportsSubmittedCount || 0;

  const lineChartData = [
    { name: 'May 12', performance: shopsCount > 0 ? 25 : 0 },
    { name: 'May 13', performance: shopsCount > 0 ? 48 : 0 },
    { name: 'May 14', performance: shopsCount > 0 ? 38 : 0 },
    { name: 'May 15', performance: shopsCount > 0 ? 62 : 0 },
    { name: 'May 16', performance: shopsCount > 0 ? 55 : 0 },
    { name: 'May 17', performance: shopsCount > 0 ? 72 : 0 },
    { name: 'May 18', performance: shopsCount > 0 ? 90 : 0 },
  ];

  const pieData = [
    { name: 'Active', value: pincodeAgentsCount, color: '#10b981' },
    { name: 'Pending', value: 0, color: '#f59e0b' },
    { name: 'Inactive', value: 0, color: '#94a3b8' },
  ];

  const reportsPieData = [
    { name: 'Submitted', value: reportsCount, color: '#10b981' },
    { name: 'Pending', value: 0, color: '#f59e0b' },
    { name: 'Rejected', value: 0, color: '#ef4444' },
  ];

  const pincodeOverview = metrics?.pincodeOverview || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Welcome back, {displayDistrictTitle} 👋</h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">District level progress monitoring dashboard for {assignedDistrict}.</p>
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
            <h3 className="text-base font-bold text-slate-800">{assignedDistrict} Performance</h3>
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
              <span className="text-xs text-slate-400 font-bold">{assignedDistrict}</span>
            </div>
            {pincodeOverview.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 font-bold border border-dashed border-slate-200 rounded-xl">
                No pincodes registered in {assignedDistrict} yet.
              </div>
            ) : (
              <div className="space-y-4">
                {pincodeOverview.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-forge-gold" />
                      <span className="font-bold text-slate-700">{p.pin}</span>
                    </div>
                    <span className="font-bold text-slate-400">{p.shops} Shops</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Middle Row: Pincode Agent Distribution, Reports Overview, Top Pincodes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pincode Agent Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 w-full text-left mb-4">Pincode Agent Distribution</h3>
          {pincodeAgentsCount === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-bold border border-dashed border-slate-200 rounded-xl w-full">
              No pincode agents registered in {assignedDistrict} yet.
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Reports Overview */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 w-full text-left mb-4">Reports Overview</h3>
          {reportsCount === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-bold border border-dashed border-slate-200 rounded-xl w-full">
              No reports submitted in {assignedDistrict} yet.
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Top Performing Pincodes */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Top Performing Pincodes</h3>
            <span className="text-xs text-forge-gold font-bold uppercase">{assignedDistrict}</span>
          </div>
          {pincodeOverview.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-bold border border-dashed border-slate-200 rounded-xl flex-1 flex items-center justify-center">
              No pincode activity logged in {assignedDistrict} yet.
            </div>
          ) : (
            <div className="space-y-3.5 flex-1">
              {pincodeOverview.slice(0, 5).map((p, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="w-5 font-bold text-slate-400 text-center">{idx + 1}</span>
                  <span className="flex-1 font-bold text-slate-700">{p.pin}</span>
                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-forge-gold h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="w-8 font-bold text-right text-forge-gold">100%</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DistrictDashboard;
