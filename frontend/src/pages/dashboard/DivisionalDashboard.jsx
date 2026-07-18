import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  TrendingUp,
  Map,
  Users,
  Store,
  MapPin,
  Clock,
  Compass,
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

const DivisionalDashboard = () => {
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
      console.error('Error fetching divisional metrics:', error);
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

  const districtsCount = metrics?.districtsCount || 6;
  const districtAgentsCount = metrics?.districtAgentsCount || 45;
  const pincodeAgentsCount = metrics?.pincodeAgentsCount || 320;
  const shopsCount = metrics?.shopsRegisteredCount || 820;

  const lineChartData = [
    { name: 'May 12', performance: 20 },
    { name: 'May 13', performance: 42 },
    { name: 'May 14', performance: 35 },
    { name: 'May 15', performance: 58 },
    { name: 'May 16', performance: 48 },
    { name: 'May 17', performance: 75 },
    { name: 'May 18', performance: 95 },
  ];

  const pieData = [
    { name: 'District Agents', value: metrics?.agentDistribution?.districtAgents || 45, color: '#10b981' },
    { name: 'Pincode Agents', value: metrics?.agentDistribution?.pincodeAgents || 320, color: '#f59e0b' },
  ];

  const mockDistrictBreakdown = [
    { name: 'Coimbatore', pincodes: 120, shops: '2,450' },
    { name: 'Tirupur', pincodes: 85, shops: '1,850' },
    { name: 'Erode', pincodes: 60, shops: '1,200' },
    { name: 'Nilgiris', pincodes: 55, shops: '900' },
    { name: 'Karur', pincodes: 45, shops: '750' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Welcome back, Chennai Division Agent 👋</h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">Division performance and activity monitor.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{districtsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Districts</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{districtAgentsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">District Agents</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-500">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{pincodeAgentsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Pincode Agents</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{shopsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Shops Registered</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-600">
            <Store className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Division Performance Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Division Performance</h3>
            <span className="text-xs text-forge-gold font-bold uppercase border border-forge-gold/30 bg-amber-50 px-2 py-0.5 rounded">This Week</span>
          </div>
          <div className="flex-1 h-60 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 8 }} />
                <Line type="monotone" dataKey="performance" stroke="#d9a32c" name="Performance Rate" strokeWidth={2.5} dot={{ fill: '#d9a32c' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Breakdown Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">District Breakdown</h3>
              <button className="text-xs text-forge-gold hover:underline font-bold">View All</button>
            </div>
            <div className="space-y-4">
              {mockDistrictBreakdown.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-extrabold text-slate-700">{d.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{d.pincodes} Pincode Agents</p>
                  </div>
                  <span className="font-bold text-slate-800">{d.shops} Shops</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Middle Row: Agent Distribution, Recent Activities, Leaders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Agent Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 w-full text-left mb-4">Agent Distribution</h3>
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

        {/* Recent Activities */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 mb-4">Recent Activities</h3>
          <div className="space-y-4 flex-1">
            {metrics?.recentActivities && metrics.recentActivities.length > 0 ? (
              metrics.recentActivities.slice(0, 4).map((activity, idx) => (
                <div key={idx} className="flex gap-3 text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-forge-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">{activity.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activity.user?.email || 'Agent'} • {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-4">
                <div className="flex gap-3 text-sm border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-forge-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">New district agent added in Tirupur</p>
                    <p className="text-xs text-slate-400 mt-0.5">20 mins ago</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-forge-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">Pincode agent report submitted</p>
                    <p className="text-xs text-slate-400 mt-0.5">1 hour ago</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-forge-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">Shop verified in Erode</p>
                    <p className="text-xs text-slate-400 mt-0.5">2 hours ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Districts */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Top Performing Districts</h3>
            <span className="text-xs text-forge-gold font-bold uppercase">This Week</span>
          </div>
          <div className="space-y-3.5 flex-1">
            {[
              { rank: 1, name: 'Coimbatore', score: '92%' },
              { rank: 2, name: 'Tirupur', score: '87%' },
              { rank: 3, name: 'Erode', score: '75%' },
              { rank: 4, name: 'Nilgiris', score: '64%' },
              { rank: 5, name: 'Karur', score: '56%' }
            ].map((dist) => (
              <div key={dist.rank} className="flex items-center gap-3 text-sm">
                <span className="w-5 font-bold text-slate-400 text-center">{dist.rank}</span>
                <span className="flex-1 font-bold text-slate-700">{dist.name}</span>
                <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-forge-gold h-full rounded-full" style={{ width: dist.score }}></div>
                </div>
                <span className="w-8 font-bold text-right text-forge-gold">{dist.score}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DivisionalDashboard;
