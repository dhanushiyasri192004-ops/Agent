import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {
  Compass,
  Users,
  MapPin,
  Store,
  Layers,
  Briefcase,
  Hourglass,
  TrendingUp,
  ChevronRight,
  PlusCircle,
  FileCheck,
  Megaphone,
  Bell,
  Settings,
  Link as LinkIcon
} from 'lucide-react';
import api from '../../services/api.js';

const StateDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [performanceRange, setPerformanceRange] = useState('This Month');
  const [revenueRange, setRevenueRange] = useState('This Month');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await api.get('/api/dashboard/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching state metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock Performance Data matching line chart from mockup
  const lineChartData = [
    { name: '01 May', revenue: 20, vendors: 12, agents: 10 },
    { name: '06 May', revenue: 35, vendors: 24, agents: 15 },
    { name: '11 May', revenue: 28, vendors: 18, agents: 22 },
    { name: '16 May', revenue: 42, vendors: 30, agents: 28 },
    { name: '21 May', revenue: 38, vendors: 26, agents: 35 },
    { name: '26 May', revenue: 48, vendors: 38, agents: 40 },
    { name: '31 May', revenue: 52, vendors: 45, agents: 48 },
  ];

  const lineChartDataWeekly = [
    { name: 'Mon', revenue: 8, vendors: 6, agents: 5 },
    { name: 'Tue', revenue: 14, vendors: 11, agents: 12 },
    { name: 'Wed', revenue: 18, vendors: 15, agents: 19 },
    { name: 'Thu', revenue: 25, vendors: 21, agents: 26 },
    { name: 'Fri', revenue: 32, vendors: 28, agents: 33 },
    { name: 'Sat', revenue: 41, vendors: 35, agents: 39 },
    { name: 'Sun', revenue: 48, vendors: 42, agents: 45 },
  ];

  const currentLineChartData = performanceRange === 'This Week' ? lineChartDataWeekly : lineChartData;

  const divisionalCount = metrics?.agentDistribution?.divisionalAgents ?? 12;
  const districtCount = metrics?.agentDistribution?.districtAgents ?? 314;
  const pincodeCount = metrics?.agentDistribution?.pincodeAgents ?? 4120;
  const totalAgentsCount = divisionalCount + districtCount + pincodeCount;

  // Doughnut Pie Data
  const pieData = [
    { name: 'District Agents', value: districtCount, color: '#10b981' },
    { name: 'Divisional Agents', value: divisionalCount, color: '#3b82f6' },
    { name: 'Pincode Agents', value: pincodeCount, color: '#8b5cf6' },
  ];

  // Revenue Overview Bar Chart Data
  const barChartData = [
    { month: 'Dec', value: 18 },
    { month: 'Jan', value: 24 },
    { month: 'Feb', value: 20 },
    { month: 'Mar', value: 35 },
    { month: 'Apr', value: 30 },
    { month: 'May', value: 48 },
  ];

  const barChartDataWeekly = [
    { month: 'Mon', value: 2.5 },
    { month: 'Tue', value: 4.8 },
    { month: 'Wed', value: 5.2 },
    { month: 'Thu', value: 3.9 },
    { month: 'Fri', value: 6.7 },
    { month: 'Sat', value: 8.5 },
    { month: 'Sun', value: 9.2 },
  ];

  const currentBarChartData = revenueRange === 'This Week' ? barChartDataWeekly : barChartData;

  const recentRegistrations = [
    { name: 'Karthik S', role: 'Divisional Agent', location: 'Coimbatore Division', time: 'Today', status: 'Pending' },
    { name: 'Monica R', role: 'District Agent', location: 'Madurai District', time: 'Today', status: 'Pending' },
    { name: 'Suresh B', role: 'Pincode Agent', location: '625001', time: 'Yesterday', status: 'Pending' },
    { name: 'Deepak Kumar', role: 'District Agent', location: 'Salem District', time: 'Yesterday', status: 'Pending' },
    { name: 'Vijayalakshmi', role: 'Pincode Agent', location: '600055', time: '2 Days Ago', status: 'Pending' },
  ];


  const topDivisions = [
    { name: 'Coimbatore Division', amount: '8.76 Cr', change: '+ 18.5%' },
    { name: 'Madurai Division', amount: '7.24 Cr', change: '+ 16.2%' },
    { name: 'Trichy Division', amount: '6.45 Cr', change: '+ 14.8%' },
    { name: 'Salem Division', amount: '5.89 Cr', change: '+ 12.4%' },
    { name: 'Tirunelveli Division', amount: '4.32 Cr', change: '+ 10.1%' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Header & Map Icon */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Welcome back, {user?.name || 'Rajesh Kumar'} 👋</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Here's what's happening in your state today.</p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">State</span>
            <span className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 select-none">
              {user?.agentInfo?.state || 'Tamil Nadu'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 7 Solid Colored Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        
        {/* Total Divisions */}
        <div className="bg-[#1e40af] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-blue-200 tracking-widest opacity-90">Total Divisions</p>
            <p className="text-2xl font-black mt-1">{metrics?.divisionsCount || 0}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span onClick={() => navigate('/divisional-agents')} className="text-[10px] text-blue-200 font-bold hover:underline cursor-pointer">View all divisions</span>
            <Compass className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </div>

        {/* Total Districts */}
        <div className="bg-[#065f46] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-emerald-200 tracking-widest opacity-90">Total Districts</p>
            <p className="text-2xl font-black mt-1">{metrics?.districtsCount || 0}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span onClick={() => navigate('/district-agents')} className="text-[10px] text-emerald-200 font-bold hover:underline cursor-pointer">View all districts</span>
            <Users className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </div>

        {/* Total Pincode Agents */}
        <div className="bg-[#6b21a8] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-purple-200 tracking-widest opacity-90">Pincode Agents</p>
            <p className="text-2xl font-black mt-1">
              {Number(metrics?.pincodeAgentsCount || 0).toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span onClick={() => navigate('/pincode-agents')} className="text-[10px] text-purple-200 font-bold hover:underline cursor-pointer">View all agents</span>
            <MapPin className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </div>

        {/* Total Vendors */}
        <div className="bg-[#c2410c] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-orange-200 tracking-widest opacity-90">Total Vendors</p>
            <p className="text-2xl font-black mt-1">
              {Number(metrics?.shopsRegisteredCount || 0).toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span onClick={() => navigate('/vendor-management')} className="text-[10px] text-orange-200 font-bold hover:underline cursor-pointer">View vendors</span>
            <Users className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-[#0f766e] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-teal-200 tracking-widest opacity-90">Active Projects</p>
            <p className="text-2xl font-black mt-1">{metrics?.activeProjects || 0}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span onClick={() => navigate('/tasks')} className="text-[10px] text-teal-200 font-bold hover:underline cursor-pointer">View projects</span>
            <Briefcase className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#be123c] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-rose-200 tracking-widest opacity-90">Total Revenue</p>
            <p className="text-2xl font-black mt-1">
              {metrics?.shopsRegisteredCount ? `₹ ${(metrics.shopsRegisteredCount * 0.05).toFixed(2)} Cr` : '₹ 0.00 Cr'}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span onClick={() => navigate('/performance')} className="text-[10px] text-rose-200 font-bold hover:underline cursor-pointer">View revenue</span>
            <span className="w-5 h-5 flex items-center justify-center font-bold text-base opacity-40 absolute bottom-4 right-4">₹</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-[#b45309] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-amber-200 tracking-widest opacity-90">Pending Approvals</p>
            <p className="text-2xl font-black mt-1">{metrics?.pendingReportsCount || 0}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span onClick={() => navigate('/reports')} className="text-[10px] text-amber-200 font-bold hover:underline cursor-pointer">View approvals</span>
            <Hourglass className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </div>

      </div>

      {/* Row 1: Performance Overview, Agent Distribution, Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Overview (2/3 width equivalent) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Performance Overview</h3>
            <select
              value={performanceRange}
              onChange={(e) => setPerformanceRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-bold text-slate-600 outline-none"
            >
              <option value="This Month">This Month</option>
              <option value="This Week">This Week</option>
            </select>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentLineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue (₹)" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="vendors" stroke="#10b981" name="Vendors" strokeWidth={2} dot={{ fill: '#10b981' }} />
                <Line type="monotone" dataKey="agents" stroke="#8b5cf6" name="Agents" strokeWidth={2} dot={{ fill: '#8b5cf6' }} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Performance stats row at bottom */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 mt-4 pt-4 text-xs">
            <div>
              <p className="text-slate-400 font-bold">Revenue</p>
              <p className="text-base font-black text-slate-800 mt-0.5">
                {metrics?.shopsRegisteredCount ? `₹ ${(metrics.shopsRegisteredCount * 0.05).toFixed(2)} Cr` : '₹ 48.76 Cr'}
              </p>
              <span className="text-xs text-emerald-600 font-bold">▲ 12.5%</span>
            </div>
            <div>
              <p className="text-slate-400 font-bold">Vendors</p>
              <p className="text-base font-black text-slate-800 mt-0.5">
                {metrics?.shopsRegisteredCount ? Number(metrics.shopsRegisteredCount).toLocaleString() : '8,75,231'}
              </p>
              <span className="text-xs text-emerald-600 font-bold">▲ 15.3%</span>
            </div>
            <div>
              <p className="text-slate-400 font-bold">Agents</p>
              <p className="text-base font-black text-slate-800 mt-0.5">
                {metrics?.pincodeAgentsCount ? Number(metrics.pincodeAgentsCount).toLocaleString() : '4,328'}
              </p>
              <span className="text-xs text-emerald-600 font-bold">▲ 10.8%</span>
            </div>
          </div>
        </div>

        {/* Agent Distribution & Recent Registrations Combined Column */}
        <div className="space-y-6">
          
          {/* Agent Distribution */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 w-full text-left mb-2">Agent Distribution</h3>
            
            <div className="h-44 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Doughnut Center text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</span>
                <span className="text-xl font-black text-slate-800 leading-none">{totalAgentsCount.toLocaleString()}</span>
                <span className="text-xs text-slate-400 font-bold mt-0.5">Agents</span>
              </div>
            </div>

            <div className="w-full space-y-2 mt-2 text-xs">
              {pieData.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                    <span className="text-slate-600 font-bold">{p.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-800">
                    {p.value} ({totalAgentsCount > 0 ? ((p.value / totalAgentsCount) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              ))}
            </div>
            
            <span onClick={() => navigate('/reports')} className="text-xs text-blue-600 hover:underline font-bold self-end mt-4 cursor-pointer">View full report →</span>
          </div>

        </div>

      </div>

      {/* Row 2: Revenue Overview, Leaders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Overview (Bar chart) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Revenue Overview</h3>
              <p className="text-xs text-slate-400 mt-0.5">₹ 48.76 Cr <span className="text-emerald-600 font-bold">▲ 12.5%</span> vs last month</p>
            </div>
            <select
              value={revenueRange}
              onChange={(e) => setRevenueRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-bold text-slate-600 outline-none"
            >
              <option value="This Month">This Month</option>
              <option value="This Week">This Week</option>
            </select>
          </div>

          <div className="flex-1 h-52 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentBarChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 8 }} />
                <Bar dataKey="value" fill="#3b82f6" name="Revenue (Cr)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Divisions */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Top Performing Divisions</h3>
              <span onClick={() => navigate('/performance')} className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View all</span>
            </div>
            <div className="space-y-4">
              {topDivisions.map((div, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-slate-700">{div.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-800">₹ {div.amount}</p>
                    <p className="text-xs text-emerald-600 font-bold">{div.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* New Row: Government Project Assignment Flow & Vendor Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Government Projects Assignment Flow */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" /> Government Projects Assignment Flow
            </h3>
            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">State Action</span>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Smart City Initiative', stage: 'Division Assigned', division: 'Coimbatore Division', district: 'Coimbatore', agent: 'Pending', step: 2 },
              { name: 'Government Schools Electrification', stage: 'District Assigned', division: 'Chennai Division', district: 'Chennai North', agent: 'Ramesh K (PAG001)', step: 3 },
              { name: 'Panchayat Drinking Water', stage: 'State Created', division: 'Unassigned', district: 'Unassigned', agent: 'Unassigned', step: 1 },
              { name: 'Government Hospitals Sanitation', stage: 'Execution Phase', division: 'Madurai Division', district: 'Madurai East', agent: 'Vignesh S (PAG003)', step: 4 }
            ].map((proj, idx) => (
              <div key={idx} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 text-xs space-y-2 font-bold text-slate-500">
                <div className="flex items-center justify-between font-black">
                  <span className="text-slate-800">{proj.name}</span>
                  <span className="text-blue-600 font-bold bg-blue-50/50 px-2 py-0.5 rounded text-[10px]">{proj.stage}</span>
                </div>
                
                {/* Horizontal steps tracker */}
                <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-slate-400 text-center relative pt-1">
                  <div className={`pb-1 ${proj.step >= 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'border-b-2 border-slate-100'}`}>1. Create</div>
                  <div className={`pb-1 ${proj.step >= 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'border-b-2 border-slate-100'}`}>2. Division</div>
                  <div className={`pb-1 ${proj.step >= 3 ? 'text-blue-600 border-b-2 border-blue-600' : 'border-b-2 border-slate-100'}`}>3. District</div>
                  <div className={`pb-1 ${proj.step >= 4 ? 'text-blue-600 border-b-2 border-blue-600' : 'border-b-2 border-slate-100'}`}>4. Execution</div>
                </div>
                
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-1">
                  <span>Div: <strong className="text-slate-650">{proj.division}</strong></span>
                  <span>Dist: <strong className="text-slate-650">{proj.district}</strong></span>
                  <span>Agent: <strong className="text-slate-650">{proj.agent}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Subscription & Expiry alerts */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" /> Vendor Subscription Management
            </h3>
            <span onClick={() => navigate('/analytics')} className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer hover:bg-emerald-100">Analytics</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg">
              <span className="block text-slate-400 text-[10px] uppercase">Monthly</span>
              <span className="block text-slate-800 text-base font-black mt-1">1,845</span>
            </div>
            <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg">
              <span className="block text-slate-400 text-[10px] uppercase">Quarterly</span>
              <span className="block text-slate-800 text-base font-black mt-1">650</span>
            </div>
            <div className="bg-[#eff6ff] border border-blue-100 p-2.5 rounded-lg">
              <span className="block text-blue-600 text-[10px] uppercase">Annual</span>
              <span className="block text-blue-700 text-base font-black mt-1">1,833</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Renewal Alerts & Expiries</h4>
            {[
              { shop: 'Murugan Supermarket', type: 'Annual', date: 'Expires in 3 days', status: 'Immediate' },
              { shop: 'Ganga Sweets & Bakery', type: 'Monthly', date: 'Expires in 7 days', status: 'Reminder' },
              { shop: 'Anand medicals', type: 'Quarterly', date: 'Expires in 12 days', status: 'Reminder' }
            ].map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-50 pb-2 last:border-0 last:pb-0 font-semibold">
                <div>
                  <span className="text-slate-800 font-extrabold block">{alert.shop}</span>
                  <span className="text-[10px] text-slate-400 font-bold block">{alert.type} Subscription</span>
                </div>
                <div className="text-right">
                  <span className="text-rose-600 font-bold block text-[10px]">{alert.date}</span>
                  <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded font-extrabold ${alert.status === 'Immediate' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>{alert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Recent Registrations & Quick Actions (Side-by-side) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Registrations (2/3 width equivalent) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Recent Registrations</h3>
              <span onClick={() => navigate('/pincode-agents')} className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View all</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50/50">
                  <tr>
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3">Time</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentRegistrations.map((reg, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30">
                      <td className="py-3.5 px-3 font-bold text-slate-700">{reg.name}</td>
                      <td className="py-3.5 px-3 text-xs font-semibold">{reg.role}</td>
                      <td className="py-3.5 px-3 text-xs text-slate-400">{reg.location}</td>
                      <td className="py-3.5 px-3 text-xs text-slate-400">{reg.time}</td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-emerald-600 border border-emerald-100">
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <button onClick={() => navigate('/reports')} className="bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2 group">
              <FileCheck className="w-5.5 h-5.5 text-emerald-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Approve Agents</span>
            </button>
            <button onClick={() => navigate('/tasks')} className="bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2 group">
              <PlusCircle className="w-5.5 h-5.5 text-purple-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Create Project</span>
            </button>
            <button onClick={() => navigate('/vendor-management')} className="bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2 group">
              <LinkIcon className="w-5.5 h-5.5 text-orange-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Add Tie-up</span>
            </button>
            <button onClick={() => navigate('/reports')} className="bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2 group">
              <FileCheck className="w-5.5 h-5.5 text-teal-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Generate Report</span>
            </button>
            <button onClick={() => navigate('/announcements')} className="bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2 group">
              <Megaphone className="w-5.5 h-5.5 text-rose-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Send Announcement</span>
            </button>
            <button onClick={() => navigate('/notifications')} className="bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2 group">
              <Bell className="w-5.5 h-5.5 text-amber-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">View Notifications</span>
            </button>
            <button onClick={() => navigate('/settings-profile')} className="bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2 group">
              <Settings className="w-5.5 h-5.5 text-slate-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Dashboard Settings</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StateDashboard;
