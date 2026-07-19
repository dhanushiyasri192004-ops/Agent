import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  ClipboardList, Plus, ShieldAlert, Check, X, FileText, CheckCircle, Clock,
  TrendingUp, Calendar, Filter, ArrowUpRight, BarChart2, PieChart as PieIcon,
  Download, Printer, Mail, Calendar as CalIcon, Settings, ChevronLeft, ChevronRight, Star,
  Eye, FileCheck, EyeOff, Bell, UserCheck, Users, Activity, Target, MessageSquare
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';
import api from '../../services/api.js';

const Reports = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'dashboard';

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reportType, setReportType] = useState('Daily Report');
  const [documentFile, setDocumentFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filter local states
  const [selectedAgentLevel, setSelectedAgentLevel] = useState('Overview');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/api/reports');
      setReports(response.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('reportType', reportType);
    if (documentFile) {
      formData.append('document', documentFile);
    }

    try {
      await api.post('/api/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Report submitted successfully!');
      setTitle('');
      setContent('');
      setReportType('Daily Report');
      setDocumentFile(null);
      fetchReports();
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Global Mock Charts & Sparkline Data
  const sparklineData1 = [{ value: 400 }, { value: 600 }, { value: 500 }, { value: 800 }, { value: 700 }, { value: 1100 }, { value: 950 }];
  const sparklineData2 = [{ value: 200 }, { value: 400 }, { value: 380 }, { value: 500 }, { value: 600 }, { value: 800 }, { value: 750 }];
  const sparklineData3 = [{ value: 50 }, { value: 80 }, { value: 70 }, { value: 120 }, { value: 100 }, { value: 150 }, { value: 115 }];

  const revenueData = [
    { date: '01 May', Revenue: 22000000 }, { date: '06 May', Revenue: 34000000 },
    { date: '11 May', Revenue: 28000000 }, { date: '16 May', Revenue: 45000000 },
    { date: '21 May', Revenue: 40000000 }, { date: '26 May', Revenue: 48000000 },
    { date: '31 May', Revenue: 42000000 }
  ];

  const approvalTrendData = [
    { name: '01 May', Approved: 300, Pending: 100 }, { name: '06 May', Approved: 420, Pending: 150 },
    { name: '11 May', Approved: 380, Pending: 120 }, { name: '16 May', Approved: 510, Pending: 200 },
    { name: '21 May', Approved: 470, Pending: 160 }, { name: '26 May', Approved: 550, Pending: 180 },
    { name: '31 May', Approved: 490, Pending: 130 }
  ];

  // Tab View Renders
  const renderDashboard = () => (
    <>
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Reports Submitted', val: '2,456', sub: 'Across all levels', color: 'text-blue-600', spark: sparklineData1 },
          { label: 'Reports Approved', val: '1,985', sub: '80.86% of total', color: 'text-emerald-600', spark: sparklineData2 },
          { label: 'Pending Reports', val: '356', sub: '14.48% of total', color: 'text-amber-600', spark: sparklineData3 },
          { label: 'Reports Rejected', val: '115', sub: '4.68% of total', color: 'text-rose-600', spark: sparklineData3 },
          { label: 'Avg. Approval Time', val: '18.6 hrs', sub: 'This month', color: 'text-teal-600', spark: sparklineData1 }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
              <p className="text-xl font-black text-slate-800 mt-1">{card.val}</p>
            </div>
            <div className="flex justify-between items-end mt-1.5">
              <span className="text-[10px] text-slate-400 font-semibold">{card.sub}</span>
              <div className="w-16 h-8 opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={card.spark}>
                    <Line type="monotone" dataKey="value" stroke={idx === 1 ? '#10b981' : idx === 2 ? '#f59e0b' : idx === 3 ? '#ef4444' : '#3b82f6'} strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Recent Submitted Reports & Monthly Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Recent Submitted Reports</h3>
            <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Report ID</th>
                  <th className="p-3">Report Type</th>
                  <th className="p-3">Submitted By</th>
                  <th className="p-3">Agent Type</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Submitted On</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 'RPT250501', type: 'Daily Report', by: 'Karthik S', role: 'Pincode Agent', area: 'Chennai', date: '31 May 2025 09:30 AM', status: 'Pending' },
                  { id: 'RPT250502', type: 'Daily Report', by: 'Monica R', role: 'District Agent', area: 'Coimbatore', date: '31 May 2025 09:15 AM', status: 'Approved' },
                  { id: 'RPT250503', type: 'Weekly Report', by: 'Suresh B', role: 'District Agent', area: 'Madurai', date: '31 May 2025 09:10 AM', status: 'Approved' },
                  { id: 'RPT250504', type: 'Daily Report', by: 'Deepak K', role: 'Pincode Agent', area: 'Trichy', date: '31 May 2025 08:45 AM', status: 'Pending' },
                  { id: 'RPT250505', type: 'Monthly Report', by: 'Vijay R', role: 'Divisional Agent', area: 'Salem', date: '31 May 2025 08:30 AM', status: 'Pending' }
                ].map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/50 text-slate-600 font-bold transition">
                    <td className="p-3 font-mono text-slate-400">{rep.id}</td>
                    <td className="p-3 text-slate-800">{rep.type}</td>
                    <td className="p-3">{rep.by}</td>
                    <td className="p-3 text-[10px] text-slate-450">{rep.role}</td>
                    <td className="p-3 text-slate-500">{rep.area}</td>
                    <td className="p-3 text-slate-450 font-mono">{rep.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rep.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>{rep.status}</span>
                    </td>
                    <td className="p-3 text-center">
                      <Eye className="w-4 h-4 text-slate-400 hover:text-blue-600 cursor-pointer mx-auto transition" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Monthly Revenue Overview</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5 font-sans">₹ 4,78,32,600 Total Revenue, <span className="text-emerald-600">▲ 18.76%</span> vs last month</p>
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" fontSize={9} stroke="#64748b" />
                <YAxis fontSize={9} stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Breakdown panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 w-full text-left mb-2">Reports by Agent Level</h3>
          <div className="h-36 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: 'Pincode Agent', value: 1456, color: '#3b82f6' },
                  { name: 'District Agent', value: 652, color: '#10b981' },
                  { name: 'Divisional Agent', value: 248, color: '#f59e0b' },
                  { name: 'State Agent', value: 100, color: '#8b5cf6' }
                ]} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value">
                  {[
                    { name: 'Pincode Agent', value: 1456, color: '#3b82f6' },
                    { name: 'District Agent', value: 652, color: '#10b981' },
                    { name: 'Divisional Agent', value: 248, color: '#f59e0b' },
                    { name: 'State Agent', value: 100, color: '#8b5cf6' }
                  ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black text-slate-850">2,456</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Total</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Target vs Achievement</h3>
          <div className="space-y-4">
            {[
              { label: 'State Target', val: '₹ 12,00,00,000', pct: 76, color: 'bg-blue-600' },
              { label: 'Revenue Target', val: '₹ 8,50,00,000', pct: 82, color: 'bg-emerald-600' },
              { label: 'Vendor Target', val: '5,000 Vendors', pct: 68, color: 'bg-amber-600' }
            ].map((tgt, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-550">{tgt.label}</span>
                  <span className="text-slate-800">{tgt.pct}%</span>
                </div>
                <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${tgt.color}`} style={{ width: `${tgt.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 w-full text-left mb-2">Government Projects Status</h3>
          <div className="h-36 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: 'Completed', value: 18, color: '#10b981' },
                  { name: 'In Progress', value: 16, color: '#3b82f6' },
                  { name: 'Pending', value: 6, color: '#f59e0b' },
                  { name: 'On Hold', value: 2, color: '#ef4444' }
                ]} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value">
                  {[
                    { name: 'Completed', value: 18, color: '#10b981' },
                    { name: 'In Progress', value: 16, color: '#3b82f6' },
                    { name: 'Pending', value: 6, color: '#f59e0b' },
                    { name: 'On Hold', value: 2, color: '#ef4444' }
                  ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Pending Reports Summary</h3>
          <div className="space-y-3 text-xs font-bold text-slate-650">
            {[
              { type: 'Daily Reports', count: 186 },
              { type: 'Weekly Reports', count: 92 },
              { type: 'Monthly Reports', count: 48 }
            ].map((p, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                <span>{p.type}</span>
                <span className="text-slate-850">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderDaily = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Reports Submitted', val: '186', sub: '+12.5% vs yesterday', color: 'text-blue-600' },
          { label: 'Approved', val: '142', sub: '8.4% vs yesterday', color: 'text-emerald-650' },
          { label: 'Pending', val: '32', sub: '6.7% vs yesterday', color: 'text-amber-600' },
          { label: 'Rejected', val: '12', sub: '2.3% vs yesterday', color: 'text-rose-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
            <span className="text-3xl font-black text-slate-850 mt-1 block">{card.val}</span>
            <span className={`text-[10px] font-bold block mt-1.5 ${card.color}`}>{card.sub}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-850">Daily Activity Logs Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-3">Report ID</th>
                <th className="p-3">Agent Name</th>
                <th className="p-3">Agent Type</th>
                <th className="p-3">District</th>
                <th className="p-3">Area</th>
                <th className="p-3">Submitted On</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: 'DR250521001', name: 'Karthik S', role: 'Pincode Agent', dist: 'Chennai', area: 'T. Nagar', date: '31 May 2025 09:30 AM', status: 'Approved' },
                { id: 'DR250521002', name: 'Monica R', role: 'District Agent', dist: 'Coimbatore', area: 'RS Puram', date: '31 May 2025 09:15 AM', status: 'Approved' },
                { id: 'DR250521003', name: 'Suresh B', role: 'District Agent', dist: 'Madurai', area: 'Anna Nagar', date: '31 May 2025 09:10 AM', status: 'Pending' },
                { id: 'DR250521004', name: 'Deepak K', role: 'Pincode Agent', dist: 'Trichy', area: 'Woraiyur', date: '31 May 2025 08:45 AM', status: 'Pending' },
                { id: 'DR250521005', name: 'Vijay R', role: 'Divisional Agent', dist: 'Salem', area: 'Hasthampatti', date: '31 May 2025 08:28 AM', status: 'Pending' },
                { id: 'DR250521006', name: 'Revathi L', role: 'District Agent', dist: 'Vellore', area: 'Katpadi', date: '31 May 2025 08:05 AM', status: 'Rejected' }
              ].map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 text-slate-600 font-bold transition">
                  <td className="p-3 font-mono text-slate-450">{row.id}</td>
                  <td className="p-3 text-slate-800 font-extrabold">{row.name}</td>
                  <td className="p-3 text-blue-600">{row.role}</td>
                  <td className="p-3 text-slate-550">{row.dist}</td>
                  <td className="p-3 text-slate-500">{row.area}</td>
                  <td className="p-3 text-slate-450 font-mono">{row.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'Approved' ? 'bg-emerald-50 text-emerald-650' : row.status === 'Rejected' ? 'bg-rose-50 text-rose-650' : 'bg-amber-50 text-amber-650'}`}>{row.status}</span>
                  </td>
                  <td className="p-3 text-center">
                    <Eye className="w-4 h-4 text-slate-400 hover:text-blue-600 cursor-pointer mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderWeekly = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Shop Visits', val: '12,348', sub: '+14.6% vs last week', color: 'text-blue-600' },
          { label: 'New Vendors', val: '1,256', sub: '+18.2% vs last week', color: 'text-emerald-600' },
          { label: 'Service Requests', val: '2,134', sub: '+10.1% vs last week', color: 'text-purple-600' },
          { label: 'Revenue Collected', val: '₹ 2,45,32,000', sub: '+16.7% vs last week', color: 'text-blue-650' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block">{card.val}</span>
            <span className={`text-[10px] font-bold block mt-1.5 ${card.color}`}>{card.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Weekly Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: '25 May', Visits: 1800, Vendors: 200 },
                { name: '26 May', Visits: 2100, Vendors: 240 },
                { name: '27 May', Visits: 1950, Vendors: 210 },
                { name: '28 May', Visits: 2400, Vendors: 290 },
                { name: '29 May', Visits: 2200, Vendors: 250 },
                { name: '30 May', Visits: 2600, Vendors: 310 },
                { name: '31 May', Visits: 2800, Vendors: 340 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <Tooltip />
                <Line type="monotone" dataKey="Visits" stroke="#2563eb" name="Shop Visits" strokeWidth={2.5} />
                <Line type="monotone" dataKey="Vendors" stroke="#10b981" name="New Vendors" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Top Performing Districts</h3>
            <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>
          <div className="space-y-4 text-xs font-bold text-slate-650">
            {[
              { dist: 'Chennai', visits: '2,452', vendors: '245' },
              { dist: 'Coimbatore', visits: '1,987', vendors: '198' },
              { dist: 'Madurai', visits: '1,643', vendors: '154' },
              { dist: 'Trichy', visits: '1,256', vendors: '124' },
              { dist: 'Salem', visits: '1,102', vendors: '110' }
            ].map((row, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-800 font-extrabold">{row.dist}</span>
                <div className="text-right">
                  <span className="block text-slate-850">{row.visits} Visits</span>
                  <span className="block text-[10px] text-slate-400">{row.vendors} New Vendors</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderMonthly = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Reports Submitted', val: '2,456', sub: '+10.2% vs last month', color: 'text-blue-600' },
          { label: 'Reports Approved', val: '1,985', sub: '+12.6% vs last month', color: 'text-emerald-600' },
          { label: 'Pending Reports', val: '356', sub: '-5.2% vs last month', color: 'text-amber-600' },
          { label: 'Reports Rejected', val: '115', sub: '+2.1% vs last month', color: 'text-rose-600' },
          { label: 'Approval %', val: '80.84%', sub: '+3.5% vs last month', color: 'text-teal-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block">{card.val}</span>
            <span className={`text-[10px] font-bold block mt-1.5 ${card.color}`}>{card.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800">Monthly Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Metric</th>
                  <th className="p-3">This Month</th>
                  <th className="p-3">Last Month</th>
                  <th className="p-3 text-right">Change %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { metric: 'Shop Visits', val1: '54,321', val2: '46,890', change: '+15.75%', color: 'text-emerald-600' },
                  { name: 'New Vendors', metric: 'New Vendors', val1: '5,420', val2: '4,856', change: '+11.64%', color: 'text-emerald-600' },
                  { metric: 'Revenue Collected', val1: '₹ 4,78,32,600', val2: '₹ 4,32,12,400', change: '+10.74%', color: 'text-emerald-600' },
                  { metric: 'Service Requests', val1: '12,845', val2: '11,876', change: '+8.16%', color: 'text-emerald-600' },
                  { metric: 'Tickets Resolved', val1: '4,356', val2: '3,645', change: '+19.51%', color: 'text-emerald-600' },
                  { metric: 'Target Achieved', val1: '82.47%', val2: '79.32%', change: '+3.15%', color: 'text-emerald-600' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 text-slate-650 font-bold transition">
                    <td className="p-3 text-slate-800 font-extrabold">{row.metric}</td>
                    <td className="p-3 font-mono">{row.val1}</td>
                    <td className="p-3 font-mono text-slate-500">{row.val2}</td>
                    <td className={`p-3 text-right font-mono font-black ${row.color}`}>{row.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-850 mb-4">Revenue Trend (Monthly)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Jan', value: 2.8 }, { name: 'Feb', value: 3.2 }, { name: 'Mar', value: 3.5 },
                { name: 'Apr', value: 4.3 }, { name: 'May', value: 4.7 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" name="Revenue (Cr)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );

  const renderAgent = () => (
    <>
      {/* Selector tabs for level */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest gap-4 pb-2">
        {['Overview', 'Divisional Agents', 'District Agents', 'Pincode Agents'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedAgentLevel(lvl)}
            className={`pb-1 transition select-none ${selectedAgentLevel === lvl ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-700'}`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents', val: '7,856', color: 'bg-blue-50 border-blue-100 text-blue-600' },
          { label: 'Active Agents', val: '7,456', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
          { label: 'Inactive Agents', val: '285', color: 'bg-rose-50 border-rose-100 text-rose-600' },
          { label: 'New Agents (This Month)', val: '145', color: 'bg-indigo-50 border-indigo-100 text-indigo-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
              <p className="text-2xl font-black text-slate-850 mt-1">{card.val}</p>
            </div>
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${card.color}`}>
              <Users className="w-5.5 h-5.5" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800">Agent Performance by Level</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Level</th>
                  <th className="p-3">Total Agents</th>
                  <th className="p-3">Active</th>
                  <th className="p-3">Inactive</th>
                  <th className="p-3">New This Month</th>
                  <th className="p-3 text-right">Target Achieved %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { level: 'Divisional Agents', total: 42, active: 40, inactive: 2, newText: '3', pct: '82.14%' },
                  { level: 'District Agents', total: 512, active: 486, inactive: 26, newText: '18', pct: '81.38%' },
                  { level: 'Pincode Agents', total: 7302, active: 6930, inactive: 257, newText: '124', pct: '77.85%' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 text-slate-650 font-bold transition">
                    <td className="p-3 text-slate-800 font-extrabold">{row.level}</td>
                    <td className="p-3 font-mono">{row.total}</td>
                    <td className="p-3 font-mono text-slate-500">{row.active}</td>
                    <td className="p-3 font-mono text-slate-450">{row.inactive}</td>
                    <td className="p-3 font-mono text-blue-600">{row.newText}</td>
                    <td className="p-3 text-right font-mono font-black text-emerald-650">{row.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-850 mb-4 font-sans">Agent Performance Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Jan', value: 72 }, { name: 'Feb', value: 75 }, { name: 'Mar', value: 78 },
                { name: 'Apr', value: 80 }, { name: 'May', value: 82 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2.5} name="Target Achieved %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );

  const renderVendor = () => (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Vendors', val: '28,456', color: 'text-blue-600' },
          { label: 'Active Vendors', val: '24,356', color: 'text-emerald-600' },
          { label: 'Inactive Vendors', val: '2,845', color: 'text-rose-600' },
          { label: 'New Vendors', val: '1,255', color: 'text-indigo-650' },
          { label: 'Renewals', val: '3,245', color: 'text-purple-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block">{card.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendors by Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 w-full text-left mb-2">Vendors by Status</h3>
          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: 'Active', value: 24356, color: '#10b981' },
                  { name: 'Inactive', value: 2845, color: '#ef4444' },
                  { name: 'Pending', value: 1255, color: '#f59e0b' }
                ]} cx="50%" cy="50%" innerRadius={50} outerRadius={68} paddingAngle={4} dataKey="value">
                  {[
                    { name: 'Active', value: 24356, color: '#10b981' },
                    { name: 'Inactive', value: 2845, color: '#ef4444' },
                    { name: 'Pending', value: 1255, color: '#f59e0b' }
                  ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Top Categories</h3>
            <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>
          <div className="space-y-3.5 text-xs font-bold text-slate-650">
            {[
              { cat: 'Retail Shops', count: '8,456' },
              { cat: 'Service Centers', count: '6,245' },
              { cat: 'Restaurants', count: '4,356' },
              { cat: 'Supermarkets', count: '3,656' },
              { cat: 'Others', count: '5,743' }
            ].map((row, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-850 font-extrabold">{row.cat}</span>
                <span className="text-slate-850">{row.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Renewal Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 mb-4">Renewal This Month</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full border-8 border-slate-100 flex items-center justify-center flex-col">
              <span className="text-xl font-black text-slate-850">68.45%</span>
              <span className="text-[10px] text-blue-600 font-bold uppercase mt-0.5">Renewed</span>
            </div>
            <span className="text-[11px] text-slate-400 font-bold text-center mt-4">3,245 total subscriptions due for renewal</span>
          </div>
        </div>
      </div>
    </>
  );

  const renderRevenue = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', val: '₹ 4,78,32,600', sub: '+12.5% vs last month', color: 'text-blue-600' },
          { label: 'Subscription Revenue', val: '₹ 3,24,45,200', sub: '67.8% of total', color: 'text-emerald-600' },
          { label: 'Service Revenue', val: '₹ 56,43,300', sub: '11.8% of total', color: 'text-purple-600' },
          { label: 'Other Revenue', val: '₹ 97,44,100', sub: '20.4% of total', color: 'text-blue-650' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block">{card.val}</span>
            <span className="text-[10px] text-slate-400 font-bold block mt-1.5">{card.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-855 mb-4">Revenue Over Time</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: '01 May', value: 1200000 }, { name: '06 May', value: 1500000 },
                { name: '11 May', value: 1350000 }, { name: '16 May', value: 1800000 },
                { name: '21 May', value: 1700000 }, { name: '26 May', value: 2100000 },
                { name: '31 May', value: 2453200 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2.5} name="Revenue (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-850 mb-4">Revenue by Level</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={[
                { name: 'Pincode Agents', value: 245 },
                { name: 'District Agents', value: 135 },
                { name: 'Divisional Agents', value: 82 },
                { name: 'Others', value: 15 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={9} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" name="Revenue (Lakhs)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );

  const renderGov = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Projects', val: '42' },
          { label: 'Active Projects', val: '18' },
          { label: 'Completed Projects', val: '16' },
          { label: 'Pending Projects', val: '6' },
          { label: 'On Hold Projects', val: '2' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block">{card.val}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-850">Government Projects Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-3">Project ID</th>
                <th className="p-3">Project Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">District</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Progress</th>
                <th className="p-3 text-right">Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: 'GPR25001', name: 'Smart City Initiative', dept: 'Municipal Admin', dist: 'Chennai', start: '01 Apr 2024', end: '31 Dec 2025', status: 'Active', prog: '72%', budget: '₹ 1,20,00,000' },
                { id: 'GPR25002', name: 'Clean Water Project', dept: 'PWD', dist: 'Coimbatore', start: '15 May 2024', end: '30 Nov 2025', status: 'Active', prog: '60%', budget: '₹ 85,00,000' },
                { id: 'GPR25003', name: 'Health Camp Program', dept: 'Health Dept', dist: 'Madurai', start: '01 Mar 2025', end: '30 Jun 2025', status: 'Active', prog: '45%', budget: '₹ 45,00,000' },
                { id: 'GPR25004', name: 'School Digitization', dept: 'Education Dept', dist: 'Trichy', start: '10 Jun 2024', end: '15 May 2025', status: 'Active', prog: '90%', budget: '₹ 65,00,000' },
                { id: 'GPR25005', name: 'Street Light Installation', dept: 'Electricity', dist: 'Salem', start: '01 Jan 2025', end: '31 Aug 2025', status: 'Completed', prog: '100%', budget: '₹ 25,00,000' },
                { id: 'GPR25006', name: 'Waste Management', dept: 'Municipal Admin', dist: 'Vellore', start: '01 Jun 2025', end: '31 Dec 2026', status: 'Active', prog: '20%', budget: '₹ 55,00,000' }
              ].map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 text-slate-650 font-bold transition">
                  <td className="p-3 font-mono text-slate-400">{row.id}</td>
                  <td className="p-3 text-slate-800 font-extrabold">{row.name}</td>
                  <td className="p-3 text-slate-600">{row.dept}</td>
                  <td className="p-3 text-slate-550">{row.dist}</td>
                  <td className="p-3 text-slate-450 font-mono">{row.start}</td>
                  <td className="p-3 text-slate-450 font-mono">{row.end}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'Completed' ? 'bg-emerald-50 text-emerald-650' : 'bg-blue-50 text-blue-650'}`}>{row.status}</span>
                  </td>
                  <td className="p-3 text-blue-600 font-black">{row.prog}</td>
                  <td className="p-3 text-right text-slate-800 font-black">{row.budget}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderTarget = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Target', val: '₹ 12,00,00,000', color: 'text-blue-600' },
          { label: 'Achieved', val: '₹ 9,78,45,200', color: 'text-emerald-600' },
          { label: 'Achievement %', val: '82.47%', color: 'text-indigo-650' },
          { label: 'Remaining Target', val: '₹ 2,21,54,800', color: 'text-rose-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block">{card.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-850">Target vs Achievement by Level</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Level</th>
                  <th className="p-3">Target (₹)</th>
                  <th className="p-3">Achieved (₹)</th>
                  <th className="p-3">Achievement %</th>
                  <th className="p-3 text-right">Remaining (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { lvl: 'Divisional Agents', tgt: '₹ 4,00,00,000', ach: '₹ 3,45,21,600', pct: '82.91%', rem: '₹ 54,78,400' },
                  { lvl: 'District Agents', tgt: '₹ 4,50,00,000', ach: '₹ 3,25,32,100', pct: '72.30%', rem: '₹ 1,24,67,900' },
                  { lvl: 'Pincode Agents', tgt: '₹ 2,30,00,000', ach: '₹ 2,17,48,500', pct: '94.55%', rem: '₹ 12,51,500' },
                  { lvl: 'Others', tgt: '₹ 1,20,00,000', ach: '₹ 90,43,000', pct: '75.35%', rem: '₹ 29,57,000' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 text-slate-655 font-bold transition">
                    <td className="p-3 text-slate-800 font-extrabold">{row.lvl}</td>
                    <td className="p-3 font-mono">{row.tgt}</td>
                    <td className="p-3 font-mono text-slate-500">{row.ach}</td>
                    <td className="p-3 font-mono font-black text-emerald-600">{row.pct}</td>
                    <td className="p-3 text-right font-mono font-black text-slate-700">{row.rem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-850 mb-4 font-sans">Achievement Trend (%)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Jan', value: 72 }, { name: 'Feb', value: 75 }, { name: 'Mar', value: 78 },
                { name: 'Apr', value: 80 }, { name: 'May', value: 82.47 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} name="Achievement %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );

  const renderSupport = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Tickets', val: '5,432', color: 'text-blue-600' },
          { label: 'Resolved', val: '4,356', color: 'text-emerald-600' },
          { label: 'Pending', val: '876', color: 'text-amber-600' },
          { label: 'Escalated', val: '200', color: 'text-rose-600' },
          { label: 'Avg. Resolution Time', val: '18.6 hrs', color: 'text-teal-650' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
            <span className="text-2xl font-black text-slate-850 mt-1 block">{card.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets by Type */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 w-full text-left mb-2">Tickets by Type</h3>
          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: 'Customer Queries', value: 2456, color: '#3b82f6' },
                  { name: 'Vendor Queries', value: 1876, color: '#10b981' },
                  { name: 'Complaints', value: 876, color: '#f59e0b' },
                  { name: 'Others', value: 224, color: '#8b5cf6' }
                ]} cx="50%" cy="50%" innerRadius={50} outerRadius={68} paddingAngle={4} dataKey="value">
                  {[
                    { name: 'Customer Queries', value: 2456, color: '#3b82f6' },
                    { name: 'Vendor Queries', value: 1876, color: '#10b981' },
                    { name: 'Complaints', value: 876, color: '#f59e0b' },
                    { name: 'Others', value: 224, color: '#8b5cf6' }
                  ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tickets Status Over Time Area Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-855 mb-4">Tickets Status Over Time</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'May 01', Resolved: 400, Pending: 100, Escalated: 20 },
                { name: 'May 06', Resolved: 480, Pending: 120, Escalated: 25 },
                { name: 'May 11', Resolved: 520, Pending: 110, Escalated: 18 },
                { name: 'May 16', Resolved: 600, Pending: 140, Escalated: 30 },
                { name: 'May 21', Resolved: 580, Pending: 130, Escalated: 22 },
                { name: 'May 26', Resolved: 670, Pending: 150, Escalated: 35 },
                { name: 'May 31', Resolved: 720, Pending: 120, Escalated: 28 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <Tooltip />
                <Area type="monotone" dataKey="Resolved" stackId="1" stroke="#10b981" fill="#ecfdf5" />
                <Area type="monotone" dataKey="Pending" stackId="1" stroke="#f59e0b" fill="#fffbeb" />
                <Area type="monotone" dataKey="Escalated" stackId="1" stroke="#ef4444" fill="#fef2f2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Reports Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">View, analyze and export reports across the state.</p>
        </div>
        <div className="flex items-center gap-3 font-bold text-xs">
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 flex items-center gap-2">
            <CalIcon className="w-4 h-4 text-slate-400" />
            <span>01 May 2025 - 31 May 2025</span>
          </div>
          <button className="bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-slate-700 flex items-center gap-1.5 hover:bg-slate-50">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter</span>
          </button>
          {user?.role !== 'Admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-md transition"
            >
              Generate Report
            </button>
          )}
        </div>
      </div>

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'daily' && renderDaily()}
      {activeTab === 'weekly' && renderWeekly()}
      {activeTab === 'monthly' && renderMonthly()}
      {activeTab === 'agent' && renderAgent()}
      {activeTab === 'vendor' && renderVendor()}
      {activeTab === 'revenue' && renderRevenue()}
      {activeTab === 'gov' && renderGov()}
      {activeTab === 'target' && renderTarget()}
      {activeTab === 'support' && renderSupport()}
      {activeTab === 'export' && <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm font-bold text-slate-400 text-center">Consolidated export center download page.</div>}

      {/* Creation Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Generate Report</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-2.5 rounded-lg flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReport} className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div>
                <label className="block mb-1.5">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily Activity Log - May 31"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-850 px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 font-bold"
                  >
                    <option value="Daily Report">Daily Report</option>
                    <option value="Weekly Report">Weekly Report</option>
                    <option value="Monthly Report">Monthly Report</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5">Upload Document (Optional)</label>
                  <input
                    type="file"
                    id="report-document-file"
                    onChange={(e) => setDocumentFile(e.target.files[0])}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-2 py-1.5 rounded-lg outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5">Content Summary</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your activities, targets achieved, vendor queries solved..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg mt-3 uppercase tracking-widest text-xs transition duration-200"
              >
                {submitting ? 'Generating...' : 'Save & Submit'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;
