import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Plus, ShieldAlert, Check, X, Phone, Mail, Compass, MapPin, Store,
  FileCheck, FileText, Upload, Clock, Settings, Search, Filter, Edit2, Eye,
  RefreshCw, MoreVertical, Download, Send, Layers, BarChart2, Info, Bell, Briefcase, Trash2, ChevronRight, ChevronDown
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
  const [shopsList, setShopsList] = useState([]);
  const [expandedAgentId, setExpandedAgentId] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

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
  
  // Edit & View Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', pincode: '', division: '', district: '', state: '' });

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
      const [agentsRes, shopsRes] = await Promise.all([
        api.get('/api/agents'),
        api.get('/api/shops')
      ]);
      const rawAgents = agentsRes.data || [];
      const rawShops = shopsRes.data || [];
      setShopsList(rawShops);

      const assignedDistrict = user?.agentInfo?.district || user?.district || '';
      const districtRegex = assignedDistrict ? new RegExp(assignedDistrict.replace(/District/i, '').trim(), 'i') : null;

      const filtered = rawAgents.filter(a => {
        if (a.role !== 'Pincode Agent') return false;
        if (user?.role === 'District Agent' && districtRegex && a.district && !districtRegex.test(a.district)) return false;
        if (user?.role === 'Divisional Agent' && user?.agentInfo?.division && a.division !== user.agentInfo.division) return false;
        return true;
      });

      setDbAgents(filtered);

      const formattedDb = filtered.map((agent, index) => {
        const pinClean = String(agent.pincode || '').trim();
        const pinShops = rawShops.filter(
          (s) => String(s.pincode || '').trim() === pinClean
        );
        return {
          _id: agent._id || `DB_PAG_${index}`,
          name: agent.name,
          role: agent.role || 'Pincode Agent',
          division: agent.division || 'Unassigned',
          district: agent.district || assignedDistrict || 'Salem District',
          pincode: agent.pincode || 'Unassigned',
          state: agent.state || 'Tamil Nadu',
          customers: pinShops.length.toString(),
          performance: 100,
          status: agent.status || 'Active',
          phone: agent.phone || 'N/A',
          user: { email: agent.user?.email || '' }
        };
      });

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

  const handleEditOpen = (agent) => {
    setSelectedAgent(agent);
    setEditForm({
      name: agent.name,
      phone: agent.phone || '',
      pincode: agent.pincode || '',
      division: agent.division || '',
      district: agent.district || '',
      state: agent.state || 'Tamil Nadu'
    });
    setShowEditModal(true);
  };

  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.patch(`/api/agents/${selectedAgent._id}`, editForm);
      setSuccess('Agent updated successfully!');
      fetchAgents();
      setTimeout(() => {
        setShowEditModal(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update agent details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewOpen = (agent) => {
    setSelectedAgent(agent);
    setShowViewModal(true);
  };

  const uniqueDistricts = ['All Districts', ...Array.from(new Set(agents.map(a => a.district).filter(Boolean)))];
  const uniqueDivisions = ['All Divisions', ...Array.from(new Set(agents.map(a => a.division).filter(Boolean)))];

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
      


      {/* Grid of 6 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Pincode Agents */}
        <div className="bg-[#4f46e5] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-indigo-200 tracking-widest opacity-90">Total Agents</p>
            <p className="text-2xl font-black mt-1">{totalAgentsCount}</p>
          </div>
          <div className="text-white opacity-40">
            <Compass className="w-8 h-8" />
          </div>
        </div>

        {/* Active Agents */}
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

        {/* Vendors Assisted */}
        <div className="bg-[#6b21a8] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-purple-200 tracking-widest opacity-90">Vendors Assisted</p>
            <p className="text-2xl font-black mt-1">{totalVendorsCount}</p>
          </div>
          <div className="text-white opacity-40">
            <Users className="w-8 h-8" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#0f766e] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-teal-200 tracking-widest opacity-90">Total Revenue</p>
            <p className="text-2xl font-black mt-1">{totalRevenueCount}</p>
          </div>
          <div className="text-white opacity-40 text-2xl font-black">
            ₹
          </div>
        </div>

      </div>

      {/* Main row layout */}
      <div className="w-full space-y-4">
        
        {/* Left Side elements: Filters + table */}
        <div className="w-full space-y-4">
          
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
                {uniqueDivisions.map(divOpt => (
                  <option key={divOpt} value={divOpt}>{divOpt}</option>
                ))}
              </select>

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
                    <th className="p-4">District</th>
                    <th className="p-4">Division</th>
                    <th className="p-4">Pincode</th>
                    <th className="p-4">Vendors</th>
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
                        <td className="p-4 text-slate-500 font-semibold">{agent.division}</td>
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
                        <td className="p-4 relative">
                          <div className="flex items-center justify-center gap-2 text-slate-400">
                            <button onClick={() => handleEditOpen(agent)} className="hover:text-blue-600 transition p-1 hover:bg-blue-50 rounded" title="Edit Agent">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleViewOpen(agent)} className="hover:text-emerald-600 transition p-1 hover:bg-emerald-50 rounded" title="View Profile">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setExpandedAgentId(expandedAgentId === agent._id ? null : agent._id)}
                              className="hover:text-blue-600 transition p-1 hover:bg-blue-50 rounded"
                              title="View Registered Shops"
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
                                      handleEditOpen(agent);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5"
                                  >
                                    <RefreshCw className="w-3 h-3 text-purple-600" />
                                    <span>Switch Pincode</span>
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
                                Shops & Vendors under Pincode: {agent.pincode || agent.name}
                              </h4>
                              {(() => {
                                const pinClean = String(agent.pincode || '').trim();
                                const pinShops = shopsList.filter(
                                  (s) => String(s.pincode || '').trim() === pinClean
                                );

                                if (pinShops.length === 0) {
                                  return (
                                    <p className="text-xs text-slate-400 font-semibold italic">
                                      No shops registered in this pincode yet.
                                    </p>
                                  );
                                }

                                return (
                                  <div className="overflow-hidden border border-slate-200 rounded-lg bg-white max-w-3xl">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                          <th className="p-2.5 pl-4">Shop Name</th>
                                          <th className="p-2.5">Category</th>
                                          <th className="p-2.5">Address</th>
                                          <th className="p-2.5 pr-4">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        {pinShops.map((shop, sIdx) => (
                                          <tr key={shop._id || sIdx} className="hover:bg-slate-50/50">
                                            <td className="p-2.5 pl-4 font-extrabold text-slate-850">
                                              {shop.name || 'N/A'}
                                            </td>
                                            <td className="p-2.5 text-slate-700">{shop.category || 'N/A'}</td>
                                            <td className="p-2.5 text-slate-500 font-medium truncate max-w-[200px]">{shop.address || 'N/A'}</td>
                                            <td className="p-2.5 pr-4">
                                              <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                  shop.verificationStatus === 'Verified'
                                                    ? 'bg-emerald-50 text-emerald-650'
                                                    : 'bg-amber-50 text-amber-650'
                                                }`}
                                              >
                                                {shop.verificationStatus || 'Pending'}
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

      {/* Edit Modal Form */}
      {showEditModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Edit Pincode Agent</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
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

            <form onSubmit={handleUpdateAgent} className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div>
                <label className="block mb-1.5">Agent Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh G."
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="9876543210"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="641001"
                    value={editForm.pincode}
                    onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1.5">District</label>
                  <input
                    type="text"
                    value={editForm.district}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Division</label>
                  <input
                    type="text"
                    value={editForm.division}
                    onChange={(e) => setEditForm({ ...editForm, division: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg mt-3 uppercase tracking-widest text-xs transition duration-200"
              >
                {submitting ? 'Updating agent...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Modal Profile */}
      {showViewModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-800">{selectedAgent.name}</h3>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Pincode Agent Profile</span>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Agent ID:</span>
                <span className="text-slate-900 font-mono text-[10px]">{selectedAgent._id}</span>
              </div>

              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Mobile Number:</span>
                <span className="text-slate-800">{selectedAgent.phone || 'N/A'}</span>
              </div>

              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-850 font-semibold select-all">{selectedAgent.user?.email || 'N/A'}</span>
              </div>

              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Assigned District:</span>
                <span className="text-slate-800">{selectedAgent.district || 'N/A'}</span>
              </div>

              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Assigned Division:</span>
                <span className="text-slate-800">{selectedAgent.division || 'N/A'}</span>
              </div>

              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Assigned Pincode:</span>
                <span className="text-slate-800">{selectedAgent.pincode || 'N/A'}</span>
              </div>

              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Status:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedAgent.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600'}`}>
                  {selectedAgent.status}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs font-bold text-slate-500 space-y-2 mt-4">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Performance Statistics</span>
              <div className="flex justify-between">
                <span>Target Shops:</span>
                <span className="text-slate-850">100</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="text-emerald-600">85%</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PincodeAgents;
