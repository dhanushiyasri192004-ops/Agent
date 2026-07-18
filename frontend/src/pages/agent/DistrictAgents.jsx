import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Users, Plus, ShieldAlert, Check, X, Phone, Mail, Compass, MapPin, Store,
  FileCheck, FileText, Upload, Clock, Settings, Search, Filter, Edit2, Eye,
  RefreshCw, MoreVertical, Download, Send, Layers, BarChart2, Info, Bell, Briefcase
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import api from '../../services/api.js';

const DistrictAgents = () => {
  const { user } = useSelector((state) => state.auth);
  const [dbAgents, setDbAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

  const [agents, setAgents] = useState(initialMockAgents);

  useEffect(() => {
    fetchAgents();
    if (user?.agentInfo) {
      setStateName(user.agentInfo.state || 'Tamil Nadu');
      setDivision(user.agentInfo.division || '');
    }
  }, [user]);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/api/agents');
      const filtered = response.data.filter(a => a.role === 'District Agent');
      setDbAgents(filtered);

      const formattedDb = filtered.map((agent, index) => ({
        _id: agent._id || `DB_DAG_${index}`,
        name: agent.name,
        division: agent.division || 'Unassigned',
        district: agent.district || 'Unassigned',
        customers: '380',
        queries: 12,
        tieups: 8,
        performance: 84,
        status: agent.status || 'Active',
        phone: agent.phone || 'N/A',
        user: { email: agent.user?.email || '' }
      }));

      // Combine ensuring no duplicates
      const all = [...initialMockAgents];
      formattedDb.forEach(db => {
        if (!all.some(a => a.user.email === db.user.email)) {
          all.push(db);
        }
      });
      setAgents(all);
    } catch (err) {
      console.error('Error fetching agents:', err);
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

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800">District Agent Management</h1>
            <Info className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Manage and monitor all District level agents across the state.</p>
        </div>
      </div>

      {/* Grid of 6 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total District Agents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Agents</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">156</p>
            <span className="text-xs text-blue-500 hover:underline cursor-pointer font-bold block mt-1">View all agents</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        {/* Active District Agents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active District</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">142</p>
            <span className="text-xs text-emerald-500 hover:underline cursor-pointer font-bold block mt-1">View active agents</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Approval</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">8</p>
            <span className="text-xs text-amber-500 hover:underline cursor-pointer font-bold block mt-1">View pending</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Inactive Agents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Inactive Agents</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">6</p>
            <span className="text-xs text-rose-500 hover:underline cursor-pointer font-bold block mt-1">View inactive</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Vendor Queries */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Vendor Queries</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">2,458</p>
            <span className="text-xs text-purple-500 hover:underline cursor-pointer font-bold block mt-1">View all queries</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Business Tie-ups */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">Business Tie-ups</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">328</p>
            <span className="text-xs text-teal-500 hover:underline cursor-pointer font-bold block mt-1">View tie-ups</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main body layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left lists table */}
        <div className="lg:col-span-2 space-y-4">
          
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
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none"
              >
                <option>All Divisions</option>
                <option>Chennai Division</option>
                <option>Coimbatore Division</option>
                <option>Madurai Division</option>
                <option>Trichy Division</option>
                <option>Salem Division</option>
              </select>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none"
              >
                <option>All Districts</option>
                <option>Chennai</option>
                <option>Coimbatore</option>
                <option>Madurai</option>
                <option>Trichy</option>
                <option>Salem</option>
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

              <button className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-3.5 py-2 transition font-bold">
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
                    <th className="p-4">Division</th>
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
                      <td className="p-4 text-slate-500">{agent.customers}</td>
                      <td className="p-4 text-slate-500">{agent.queries}</td>
                      <td className="p-4 text-slate-500">{agent.tieups}</td>
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
                          <button className="hover:text-purple-600 transition" title="Switch Territory">
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

        {/* Right Sidebar Section */}
        <div className="space-y-6">
          
          {/* Pending Approvals */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Pending District Agent Approvals</h3>
              <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Rajesh Kumar', info: 'Chennai Division - Chengalpattu District', date: 'Submitted on 16 May 2025' },
                { name: 'Sathish P', info: 'Coimbatore Division - Tirupur District', date: 'Submitted on 15 May 2025' },
                { name: 'Karthikeyan M', info: 'Madurai Division - Sivaganga District', date: 'Submitted on 14 May 2025' },
                { name: 'Naveen R', info: 'Trichy Division - Ariyalur District', date: 'Submitted on 14 May 2025' }
              ].map((p, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs leading-snug">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{p.info}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{p.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded px-2 py-0.5 text-[9px] font-bold">
                      Approve
                    </button>
                    <button className="bg-rose-50 text-rose-600 border border-rose-100 rounded px-2 py-0.5 text-[9px] font-bold">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Recent Activities</h3>
              <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-4">
              {[
                { text: 'New District Agent Karthik M registered', time: '16 May 2025, 10:30 AM', color: 'bg-blue-500' },
                { text: 'Business tie-up added in Chennai District', time: '15 May 2025, 04:15 PM', color: 'bg-emerald-500' },
                { text: 'Vendor query resolved in Coimbatore District', time: '15 May 2025, 02:45 PM', color: 'bg-indigo-500' },
                { text: 'District report submitted by Madurai District Agent', time: '14 May 2025, 11:20 AM', color: 'bg-amber-500' },
                { text: 'New Pincode Agent assigned in Salem District', time: '14 May 2025, 09:30 AM', color: 'bg-rose-500' }
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

          {/* Notifications */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Notifications</h3>
              <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-3.5">
              {[
                { text: '8 new district agent registrations', time: '10 mins ago' },
                { text: '12 vendor queries escalated', time: '1 hour ago' },
                { text: 'District performance reports pending', time: '2 hours ago' },
                { text: '5 business tie-up requests', time: '3 hours ago' },
                { text: '3 agent profile updates', time: 'Yesterday' }
              ].map((n, idx) => (
                <div key={idx} className="flex gap-3 text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <Bell className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-700 leading-snug">{n.text}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Row 4: Doughnut charts, Performing districts, and performance charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Vendor Queries Overview Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Vendor Queries</h3>
            <span className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">View All</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center min-h-[180px] relative">
            <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center flex-col">
              <span className="text-lg font-black text-slate-800">2,458</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
            </div>

            {/* Custom chart legend showing mockup percentages */}
            <div className="w-full grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 mt-4 border-t border-slate-50 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Open: 632 (25.7%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Progress: 845 (34.4%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Resolved: 861 (35.1%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Escalated: 120 (4.8%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Tie-up Overview Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Business Tie-up Overview</h3>
            <span className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">View All</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[180px]">
            <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center flex-col">
              <span className="text-lg font-black text-slate-800">328</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
            </div>

            <div className="w-full grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 mt-4 border-t border-slate-50 pt-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Malls: 68 (20.7%)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Super Mkt: 75 (22.9%)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Hospital: 54 (16.5%)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                <span>School: 48 (14.6%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Districts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Top Performing Districts</h3>
              <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Chennai', rate: 97 },
                { name: 'Coimbatore', rate: 93 },
                { name: 'Madurai', rate: 91 },
                { name: 'Salem', rate: 88 },
                { name: 'Trichy', rate: 86 }
              ].map((d, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-700">{idx+1}. {d.name}</span>
                    <span className="text-slate-800">{d.rate}%</span>
                  </div>
                  <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${d.rate}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* District Performance Line Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">District Performance</h3>
            <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={9} stroke="#64748b" />
                <YAxis fontSize={9} stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="Vendors" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* District Map Graphic & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* District Map */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">District Map</h3>
            <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] relative">
            <svg viewBox="0 0 100 100" className="w-28 h-28 text-blue-500/20 drop-shadow">
              <path d="M40,10 C50,15 65,10 70,25 C75,40 68,55 80,65 C92,75 85,85 70,90 C55,95 40,88 30,80 C20,72 15,55 25,40 C35,25 30,15 40,10 Z" fill="currentColor" stroke="#fff" strokeWidth="1.5" />
              <circle cx="50" cy="30" r="3.5" fill="#10b981" />
              <circle cx="42" cy="52" r="3.5" fill="#f59e0b" />
              <circle cx="68" cy="48" r="3.5" fill="#3b82f6" />
              <circle cx="55" cy="72" r="3.5" fill="#ef4444" />
            </svg>
            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-bold text-slate-500 mt-4 border-t border-slate-50 pt-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active (20)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Pending (5)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Inactive (2)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                <span>No Agent (1)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2.5 group"
            >
              <Plus className="w-5.5 h-5.5 text-blue-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase">Create District Agent</span>
            </button>
            <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2.5 group">
              <Layers className="w-5.5 h-5.5 text-emerald-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase">Assign District</span>
            </button>
            <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2.5 group">
              <FileCheck className="w-5.5 h-5.5 text-purple-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase">Generate Report</span>
            </button>
            <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2.5 group">
              <Send className="w-5.5 h-5.5 text-orange-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase">Send Notification</span>
            </button>
            <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2.5 group">
              <Download className="w-5.5 h-5.5 text-teal-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase">Export Data</span>
            </button>
            <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2.5 group">
              <Users className="w-5.5 h-5.5 text-rose-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase">View All District Agents</span>
            </button>
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

    </div>
  );
};

export default DistrictAgents;
