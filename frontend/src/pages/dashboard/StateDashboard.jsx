import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  Cell,
  Legend
} from 'recharts';
import {
  Compass,
  Users,
  MapPin,
  Store,
  Layers,
  Briefcase,
  Hourglass,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  Mail,
  Phone,
  Clock,
  Award,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import api from '../../services/api.js';

const StateDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [performanceRange, setPerformanceRange] = useState('This Month');
  const [revenueRange, setRevenueRange] = useState('This Month');

  // Hierarchy Navigation states
  const [agentsList, setAgentsList] = useState([]);
  const [shopsList, setShopsList] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [selectedAgentDetails, setSelectedAgentDetails] = useState(null);
  const [selectedPincodeDetails, setSelectedPincodeDetails] = useState(null);
  const [activeKpiTab, setActiveKpiTab] = useState(null); // 'agents', 'districts', 'divisions', 'pincodes', or null

  useEffect(() => {
    fetchMetrics();
    fetchHierarchyData();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await api.get('/api/dashboard/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching state metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHierarchyData = async () => {
    try {
      const [agentsRes, shopsRes] = await Promise.all([
        api.get('/api/agents'),
        api.get('/api/shops')
      ]);
      setAgentsList(agentsRes.data || []);
      setShopsList(shopsRes.data || []);
      
      const stateName = user?.agentInfo?.state || 'Tamil Nadu';
      setExpandedNodes({ [stateName]: true });
    } catch (err) {
      console.error('Error fetching hierarchy data:', err);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm('Are you sure you want to permanently delete this agent from the database?')) return;
    try {
      await api.delete(`/api/agents/${agentId}`);
      setSelectedAgentDetails(null);
      fetchHierarchyData();
      fetchMetrics();
    } catch (err) {
      console.error('Error deleting agent:', err);
      alert(err.response?.data?.message || 'Failed to delete agent');
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Are you sure you want to reset the database and restore all default agents, divisions, and pincodes?')) return;
    try {
      setLoading(true);
      await api.post('/api/dashboard/reset-db');
      setSelectedAgentDetails(null);
      setSelectedPincodeDetails(null);
      await Promise.all([
        fetchHierarchyData(),
        fetchMetrics()
      ]);
      alert('Database successfully reset and re-seeded!');
    } catch (err) {
      console.error('Error resetting database:', err);
      alert('Failed to reset database');
    } finally {
      setLoading(false);
    }
  };

  // Grouping function
  const buildHierarchy = () => {
    const stateName = user?.agentInfo?.state || 'Tamil Nadu';
    const hierarchy = {
      name: stateName,
      type: 'state',
      id: stateName,
      districts: {}
    };

    agentsList.forEach(agent => {
      if (agent.role === 'State Agent') return;

      let dist = agent.district;
      if (!dist && agent.role === 'District Agent') {
        dist = agent.name.includes('District') ? agent.name : `${agent.name} District`;
      }
      if (!dist) dist = 'Unassigned District';

      if (!hierarchy.districts[dist]) {
        const distAgent = agentsList.find(a => a.role === 'District Agent' && (a.district === dist || a.name.includes(dist.replace(/District/i, '').trim())));
        hierarchy.districts[dist] = {
          name: dist,
          type: 'district',
          id: `${stateName}-${dist}`,
          agent: distAgent,
          divisions: {}
        };
      }

      let div = agent.division;
      if (!div && agent.role === 'Divisional Agent') {
        div = agent.name.includes('Division') ? agent.name : `${agent.name} Division`;
      }

      if (div && div !== 'Unassigned') {
        if (!hierarchy.districts[dist].divisions[div]) {
          const divAgent = agentsList.find(a => a.role === 'Divisional Agent' && a.division === div);
          hierarchy.districts[dist].divisions[div] = {
            name: div,
            type: 'division',
            id: `${stateName}-${dist}-${div}`,
            agent: divAgent,
            pincodes: {}
          };
        }

        let pin = agent.pincode;
        if (!pin && agent.role === 'Pincode Agent') {
          pin = agent.name.replace(/[^0-9]/g, '') || 'General Pincode';
        }

        if (pin && pin !== 'Unassigned') {
          if (!hierarchy.districts[dist].divisions[div].pincodes[pin]) {
            hierarchy.districts[dist].divisions[div].pincodes[pin] = {
              name: pin,
              type: 'pincode',
              id: `${stateName}-${dist}-${div}-${pin}`,
              agents: []
            };
          }
          if (agent.role === 'Pincode Agent' && !hierarchy.districts[dist].divisions[div].pincodes[pin].agents.some(a => a._id === agent._id)) {
            hierarchy.districts[dist].divisions[div].pincodes[pin].agents.push(agent);
          }
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
      setActiveKpiTab(null); // collapse
    } else {
      setActiveKpiTab(tab); // expand
      
      // Auto-expand hierarchy nodes relevant to that tab
      const stateName = user?.agentInfo?.state || 'Tamil Nadu';
      const updatedExpanded = { [stateName]: true };
      
      if (tab === 'divisions' || tab === 'pincodes' || tab === 'agents') {
        agentsList.forEach(a => {
          if (a.district) updatedExpanded[`${stateName}-${a.district}`] = true;
          if (tab === 'pincodes' || tab === 'agents') {
            if (a.district && a.division) updatedExpanded[`${stateName}-${a.district}-${a.division}`] = true;
          }
          if (tab === 'agents') {
            if (a.district && a.division && a.pincode) updatedExpanded[`${stateName}-${a.district}-${a.division}-${a.pincode}`] = true;
          }
        });
      }
      setExpandedNodes(updatedExpanded);
    }
  };

  // Mock Performance Data
  const lineChartData = metrics?.trendData && metrics.trendData.length > 0 ? metrics.trendData : [
    { name: '01 May', revenue: 0, vendors: 0, agents: 0 },
    { name: '06 May', revenue: 0, vendors: 0, agents: 0 },
    { name: '11 May', revenue: 0, vendors: 0, agents: 0 },
    { name: '16 May', revenue: 0, vendors: 0, agents: 0 },
    { name: '21 May', revenue: 0, vendors: 0, agents: 0 },
    { name: '26 May', revenue: 0, vendors: 0, agents: 0 },
    { name: '31 May', revenue: 0, vendors: 0, agents: 0 },
  ];

  const subAgentsList = agentsList.filter(a => a.role !== 'State Agent');

  const districtAgentsCount = subAgentsList.filter(a => a.role === 'District Agent').length || (metrics?.agentDistribution?.districtAgents || 0);
  const divisionalAgentsCount = subAgentsList.filter(a => a.role === 'Divisional Agent').length || (metrics?.agentDistribution?.divisionalAgents || 0);
  const pincodeAgentsCount = subAgentsList.filter(a => a.role === 'Pincode Agent').length || (metrics?.agentDistribution?.pincodeAgents || 0);

  const totalAgentsCount = subAgentsList.length || (districtAgentsCount + divisionalAgentsCount + pincodeAgentsCount);

  const registeredDistrictsSet = new Set(
    subAgentsList.filter(a => a.role === 'District Agent' || (a.district && a.district !== 'Unassigned' && a.district !== 'Unassigned District')).map(a => a.district || a.name)
  );
  const registeredDivisionsSet = new Set(
    subAgentsList.filter(a => a.role === 'Divisional Agent' || (a.division && a.division !== 'Unassigned' && a.division !== 'Unassigned Division')).map(a => a.division || a.name)
  );

  const districtsCount = registeredDistrictsSet.size > 0 ? registeredDistrictsSet.size : (metrics?.districtsCount || districtAgentsCount);
  const divisionsCount = registeredDivisionsSet.size > 0 ? registeredDivisionsSet.size : (metrics?.divisionsCount || divisionalAgentsCount);

  // Doughnut Pie Data
  const pieData = [
    { name: 'District Agents', value: districtAgentsCount, color: '#10b981' },
    { name: 'Divisional Agents', value: divisionalAgentsCount, color: '#3b82f6' },
    { name: 'Pincode Agents', value: pincodeAgentsCount, color: '#8b5cf6' },
  ];

  // Performance by Division table derived dynamically from live agents
  const divisionPerformanceMap = {};
  agentsList.forEach(a => {
    const div = a.division || 'Unassigned';
    if (!divisionPerformanceMap[div]) {
      divisionPerformanceMap[div] = { name: div, agentsCount: 0 };
    }
    divisionPerformanceMap[div].agentsCount += 1;
  });

  const divisionPerformance = Object.keys(divisionPerformanceMap).map((key, idx) => ({
    name: key,
    agents: divisionPerformanceMap[key].agentsCount.toLocaleString(),
    target: '100%',
    achieved: '100%',
    revenue: `₹ ${(divisionPerformanceMap[key].agentsCount * 5000).toLocaleString()}`,
    activity: '100%',
    rank: idx + 1
  }));

  // Performers derived dynamically from live agents
  const activeAgents = agentsList.filter(a => a.status === 'Active' || a.status === 'Approved');
  const inactiveAgents = agentsList.filter(a => a.status === 'Pending' || a.status === 'Inactive');

  const topPerformers = activeAgents.slice(0, 3).map(a => ({
    name: a.name || a.user?.email || 'Active Agent',
    role: a.role || 'Agent',
    value: '100%'
  }));

  const bottomPerformers = inactiveAgents.slice(0, 3).map(a => ({
    name: a.name || a.user?.email || 'Pending Agent',
    role: a.role || 'Agent',
    value: '0%'
  }));

  const hierarchy = buildHierarchy();

  return (
    <div className="space-y-6">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            Welcome back, {user?.agentInfo?.state || user?.state || 'Tamil Nadu'} State Agent 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">
            Complete state-wide monitoring and management dashboard for {user?.agentInfo?.state || user?.state || 'Tamil Nadu'}.
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={handleResetDatabase}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold px-3.5 py-1.5 rounded-lg text-xs transition duration-200 shadow-sm active:scale-95"
          >
            Reset & Re-Seed Database
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">State</span>
            <span className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 select-none">
              {user?.agentInfo?.state || 'Tamil Nadu'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Solid Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        
        {/* 1. Total Agents Card */}
        <button
          onClick={() => toggleKpiTab('agents')}
          className={`text-left rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-200 hover:scale-[1.02] focus:outline-none ${
            activeKpiTab === 'agents' ? 'bg-[#3b82f6] text-white ring-4 ring-[#f5c518] ring-offset-2' : 'bg-[#4f46e5] text-white'
          }`}
        >
          <div>
            <p className="text-[10px] uppercase font-black text-indigo-200 tracking-widest opacity-90">Total Agents</p>
            <p className="text-2xl font-black mt-1">
              {Number(totalAgentsCount || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <Users className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </button>

        {/* 2. Total Districts Card */}
        <button
          onClick={() => toggleKpiTab('districts')}
          className={`text-left rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-200 hover:scale-[1.02] focus:outline-none ${
            activeKpiTab === 'districts' ? 'bg-[#3b82f6] text-white ring-4 ring-[#f5c518] ring-offset-2' : 'bg-[#065f46] text-white'
          }`}
        >
          <div>
            <p className="text-[10px] uppercase font-black text-emerald-200 tracking-widest opacity-90">Total Districts</p>
            <p className="text-2xl font-black mt-1">{Number(districtsCount || 0).toLocaleString()}</p>
          </div>
          <div>
            <Users className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </button>

        {/* 3. Total Divisions Card */}
        <button
          onClick={() => toggleKpiTab('divisions')}
          className={`text-left rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-200 hover:scale-[1.02] focus:outline-none ${
            activeKpiTab === 'divisions' ? 'bg-[#3b82f6] text-white ring-4 ring-[#f5c518] ring-offset-2' : 'bg-[#1e40af] text-white'
          }`}
        >
          <div>
            <p className="text-[10px] uppercase font-black text-blue-200 tracking-widest opacity-90">Total Divisions</p>
            <p className="text-2xl font-black mt-1">{Number(divisionsCount || 0).toLocaleString()}</p>
          </div>
          <div>
            <Compass className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </button>

        {/* 4. Pincode Agents Card */}
        <button
          onClick={() => toggleKpiTab('pincodes')}
          className={`text-left rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-200 hover:scale-[1.02] focus:outline-none ${
            activeKpiTab === 'pincodes' ? 'bg-[#3b82f6] text-white ring-4 ring-[#f5c518] ring-offset-2' : 'bg-[#6b21a8] text-white'
          }`}
        >
          <div>
            <p className="text-[10px] uppercase font-black text-purple-200 tracking-widest opacity-90">Pincode Agents</p>
            <p className="text-2xl font-black mt-1">
              {Number(pincodeAgentsCount || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <MapPin className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </button>

        {/* 5. Total Vendors */}
        <div className="bg-[#c2410c] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-orange-200 tracking-widest opacity-90">Total Vendors</p>
            <p className="text-2xl font-black mt-1">
              {Number(shopsList.length || metrics?.shopsRegisteredCount || 0).toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <Users className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </div>

        {/* 6. Active Projects */}
        <div className="bg-[#0f766e] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-teal-200 tracking-widest opacity-90">Active Projects</p>
            <p className="text-2xl font-black mt-1">{metrics?.activeProjects || 0}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <Briefcase className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </div>

        {/* 7. Total Revenue */}
        <div className="bg-[#be123c] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-rose-200 tracking-widest opacity-90">Total Revenue</p>
            <p className="text-2xl font-black mt-1">
              {shopsList.length ? `₹ ${(shopsList.length * 0.05).toFixed(2)} Cr` : (metrics?.shopsRegisteredCount ? `₹ ${(metrics.shopsRegisteredCount * 0.05).toFixed(2)} Cr` : '₹ 0.00 Cr')}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="w-5 h-5 flex items-center justify-center font-bold text-base opacity-40 absolute bottom-4 right-4">₹</span>
          </div>
        </div>

        {/* 8. Pending Approvals */}
        <div className="bg-[#b45309] text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-32 relative overflow-hidden">
          <div>
            <p className="text-[10px] uppercase font-black text-amber-200 tracking-widest opacity-90">Pending Approvals</p>
            <p className="text-2xl font-black mt-1">{metrics?.pendingReportsCount || 0}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <Hourglass className="w-5 h-5 opacity-40 absolute bottom-4 right-4" />
          </div>
        </div>
      </div>

      {/* DYNAMIC HIERARCHY MODAL (Shown when a KPI card is clicked) */}
      {activeKpiTab && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full p-6 shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn relative">
            {/* Left Navigation Tree Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  {activeKpiTab === 'agents' && 'All Agents'}
                  {activeKpiTab === 'districts' && 'Districts'}
                  {activeKpiTab === 'divisions' && 'Divisions'}
                  {activeKpiTab === 'pincodes' && 'Pincodes'}
                </h3>
              </div>
              <button
                onClick={() => setActiveKpiTab(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-650"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 space-y-2 overflow-y-auto max-h-[400px]">
              {/* Root State Node: Tamil Nadu */}
              <div className="space-y-1">
                <div
                  onClick={() => toggleNode(hierarchy.id)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-black text-[#034ea2] bg-blue-50/80 hover:bg-blue-100/80 cursor-pointer select-none border border-blue-200/60 shadow-sm transition"
                >
                  {expandedNodes[hierarchy.id] ? <ChevronDown className="w-4 h-4 text-[#f5c518] shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                  <Compass className="w-4.5 h-4.5 text-[#034ea2]" />
                  <span>{hierarchy.name}</span>
                </div>

                {/* Expanded State Level: Districts */}
                {expandedNodes[hierarchy.id] && (
                  <div className="pl-5 space-y-2 border-l-2 border-slate-200 ml-4 pt-1">
                    {/* Districts List */}
                    {Object.keys(hierarchy.districts).length > 0 ? (
                      Object.keys(hierarchy.districts).map(distKey => {
                      const distNode = hierarchy.districts[distKey];
                      const divKeys = Object.keys(distNode.divisions);
                      const divCount = agentsList.filter(a => a.district === distNode.name && a.role === 'Divisional Agent').length;
                      const pinCount = agentsList.filter(a => a.district === distNode.name && a.role === 'Pincode Agent').length;
                      return (
                        <div key={distNode.id} className="space-y-1">
                          <div
                            onClick={() => {
                              toggleNode(distNode.id);
                              if (distNode.agent) {
                                setSelectedAgentDetails(distNode.agent);
                                setSelectedPincodeDetails(null);
                              }
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 cursor-pointer select-none transition ${
                              selectedAgentDetails?._id === distNode.agent?._id && distNode.agent?._id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {expandedNodes[distNode.id] || activeKpiTab === 'districts' ? <ChevronDown className="w-3.5 h-3.5 text-[#f5c518] shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                              <span>{distNode.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-extrabold">Division Agents: {divCount}</span>
                              <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-extrabold">Pincode Agents: {pinCount}</span>
                            </div>
                          </div>

                          {/* Divisions under District */}
                          {(expandedNodes[distNode.id] || activeKpiTab === 'divisions' || activeKpiTab === 'pincodes') && (
                            <div className="pl-5 space-y-1.5 border-l-2 border-dashed border-slate-200 ml-4 pt-1">
                              {divKeys.map(divKey => {
                                const divNode = distNode.divisions[divKey];
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
                                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-150/40 cursor-pointer select-none transition ${
                                        selectedAgentDetails?._id === divNode.agent?._id && divNode.agent?._id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
                                      }`}
                                    >
                                      {expandedNodes[divNode.id] || activeKpiTab === 'divisions' ? <ChevronDown className="w-3.5 h-3.5 text-[#f5c518] shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                                      <span>{divNode.name}</span>
                                    </div>

                                    {/* Pincodes under Division */}
                                    {(expandedNodes[divNode.id] || activeKpiTab === 'pincodes') && (
                                      <div className="pl-5 space-y-1 border-l-2 border-slate-200 ml-4 pt-1">
                                        {pinKeys.map(pinKey => {
                                          const pinNode = divNode.pincodes[pinKey];
                                          const pinAgent = pinNode.agents[0];
                                          return (
                                            <div key={pinNode.id} className="space-y-1">
                                              <div
                                                onClick={() => {
                                                  toggleNode(pinNode.id);
                                                  if (pinAgent) {
                                                    setSelectedAgentDetails(pinAgent);
                                                    setSelectedPincodeDetails(null);
                                                  } else {
                                                    setSelectedPincodeDetails({
                                                      pincode: pinNode.name,
                                                      division: divNode.name,
                                                      district: distNode.name,
                                                      agents: pinNode.agents
                                                    });
                                                    setSelectedAgentDetails(null);
                                                  }
                                                }}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer select-none"
                                              >
                                                {expandedNodes[pinNode.id] || activeKpiTab === 'pincodes' ? <ChevronDown className="w-3 h-3 text-[#f5c518] shrink-0" /> : <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                                                <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                                                <span>Pincode: {pinNode.name}</span>
                                              </div>

                                              {/* Agents under Pincode */}
                                              {expandedNodes[pinNode.id] && pinNode.agents && pinNode.agents.length > 0 && (
                                                <div className="pl-5 space-y-1 ml-3 pt-1">
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
                                                      <Users className="w-3.5 h-3.5 text-purple-600" />
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
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-400 font-bold italic p-3 bg-slate-100/50 rounded-xl">
                      No registered sub-agents under Tamil Nadu yet.
                    </p>
                  )}
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
                      <div className="flex items-center gap-2 text-slate-500">
                        <Award className="w-4 h-4 text-slate-405 shrink-0" />
                        <span>Agent ID</span>
                      </div>
                      <span className="text-slate-800 font-mono text-[10px]">{selectedAgentDetails._id}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Phone className="w-4 h-4 text-slate-405 shrink-0" />
                        <span>Mobile</span>
                      </div>
                      <span className="text-slate-800">{selectedAgentDetails.phone || 'N/A'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Mail className="w-4 h-4 text-slate-405 shrink-0" />
                        <span>Email</span>
                      </div>
                      <span className="text-slate-800 lowercase">{selectedAgentDetails.user?.email || 'N/A'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-4 h-4 text-slate-405 shrink-0" />
                        <span>Region Bounds</span>
                      </div>
                      <span className="text-slate-850 text-right text-[11px] max-w-[180px] truncate">
                        {selectedAgentDetails.role === 'District Agent'
                          ? selectedAgentDetails.district
                          : selectedAgentDetails.role === 'Divisional Agent'
                          ? `${selectedAgentDetails.district} → ${selectedAgentDetails.division}`
                          : `${selectedAgentDetails.division} → ${selectedAgentDetails.pincode}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Store className="w-4 h-4 text-slate-405 shrink-0" />
                        <span>Shops Managed</span>
                      </div>
                      <span className="text-slate-800">
                        {selectedAgentDetails.role === 'District Agent'
                          ? shopsList.filter(s => s.district === selectedAgentDetails.district).length
                          : selectedAgentDetails.role === 'Divisional Agent'
                          ? shopsList.filter(s => s.district === selectedAgentDetails.district && s.division === selectedAgentDetails.division).length
                          : shopsList.filter(s => s.pincode === selectedAgentDetails.pincode).length
                        } Shops
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/agent-management', { state: { selectedAgent: selectedAgentDetails } })}
                    className="w-full bg-[#034ea2] hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow-md transition duration-200 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    <span>View Detailed Analytics</span>
                  </button>

                  <button
                    onClick={() => handleDeleteAgent(selectedAgentDetails._id)}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-2 rounded-lg transition duration-200 tracking-wider text-xs flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Agent Permanently</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-400 font-semibold mt-1 flex items-center justify-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                    </span>
                    <span>Verified Active Profile</span>
                  </p>
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
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{user?.agentInfo?.state || 'Tamil Nadu'} State</span>
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

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Verified Shops</span>
                      <span className="text-emerald-600">
                        {selectedPincodeDetails.shops?.filter(s => s.verificationStatus === 'Verified').length || 0} Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Pending Registrations</span>
                      <span className="text-amber-600">
                        {selectedPincodeDetails.shops?.filter(s => s.verificationStatus === 'Pending').length || 0} Pending
                      </span>
                    </div>
                  </div>

                  {/* List of Shops */}
                  <div className="space-y-2 mt-2">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Shops & Vendors</h5>
                    {selectedPincodeDetails.shops?.length > 0 ? (
                      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                        {selectedPincodeDetails.shops.map((shop, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-[11px] font-bold text-slate-700 flex justify-between items-center">
                            <div>
                              <span className="block font-black text-slate-800">{shop.name}</span>
                              <span className="block text-[9px] text-slate-400 mt-0.5">{shop.address}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                              shop.verificationStatus === 'Verified'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {shop.verificationStatus || 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 font-semibold italic">No shops registered in this pincode yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Users className="w-10 h-10 text-slate-355 mb-2" />
                <h4 className="text-xs font-bold text-slate-600 font-black">No Agent Selected</h4>
                <p className="text-[10px] font-semibold mt-1">
                  Select a Pincode Agent or Pincode in the left tree to display complete details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Row 2: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Performance Overview</h3>
            <select
              value={performanceRange}
              onChange={(e) => setPerformanceRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-bold text-slate-600 outline-none"
            >
              <option value="This Month">This Month</option>
              <option value="This Week">This Week</option>
            </select>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue (₹)" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="vendors" stroke="#10b981" name="Vendors" strokeWidth={2} dot={{ fill: '#10b981' }} />
                <Line type="monotone" dataKey="agents" stroke="#8b5cf6" name="Agents" strokeWidth={2} dot={{ fill: '#8b5cf6' }} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Distribution Chart */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 mb-4">Agent Distribution</h3>
          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
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
            <div className="absolute text-center">
              <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total</span>
              <span className="block text-2xl font-black text-slate-800">{totalAgentsCount}</span>
              <span className="block text-slate-400 text-[9px] font-bold">Agents</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-bold text-slate-500 pt-4 border-t border-slate-100">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="text-slate-800">{item.value} ({totalAgentsCount > 0 ? ((item.value / totalAgentsCount) * 100).toFixed(0) : 0}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Top/Bottom Performers */}
      <div className="mt-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Top & Bottom Performers (Agents)</h3>
            <span onClick={() => navigate('/performance')} className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1"><Check className="w-4.5 h-4.5" /> Top Performers</h4>
              <div className="space-y-2 text-xs font-bold text-slate-600">
                {topPerformers.map((a, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                    <div>
                      <span className="text-slate-855 font-extrabold block">{a.name}</span>
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
                {bottomPerformers.length > 0 ? (
                  bottomPerformers.map((a, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-1.5 last:border-0 last:pb-0 font-semibold">
                      <div>
                        <span className="text-slate-855 font-extrabold block">{a.name}</span>
                        <span className="text-[9px] text-slate-400 block">{a.role}</span>
                      </div>
                      <span className="text-rose-600 font-black">{a.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 font-semibold italic">No bottom performers (100% active target rate)</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StateDashboard;
