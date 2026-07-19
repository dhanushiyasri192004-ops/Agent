import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  TrendingUp, Users, Target, BarChart2, Star, CheckSquare, Calendar, Filter, Download,
  MapPin, ShieldAlert, Check, ChevronUp, ChevronDown, Award, AlertCircle, Info, Bell
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const Performance = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('Overview');

  // Stats cards
  const stats = [
    { label: 'Total Agents', value: '8,756', change: '+18.6% vs Apr 2025', color: 'text-emerald-600', isPositive: true, icon: Users },
    { label: 'Target Achieved', value: '82.47%', change: '+12.3% vs Apr 2025', color: 'text-emerald-600', isPositive: true, icon: Target },
    { label: 'Total Revenue (This Month)', value: '₹ 4,78,32,600', change: '+18.7% vs Apr 2025', color: 'text-emerald-600', isPositive: true, icon: TrendingUp },
    { label: 'Top Performer', value: 'Coimbatore Division', change: '89.45% Achievement', color: 'text-emerald-600', isPositive: true, icon: Award },
    { label: 'Pending Tasks', value: '256', change: '-6.4% vs Apr 2025', color: 'text-rose-600', isPositive: false, icon: AlertCircle }
  ];

  // Overall Performance Trend
  const trendData = [
    { name: '01 May', target: 70, activity: 50, revenue: 30 },
    { name: '06 May', target: 67, activity: 48, revenue: 26 },
    { name: '11 May', target: 72, activity: 55, revenue: 29 },
    { name: '16 May', target: 70, activity: 52, revenue: 28 },
    { name: '21 May', target: 75, activity: 61, revenue: 32 },
    { name: '26 May', target: 71, activity: 58, revenue: 29 },
    { name: '31 May', target: 74, activity: 63, revenue: 31 }
  ];

  // Target Achievement by Level (Doughnut Chart)
  const achievementByLevelData = [
    { name: 'State Level', value: 85.6, color: '#3b82f6' },
    { name: 'Division Level', value: 83.2, color: '#10b981' },
    { name: 'District Level', value: 81.3, color: '#f59e0b' },
    { name: 'Pincode Level', value: 79.2, color: '#8b5cf6' }
  ];

  // Performance by key metrics (progress bars)
  const keyMetrics = [
    { label: 'Shop Visits', pct: 85.32, change: '+ 12.4%', color: 'bg-blue-600' },
    { label: 'New Vendor Registration', pct: 78.65, change: '+ 8.7%', color: 'bg-emerald-600' },
    { label: 'Revenue Collection', pct: 88.91, change: '+ 14.2%', color: 'bg-amber-500' },
    { label: 'Service Requests', pct: 72.18, change: '+ 10.1%', color: 'bg-purple-600' },
    { label: 'Reports Submission', pct: 90.23, change: '+ 15.3%', color: 'bg-teal-500' }
  ];

  // Performance by Division table
  const divisionPerformance = [
    { name: 'Coimbatore Division', agents: '1,245', target: '85%', achieved: '89.45%', revenue: '₹ 1,25,34,600', activity: '87.32%', rank: 1 },
    { name: 'Chennai Division', agents: '1,320', target: '85%', achieved: '86.21%', revenue: '₹ 1,15,78,900', activity: '84.11%', rank: 2 },
    { name: 'Madurai Division', agents: '1,180', target: '85%', achieved: '81.42%', revenue: '₹ 98,45,300', activity: '79.23%', rank: 3 },
    { name: 'Tiruchirappalli Division', agents: '1,210', target: '85%', achieved: '79.35%', revenue: '₹ 85,64,200', activity: '76.18%', rank: 4 },
    { name: 'Salem Division', agents: '1,150', target: '85%', achieved: '77.89%', revenue: '₹ 78,21,600', activity: '74.02%', rank: 5 },
    { name: 'Vellore Division', agents: '1,115', target: '85%', achieved: '74.18%', revenue: '₹ 74,88,500', activity: '71.24%', rank: 6 },
    { name: 'Tirunelveli Division', agents: '1,016', target: '85%', achieved: '72.11%', revenue: '₹ 68,12,500', activity: '69.11%', rank: 7 }
  ];

  const topPerformers = [
    { name: 'Ramesh Kumar', role: 'District Agent', value: '96.45%' },
    { name: 'Suresh B', role: 'Divisional Agent', value: '94.32%' },
    { name: 'Vijayalakshmi R', role: 'Pincode Agent', value: '93.18%' },
    { name: 'Arun Prakash', role: 'District Agent', value: '91.27%' },
    { name: 'Deepak Kumar', role: 'Pincode Agent', value: '90.12%' }
  ];

  const bottomPerformers = [
    { name: 'Karthik P', role: 'District Agent', value: '45.21%' },
    { name: 'Manoj M', role: 'Divisional Agent', value: '47.32%' },
    { name: 'Siva Kumar', role: 'Pincode Agent', value: '48.67%' },
    { name: 'Prakash R', role: 'District Agent', value: '49.18%' },
    { name: 'Raghu N', role: 'Pincode Agent', value: '50.45%' }
  ];

  const summaryMetrics = [
    { label: 'Total Targets', val: '12,450', sub: '▲ 10.5% vs Apr 2025', color: 'text-blue-600' },
    { label: 'Targets Achieved', val: '10,276', sub: '▲ 12.3% vs Apr 2025', color: 'text-emerald-600' },
    { label: 'Total Activities', val: '26,450', sub: '▲ 15.6% vs Apr 2025', color: 'text-indigo-600' },
    { label: 'Activities Completed', val: '22,460', sub: '▲ 14.2% vs Apr 2025', color: 'text-teal-600' },
    { label: 'Total Revenue', val: '₹ 4,78,32,600', sub: '▲ 18.7% vs Apr 2025', color: 'text-blue-700' },
    { label: 'Average Achievement', val: '82.47%', sub: '▲ 12.3% vs Apr 2025', color: 'text-purple-600' }
  ];

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Performance</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Track performance across all levels and optimize growth.</p>
        </div>
        <div className="flex items-center gap-3 font-bold text-xs">
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>01 May 2025 - 31 May 2025</span>
          </div>
          <button className="bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-slate-700 flex items-center gap-1.5 hover:bg-slate-50">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-md flex items-center gap-1.5 transition">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Grid of 5 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
              <span className="text-xl font-black text-slate-855 block">{card.value}</span>
              <span className={`text-[10px] font-bold block ${card.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>{card.change}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100 ${card.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest gap-5 pb-2">
        {['Overview', 'Level Performance', 'Target Achievement', 'Revenue Performance', 'Activity Performance', 'Top Performers'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 transition select-none ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Row 2: Trend, Level breakdown, Key metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Performance Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Overall Performance Trend</h3>
            <span className="text-xs text-slate-400 font-bold">This Month</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={9} stroke="#64748b" />
                <YAxis fontSize={9} stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} name="Target Achievement (%)" />
                <Line type="monotone" dataKey="activity" stroke="#10b981" strokeWidth={2} name="Activity Completion (%)" />
                <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} name="Revenue Achievement (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Target Achievement by Level */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 w-full text-left mb-2">Target Achievement by Level</h3>
          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={achievementByLevelData} cx="50%" cy="50%" innerRadius={55} outerRadius={72} paddingAngle={4} dataKey="value">
                  {achievementByLevelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-850">82.47%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Overall</span>
            </div>
          </div>
          <div className="w-full space-y-1.5 text-[10px] font-bold">
            {achievementByLevelData.map((d, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span> {d.name}</span>
                <span className="text-slate-800">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance by Key Metrics */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Performance by Key Metrics</h3>
            <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>
          <div className="space-y-3.5">
            {keyMetrics.map((m, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-550">{m.label}</span>
                  <span className="text-slate-800">{m.pct}% <span className="text-emerald-600 ml-1 font-semibold">{m.change}</span></span>
                </div>
                <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Division Table & Top/Bottom Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance by Division */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Performance by Division</h3>
            <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Division</th>
                  <th className="p-3">Total Agents</th>
                  <th className="p-3">Target (%)</th>
                  <th className="p-3">Achieved (%)</th>
                  <th className="p-3">Revenue (₹)</th>
                  <th className="p-3">Activity (%)</th>
                  <th className="p-3 text-center">Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {divisionPerformance.map((row) => (
                  <tr key={row.rank} className="hover:bg-slate-50/50 text-slate-650 font-bold transition">
                    <td className="p-3 text-slate-800 font-extrabold">{row.name}</td>
                    <td className="p-3 font-mono">{row.agents}</td>
                    <td className="p-3 font-mono text-slate-500">{row.target}</td>
                    <td className="p-3 font-mono font-black text-emerald-655">{row.achieved}</td>
                    <td className="p-3 font-mono text-slate-700">{row.revenue}</td>
                    <td className="p-3 font-mono text-slate-500">{row.activity}</td>
                    <td className="p-3 text-center">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mx-auto ${row.rank === 1 ? 'bg-amber-100 text-amber-700' : row.rank === 2 ? 'bg-slate-100 text-slate-700' : 'bg-orange-100 text-orange-700'}`}>
                        {row.rank}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top & Bottom Performers */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Top & Bottom Performers (Agents)</h3>
            <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1"><Check className="w-4.5 h-4.5" /> Top Performers</h4>
              <div className="space-y-2 text-xs font-bold text-slate-600">
                {topPerformers.map((a, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                    <div>
                      <span className="text-slate-850 font-extrabold block">{a.name}</span>
                      <span className="text-[9px] text-slate-400 block">{a.role}</span>
                    </div>
                    <span className="text-emerald-600 font-black">{a.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-1"><ShieldAlert className="w-4.5 h-4.5" /> Bottom Performers</h4>
              <div className="space-y-2 text-xs font-bold text-slate-655">
                {bottomPerformers.map((a, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-1.5 last:border-0 last:pb-0 font-semibold">
                    <div>
                      <span className="text-slate-850 font-extrabold block">{a.name}</span>
                      <span className="text-[9px] text-slate-400 block">{a.role}</span>
                    </div>
                    <span className="text-rose-600 font-black">{a.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 4: Monthly Performance Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800">Monthly Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          {summaryMetrics.map((m, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl">
              <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">{m.label}</span>
              <span className="block text-slate-800 text-base font-black mt-1">{m.val}</span>
              <span className="block text-[9px] text-emerald-600 font-bold mt-1">{m.sub}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Performance;
