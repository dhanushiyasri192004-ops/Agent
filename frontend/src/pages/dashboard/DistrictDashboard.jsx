import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  TrendingUp,
  MapPin,
  Users,
  Store,
  FileCheck,
  Clock,
  Award,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  Mail,
  Phone,
  Compass
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

const DistrictDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Explorer Tree States
  const [agentsList, setAgentsList] = useState([]);
  const [shopsList, setShopsList] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [selectedAgentDetails, setSelectedAgentDetails] = useState(null);
  const [selectedPincodeDetails, setSelectedPincodeDetails] = useState(null);
  const [activeKpiTab, setActiveKpiTab] = useState(null); // 'divisional-agents', 'pincode-agents', or null

  useEffect(() => {
    fetchMetrics();
    fetchHierarchyData();
  }, []);

  const fetchHierarchyData = async () => {
    try {
      const token = user?.token;
      const headers = { Authorization: `Bearer ${token}` };
      const [agentsRes, shopsRes] = await Promise.all([
        axios.get('/api/agents', { headers }),
        axios.get('/api/shops', { headers })
      ]);
      setAgentsList(agentsRes.data || []);
      setShopsList(shopsRes.data || []);
    } catch (err) {
      console.error('Error fetching district hierarchy lists:', err);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/api/dashboard/metrics', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching district metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildHierarchy = () => {
    const rootName = assignedDistrict;
    const hierarchy = {
      name: rootName,
      type: 'district',
      id: rootName,
      divisions: {}
    };

    const districtRegex = new RegExp(rootName.replace(/District/i, '').trim(), 'i');
    const districtAgents = agentsList.filter(a => a.district && districtRegex.test(a.district));

    districtAgents.forEach(agent => {
      if (agent.role === 'District Agent' || agent.role === 'State Agent') return;

      const div = agent.division || 'General Division';
      const pin = agent.pincode || 'General Pincode';

      if (!hierarchy.divisions[div]) {
        const divAgent = agentsList.find(a => a.role === 'Divisional Agent' && a.division === div);
        hierarchy.divisions[div] = {
          name: div,
          type: 'division',
          id: `${rootName}-${div}`,
          agent: divAgent,
          pincodes: {}
        };
      }

      if (!hierarchy.divisions[div].pincodes[pin]) {
        hierarchy.divisions[div].pincodes[pin] = {
          name: pin,
          type: 'pincode',
          id: `${rootName}-${div}-${pin}`,
          agents: []
        };
      }

      if (agent.role === 'Pincode Agent') {
        hierarchy.divisions[div].pincodes[pin].agents.push(agent);
      }
    });

    return hierarchy;
  };

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const toggleKpiTab = (tab) => {
    setSelectedAgentDetails(null);
    setSelectedPincodeDetails(null);
    if (activeKpiTab === tab) {
      setActiveKpiTab(null);
    } else {
      setActiveKpiTab(tab);
      const rootName = assignedDistrict;
      const updatedExpanded = { [rootName]: true };
      
      const districtRegex = new RegExp(rootName.replace(/District/i, '').trim(), 'i');
      const districtAgents = agentsList.filter(a => a.district && districtRegex.test(a.district));
      
      districtAgents.forEach(a => {
        if (a.division) updatedExpanded[`${rootName}-${a.division}`] = true;
      });
      setExpandedNodes(updatedExpanded);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-forge-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }



  const assignedDistrict = metrics?.district || user?.agentInfo?.district || user?.district || (user?.name?.includes('Salem') ? 'Salem District' : 'Salem District');
  const displayDistrictTitle = assignedDistrict.toLowerCase().includes('agent') ? assignedDistrict : `${assignedDistrict} Agent`;

  const pincodesCount = metrics?.pincodesCount || 0;
  const pincodeAgentsCount = metrics?.pincodeAgentsCount || 0;
  const divisionalAgentsCount = metrics?.divisionalAgentsCount || 0;
  const shopsCount = metrics?.shopsRegisteredCount || 0;
  const reportsCount = metrics?.reportsSubmittedCount || 0;

  const lineChartData = [
    { name: 'May 12', performance: shopsCount > 0 ? 25 : 0 },
    { name: 'May 13', performance: shopsCount > 0 ? 48 : 0 },
    { name: 'May 14', performance: shopsCount > 0 ? 38 : 0 },
    { name: 'May 15', performance: shopsCount > 0 ? 62 : 0 },
    { name: 'May 16', performance: shopsCount > 0 ? 55 : 0 },
    { name: 'May 17', performance: shopsCount > 0 ? 72 : 0 },
    { name: 'May 18', performance: shopsCount > 0 ? 90 : 0 },
  ];

  const pieData = [
    { name: 'Active', value: pincodeAgentsCount, color: '#10b981' },
    { name: 'Pending', value: 0, color: '#f59e0b' },
    { name: 'Inactive', value: 0, color: '#94a3b8' },
  ];

  const reportsPieData = [
    { name: 'Submitted', value: reportsCount, color: '#10b981' },
    { name: 'Pending', value: 0, color: '#f59e0b' },
    { name: 'Rejected', value: 0, color: '#ef4444' },
  ];

  const pincodeOverview = metrics?.pincodeOverview || [];
  const hierarchy = buildHierarchy();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Welcome back, {displayDistrictTitle} 👋</h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">District level progress monitoring dashboard for {assignedDistrict}.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Divisional Agents */}
        <button
          onClick={() => toggleKpiTab('divisional-agents')}
          className={`text-left rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-200 hover:scale-[1.02] focus:outline-none ${
            activeKpiTab === 'divisional-agents' ? 'bg-[#3b82f6] text-white ring-4 ring-[#f5c518] ring-offset-2' : 'bg-[#4f46e5] text-white'
          }`}
        >
          <div>
            <p className="text-[10px] uppercase font-black text-indigo-200 tracking-widest opacity-90">Divisional Agents</p>
            <p className="text-2xl font-black mt-1">
              {Number(divisionalAgentsCount || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <Users className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </button>

        {/* 2. Pincode Agents */}
        <button
          onClick={() => toggleKpiTab('pincode-agents')}
          className={`text-left rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-200 hover:scale-[1.02] focus:outline-none ${
            activeKpiTab === 'pincode-agents' ? 'bg-[#3b82f6] text-white ring-4 ring-[#f5c518] ring-offset-2' : 'bg-[#6b21a8] text-white'
          }`}
        >
          <div>
            <p className="text-[10px] uppercase font-black text-purple-200 tracking-widest opacity-90">Pincode Agents</p>
            <p className="text-2xl font-black mt-1">
              {Number(pincodeAgentsCount || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <Users className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </button>

        {/* 3. Shops Registered */}
        <div className="bg-[#c2410c] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-orange-200 tracking-widest opacity-90">Shops Registered</p>
            <p className="text-2xl font-black mt-1">
              {Number(shopsCount || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <Store className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </div>

        {/* 4. Reports Submitted */}
        <div className="bg-[#b45309] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-amber-200 tracking-widest opacity-90">Reports Submitted</p>
            <p className="text-2xl font-black mt-1">
              {Number(reportsCount || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <FileCheck className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </div>

      </div>

      {/* Main Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* District Performance Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">{assignedDistrict} Performance</h3>
            <span className="text-xs text-forge-gold font-bold uppercase border border-forge-gold/30 bg-amber-50 px-2 py-0.5 rounded">This Week</span>
          </div>
          <div className="flex-1 h-60 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 8 }} />
                <Line type="monotone" dataKey="performance" stroke="#d9a32c" name="Performance" strokeWidth={2.5} dot={{ fill: '#d9a32c' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pincode Overview List */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Pincode Overview</h3>
              <span className="text-xs text-slate-400 font-bold">{assignedDistrict}</span>
            </div>
            {pincodeOverview.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 font-bold border border-dashed border-slate-200 rounded-xl">
                No pincodes registered in {assignedDistrict} yet.
              </div>
            ) : (
              <div className="space-y-4">
                {pincodeOverview.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-forge-gold" />
                      <span className="font-bold text-slate-700">{p.pin}</span>
                    </div>
                    <span className="font-bold text-slate-400">{p.shops} Shops</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Middle Row: Pincode Agent Distribution, Reports Overview, Top Pincodes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pincode Agent Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 w-full text-left mb-4">Pincode Agent Distribution</h3>
          {pincodeAgentsCount === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-bold border border-dashed border-slate-200 rounded-xl w-full">
              No pincode agents registered in {assignedDistrict} yet.
            </div>
          ) : (
            <>
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
              <div className="w-full flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm mt-4">
                {pieData.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                    <span className="text-slate-500 font-bold">{p.name} ({p.value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Reports Overview */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 w-full text-left mb-4">Reports Overview</h3>
          {reportsCount === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-bold border border-dashed border-slate-200 rounded-xl w-full">
              No reports submitted in {assignedDistrict} yet.
            </div>
          ) : (
            <>
              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportsPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {reportsPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm mt-4">
                {reportsPieData.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                    <span className="text-slate-500 font-bold">{p.name} ({p.value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Top Performing Pincodes */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Top Performing Pincodes</h3>
            <span className="text-xs text-forge-gold font-bold uppercase">{assignedDistrict}</span>
          </div>
          {pincodeOverview.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-bold border border-dashed border-slate-200 rounded-xl flex-1 flex items-center justify-center">
              No pincode activity logged in {assignedDistrict} yet.
            </div>
          ) : (
            <div className="space-y-3.5 flex-1">
              {pincodeOverview.slice(0, 5).map((p, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="w-5 font-bold text-slate-400 text-center">{idx + 1}</span>
                  <span className="flex-1 font-bold text-slate-700">{p.pin}</span>
                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-forge-gold h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="w-8 font-bold text-right text-forge-gold">100%</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* HIERARCHY EXPLORER MODAL */}
      {activeKpiTab && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full p-6 shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn relative">
            
            {/* Left Tree Explorer */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-slate-800">
                  {activeKpiTab === 'divisional-agents' ? 'Divisional Hierarchy' : 'Pincode Agent Hierarchy'}
                </h3>
                <button
                  onClick={() => setActiveKpiTab(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-650"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 space-y-2 overflow-y-auto max-h-[400px]">
                {/* Root Node */}
                <div className="space-y-1">
                  <div
                    onClick={() => toggleNode(hierarchy.id)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-extrabold text-[#034ea2] hover:bg-slate-100 cursor-pointer select-none"
                  >
                    {expandedNodes[hierarchy.id] ? <ChevronDown className="w-4 h-4 text-[#f5c518] shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                    <Compass className="w-4.5 h-4.5 text-[#034ea2]" />
                    <span>{hierarchy.name}</span>
                  </div>

                  {/* Divisions under District */}
                  {expandedNodes[hierarchy.id] && (
                    <div className="pl-6 space-y-1.5 border-l-2 border-slate-200 ml-5 pt-1">
                      {Object.keys(hierarchy.divisions).map(divKey => {
                        const divNode = hierarchy.divisions[divKey];
                        const pinKeys = Object.keys(divNode.pincodes);
                        return (
                          <div key={divNode.id} className="space-y-1">
                            <div
                              onClick={() => {
                                toggleNode(divNode.id);
                                if (divNode.agent) {
                                  setSelectedAgentDetails(divNode.agent);
                                  setSelectedPincodeDetails(null);
                                }
                              }}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 cursor-pointer select-none transition ${
                                selectedAgentDetails?._id === divNode.agent?._id && divNode.agent?._id
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'text-slate-700'
                              }`}
                            >
                              {expandedNodes[divNode.id] ? <ChevronDown className="w-3.5 h-3.5 text-[#f5c518] shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                              <span>{divNode.name}</span>
                            </div>

                            {/* Pincodes under Division */}
                            {expandedNodes[divNode.id] && (
                              <div className="pl-6 space-y-1.5 border-l border-dashed border-slate-200 ml-4 pt-1">
                                {pinKeys.map(pinKey => {
                                  const pinNode = divNode.pincodes[pinKey];
                                  return (
                                    <div key={pinNode.id} className="space-y-1">
                                      <div
                                        onClick={() => {
                                          toggleNode(pinNode.id);
                                          setSelectedAgentDetails(null);
                                          setSelectedPincodeDetails({
                                            pincode: pinNode.name,
                                            agents: pinNode.agents,
                                            shops: shopsList.filter(s => s.pincode === pinNode.name)
                                          });
                                        }}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer select-none transition ${
                                          selectedPincodeDetails?.pincode === pinNode.name
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-slate-500 hover:bg-slate-150/40'
                                        }`}
                                      >
                                        {expandedNodes[pinNode.id] ? <ChevronDown className={`w-3 h-3 shrink-0 ${selectedPincodeDetails?.pincode === pinNode.name ? 'text-white' : 'text-[#f5c518]'}`} /> : <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                                        <MapPin className={`w-3.5 h-3.5 ${selectedPincodeDetails?.pincode === pinNode.name ? 'text-white' : 'text-slate-400'}`} />
                                        <span>{pinNode.name}</span>
                                      </div>

                                      {/* Pincode Agents */}
                                      {expandedNodes[pinNode.id] && (
                                        <div className="pl-6 space-y-1 ml-3 pt-1">
                                          {pinNode.agents.map(agent => (
                                            <div
                                              key={agent._id}
                                              onClick={() => {
                                                setSelectedAgentDetails(agent);
                                                setSelectedPincodeDetails(null);
                                              }}
                                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-extrabold cursor-pointer transition ${
                                                selectedAgentDetails?._id === agent._id
                                                  ? 'bg-blue-600 text-white shadow-sm'
                                                  : 'text-slate-700 hover:bg-slate-200/50'
                                              }`}
                                            >
                                              <Users className="w-3.5 h-3.5" />
                                              <span>{agent.name}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Details Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md flex flex-col justify-between min-h-[350px]">
              {selectedAgentDetails ? (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Agent Profile</span>
                      <button
                        onClick={() => setSelectedAgentDetails(null)}
                        className="text-slate-400 hover:text-slate-650"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3.5 mb-5">
                      <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-[#034ea2] text-sm shrink-0">
                        {selectedAgentDetails.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-extrabold text-slate-800">{selectedAgentDetails.name}</span>
                          <span className="w-4.5 h-4.5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white stroke-[3.5]" />
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{selectedAgentDetails.role || 'Agent'}</span>
                      </div>
                    </div>

                    <div className="space-y-4 py-4 border-t border-b border-slate-100 my-4 text-xs font-bold">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Mobile</span>
                        <span className="text-slate-800">{selectedAgentDetails.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Region Bounds</span>
                        <span className="text-slate-850 text-right text-[11px] max-w-[180px] truncate">
                          {selectedAgentDetails.role === 'Divisional Agent'
                            ? `${selectedAgentDetails.district} → ${selectedAgentDetails.division}`
                            : `${selectedAgentDetails.division} → ${selectedAgentDetails.pincode}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedPincodeDetails ? (
                <div className="flex flex-col h-full justify-between overflow-y-auto max-h-[450px] pr-1">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pincode Details</span>
                      <button
                        onClick={() => setSelectedPincodeDetails(null)}
                        className="text-slate-400 hover:text-slate-650"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-black text-blue-600 text-sm shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-base font-extrabold text-slate-800">Pincode: {selectedPincodeDetails.pincode}</span>
                        <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{hierarchy.name}</span>
                      </div>
                    </div>

                    <div className="space-y-4 py-4 border-t border-b border-slate-100 my-4 text-xs font-bold">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Pincode Agent(s)</span>
                        <span className="text-slate-800 text-right max-w-[150px] truncate">
                          {selectedPincodeDetails.agents?.length > 0
                            ? selectedPincodeDetails.agents.map(a => a.name).join(', ')
                            : 'No Pincode Agent Assigned'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Total Shops</span>
                        <span className="text-slate-800">{selectedPincodeDetails.shops?.length || 0} Shops</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <Users className="w-10 h-10 text-slate-355 mb-2" />
                  <h4 className="text-xs font-bold text-slate-600 font-black">No Selection</h4>
                  <p className="text-[10px] font-semibold mt-1">
                    Select a Division, Pincode or Pincode Agent in the left tree.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DistrictDashboard;
