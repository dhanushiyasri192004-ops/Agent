import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Plus, ShieldAlert, Check, X, Phone, Mail, Compass, MapPin, Store,
  FileCheck, FileText, Upload, Clock, Settings, Search, Filter, Edit2, Eye,
  RefreshCw, MoreVertical, Download, Send, Layers, BarChart2, Info, Bell, Trash2, ChevronRight, ChevronDown
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api.js';

const DivisionalAgents = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [dbAgents, setDbAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [allAgents, setAllAgents] = useState([]);
  const [expandedAgentId, setExpandedAgentId] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPerformance, setSelectedPerformance] = useState('All');
  const [performancePeriod, setPerformancePeriod] = useState('This Month');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('Tamil Nadu');
  const [division, setDivision] = useState('');
  const [viewingAgent, setViewingAgent] = useState(null);
  const [editingAgent, setEditingAgent] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editDivision, setEditDivision] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [agents, setAgents] = useState([]);

  const handleOpenEditModal = (agent) => {
    setEditingAgent(agent);
    setEditName(agent.name || '');
    setEditPhone(agent.phone || '');
    setEditDistrict(agent.district || 'Salem District');
    setEditDivision(agent.division || 'Salem East Division');
  };

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
      setSuccess('Divisional Agent details updated successfully!');
      fetchAgents();
      setTimeout(() => {
        setEditingAgent(null);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update Divisional Agent');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSwitchRegionPrompt = async (agent) => {
    const newDivision = prompt(`Enter new Division for ${agent.name}:`, agent.division || 'Salem East Division');
    if (newDivision && newDivision !== agent.division) {
      try {
        await api.patch(`/api/agents/${agent._id}`, { division: newDivision });
        alert(`Division updated to ${newDivision}`);
        fetchAgents();
      } catch (err) {
        console.error('Error switching division:', err);
      }
    }
  };

  useEffect(() => {
    fetchAgents();
    if (user?.agentInfo) {
      setStateName(user.agentInfo.state || 'Tamil Nadu');
    }
  }, [user]);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/api/agents');
      const rawData = response.data || [];
      setAllAgents(rawData);
      const assignedDistrict = user?.agentInfo?.district || user?.district || '';
      const districtRegex = assignedDistrict ? new RegExp(assignedDistrict.replace(/District/i, '').trim(), 'i') : null;

      const filtered = rawData.filter(a => {
        if (a.role !== 'Divisional Agent') return false;
        if (user?.role === 'District Agent' && districtRegex && a.district && !districtRegex.test(a.district)) return false;
        return true;
      });

      setDbAgents(filtered);

      const formattedDb = filtered.map((agent, index) => ({
        _id: agent._id || `DB_${index}`,
        name: agent.name,
        role: agent.role || 'Divisional Agent',
        division: agent.division || 'Unassigned',
        district: agent.district || assignedDistrict || 'Salem District',
        pincode: agent.pincode || '',
        state: agent.state || 'Tamil Nadu',
        districts: 1,
        customers: '0',
        revenue: '₹ 0.00',
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
        district: district || user?.agentInfo?.district || 'Salem District',
        division,
      });

      setSuccess('Divisional Agent created successfully!');
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
      setDistrict('');
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
    const nameStr = agent.name || '';
    const districtStr = agent.district || '';
    const divisionStr = agent.division || '';
    const idStr = agent._id || '';

    const matchesSearch = nameStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          districtStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          divisionStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          idStr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = selectedDistrict === 'All Districts' || 
                            districtStr.toLowerCase().includes(selectedDistrict.toLowerCase().replace(' district', '').trim());

    const matchesDivision = selectedDivision === 'All Divisions' || 
                            divisionStr.toLowerCase().includes(selectedDivision.toLowerCase().replace(' division', '').trim());
                            
    const matchesStatus = selectedStatus === 'All Status' || 
                          (agent.status || '').toLowerCase() === selectedStatus.toLowerCase();
    
    let matchesPerf = true;
    if (selectedPerformance === 'High') {
      matchesPerf = agent.performance > 90;
    } else if (selectedPerformance === 'Average') {
      matchesPerf = agent.performance >= 80 && agent.performance <= 90;
    }

    return matchesSearch && matchesDistrict && matchesDivision && matchesStatus && matchesPerf;
  });

  // Chart data
  const chartData = [
    { name: 'Chennai', Vendors: 2540, Revenue: 2.45 },
    { name: 'Coimbatore', Vendors: 1870, Revenue: 1.89 },
    { name: 'Madurai', Vendors: 1650, Revenue: 1.54 },
    { name: 'Trichy', Vendors: 1320, Revenue: 1.32 },
    { name: 'Salem', Vendors: 1180, Revenue: 1.08 },
  ];

  const chartDataWeekly = [
    { name: 'Chennai', Vendors: 540, Revenue: 0.45 },
    { name: 'Coimbatore', Vendors: 470, Revenue: 0.39 },
    { name: 'Madurai', Vendors: 350, Revenue: 0.34 },
    { name: 'Trichy', Vendors: 220, Revenue: 0.22 },
    { name: 'Salem', Vendors: 180, Revenue: 0.18 },
  ];

  const currentChartData = performancePeriod === 'This Week' ? chartDataWeekly : chartData;
  const uniqueDistricts = ['All Districts', ...Array.from(new Set(agents.map(a => a.district).filter(Boolean)))];
  const uniqueDivisions = ['All Divisions', ...Array.from(new Set(agents.map(a => a.division).filter(Boolean)))];
  const totalDivisionsCount = new Set(agents.map(a => a.division).filter(Boolean)).size || agents.length;
  const activeAgentsCount = agents.filter(a => a.status === 'Active' || a.status === 'Approved').length;
  const pendingAgentsCount = agents.filter(a => a.status === 'Pending').length;
  const inactiveAgentsCount = agents.filter(a => a.status === 'Inactive').length;
  const totalVendorsCount = agents.reduce((sum, a) => sum + (Number(String(a.customers || 0).replace(/,/g, '')) || 0), 0).toLocaleString();
  const totalRevenueCount = agents.length > 0 ? `₹ ${(agents.length * 1.2).toFixed(1)} Cr` : '₹ 0 Cr';

  return (
    <div className="space-y-6 text-slate-800">
      


      {/* Grid of 6 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total Divisions */}
        <div className="bg-[#4f46e5] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-indigo-200 tracking-widest opacity-90">Total Divisions</p>
            <p className="text-2xl font-black mt-1">{totalDivisionsCount}</p>
          </div>
          <div className="text-white opacity-40">
            <Compass className="w-8 h-8" />
          </div>
        </div>

        {/* Active Divisional Agents */}
        <div className="bg-[#065f46] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-emerald-200 tracking-widest opacity-90">Active Agents</p>
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

        {/* Total Vendors */}
        <div className="bg-[#6b21a8] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-purple-200 tracking-widest opacity-90">Vendors Assisted</p>
            <p className="text-2xl font-black mt-1">{totalVendorsCount}</p>
          </div>
          <div className="text-white opacity-40">
            <Store className="w-8 h-8" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#0f766e] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-teal-200 tracking-widest opacity-90">Total Revenue</p>
            <p className="text-2xl font-black mt-1">{totalRevenueCount}</p>
          </div>
          <div className="text-white opacity-40">
            <BarChart2 className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Divisional Agents List */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            
            {/* Table Header Controls */}
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-base font-bold text-slate-800">Divisional Agents List</h3>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by agent name, ID or division..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-9 pr-3.5 py-2 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>

                {/* District Filter */}
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold outline-none focus:border-blue-500"
                >
                  {uniqueDistricts.map(distOpt => (
                    <option key={distOpt} value={distOpt}>{distOpt}</option>
                  ))}
                </select>

                {/* Division Filter */}
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold outline-none focus:border-blue-500"
                >
                  {uniqueDivisions.map(divOpt => (
                    <option key={divOpt} value={divOpt}>{divOpt}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold outline-none focus:border-blue-500"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>

            {/* Agents Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Agent ID</th>
                    <th className="p-4">Agent Name</th>
                    <th className="p-4">District</th>
                    <th className="p-4">Division</th>
                    <th className="p-4">Vendors</th>
                    <th className="p-4">Performance</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                  {filteredAgents.map((agent) => (
                    <React.Fragment key={agent._id}>
                      <tr className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-mono text-slate-500">{agent._id}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
                              {agent.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{agent.name}</p>
                              <p className="text-[10px] text-slate-400 font-normal">{agent.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-800 font-extrabold">{agent.district || 'Salem District'}</td>
                        <td className="p-4 text-slate-600">{agent.division}</td>
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
                        <td className="p-4 relative">
                          <div className="flex items-center justify-center gap-2.5 text-slate-400">
                            <button onClick={() => handleOpenEditModal(agent)} className="hover:text-blue-600 transition p-1 hover:bg-blue-50 rounded" title="Edit Agent">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setViewingAgent(agent)} className="hover:text-emerald-600 transition p-1 hover:bg-emerald-50 rounded" title="View Profile">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setExpandedAgentId(expandedAgentId === agent._id ? null : agent._id)}
                              className="hover:text-blue-600 transition p-1 hover:bg-blue-50 rounded"
                              title="View Pincode Agents"
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
                                      handleSwitchRegionPrompt(agent);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5"
                                  >
                                    <RefreshCw className="w-3 h-3 text-purple-600" />
                                    <span>Switch Division</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleStatusToggle(agent._id, agent.status);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5"
                                  >
                                    <RefreshCw className="w-3 h-3 text-emerald-600" />
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
                                Pincode Agents Managed under {agent.division || agent.name}
                              </h4>
                              {(() => {
                                const divClean = (agent.division || '').replace(/Division/i, '').trim();
                                const divRegex = new RegExp(divClean, 'i');
                                const pinAgentsUnder = allAgents.filter(
                                  (a) => a.role === 'Pincode Agent' && a.division && divRegex.test(a.division)
                                );

                                if (pinAgentsUnder.length === 0) {
                                  return (
                                    <p className="text-xs text-slate-400 font-semibold italic">
                                      No pincode agents assigned to this division yet.
                                    </p>
                                  );
                                }

                                return (
                                  <div className="overflow-hidden border border-slate-200 rounded-lg bg-white max-w-3xl">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                          <th className="p-2.5 pl-4">Pincode</th>
                                          <th className="p-2.5">Agent Name</th>
                                          <th className="p-2.5">Phone</th>
                                          <th className="p-2.5 pr-4">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        {pinAgentsUnder.map((subA, sIdx) => (
                                          <tr key={subA._id || sIdx} className="hover:bg-slate-50/50">
                                            <td className="p-2.5 pl-4 font-extrabold text-slate-850">
                                              {subA.pincode || 'N/A'}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">District Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Salem District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Division Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Salem East Division"
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
      {/* View Profile Modal */}
      {viewingAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Divisional Agent Profile</h3>
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
                <span className="text-slate-800 normal-case">{viewingAgent.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>District:</span>
                <span className="text-slate-800 normal-case">{viewingAgent.district || 'Salem District'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Division:</span>
                <span className="text-slate-800 normal-case">{viewingAgent.division || 'Salem East Division'}</span>
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

      {/* Edit Agent Modal */}
      {editingAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Edit Divisional Agent</h3>
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
                <label className="block mb-1.5">Division Name</label>
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

export default DivisionalAgents;
