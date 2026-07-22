import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Plus, ShieldAlert, Check, X, Phone, Mail, Compass, MapPin, Store,
  FileCheck, FileText, Upload, Clock, Settings, Search, Filter, Edit2, Eye,
  RefreshCw, MoreVertical, Download, Send, Layers, BarChart2, Info, Bell, Briefcase
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import api from '../../services/api.js';

const PincodeAgents = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [dbAgents, setDbAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedPincode, setSelectedPincode] = useState('All Pincodes');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPerformance, setSelectedPerformance] = useState('All');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [stateName, setStateName] = useState('Tamil Nadu');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetchAgents();
    if (user?.agentInfo) {
      setStateName(user.agentInfo.state || 'Tamil Nadu');
      setDivision(user.agentInfo.division || '');
      setDistrict(user.agentInfo.district || '');
    }
  }, [user]);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/api/agents');
      const assignedDistrict = user?.agentInfo?.district || user?.district || 'Salem District';
      const districtRegex = new RegExp(assignedDistrict.replace(/District/i, '').trim(), 'i');

      const filtered = response.data.filter(a => {
        if (a.role !== 'Pincode Agent') return false;
        if (user?.role === 'District Agent' && a.district && !districtRegex.test(a.district)) return false;
        return true;
      });

      setDbAgents(filtered);

      const formattedDb = filtered.map((agent, index) => ({
        _id: agent._id || `DB_PAG_${index}`,
        name: agent.name,
        division: agent.division || 'Unassigned',
        district: agent.district || assignedDistrict,
        pincode: agent.pincode || 'Unassigned',
        customers: '0',
        performance: 100,
        status: agent.status || 'Active',
        phone: agent.phone || 'N/A',
        user: { email: agent.user?.email || '' }
      }));

      setAgents(formattedDb);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (agentId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setAgents(prev => prev.map(a => a._id === agentId ? { ...a, status: newStatus } : a));

    const dbAgent = dbAgents.find(a => a._id === agentId);
    if (dbAgent) {
      try {
        await api.patch(`/api/agents/${agentId}/status`, { status: newStatus });
        fetchAgents();
      } catch (err) {
        console.error('Error toggling status in DB:', err);
      }
    }
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/api/agents', {
        email,
        password,
        name,
        phone,
        state: stateName || user?.agentInfo?.state || 'Tamil Nadu',
        division: division || user?.agentInfo?.division || 'Chennai Division',
        district: district || user?.agentInfo?.district || 'Coimbatore District',
        pincode,
      });

      setSuccess('Pincode Agent created successfully!');
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
      setPincode('');
      
      fetchAgents();
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create Pincode Agent');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agent.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.pincode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDivision = selectedDivision === 'All Divisions' || agent.division === selectedDivision;
    const matchesDistrict = selectedDistrict === 'All Districts' || agent.district === selectedDistrict;
    const matchesPincode = selectedPincode === 'All Pincodes' || agent.pincode === selectedPincode;
    const matchesStatus = selectedStatus === 'All Status' || agent.status === selectedStatus;
    
    let matchesPerf = true;
    if (selectedPerformance === 'High (>90%)') {
      matchesPerf = agent.performance > 90;
    } else if (selectedPerformance === 'Average (80-90%)') {
      matchesPerf = agent.performance >= 80 && agent.performance <= 90;
    }

    return matchesSearch && matchesDivision && matchesDistrict && matchesPincode && matchesStatus && matchesPerf;
  });

  // Recharts mock datasets
  const distPieData = [
    { name: 'Chennai', value: 820, color: '#3b82f6' },
    { name: 'Coimbatore', value: 650, color: '#10b981' },
    { name: 'Madurai', value: 580, color: '#f59e0b' },
    { name: 'Trichy', value: 450, color: '#ec4899' },
    { name: 'Salem', value: 356, color: '#8b5cf6' }
  ];

  const assistedTrendData = [
    { name: 'Jan', value: 20000 },
    { name: 'Feb', value: 45000 },
    { name: 'Mar', value: 75000 },
    { name: 'Apr', value: 125000 },
    { name: 'May', value: 185230 }
  ];

  const performanceBarData = [
    { name: '600001', Performance: 97 },
    { name: '641002', Performance: 93 },
    { name: '625001', Performance: 91 },
    { name: '620001', Performance: 88 },
    { name: '636001', Performance: 85 }
  ];

  const queryStatusData = [
    { name: 'Resolved', value: 1850, color: '#10b981' },
    { name: 'Pending', value: 450, color: '#f59e0b' },
    { name: 'Rejected', value: 158, color: '#ef4444' }
  ];

  const totalAgentsCount = agents.length;
  const activeAgentsCount = agents.filter(a => a.status === 'Active' || a.status === 'Approved').length;
  const pendingAgentsCount = agents.filter(a => a.status === 'Pending').length;
  const inactiveAgentsCount = agents.filter(a => a.status === 'Inactive').length;
  const totalVendorsCount = agents.reduce((sum, a) => sum + (Number(String(a.customers || 0).replace(/,/g, '')) || 0), 0).toLocaleString();
  const totalRevenueCount = agents.length > 0 ? `₹ ${(agents.length * 0.8).toFixed(2)} Cr` : '₹ 0 Cr';

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800">Pincode Agent Management</h1>
            <Info className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Manage and monitor all Pincode level agents assigned to your areas.</p>
        </div>
      </div>

      {/* Grid of 6 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total Pincode Agents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Agents</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">{totalAgentsCount}</p>
            <span onClick={() => { setSelectedDivision('All Divisions'); setSelectedDistrict('All Districts'); setSelectedPincode('All Pincodes'); setSelectedStatus('All Status'); }} className="text-xs text-blue-500 hover:underline cursor-pointer font-bold block mt-1">View all agents</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        {/* Active Agents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Agents</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">{activeAgentsCount}</p>
            <span onClick={() => setSelectedStatus('Active')} className="text-xs text-emerald-500 hover:underline cursor-pointer font-bold block mt-1">View active agents</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Approval</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">{pendingAgentsCount}</p>
            <span onClick={() => navigate('/reports')} className="text-xs text-amber-500 hover:underline cursor-pointer font-bold block mt-1">View pending</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Inactive Agents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Inactive Agents</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">{inactiveAgentsCount}</p>
            <span onClick={() => setSelectedStatus('Inactive')} className="text-xs text-rose-500 hover:underline cursor-pointer font-bold block mt-1">View inactive</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Vendors Assisted */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Vendors Assisted</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">{totalVendorsCount}</p>
            <span onClick={() => navigate('/vendor-management')} className="text-xs text-purple-500 hover:underline cursor-pointer font-bold block mt-1">View assisted vendors</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">{totalRevenueCount}</p>
            <span onClick={() => navigate('/performance')} className="text-xs text-teal-500 hover:underline cursor-pointer font-bold block mt-1">View revenue</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 text-base font-black shrink-0">
            ₹
          </div>
        </div>

      </div>

      {/* Main row layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side elements: Filters + table */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Pincode or Agent Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-blue-500 font-medium transition"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-bold">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none"
              >
                <option value="All Divisions">All Divisions</option>
                <option value="Chennai Division">Chennai Division</option>
                <option value="Coimbatore Division">Coimbatore Division</option>
                <option value="Madurai Division">Madurai Division</option>
              </select>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none"
              >
                <option value="All Districts">All Districts</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Madurai">Madurai</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button onClick={() => navigate('/reports')} className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-3.5 py-2 transition font-bold">
                <Download className="w-4 h-4 text-slate-500" /> Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Pincode Agents List</h3>
              <span className="text-xs font-bold text-slate-400">Total: {filteredAgents.length} Agents</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Agent ID</th>
                    <th className="p-4">Agent Name</th>
                    <th className="p-4">Division</th>
                    <th className="p-4">District</th>
                    <th className="p-4">Pincode</th>
                    <th className="p-4">Vendors</th>
                    <th className="p-4">Performance</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAgents.map((agent) => (
                    <tr key={agent._id} className="hover:bg-slate-50/50 text-slate-600 font-bold transition">
                      <td className="p-4 font-mono text-slate-400">{agent._id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-blue-600 text-xs shrink-0">
                            {agent.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-slate-800 font-extrabold block">{agent.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium block">{agent.user?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 font-semibold">{agent.division}</td>
                      <td className="p-4 text-slate-700">{agent.district}</td>
                      <td className="p-4 font-mono text-slate-800 font-bold">{agent.pincode}</td>
                      <td className="p-4 text-slate-500">{agent.customers}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 min-w-[80px]">
                          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${agent.performance}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-700">{agent.performance}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          onClick={() => handleStatusToggle(agent._id, agent.status)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border cursor-pointer select-none transition ${
                            agent.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                          }`}
                        >
                          {agent.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2 text-slate-400">
                          <button className="hover:text-blue-600 transition" title="Edit Agent">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="hover:text-emerald-600 transition" title="View Profile">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="hover:text-purple-600 transition" title="Switch Pincode">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button className="hover:text-slate-600 transition" title="More Options">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-slate-500">
              <span>Showing 1 to {filteredAgents.length} of {filteredAgents.length} entries</span>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100">&lt;</button>
                <button className="px-2.5 py-1 rounded bg-blue-600 text-white">1</button>
                <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100">2</button>
                <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100">3</button>
                <button className="px-2 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100">&gt;</button>
                <select className="bg-white border border-slate-200 rounded px-1.5 py-1 outline-none text-slate-600 ml-2">
                  <option>5 / page</option>
                  <option>10 / page</option>
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* Right column */}
        <div className="space-y-6">
          


          {/* Recent Activities */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Recent Activities</h3>
              <span onClick={() => navigate('/notifications')} className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-4">
              {[
                { text: 'New Pincode Agent Ramesh K registered', time: '16 May 2025, 10:30 AM', color: 'bg-blue-500' },
                { text: 'Shop registration report submitted by Salem Pincode', time: '15 May 2025, 04:15 PM', color: 'bg-emerald-500' },
                { text: 'Customer query resolved in Madurai Pincode', time: '15 May 2025, 02:45 PM', color: 'bg-indigo-500' },
                { text: 'New shop registration verified in Coimbatore', time: '14 May 2025, 11:20 AM', color: 'bg-amber-500' }
              ].map((a, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${a.color}`}></div>
                  <div>
                    <p className="font-bold text-slate-700 leading-snug">{a.text}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Row 4: Charts breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Agent by District Doughnut */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Agent by District</h3>
            <span onClick={() => navigate('/analytics')} className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">View All</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[180px] relative">
            <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center flex-col">
              <span className="text-lg font-black text-slate-800">2,856</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Agents</span>
            </div>
            
            <div className="w-full grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 mt-4 border-t border-slate-50 pt-3">
              {distPieData.map((d, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span>{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vendors Assisted Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Vendors Assisted</h3>
            <span onClick={() => navigate('/vendor-management')} className="text-xs text-emerald-600 font-bold cursor-pointer hover:underline">▲ 15.3%</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={assistedTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={9} stroke="#64748b" />
                <YAxis fontSize={9} stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Pincodes */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Top Performing Pincodes</h3>
              <span onClick={() => navigate('/performance')} className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-4">
              {[
                { pin: '600001', rate: 97 },
                { pin: '641002', rate: 93 },
                { pin: '625001', rate: 91 },
                { pin: '620001', rate: 88 },
                { pin: '636001', rate: 85 }
              ].map((p, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-700">{idx+1}. Pin {p.pin}</span>
                    <span className="text-slate-800">{p.rate}%</span>
                  </div>
                  <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${p.rate}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Overview (Bar Chart) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Performance Overview</h3>
            <span onClick={() => navigate('/performance')} className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={9} stroke="#64748b" />
                <YAxis fontSize={9} stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="Performance" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 5: Maps, Query status, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pincode Map */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Pincode Map</h3>
            <span onClick={() => navigate('/analytics')} className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View Map</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] relative">
            <svg viewBox="0 0 100 100" className="w-28 h-28 text-blue-500/20 drop-shadow">
              <path d="M40,10 C50,15 65,10 70,25 C75,40 68,55 80,65 C92,75 85,85 70,90 C55,95 40,88 30,80 C20,72 15,55 25,40 C35,25 30,15 40,10 Z" fill="currentColor" stroke="#fff" strokeWidth="1.5" />
              <circle cx="48" cy="28" r="3.5" fill="#10b981" />
              <circle cx="58" cy="42" r="3.5" fill="#3b82f6" />
              <circle cx="38" cy="62" r="3.5" fill="#f59e0b" />
            </svg>
            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-bold text-slate-500 mt-4 border-t border-slate-50 pt-3">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Active (2,543)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                <span>Inactive (159)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span>Pending (154)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Query Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Query Status</h3>
            <span onClick={() => navigate('/reports')} className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px]">
            <div className="w-28 h-28 rounded-full border-8 border-slate-100 flex items-center justify-center flex-col">
              <span className="text-lg font-black text-slate-800">2,458</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
            </div>
            <div className="w-full grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-500 mt-4 border-t border-slate-50 pt-3">
              {queryStatusData.map((q, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <span className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: q.color }}></span>
                  <span className="block">{q.name}</span>
                  <span className="block text-slate-800 font-extrabold">{q.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            
            <button onClick={() => setSelectedPincode('All Pincodes')} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2.5 group">
              <Layers className="w-5.5 h-5.5 text-emerald-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Assign Pincode</span>
            </button>
            <button onClick={() => navigate('/reports')} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2.5 group">
              <FileCheck className="w-5.5 h-5.5 text-purple-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Generate Report</span>
            </button>
            <button onClick={() => navigate('/divisional-agents')} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2.5 group">
              <Users className="w-5.5 h-5.5 text-rose-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">View All Agents</span>
            </button>
          </div>
        </div>

      </div>

      {/* Creation Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Create Pincode Agent</h3>
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

            <form onSubmit={handleCreateAgent} className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div>
                <label className="block mb-1.5">Agent Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh G."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Email ID</label>
                  <input
                    type="email"
                    required
                    placeholder="suresh@agent.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 lowercase"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="641001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1.5">District</label>
                  <input
                    type="text"
                    disabled
                    value={district || user?.agentInfo?.district || 'Coimbatore District'}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-400 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Division</label>
                  <input
                    type="text"
                    disabled
                    value={division || user?.agentInfo?.division || 'Chennai Division'}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-400 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">State</label>
                  <input
                    type="text"
                    disabled
                    value={stateName || user?.agentInfo?.state || 'Tamil Nadu'}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-400 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg mt-3 uppercase tracking-widest text-xs transition duration-200"
              >
                {submitting ? 'Registering agent...' : 'Save Agent'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PincodeAgents;
