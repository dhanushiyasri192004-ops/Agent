import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  TrendingUp,
  Map,
  Users,
  Store,
  MapPin,
  Clock,
  Compass,
  Award,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  Mail,
  Phone
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

const DivisionalDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Explorer Tree States
  const [agentsList, setAgentsList] = useState([]);
  const [shopsList, setShopsList] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [selectedAgentDetails, setSelectedAgentDetails] = useState(null);
  const [selectedPincodeDetails, setSelectedPincodeDetails] = useState(null);
  const [activeKpiTab, setActiveKpiTab] = useState(null); // 'pincode-agents' or null

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
      console.error('Error fetching divisional hierarchy lists:', err);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/api/dashboard/metrics', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching divisional metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildHierarchy = () => {
    const rootName = assignedDivision;
    const hierarchy = {
      name: rootName,
      type: 'division',
      id: rootName,
      pincodes: {}
    };

    const divRegex = new RegExp(rootName.replace(/Division/i, '').trim(), 'i');
    const divisionalAgents = agentsList.filter(a => a.division && divRegex.test(a.division));

    divisionalAgents.forEach(agent => {
      const pin = agent.pincode;

      if (agent.role === 'Divisional Agent' || agent.role === 'District Agent' || agent.role === 'State Agent') return;

      if (pin && pin !== 'Unassigned' && pin !== 'Unassigned Pincode') {
        if (!hierarchy.pincodes[pin]) {
          hierarchy.pincodes[pin] = {
            name: pin,
            type: 'pincode',
            id: `${rootName}-${pin}`,
            agents: []
          };
        }

        if (agent.role === 'Pincode Agent') {
          hierarchy.pincodes[pin].agents.push(agent);
        }
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
      const rootName = assignedDivision;
      const updatedExpanded = { [rootName]: true };
      
      const divRegex = new RegExp(rootName.replace(/Division/i, '').trim(), 'i');
      const divisionalAgents = agentsList.filter(a => a.division && divRegex.test(a.division));
      
      divisionalAgents.forEach(a => {
        if (a.pincode) updatedExpanded[`${rootName}-${a.pincode}`] = true;
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

  const divisionDistrictMap = {
    'chennai': [
      { name: 'Chennai', pincodes: 150, shops: '2,450' },
      { name: 'Chengalpattu', pincodes: 95, shops: '1,850' },
      { name: 'Kanchipuram', pincodes: 80, shops: '1,200' },
      { name: 'Tiruvallur', pincodes: 75, shops: '900' }
    ],
    'vellore': [
      { name: 'Vellore', pincodes: 90, shops: '1,500' },
      { name: 'Ranipet', pincodes: 65, shops: '1,100' },
      { name: 'Tirupathur', pincodes: 55, shops: '850' },
      { name: 'Tiruvannamalai', pincodes: 70, shops: '950' }
    ],
    'salem': [
      { name: 'Salem', pincodes: 110, shops: '2,100' },
      { name: 'Namakkal', pincodes: 75, shops: '1,300' },
      { name: 'Dharmapuri', pincodes: 60, shops: '950' },
      { name: 'Krishnagiri', pincodes: 70, shops: '1,050' }
    ],
    'coimbatore': [
      { name: 'Coimbatore', pincodes: 120, shops: '2,450' },
      { name: 'Tiruppur', pincodes: 85, shops: '1,850' },
      { name: 'Erode', pincodes: 60, shops: '1,200' },
      { name: 'The Nilgiris', pincodes: 55, shops: '900' }
    ],
    'tiruchirappalli': [
      { name: 'Tiruchirappalli', pincodes: 100, shops: '1,950' },
      { name: 'Karur', pincodes: 55, shops: '950' },
      { name: 'Perambalur', pincodes: 40, shops: '650' },
      { name: 'Ariyalur', pincodes: 45, shops: '700' }
    ],
    'thanjavur': [
      { name: 'Thanjavur', pincodes: 95, shops: '1,750' },
      { name: 'Tiruvarur', pincodes: 60, shops: '1,050' },
      { name: 'Nagapattinam', pincodes: 55, shops: '900' },
      { name: 'Mayiladuthurai', pincodes: 50, shops: '800' }
    ],
    'madurai': [
      { name: 'Madurai', pincodes: 115, shops: '2,150' },
      { name: 'Dindigul', pincodes: 80, shops: '1,450' },
      { name: 'Theni', pincodes: 60, shops: '950' },
      { name: 'Sivagangai', pincodes: 55, shops: '850' },
      { name: 'Ramanathapuram', pincodes: 65, shops: '900' }
    ],
    'tirunelveli': [
      { name: 'Tirunelveli', pincodes: 105, shops: '1,850' },
      { name: 'Tenkasi', pincodes: 70, shops: '1,150' },
      { name: 'Thoothukudi', pincodes: 75, shops: '1,250' },
      { name: 'Kanniyakumari', pincodes: 80, shops: '1,350' },
      { name: 'Virudhunagar', pincodes: 70, shops: '1,100' }
    ]
  };

  const assignedDivision = user?.agentInfo?.division || user?.division || metrics?.division || 'Salem East Division';
  const displayDivisionTitle = assignedDivision.toLowerCase().includes('agent') ? assignedDivision : `${assignedDivision} Agent`;

  // Filter pincode agents belonging to this division
  const divRegex = new RegExp(assignedDivision.replace(/Division/i, '').trim(), 'i');
  const pincodeAgentsInDiv = agentsList.filter(a => a.role === 'Pincode Agent' && a.division && divRegex.test(a.division));

  // Get unique pincodes & metrics in this division
  const pincodeMap = {};
  pincodeAgentsInDiv.forEach(a => {
    const pin = a.pincode || 'Unassigned Pincode';
    if (!pincodeMap[pin]) {
      pincodeMap[pin] = {
        pincode: pin,
        agentName: a.name,
        email: a.email,
        shopsCount: shopsList.filter(s => s.pincode === pin).length
      };
    }
  });

  const livePincodeBreakdown = Object.values(pincodeMap);

  const pincodeAgentsCount = pincodeAgentsInDiv.length;
  const pincodesCount = Object.keys(pincodeMap).length;
  const shopsCount = shopsList.filter(s => s.division && divRegex.test(s.division)).length;

  const lineChartData = metrics?.trendData && metrics.trendData.length > 0 ? metrics.trendData : [
    { name: '01 May', performance: 0 },
    { name: '06 May', performance: 0 },
    { name: '11 May', performance: 0 },
    { name: '16 May', performance: 0 },
    { name: '21 May', performance: 0 },
    { name: '26 May', performance: 0 },
    { name: '31 May', performance: 0 },
  ];

  const pieData = [
    { name: 'Pincode Agents', value: pincodeAgentsCount, color: '#3b82f6' },
    { name: 'Managed Pincodes', value: pincodesCount, color: '#f59e0b' },
  ];

  const filteredActivities = [];
  const hierarchy = buildHierarchy();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Welcome back, {displayDivisionTitle} 👋</h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">Division performance and activity monitor for {assignedDivision}.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pincodes Managed */}
        <button
          onClick={() => toggleKpiTab('pincode-agents')}
          className={`text-left rounded-xl p-5 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-200 hover:scale-[1.02] focus:outline-none ${
            activeKpiTab === 'pincode-agents' ? 'bg-[#3b82f6] text-white ring-4 ring-[#f5c518] ring-offset-2' : 'bg-white border border-slate-200/80'
          }`}
        >
          <div>
            <span className={`text-3xl font-black ${activeKpiTab === 'pincode-agents' ? 'text-white' : 'text-slate-800'}`}>{pincodesCount}</span>
            <h3 className={`text-sm mt-1.5 font-bold ${activeKpiTab === 'pincode-agents' ? 'text-blue-105' : 'text-slate-500'}`}>Pincodes Managed</h3>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            activeKpiTab === 'pincode-agents' ? 'bg-white/10 border-white/20 text-white' : 'bg-blue-500/10 border-blue-500/25 text-blue-500'
          }`}>
            <Compass className="w-6 h-6" />
          </div>
        </button>

        {/* Pincode Agents */}
        <button
          onClick={() => toggleKpiTab('pincode-agents')}
          className={`text-left rounded-xl p-5 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-200 hover:scale-[1.02] focus:outline-none ${
            activeKpiTab === 'pincode-agents' ? 'bg-[#3b82f6] text-white ring-4 ring-[#f5c518] ring-offset-2' : 'bg-white border border-slate-200/80'
          }`}
        >
          <div>
            <span className={`text-3xl font-black ${activeKpiTab === 'pincode-agents' ? 'text-white' : 'text-slate-800'}`}>{pincodeAgentsCount}</span>
            <h3 className={`text-sm mt-1.5 font-bold ${activeKpiTab === 'pincode-agents' ? 'text-blue-105' : 'text-slate-500'}`}>Pincode Agents</h3>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            activeKpiTab === 'pincode-agents' ? 'bg-white/10 border-white/20 text-white' : 'bg-indigo-500/10 border-indigo-500/25 text-indigo-500'
          }`}>
            <Users className="w-6 h-6" />
          </div>
        </button>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{shopsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Shops Registered</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{metrics?.pendingReportsCount || 0}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Pincode Reports</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-600">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Division Performance Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Division Performance</h3>
            <span className="text-xs text-forge-gold font-bold uppercase border border-forge-gold/30 bg-amber-50 px-2 py-0.5 rounded">This Month</span>
          </div>
          <div className="flex-1 h-60 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 8 }} />
                <Line type="monotone" dataKey="performance" stroke="#d9a32c" name="Activity Rate" strokeWidth={2.5} dot={{ fill: '#d9a32c' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pincode Breakdown Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Pincode Breakdown</h3>
              <span className="text-xs text-slate-400 font-bold">{assignedDivision}</span>
            </div>
            <div className="space-y-3">
              {livePincodeBreakdown.length > 0 ? (
                livePincodeBreakdown.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-extrabold text-slate-700">Pincode: {d.pincode}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Agent: {d.agentName}</p>
                    </div>
                    <span className="font-bold text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-lg">{d.shopsCount} Shops</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-bold italic py-4">No pincodes registered under {assignedDivision} yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Middle Row: Agent Distribution, Recent Activities, Leaders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Agent Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 w-full text-left mb-4">Agent Distribution</h3>
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
          <div className="w-full flex items-center justify-around text-sm mt-4">
            {pieData.map((p, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span className="text-slate-500 font-bold">{p.name} ({p.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 mb-4">Recent Activities</h3>
          <div className="space-y-4 flex-1">
            {metrics?.recentActivities && metrics.recentActivities.length > 0 ? (
              metrics.recentActivities.slice(0, 4).map((activity, idx) => (
                <div key={idx} className="flex gap-3 text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-forge-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">{activity.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activity.user?.email || 'Agent'} • {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((act, idx) => (
                  <div key={idx} className="flex gap-3 text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-forge-gold" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">{act.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Pincodes */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Pincodes Performance</h3>
            <span className="text-xs text-forge-gold font-bold uppercase">{assignedDivision}</span>
          </div>
          <div className="space-y-3.5 flex-1">
            {livePincodeBreakdown.length > 0 ? (
              livePincodeBreakdown.map((pin, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="w-5 font-bold text-slate-400 text-center">{idx + 1}</span>
                  <span className="flex-1 font-bold text-slate-700">Pincode: {pin.pincode}</span>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{pin.shopsCount} Shops</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-bold italic py-4">No active pincode performance data.</p>
            )}
          </div>
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
                  Pincode Agent Hierarchy
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

                  {/* Pincodes under Division */}
                  {expandedNodes[hierarchy.id] && (
                    <div className="pl-6 space-y-1.5 border-l-2 border-slate-200 ml-5 pt-1">
                      {Object.keys(hierarchy.pincodes).map(pinKey => {
                        const pinNode = hierarchy.pincodes[pinKey];
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
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer select-none transition ${
                                selectedPincodeDetails?.pincode === pinNode.name
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'text-slate-700'
                              }`}
                            >
                              {expandedNodes[pinNode.id] ? <ChevronDown className={`w-3.5 h-3.5 shrink-0 ${selectedPincodeDetails?.pincode === pinNode.name ? 'text-white' : 'text-[#f5c518]'}`} /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
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
                          {selectedAgentDetails.division} → {selectedAgentDetails.pincode}
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
                    Select a Pincode or Pincode Agent in the left tree.
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

export default DivisionalDashboard;
