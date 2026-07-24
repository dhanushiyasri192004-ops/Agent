import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Users, Plus, ShieldAlert, Check, X, Phone, Mail, Compass, MapPin, Store,
  FileCheck, FileText, Upload, Clock, Settings, Search, Filter, Edit2, Eye,
  RefreshCw, MoreVertical, Download, Send, Layers, BarChart2, Info, Bell, Briefcase, Trash2, ChevronRight, ChevronDown
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import api from '../../services/api.js';

const DistrictAgents = () => {
  const { user } = useSelector((state) => state.auth);
  const [dbAgents, setDbAgents] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedAgentId, setExpandedAgentId] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [viewingAgent, setViewingAgent] = useState(null);
  const [editingAgent, setEditingAgent] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editDivision, setEditDivision] = useState('');

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.patch(`/api/agents/${editingAgent._id}`, {
        name: editName,
        phone: editPhone,
        district: editDistrict,
        division: editDivision,
      });
      setSuccess('Agent details updated successfully!');
      fetchAgents();
      setTimeout(() => {
        setEditingAgent(null);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update agent');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Agent ID', 'Agent Name', 'Email', 'Phone', 'Division', 'District', 'Status', 'Performance'];
    const rows = filteredAgents.map(a => [
      a._id,
      a.name,
      a.user?.email || '',
      a.phone,
      a.division,
      a.district,
      a.status,
      `${a.performance}%`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `District_Agents_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock data matching the district agent mockup image
  const initialMockAgents = [
    {
      _id: 'DAG001',
      name: 'Karthik M',
      division: 'Chennai Division',
      district: 'Chennai',
      customers: '2,540',
      queries: 42,
      tieups: 38,
      performance: 97,
      status: 'Active',
      phone: '9876543220',
      user: { email: 'karthik@agent.com' }
    },
    {
      _id: 'DAG001_2',
      name: 'Ramesh K',
      division: 'Chennai Division',
      district: 'Chengalpattu',
      customers: '1,850',
      queries: 35,
      tieups: 30,
      performance: 92,
      status: 'Active',
      phone: '9876543225',
      user: { email: 'ramesh_k@agent.com' }
    },
    {
      _id: 'DAG001_3',
      name: 'Suresh Kumar',
      division: 'Chennai Division',
      district: 'Kanchipuram',
      customers: '1,200',
      queries: 28,
      tieups: 25,
      performance: 89,
      status: 'Active',
      phone: '9876543226',
      user: { email: 'suresh_kanchi@agent.com' }
    },
    {
      _id: 'DAG001_4',
      name: 'Vijay Anand',
      division: 'Chennai Division',
      district: 'Tiruvallur',
      customers: '900',
      queries: 22,
      tieups: 20,
      performance: 86,
      status: 'Active',
      phone: '9876543227',
      user: { email: 'vijay_tiru@agent.com' }
    },
    {
      _id: 'DAG002',
      name: 'Prakash B',
      division: 'Coimbatore Division',
      district: 'Coimbatore',
      customers: '1,870',
      queries: 35,
      tieups: 29,
      performance: 93,
      status: 'Active',
      phone: '9876543221',
      user: { email: 'prakash_d@agent.com' }
    },
    {
      _id: 'DAG003',
      name: 'Meena R',
      division: 'Madurai Division',
      district: 'Madurai',
      customers: '1,650',
      queries: 28,
      tieups: 31,
      performance: 91,
      status: 'Active',
      phone: '9876543222',
      user: { email: 'meena_r@agent.com' }
    },
    {
      _id: 'DAG004',
      name: 'Suresh T',
      division: 'Trichy Division',
      district: 'Trichy',
      customers: '1,320',
      queries: 31,
      tieups: 21,
      performance: 88,
      status: 'Active',
      phone: '9876543223',
      user: { email: 'suresh_t@agent.com' }
    },
    {
      _id: 'DAG005',
      name: 'Senthil Kumar',
      division: 'Salem Division',
      district: 'Salem',
      customers: '1,180',
      queries: 22,
      tieups: 18,
      performance: 85,
      status: 'Inactive',
      phone: '9876543224',
      user: { email: 'senthil_k@agent.com' }
    }
  ];

  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetchAgents();
    if (user?.agentInfo) {
      setStateName(user.agentInfo.state || 'Tamil Nadu');
      setDivision(user.agentInfo.division || '');
      if (user.role === 'Divisional Agent') {
        setSelectedDivision(user.agentInfo.division);
      }
    }
  }, [user]);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/api/agents');
      const rawAgents = response.data || [];
      setAllAgents(rawAgents);
      const filtered = rawAgents.filter(a => a.role === 'District Agent');

      setDbAgents(filtered);

      let allShops = [];
      try {
        const shopsResponse = await api.get('/api/shops');
        if (Array.isArray(shopsResponse.data)) {
          allShops = shopsResponse.data;
        }
      } catch (err) {
        console.error('Error fetching shops for count:', err);
      }

      const formattedDb = filtered.map((agent, index) => {
        const agentShopsCount = allShops.filter(shop => {
          const shopDist = shop?.district || '';
          const agentDist = agent?.district || '';
          return shopDist.toLowerCase().trim() === agentDist.toLowerCase().trim();
        }).length;

        return {
          _id: agent._id || `DB_DAG_${index}`,
          name: agent.name,
          role: agent.role || 'District Agent',
          division: agent.division || 'Unassigned',
          district: agent.district || 'Unassigned District',
          pincode: agent.pincode || '',
          state: agent.state || 'Tamil Nadu',
          customers: agentShopsCount.toLocaleString(),
          queries: 0,
          tieups: agentShopsCount,
          performance: 100,
          status: agent.status || 'Active',
          phone: agent.phone || 'N/A',
          user: { email: agent.user?.email || '' }
        };
      });

      setAgents(formattedDb);
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm('Are you sure you want to permanently delete this agent from the database?')) return;
    try {
      await api.delete(`/api/agents/${agentId}`);
      fetchAgents();
    } catch (err) {
      console.error('Error deleting agent:', err);
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
        district,
      });

      setSuccess('District Agent created successfully!');
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
      setDistrict('');
      
      fetchAgents();
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create District Agent');
    } finally {
      setSubmitting(false);
    }
  };

  // Filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agent.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDivision = selectedDivision === 'All Divisions' || agent.division === selectedDivision;
    const matchesDistrict = selectedDistrict === 'All Districts' || agent.district === selectedDistrict;
    const matchesStatus = selectedStatus === 'All Status' || agent.status === selectedStatus;
    
    let matchesPerf = true;
    if (selectedPerformance === 'High (>90%)') {
      matchesPerf = agent.performance > 90;
    } else if (selectedPerformance === 'Average (80-90%)') {
      matchesPerf = agent.performance >= 80 && agent.performance <= 90;
    }

    return matchesSearch && matchesDivision && matchesDistrict && matchesStatus && matchesPerf;
  });

  const pendingApprovalsList = [
    { name: 'Rajesh Kumar', info: 'Chennai Division - Chengalpattu District', division: 'Chennai Division', date: 'Submitted on 16 May 2025' },
    { name: 'Sathish P', info: 'Coimbatore Division - Tirupur District', division: 'Coimbatore Division', date: 'Submitted on 15 May 2025' },
    { name: 'Karthikeyan M', info: 'Madurai Division - Sivaganga District', division: 'Madurai Division', date: 'Submitted on 14 May 2025' },
    { name: 'Naveen R', info: 'Trichy Division - Ariyalur District', division: 'Trichy Division', date: 'Submitted on 14 May 2025' }
  ];

  const filteredPending = user?.role === 'Divisional Agent' && user?.agentInfo?.division
    ? pendingApprovalsList.filter(p => p.division === user.agentInfo.division)
    : pendingApprovalsList;

  const recentActivitiesList = [
    { text: 'New District Agent Karthik M registered', time: '16 May 2025, 10:30 AM', color: 'bg-blue-500', division: 'Chennai Division' },
    { text: 'Business tie-up added in Chennai District', time: '15 May 2025, 04:15 PM', color: 'bg-emerald-500', division: 'Chennai Division' },
    { text: 'Vendor query resolved in Coimbatore District', time: '15 May 2025, 02:45 PM', color: 'bg-indigo-500', division: 'Coimbatore Division' },
    { text: 'District report submitted by Madurai District Agent', time: '14 May 2025, 11:20 AM', color: 'bg-amber-500', division: 'Madurai Division' },
    { text: 'New Pincode Agent assigned in Salem District', time: '14 May 2025, 09:30 AM', color: 'bg-rose-500', division: 'Salem Division' }
  ];

  const filteredActivities = user?.role === 'Divisional Agent' && user?.agentInfo?.division
    ? recentActivitiesList.filter(a => a.division === user.agentInfo.division)
    : recentActivitiesList;

  const totalAgentsCount = agents.length;
  const activeAgentsCount = agents.filter(a => a.status === 'Active' || a.status === 'Approved').length;
  const pendingAgentsCount = agents.filter(a => a.status === 'Pending').length;
  const inactiveAgentsCount = agents.filter(a => a.status === 'Inactive').length;
  const totalQueriesCount = agents.reduce((sum, a) => sum + (Number(a.queries) || 0), 0).toLocaleString();
  const totalTieupsCount = agents.reduce((sum, a) => sum + (Number(a.tieups) || 0), 0).toLocaleString();

  // Pie chart data
  const queriesPieData = [
    { name: 'Open', value: 632, color: '#3b82f6' },
    { name: 'In Progress', value: 845, color: '#f59e0b' },
    { name: 'Resolved', value: 861, color: '#10b981' },
    { name: 'Escalated', value: 120, color: '#ef4444' }
  ];

  const tieupPieData = [
    { name: 'Shopping Malls', value: 68, color: '#3b82f6' },
    { name: 'Super Markets', value: 75, color: '#10b981' },
    { name: 'Hospitals', value: 54, color: '#f59e0b' },
    { name: 'Schools', value: 48, color: '#ec4899' },
    { name: 'Colleges', value: 36, color: '#8b5cf6' },
    { name: 'Others', value: 47, color: '#64748b' }
  ];

  // Bar charts
  const performanceData = [
    { name: 'Chennai', Vendors: 2540, Revenue: 2.45 },
    { name: 'Coimbatore', Vendors: 1870, Revenue: 1.89 },
    { name: 'Madurai', Vendors: 1650, Revenue: 1.54 },
    { name: 'Trichy', Vendors: 1320, Revenue: 1.32 },
    { name: 'Salem', Vendors: 1180, Revenue: 1.08 }
  ];
  const uniqueDivisions = ['All Divisions', ...new Set(agents.map(a => a.division).filter(Boolean))];
  const uniqueDistricts = ['All Districts', ...new Set(agents.map(a => a.district).filter(Boolean))];

  return (
    <div className="space-y-6 text-slate-800">
      


      {/* Grid of 6 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total District Agents */}
        <div className="bg-[#4f46e5] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-indigo-200 tracking-widest opacity-90">Total Agents</p>
            <p className="text-2xl font-black mt-1">{totalAgentsCount}</p>
          </div>
          <div className="text-white opacity-40">
            <Compass className="w-8 h-8" />
          </div>
        </div>

        {/* Active District Agents */}
        <div className="bg-[#065f46] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-emerald-200 tracking-widest opacity-90">Active District</p>
            <p className="text-2xl font-black mt-1">{activeAgentsCount}</p>
          </div>
          <div className="text-white opacity-40">
            <Users className="w-8 h-8" />
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-[#b45309] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-amber-200 tracking-widest opacity-90">Pending Approval</p>
            <p className="text-2xl font-black mt-1">{pendingAgentsCount}</p>
          </div>
          <div className="text-white opacity-40">
            <Clock className="w-8 h-8" />
          </div>
        </div>

        {/* Inactive Agents */}
        <div className="bg-[#be123c] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-rose-200 tracking-widest opacity-90">Inactive Agents</p>
            <p className="text-2xl font-black mt-1">{inactiveAgentsCount}</p>
          </div>
          <div className="text-white opacity-40">
            <Users className="w-8 h-8" />
          </div>
        </div>

        {/* Vendor Queries */}
        <div className="bg-[#6b21a8] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-purple-200 tracking-widest opacity-90">Vendor Queries</p>
            <p className="text-2xl font-black mt-1">{totalQueriesCount}</p>
          </div>
          <div className="text-white opacity-40">
            <Users className="w-8 h-8" />
          </div>
        </div>

        {/* Business Tie-ups */}
        <div className="bg-[#0f766e] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-teal-200 tracking-widest opacity-90">Business Tie-ups</p>
            <p className="text-2xl font-black mt-1">{totalTieupsCount}</p>
          </div>
          <div className="text-white opacity-40">
            <Briefcase className="w-8 h-8" />
          </div>
        </div>

      </div>

      {/* Main body layouts */}
      <div className="w-full space-y-4">
        
        {/* Left lists table */}
        <div className="w-full space-y-4">
          
          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by agent name, ID or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-blue-500 font-medium transition"
              />
            </div>
             <div className="flex flex-wrap gap-2 text-sm font-bold">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none"
              >
                {uniqueDistricts.map(distOpt => (
                  <option key={distOpt} value={distOpt}>{distOpt}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-3.5 py-2 transition font-bold"
              >
                <Download className="w-4 h-4 text-slate-500" /> Export
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">District Agents List</h3>
              <span className="text-xs font-bold text-slate-400">Total: {filteredAgents.length} Agents</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Agent ID</th>
                    <th className="p-4">Agent Name</th>
                    <th className="p-4">District</th>
                    <th className="p-4">Vendors</th>
                    <th className="p-4">Queries</th>
                    <th className="p-4">Tie-ups</th>
                    <th className="p-4">Performance</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAgents.map((agent) => (
                    <React.Fragment key={agent._id}>
                      <tr className="hover:bg-slate-50/50 text-slate-600 font-bold transition">
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
                        <td className="p-4 text-slate-700">{agent.district}</td>
                        <td className="p-4 font-mono text-slate-500">{agent.customers || 0}</td>
                        <td className="p-4 font-mono text-slate-500">{agent.queries || 0}</td>
                        <td className="p-4 font-mono text-slate-500">{agent.tieups || 0}</td>
                        <td className="p-4 font-sans text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${agent.performance || 100}%` }}></div>
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
                        <td className="p-4 relative">
                          <div className="flex items-center justify-center gap-2 text-slate-400">
                            <button
                              onClick={() => {
                                setEditingAgent(agent);
                                setEditName(agent.name);
                                setEditPhone(agent.phone);
                                setEditDistrict(agent.district);
                                setEditDivision(agent.division);
                              }}
                              className="hover:text-blue-600 transition"
                              title="Edit Agent"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setViewingAgent(agent)}
                              className="hover:text-emerald-600 transition"
                              title="View Profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setExpandedAgentId(expandedAgentId === agent._id ? null : agent._id)}
                              className="hover:text-blue-600 transition p-1 hover:bg-blue-50 rounded"
                              title="View Managed Divisions"
                            >
                              {expandedAgentId === agent._id ? (
                                <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <div className="relative">
                              <button
                                onClick={() => setActiveDropdownId(activeDropdownId === agent._id ? null : agent._id)}
                                className="hover:text-amber-600 transition p-1 hover:bg-amber-50 rounded"
                                title="More Options"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                              {activeDropdownId === agent._id && (
                                <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-slate-700 font-semibold text-[11px] text-left">
                                  <button
                                    onClick={() => {
                                      handleStatusToggle(agent._id, agent.status);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5"
                                  >
                                    <RefreshCw className="w-3 h-3 text-purple-600" />
                                    <span>Toggle Status</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteAgent(agent._id);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-1.5"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete Agent</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                      {expandedAgentId === agent._id && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={10} className="p-4 border-t border-b border-slate-100">
                            <div className="pl-6 py-2 space-y-3">
                              <h4 className="text-xs font-black text-slate-750 uppercase tracking-wider">
                                Divisions & Agents Managed under {agent.district || agent.name}
                              </h4>
                              {(() => {
                                const distClean = (agent.district || agent.name || '').replace(/District/i, '').trim();
                                const distRegex = new RegExp(distClean, 'i');
                                const divAgentsUnder = allAgents.filter(
                                  (a) => a.role === 'Divisional Agent' && a.district && distRegex.test(a.district)
                                );

                                if (divAgentsUnder.length === 0) {
                                  return (
                                    <p className="text-xs text-slate-400 font-semibold italic">
                                      No divisional agents assigned to this district yet.
                                    </p>
                                  );
                                }

                                return (
                                  <div className="overflow-hidden border border-slate-200 rounded-lg bg-white max-w-3xl">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                          <th className="p-2.5 pl-4">Division Name</th>
                                          <th className="p-2.5">Agent Name</th>
                                          <th className="p-2.5">Phone</th>
                                          <th className="p-2.5 pr-4">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        {divAgentsUnder.map((subA, sIdx) => (
                                          <tr key={subA._id || sIdx} className="hover:bg-slate-50/50">
                                            <td className="p-2.5 pl-4 font-extrabold text-slate-850">
                                              {subA.division || 'N/A'}
                                            </td>
                                            <td className="p-2.5 text-slate-700">{subA.name}</td>
                                            <td className="p-2.5 font-mono text-slate-500">{subA.phone || 'N/A'}</td>
                                            <td className="p-2.5 pr-4">
                                              <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                  subA.status === 'Active' || subA.status === 'Approved'
                                                    ? 'bg-emerald-50 text-emerald-650'
                                                    : 'bg-rose-50 text-rose-650'
                                                }`}
                                              >
                                                {subA.status || 'Active'}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                );
                              })()}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
      </div>



      {/* Creation Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Create District Agent</h3>
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
                  placeholder="e.g. Anand Sharma"
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
                    placeholder="anand@agent.com"
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
                  <label className="block mb-1.5">District Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Coimbatore District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

      {/* View Modal */}
      {viewingAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">District Agent Profile</h3>
              <button onClick={() => setViewingAgent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Agent ID:</span>
                <span className="text-slate-800 font-mono normal-case">{viewingAgent._id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Full Name:</span>
                <span className="text-slate-800 normal-case">{viewingAgent.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Email Address:</span>
                <span className="text-slate-800 lowercase">{viewingAgent.user?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Mobile Number:</span>
                <span className="text-slate-800 normal-case">{viewingAgent.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>District:</span>
                <span className="text-slate-800 normal-case">{viewingAgent.district}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Divisions Managed:</span>
                <span className="text-slate-800 font-extrabold normal-case">
                  {(() => {
                    const dist = viewingAgent.district || viewingAgent.name || '';
                    const distRegex = dist ? new RegExp(dist.replace(/District/i, '').trim(), 'i') : null;
                    const divAgentsUnderDist = allAgents.filter(a => a.role === 'Divisional Agent' && a.district && distRegex && distRegex.test(a.district));
                    const uniqueDivisions = Array.from(new Set(divAgentsUnderDist.map(a => a.division).filter(Boolean)));

                    if (uniqueDivisions.length > 0) {
                      return `${uniqueDivisions.length} ${uniqueDivisions.length === 1 ? 'Division' : 'Divisions'} (${uniqueDivisions.join(', ')})`;
                    }
                    if (viewingAgent.division && viewingAgent.division !== 'Unassigned' && viewingAgent.division !== 'Unassigned Division') {
                      return `1 Division (${viewingAgent.division})`;
                    }
                    return '0 Divisions (Whole District Territory)';
                  })()}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Vendors / Tie-ups:</span>
                <span className="text-slate-800 font-extrabold normal-case">{viewingAgent.customers || '0'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Performance:</span>
                <span className="text-emerald-600">{viewingAgent.performance}%</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Current Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  viewingAgent.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>{viewingAgent.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Edit District Agent</h3>
              <button onClick={() => setEditingAgent(null)} className="text-slate-400 hover:text-slate-600">
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

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div>
                <label className="block mb-1.5">Agent Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">District Name</label>
                  <input
                    type="text"
                    required
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5">Division</label>
                <input
                  type="text"
                  required
                  value={editDivision}
                  onChange={(e) => setEditDivision(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg mt-3 uppercase tracking-widest text-xs transition duration-200"
              >
                {submitting ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DistrictAgents;
