import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Users, Plus, ShieldAlert, Check, X, Phone, Mail, Compass, MapPin, Store,
  FileCheck, FileText, Upload, Clock, Settings, Search, Filter, Edit2, Eye,
  RefreshCw, MoreVertical, Download, Send, Layers, BarChart2, Info, Bell
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api.js';

const DivisionalAgents = () => {
  const { user } = useSelector((state) => state.auth);
  const [dbAgents, setDbAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPerformance, setSelectedPerformance] = useState('All');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [stateName, setStateName] = useState('Tamil Nadu');
  const [division, setDivision] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Initial mock agents as requested by the mockup image
  const initialMockAgents = [
    {
      _id: 'DA301',
      name: 'Rajesh Kumar',
      division: 'Chennai Division',
      districts: 6,
      customers: '2,540',
      revenue: '₹ 2.45 Cr',
      performance: 96,
      status: 'Active',
      phone: '9876543210',
      user: { email: 'rajesh@agent.com' }
    },
    {
      _id: 'DA302',
      name: 'Prakash B',
      division: 'Coimbatore Division',
      districts: 5,
      customers: '1,870',
      revenue: '₹ 1.89 Cr',
      performance: 92,
      status: 'Active',
      phone: '9876543211',
      user: { email: 'prakash@agent.com' }
    },
    {
      _id: 'DA303',
      name: 'Meena Devi',
      division: 'Madurai Division',
      districts: 4,
      customers: '1,650',
      revenue: '₹ 1.54 Cr',
      performance: 91,
      status: 'Active',
      phone: '9876543212',
      user: { email: 'meena@agent.com' }
    },
    {
      _id: 'DA304',
      name: 'Senthil Kumar',
      division: 'Trichy Division',
      districts: 4,
      customers: '1,320',
      revenue: '₹ 1.32 Cr',
      performance: 88,
      status: 'Inactive',
      phone: '9876543213',
      user: { email: 'senthil@agent.com' }
    },
    {
      _id: 'DA305',
      name: 'Suresh R',
      division: 'Salem Division',
      districts: 4,
      customers: '1,180',
      revenue: '₹ 1.08 Cr',
      performance: 85,
      status: 'Active',
      phone: '9876543214',
      user: { email: 'suresh@agent.com' }
    }
  ];

  const [agents, setAgents] = useState(initialMockAgents);

  useEffect(() => {
    fetchAgents();
    if (user?.agentInfo) {
      setStateName(user.agentInfo.state || 'Tamil Nadu');
    }
  }, [user]);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/api/agents');
      const filtered = response.data.filter(a => a.role === 'Divisional Agent');
      setDbAgents(filtered);

      // Merge mock data with real database agents
      const formattedDb = filtered.map((agent, index) => ({
        _id: agent._id || `DB_${index}`,
        name: agent.name,
        division: agent.division || 'Unassigned',
        districts: 3,
        customers: '450',
        revenue: '₹ 0.25 Cr',
        performance: 82,
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
    // Update local state first for fast response
    setAgents(prev => prev.map(a => a._id === agentId ? { ...a, status: newStatus } : a));

    // If it's a DB agent, update in backend too
    const dbAgent = dbAgents.find(a => a._id === agentId);
    if (dbAgent) {
      try {
        await api.patch(`/api/agents/${agentId}/status`, { status: newStatus });
        fetchAgents();
      } catch (err) {
        console.error('Error toggling agent status in DB:', err);
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
        division,
      });

      setSuccess('Divisional Agent created successfully!');
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
      setDivision('');
      
      // Refresh list
      fetchAgents();
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create Divisional Agent');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter logic
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agent.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDivision = selectedDivision === 'All Divisions' || agent.division === selectedDivision;
    const matchesStatus = selectedStatus === 'All Status' || agent.status === selectedStatus;
    
    let matchesPerf = true;
    if (selectedPerformance === 'High (>90%)') {
      matchesPerf = agent.performance > 90;
    } else if (selectedPerformance === 'Average (80-90%)') {
      matchesPerf = agent.performance >= 80 && agent.performance <= 90;
    }

    return matchesSearch && matchesDivision && matchesStatus && matchesPerf;
  });

  // Chart data
  const chartData = [
    { name: 'Chennai', Vendors: 2540, Revenue: 2.45 },
    { name: 'Coimbatore', Vendors: 1870, Revenue: 1.89 },
    { name: 'Madurai', Vendors: 1650, Revenue: 1.54 },
    { name: 'Trichy', Vendors: 1320, Revenue: 1.32 },
    { name: 'Salem', Vendors: 1180, Revenue: 1.08 },
  ];

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Top Breadcrumb & Heading Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800">Divisional Agent Management</h1>
            <Info className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Manage and monitor all Divisional Agents and their performance.</p>
        </div>
      </div>

      {/* Grid of 6 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total Divisions */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Divisions</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">12</p>
            <span className="text-xs text-blue-500 hover:underline cursor-pointer font-bold block mt-1">View all divisions</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        {/* Active Divisional Agents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Agents</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">10</p>
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
            <p className="text-2xl font-black text-slate-800 mt-1.5">3</p>
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
            <p className="text-2xl font-black text-slate-800 mt-1.5">2</p>
            <span className="text-xs text-rose-500 hover:underline cursor-pointer font-bold block mt-1">View inactive</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Total Vendors */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Total Vendors</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">15,240</p>
            <span className="text-xs text-purple-500 hover:underline cursor-pointer font-bold block mt-1">View all vendors</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">₹ 12.8 Cr</p>
            <span className="text-xs text-teal-500 hover:underline cursor-pointer font-bold block mt-1">View revenue</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 text-base font-black shrink-0">
            ₹
          </div>
        </div>

      </div>

      {/* Main content grid: Left list + right panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Search, Filters & Agents Table */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by agent name, ID or division..."
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <select
                value={selectedPerformance}
                onChange={(e) => setSelectedPerformance(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none"
              >
                <option>All</option>
                <option>High (&gt;90%)</option>
                <option>Average (80-90%)</option>
              </select>

              <button className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-4 py-2 transition">
                <Filter className="w-4 h-4" /> More Filters
              </button>
            </div>
          </div>

          {/* Agents List Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Divisional Agents List</h3>
              <span className="text-xs font-bold text-slate-400">Total: {filteredAgents.length} Agents</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-55/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Agent ID</th>
                    <th className="p-4">Agent Name</th>
                    <th className="p-4">Division</th>
                    <th className="p-4">Districts</th>
                    <th className="p-4">Vendors</th>
                    <th className="p-4">Revenue</th>
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
                      <td className="p-4 font-semibold text-slate-700">{agent.division}</td>
                      <td className="p-4 text-slate-500">{agent.districts}</td>
                      <td className="p-4 text-slate-500">{agent.customers}</td>
                      <td className="p-4 text-slate-800 font-extrabold">{agent.revenue}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 min-w-[80px]">
                          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${agent.performance > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
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
                        <div className="flex items-center justify-center gap-2.5 text-slate-400">
                          <button className="hover:text-blue-600 transition" title="Edit Agent">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="hover:text-emerald-600 transition" title="View Profile">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="hover:text-purple-600 transition" title="Switch Division">
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

        {/* Right Column: Pending Approvals & Recent Activities */}
        <div className="space-y-6">
          
          {/* Pending Approvals */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Pending Approvals</h3>
              <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Rajesh Kumar', div: 'Chennai Division', date: 'Submitted on 16 May 2025' },
                { name: 'Sathish P', div: 'Coimbatore Division', date: 'Submitted on 15 May 2025' },
                { name: 'Karthik M', div: 'Madurai Division', date: 'Submitted on 14 May 2025' }
              ].map((p, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs leading-snug">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{p.div} • {p.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 rounded px-2.5 py-1 text-[10px] font-bold transition">
                      Approve
                    </button>
                    <button className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded px-2.5 py-1 text-[10px] font-bold transition">
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
                { text: 'New Divisional Agent Rajesh Kumar registered', desc: '16 May 2025, 10:30 AM', dotColor: 'bg-blue-500' },
                { text: 'Divisional Agent Prakash B updated profile', desc: '15 May 2025, 04:15 PM', dotColor: 'bg-emerald-500' },
                { text: 'Revenue report for Coimbatore Division generated', desc: '15 May 2025, 11:20 AM', dotColor: 'bg-indigo-500' },
                { text: 'District Agent added under Madurai Division', desc: '14 May 2025, 03:45 PM', dotColor: 'bg-amber-500' },
                { text: 'Vendor query resolved in Trichy Division', desc: '14 May 2025, 12:05 PM', dotColor: 'bg-teal-500' }
              ].map((a, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 self-start bg-blue-500" style={{ backgroundColor: a.dotColor }}></div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-700 leading-snug">{a.text}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Row 4: Performance Chart & Top Divisions & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Division Performance Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Division Performance Overview</h3>
            <span className="text-xs text-blue-600 font-bold border border-blue-100 bg-blue-50/50 px-2.5 py-1 rounded-lg">This Month</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} stroke="#64748b" />
                <YAxis fontSize={10} stroke="#64748b" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Vendors" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Divisions List */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Top Performing Divisions</h3>
              <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Chennai Division', rate: '96%', rev: '₹ 2.45 Cr', color: 'bg-blue-500' },
                { name: 'Coimbatore Division', rate: '92%', rev: '₹ 1.89 Cr', color: 'bg-emerald-500' },
                { name: 'Madurai Division', rate: '91%', rev: '₹ 1.54 Cr', color: 'bg-indigo-500' },
                { name: 'Trichy Division', rate: '88%', rev: '₹ 1.32 Cr', color: 'bg-amber-500' },
                { name: 'Salem Division', rate: '85%', rev: '₹ 1.08 Cr', color: 'bg-rose-500' }
              ].map((div, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-slate-700">{div.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="font-black text-slate-800">{div.rev}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">▲ {div.rate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Division Map Placeholder */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Division Map</h3>
            <span className="text-[10px] text-slate-400 font-bold">Active Regions</span>
          </div>
          
          {/* Vector graphic of regions */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] relative">
            <svg viewBox="0 0 100 100" className="w-32 h-32 text-blue-600/20 drop-shadow">
              <path d="M40,10 C50,15 65,10 70,25 C75,40 68,55 80,65 C92,75 85,85 70,90 C55,95 40,88 30,80 C20,72 15,55 25,40 C35,25 30,15 40,10 Z" fill="currentColor" stroke="#fff" strokeWidth="1.5" />
              <circle cx="50" cy="30" r="3" fill="#2563eb" />
              <circle cx="45" cy="55" r="3" fill="#10b981" />
              <circle cx="65" cy="45" r="3" fill="#f59e0b" />
              <circle cx="60" cy="70" r="3" fill="#3b82f6" />
              <circle cx="35" cy="65" r="3" fill="#ef4444" />
            </svg>

            {/* Map Legend */}
            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-bold text-slate-500 mt-4 border-t border-slate-50 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Active (6)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                <span>Inactive (1)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span>Pending (2)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0"></span>
                <span>No Agent (3)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions Footer Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center text-center transition gap-2 group"
          >
            <Plus className="w-5 h-5 text-blue-600 group-hover:scale-110 transition duration-200" />
            <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Create Agent</span>
          </button>
          
          <button className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center text-center transition gap-2 group">
            <Download className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition duration-200" />
            <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Export Report</span>
          </button>

          <button className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center text-center transition gap-2 group">
            <Send className="w-5 h-5 text-purple-600 group-hover:scale-110 transition duration-200" />
            <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Send Notification</span>
          </button>

          <button className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center text-center transition gap-2 group">
            <Layers className="w-5 h-5 text-orange-600 group-hover:scale-110 transition duration-200" />
            <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Assign Division</span>
          </button>

          <button className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center text-center transition gap-2 group">
            <BarChart2 className="w-5 h-5 text-teal-600 group-hover:scale-110 transition duration-200" />
            <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">View Analytics</span>
          </button>

          <button className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center text-center transition gap-2 group">
            <Upload className="w-5 h-5 text-rose-600 group-hover:scale-110 transition duration-200" />
            <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Upload Document</span>
          </button>
        </div>
      </div>

      {/* Creation Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Create Divisional Agent</h3>
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
                  placeholder="e.g. Ramesh Kumar"
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
                    placeholder="ramesh@agent.com"
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
                  <label className="block mb-1.5">Division Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Chennai Division"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                  />
                </div>
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

export default DivisionalAgents;
