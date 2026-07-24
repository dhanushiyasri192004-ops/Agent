import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Users, Compass, MapPin, ShieldAlert, Check, Clock, UserCheck, Search, Download } from 'lucide-react';
import api from '../../services/api.js';

import DivisionalAgents from './DivisionalAgents.jsx';
import DistrictAgents from './DistrictAgents.jsx';
import PincodeAgents from './PincodeAgents.jsx';

const AgentManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [allAgents, setAllAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedPincode, setSelectedPincode] = useState('All Pincodes');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  useEffect(() => {
    fetchAllAgents();
  }, []);

  useEffect(() => {
    if (location.state?.selectedAgent) {
      const { role } = location.state.selectedAgent;
      if (role === 'District Agent') {
        setActiveTab('district');
      } else if (role === 'Divisional Agent') {
        setActiveTab('divisional');
      } else if (role === 'Pincode Agent') {
        setActiveTab('pincode');
      }
    }
  }, [location.state]);

  const fetchAllAgents = async () => {
    try {
      const response = await api.get('/api/agents');
      setAllAgents(response.data || []);
    } catch (err) {
      console.error('Error fetching all agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const divisionalCount = allAgents.filter(a => a.role === 'Divisional Agent').length;
  const districtCount = allAgents.filter(a => a.role === 'District Agent').length;
  const pincodeCount = allAgents.filter(a => a.role === 'Pincode Agent').length;
  const activeCount = allAgents.filter(a => a.status === 'Active' || a.status === 'Approved').length;

  const handleDistrictChange = (val) => {
    setSelectedDistrict(val);
    setSelectedDivision('All Divisions');
    setSelectedPincode('All Pincodes');
  };

  const handleDivisionChange = (val) => {
    setSelectedDivision(val);
    setSelectedPincode('All Pincodes');
  };

  const uniqueDistricts = ['All Districts', ...Array.from(new Set(allAgents.map(a => a.district).filter(Boolean)))];

  const divisionsForDistrict = selectedDistrict === 'All Districts'
    ? allAgents
    : allAgents.filter(a => a.district === selectedDistrict);
  const uniqueDivisions = ['All Divisions', ...Array.from(new Set(divisionsForDistrict.map(a => a.division).filter(Boolean)))];

  const pincodesForFilters = allAgents.filter(a => {
    const matchesDist = selectedDistrict === 'All Districts' || a.district === selectedDistrict;
    const matchesDiv = selectedDivision === 'All Divisions' || a.division === selectedDivision;
    return matchesDist && matchesDiv;
  });
  const uniquePincodes = ['All Pincodes', ...Array.from(new Set(pincodesForFilters.map(a => a.pincode).filter(Boolean)))];

  const filteredAgents = allAgents.filter(agent => {
    const nameStr = agent.name || '';
    const districtStr = agent.district || '';
    const divisionStr = agent.division || '';
    const pincodeStr = agent.pincode || '';
    const idStr = agent._id || '';

    const matchesSearch = nameStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          districtStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          divisionStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          idStr.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'All Roles' || agent.role === selectedRole;
    const matchesDistrict = selectedDistrict === 'All Districts' || districtStr === selectedDistrict;
    const matchesDivision = selectedDivision === 'All Divisions' || divisionStr === selectedDivision;
    const matchesPincode = selectedPincode === 'All Pincodes' || pincodeStr === selectedPincode;
    const matchesStatus = selectedStatus === 'All Status' || agent.status === selectedStatus;
    return matchesSearch && matchesRole && matchesDistrict && matchesDivision && matchesPincode && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Agent ID', 'Name', 'Role / Level', 'District', 'Division', 'Pincode', 'Phone', 'Status'];
    const rows = filteredAgents.map(agent => [
      agent._id,
      agent.name,
      agent.role,
      agent.district || 'N/A',
      agent.division || 'N/A',
      agent.pincode || 'N/A',
      agent.phone || 'N/A',
      agent.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tamil_Nadu_Agents_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Agent Management</h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">Monitor and manage all levels of agents across Tamil Nadu.</p>
      </div>

      {/* Top Tabs (1st image method) */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest gap-6 pb-2 select-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2 transition-all ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600 font-black' : 'hover:text-slate-700'}`}
        >
          All
        </button>
        {(user?.role === 'State Agent' || user?.role === 'Admin') && (
          <button
            onClick={() => setActiveTab('district')}
            className={`pb-2 transition-all ${activeTab === 'district' ? 'text-blue-600 border-b-2 border-blue-600 font-black' : 'hover:text-slate-700'}`}
          >
            District Agents
          </button>
        )}
        {(user?.role === 'State Agent' || user?.role === 'District Agent' || user?.role === 'Admin') && (
          <button
            onClick={() => setActiveTab('divisional')}
            className={`pb-2 transition-all ${activeTab === 'divisional' ? 'text-blue-600 border-b-2 border-blue-600 font-black' : 'hover:text-slate-700'}`}
          >
            Divisional Agents
          </button>
        )}
        {(user?.role === 'State Agent' || user?.role === 'District Agent' || user?.role === 'Divisional Agent' || user?.role === 'Admin') && (
          <button
            onClick={() => setActiveTab('pincode')}
            className={`pb-2 transition-all ${activeTab === 'pincode' ? 'text-blue-600 border-b-2 border-blue-600 font-black' : 'hover:text-slate-700'}`}
          >
            Pincode Agents
          </button>
        )}
      </div>

      {/* Render selected component tab */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#4f46e5] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
              <div>
                <p className="text-[10px] uppercase font-black text-indigo-200 tracking-widest opacity-90">Total Agents</p>
                <p className="text-2xl font-black mt-1">{allAgents.length}</p>
              </div>
              <Users className="w-8 h-8 text-white opacity-30" />
            </div>

            <div className="bg-[#065f46] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
              <div>
                <p className="text-[10px] uppercase font-black text-emerald-200 tracking-widest opacity-90">Active Agents</p>
                <p className="text-2xl font-black mt-1">{activeCount}</p>
              </div>
              <UserCheck className="w-8 h-8 text-white opacity-30" />
            </div>

            <div className="bg-[#0f766e] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
              <div>
                <p className="text-[10px] uppercase font-black text-teal-200 tracking-widest opacity-90">Divisional Agents</p>
                <p className="text-2xl font-black mt-1">{divisionalCount}</p>
              </div>
              <Compass className="w-8 h-8 text-white opacity-30" />
            </div>

            <div className="bg-[#be123c] text-white rounded-xl p-5 shadow-sm flex items-center justify-between h-28 relative overflow-hidden">
              <div>
                <p className="text-[10px] uppercase font-black text-rose-200 tracking-widest opacity-90">Pincode Agents</p>
                <p className="text-2xl font-black mt-1">{pincodeCount}</p>
              </div>
              <MapPin className="w-8 h-8 text-white opacity-30" />
            </div>
          </div>

          {/* Combined Agents List */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-805">Tamil Nadu Agent Directory</h3>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mt-0.5">Total: {filteredAgents.length} Agents</span>
              </div>

              {/* Filters & Actions Block */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Role Filter */}
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-slate-50 border border-slate-205 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold outline-none focus:border-blue-500 cursor-pointer transition hover:bg-slate-100/50"
                >
                  <option>All Roles</option>
                  <option>State Agent</option>
                  <option>District Agent</option>
                  <option>Divisional Agent</option>
                  <option>Pincode Agent</option>
                </select>

                {/* District Filter */}
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="bg-slate-50 border border-slate-205 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold outline-none focus:border-blue-500 cursor-pointer transition hover:bg-slate-100/50"
                >
                  {uniqueDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {/* Division Filter */}
                <select
                  value={selectedDivision}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="bg-slate-50 border border-slate-205 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold outline-none focus:border-blue-500 cursor-pointer transition hover:bg-slate-100/50"
                >
                  {uniqueDivisions.map(div => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>

                {/* Pincode Filter */}
                <select
                  value={selectedPincode}
                  onChange={(e) => setSelectedPincode(e.target.value)}
                  className="bg-slate-50 border border-slate-205 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold outline-none focus:border-blue-500 cursor-pointer transition hover:bg-slate-100/50"
                >
                  {uniquePincodes.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-205 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold outline-none focus:border-blue-500 cursor-pointer transition hover:bg-slate-100/50"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                </select>

                {/* Export Button */}
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition shadow-sm hover:shadow active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Agent ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Role / Level</th>
                    <th className="p-4">District</th>
                    <th className="p-4">Division</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-655 font-bold transition">
                  {filteredAgents.map((agent, idx) => (
                    <tr key={agent._id || idx} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono text-slate-400">{agent._id || `DB_AG_${idx}`}</td>
                      <td className="p-4 text-slate-900 font-extrabold">{agent.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          agent.role === 'District Agent' ? 'bg-blue-50 text-blue-700' :
                          agent.role === 'Divisional Agent' ? 'bg-teal-50 text-teal-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {agent.role}
                        </span>
                      </td>
                      <td className="p-4">{agent.district || 'N/A'}</td>
                      <td className="p-4">{agent.division || 'N/A'}</td>
                      <td className="p-4 font-mono text-slate-500">{agent.phone || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black transition ${
                          agent.status === 'Active' || agent.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-600'
                        }`}>
                          {agent.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {allAgents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">No registered agents in system yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'divisional' && <DivisionalAgents />}
      {activeTab === 'district' && <DistrictAgents />}
      {activeTab === 'pincode' && <PincodeAgents />}
    </div>
  );
};

export default AgentManagement;
