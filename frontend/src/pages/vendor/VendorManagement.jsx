import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Users, Plus, ShieldAlert, Check, X, Phone, Mail, Compass, MapPin, Store,
  FileCheck, FileText, Upload, Clock, Settings, Search, Filter, Edit2, Eye,
  RefreshCw, MoreVertical, Download, Send, Layers, BarChart2, Info, Bell,
  MessageSquare, Star
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Link, useLocation } from 'react-router-dom';

const VendorManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'list';

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPriority, setSelectedPriority] = useState('All Priority');
  const [selectedRating, setSelectedRating] = useState('All Ratings');

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [vendors, setVendors] = useState([]);
  const [queries, setQueries] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await api.get('/api/shops');
      if (Array.isArray(response.data)) {
        const formattedShops = response.data.map((shop, idx) => ({
          id: shop._id || `VEN_${idx}`,
          name: shop.shopName,
          phone: shop.contactNumber || 'N/A',
          district: shop.district || 'Unassigned',
          pincode: shop.pincode || 'Unassigned',
          category: shop.businessCategory || 'General',
          agent: shop.createdBy?.name || 'Agent',
          status: shop.verificationStatus || 'Pending Approval',
          email: shop.ownerName || shop.shopName
        }));
        setVendors(formattedShops);
      } else {
        setVendors([]);
      }
    } catch (err) {
      console.error('Error fetching shops:', err);
      setVendors([]);
    }
  };

  const handleStatusToggle = (id) => {
    setVendors(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
  };

  const handleCreateVendor = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (!name || !phone || !district || !pincode) {
      setError('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    const newVendor = {
      id: `VEN${10000 + vendors.length + 1}`,
      name,
      phone,
      district,
      pincode,
      category: 'General',
      agent: 'State Agent',
      status: 'Active',
      email: email || 'N/A'
    };

    setVendors(prev => [newVendor, ...prev]);
    setSuccess('Vendor added successfully!');
    setName('');
    setPhone('');
    setEmail('');
    setDistrict('');
    setPincode('');

    setTimeout(() => {
      setShowModal(false);
      setSuccess('');
      setSubmitting(false);
    }, 1500);
  };

  // Filters logic
  const filteredVendors = vendors.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.phone.includes(searchTerm) ||
                          c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All Districts' || c.district === selectedDistrict;
    const matchesStatus = selectedStatus === 'All Status' || c.status === selectedStatus;
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  // Recharts Chart Mock Data
  const regTrendData = [
    { name: '01 May', Vendors: 100 },
    { name: '06 May', Vendors: 180 },
    { name: '11 May', Vendors: 150 },
    { name: '16 May', Vendors: 240 },
    { name: '21 May', Vendors: 200 },
    { name: '26 May', Vendors: 220 },
    { name: '31 May', Vendors: 260 }
  ];

  const divisionData = [
    { name: 'Chennai', value: 245231 },
    { name: 'Coimbatore', value: 185420 },
    { name: 'Madurai', value: 165312 },
    { name: 'Trichy', value: 120441 },
    { name: 'Salem', value: 110985 },
    { name: 'Others', value: 46842 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // View Renders
  const renderOverview = () => (
    <>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800">Vendor Management</h1>
            <Info className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Manage and monitor all vendors across the state.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition duration-200"
        >
          <Plus className="w-4.5 h-4.5" /> Add Vendor
        </button>
      </div>

      {/* Grid of 8 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Total Vendors', value: vendors.length.toLocaleString(), sub: 'View all vendors', color: 'text-blue-600', icon: Users },
          { label: 'Active Vendors', value: vendors.filter(v => v.status === 'Active' || v.status === 'Verified').length.toLocaleString(), sub: 'Active vendors', color: 'text-emerald-600', icon: Users },
          { label: 'Pending Approval', value: vendors.filter(v => v.status === 'Pending Approval' || v.status === 'Pending').length.toLocaleString(), sub: 'Pending approval', color: 'text-amber-600', icon: Clock },
          { label: 'Inactive Vendors', value: vendors.filter(v => v.status === 'Inactive').length.toLocaleString(), sub: 'Inactive vendors', color: 'text-rose-600', icon: Users },
          { label: 'Vendor Queries', value: queries.length.toLocaleString(), sub: 'View all queries', color: 'text-amber-600', icon: MessageSquare },
          { label: 'Open Complaints', value: complaints.length.toLocaleString(), sub: 'View complaints', color: 'text-rose-600', icon: ShieldAlert },
          { label: 'Service Requests', value: serviceRequests.length.toLocaleString(), sub: 'View requests', color: 'text-slate-500', icon: FileText },
          { label: 'Feedback Ratings', value: feedbacks.length.toLocaleString(), sub: 'View feedback', color: 'text-purple-600', icon: Star }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="mt-2">
              <p className="text-xl font-black text-slate-800">{card.value}</p>
              <span className={`text-[10px] font-bold block mt-1 ${card.color}`}>{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main body layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Table & Filters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, mobile, vendor ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-blue-500 font-medium transition"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-bold">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-650 outline-none"
              >
                <option>All Districts</option>
                <option>Chennai</option>
                <option>Coimbatore</option>
                <option>Madurai</option>
                <option>Salem</option>
                <option>Trichy</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-650 outline-none"
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

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Vendor List</h3>
              <span className="text-xs font-bold text-slate-400">Total: {filteredVendors.length} Vendors</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Vendor ID</th>
                    <th className="p-4">Vendor Name</th>
                    <th className="p-4">Mobile Number</th>
                    <th className="p-4">District</th>
                    <th className="p-4">Pincode</th>
                    <th className="p-4">Assigned Agent</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVendors.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/50 text-slate-600 font-bold transition">
                      <td className="p-4 font-mono text-slate-400">{cust.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-blue-600 text-xs shrink-0">
                            {cust.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-slate-800 font-extrabold block">{cust.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium block">{cust.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-700 font-mono">{cust.phone}</td>
                      <td className="p-4 text-slate-500">{cust.district}</td>
                      <td className="p-4 font-mono text-slate-500">{cust.pincode}</td>
                      <td className="p-4 text-slate-600">{cust.agent}</td>
                      <td className="p-4">
                        {cust.status === 'Pending Approval' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setVendors(prev => prev.map(v => v.id === cust.id ? { ...v, status: 'Active' } : v));
                                alert(`Vendor ${cust.name} approved & activated!`);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded shadow transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Enter rejection reason for Pincode Agent:', 'License proof image unclear');
                                if (reason) {
                                  setVendors(prev => prev.map(v => v.id === cust.id ? { ...v, status: `Rejected (${reason})` } : v));
                                  alert(`Vendor ${cust.name} rejected and returned to agent with reason: "${reason}"`);
                                }
                              }}
                              className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded shadow transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            onClick={() => handleStatusToggle(cust.id)}
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border cursor-pointer select-none transition ${
                              cust.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : cust.status.startsWith('Rejected') ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                            }`}
                          >
                            {cust.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-400">
                          <button className="hover:text-blue-600 transition"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button className="hover:text-emerald-600 transition"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="hover:text-slate-600 transition"><MoreVertical className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800">Vendor Query Overview</h3>
            <div className="flex flex-col items-center justify-center min-h-[160px]">
              <div className="w-28 h-28 rounded-full border-8 border-slate-100 flex items-center justify-center flex-col">
                <span className="text-lg font-black text-slate-800">{queries.length}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Queries</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800">Recent Vendor Activities</h3>
            <div className="space-y-4">
              {vendors.slice(0, 3).map((v, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-blue-500"></div>
                  <div>
                    <p className="font-bold text-slate-700 leading-snug">Vendor {v.name} registered</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">District: {v.district}</p>
                  </div>
                </div>
              ))}
              {vendors.length === 0 && (
                <p className="text-xs text-slate-400 font-semibold">No recent vendor activity.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );

  const renderList = () => (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Vendor List</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">View and manage all vendors across the state.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-md transition"
        >
          <Plus className="w-4.5 h-4.5" /> Add Vendor
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors', value: vendors.length.toLocaleString(), color: 'bg-blue-50 border-blue-100 text-blue-600' },
          { label: 'Active Vendors', value: vendors.filter(v => v.status === 'Active' || v.status === 'Verified').length.toLocaleString(), color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
          { label: 'Pending Approval', value: vendors.filter(v => v.status === 'Pending Approval' || v.status === 'Pending').length.toLocaleString(), color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
          { label: 'Inactive Vendors', value: vendors.filter(v => v.status === 'Inactive').length.toLocaleString(), color: 'bg-rose-50 border-rose-100 text-rose-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
              <p className="text-2xl font-black text-slate-800 mt-1">{card.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
              <Users className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Table */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, mobile, vendor ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-blue-500 font-medium transition"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-bold">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-650 outline-none">
              <option>All Districts</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-650 outline-none">
              <option>All Status</option>
            </select>
            <button className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-3.5 py-2 font-bold transition">
              <Download className="w-4 h-4 text-slate-500" /> Export
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Vendor ID</th>
                <th className="p-4">Vendor Name</th>
                <th className="p-4">Mobile Number</th>
                <th className="p-4">District</th>
                <th className="p-4">Pincode</th>
                <th className="p-4">Category</th>
                <th className="p-4">Assigned Agent</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVendors.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 text-slate-600 font-bold transition">
                  <td className="p-4 font-mono text-slate-450">{c.id}</td>
                  <td className="p-4 text-slate-800 font-extrabold">{c.name}</td>
                  <td className="p-4 font-mono text-slate-700">{c.phone}</td>
                  <td className="p-4 text-slate-500">{c.district}</td>
                  <td className="p-4 font-mono text-slate-500">{c.pincode}</td>
                  <td className="p-4 text-blue-600 font-semibold">{c.category}</td>
                  <td className="p-4 text-slate-600">{c.agent}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{c.status}</span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-450">
                      <button className="hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-emerald-600"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderQueries = () => (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Vendor Queries</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Track and manage vendor queries.</p>
        </div>
      </div>

      {/* 6 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Queries', value: queries.length.toLocaleString(), color: 'bg-blue-50 text-blue-600' },
          { label: 'Open', value: queries.filter(q => q.status === 'Open').length.toLocaleString(), color: 'bg-rose-50 text-rose-600' },
          { label: 'In Progress', value: queries.filter(q => q.status === 'In Progress').length.toLocaleString(), color: 'bg-indigo-50 text-indigo-650' },
          { label: 'Pending', value: queries.filter(q => q.status === 'Pending').length.toLocaleString(), color: 'bg-amber-50 text-amber-600' },
          { label: 'Resolved', value: queries.filter(q => q.status === 'Resolved').length.toLocaleString(), color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Escalated', value: queries.filter(q => q.status === 'Escalated').length.toLocaleString(), color: 'bg-red-50 text-red-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{card.label}</span>
            <p className={`text-2xl font-black mt-2 ${card.color.split(' ')[1]}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table & Filters */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by vendor name, mobile, query ID..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-blue-500 font-medium transition"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-bold">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-650 outline-none"><option>All Districts</option></select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-650 outline-none"><option>All Status</option></select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-650 outline-none"><option>All Priority</option></select>
            <button className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-3.5 py-2 font-bold transition">
              <Download className="w-4 h-4 text-slate-500" /> Export
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Query ID</th>
                <th className="p-4">Vendor Name</th>
                <th className="p-4">Mobile Number</th>
                <th className="p-4">Query Type</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Agent</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queries.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/50 text-slate-600 font-bold transition">
                  <td className="p-4 font-mono text-slate-450">{q.id}</td>
                  <td className="p-4 text-slate-800 font-extrabold">{q.vendor}</td>
                  <td className="p-4 font-mono text-slate-700">{q.phone}</td>
                  <td className="p-4 text-slate-600">{q.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${q.priority === 'High' ? 'bg-red-50 text-red-650' : 'bg-blue-50 text-blue-650'}`}>{q.priority}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${q.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{q.status}</span>
                  </td>
                  <td className="p-4 text-slate-550">{q.agent}</td>
                  <td className="p-4 text-slate-500">{q.date}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-450">
                      <button className="hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {queries.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-semibold">No vendor queries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderComplaints = () => (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Vendor Complaints</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Track and resolve vendor complaints.</p>
        </div>
      </div>

      {/* 6 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Complaints', value: complaints.length.toLocaleString(), color: 'text-blue-600' },
          { label: 'Open', value: complaints.filter(c => c.status === 'Open').length.toLocaleString(), color: 'text-rose-600' },
          { label: 'In Progress', value: complaints.filter(c => c.status === 'In Progress').length.toLocaleString(), color: 'text-indigo-600' },
          { label: 'Pending', value: complaints.filter(c => c.status === 'Pending').length.toLocaleString(), color: 'text-amber-600' },
          { label: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length.toLocaleString(), color: 'text-emerald-600' },
          { label: 'Escalated', value: complaints.filter(c => c.status === 'Escalated').length.toLocaleString(), color: 'text-red-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{card.label}</span>
            <p className={`text-2xl font-black mt-2 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table & Filters */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search complaints..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-blue-500 font-medium transition"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-bold">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-650 outline-none"><option>All Districts</option></select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-650 outline-none"><option>All Status</option></select>
            <button className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-650 rounded-lg px-3.5 py-2 font-bold transition">
              <Download className="w-4 h-4 text-slate-500" /> Export
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Complaint ID</th>
                <th className="p-4">Vendor Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Agent</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 text-slate-600 font-bold transition">
                  <td className="p-4 font-mono text-slate-450">{c.id}</td>
                  <td className="p-4 text-slate-800 font-extrabold">{c.vendor}</td>
                  <td className="p-4 text-slate-600">{c.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.priority === 'High' ? 'bg-red-50 text-red-650' : 'bg-blue-50 text-blue-650'}`}>{c.priority}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{c.status}</span>
                  </td>
                  <td className="p-4 text-slate-550">{c.agent}</td>
                  <td className="p-4 text-slate-500">{c.date}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-450">
                      <button className="hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-semibold">No complaints found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Charts at bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Complaints by Category</h3>
          <div className="h-56 flex items-center justify-center text-slate-400 text-xs font-semibold">
            {complaints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[
                    { name: 'Product', value: complaints.filter(c => c.category === 'Product').length },
                    { name: 'Delivery', value: complaints.filter(c => c.category === 'Delivery').length }
                  ]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              'No complaint data available'
            )}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Complaint Trend</h3>
          <div className="h-56 flex items-center justify-center text-slate-400 text-xs font-semibold">
            No complaint trend data available
          </div>
        </div>
      </div>
    </>
  );

  const renderServices = () => (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Service Requests</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Track and manage vendor service requests.</p>
        </div>
      </div>

      {/* 6 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Requests', value: serviceRequests.length.toLocaleString(), color: 'text-blue-600' },
          { label: 'New Requests', value: serviceRequests.filter(s => s.status === 'New').length.toLocaleString(), color: 'text-rose-600' },
          { label: 'In Progress', value: serviceRequests.filter(s => s.status === 'In Progress').length.toLocaleString(), color: 'text-indigo-650' },
          { label: 'Pending', value: serviceRequests.filter(s => s.status === 'Pending').length.toLocaleString(), color: 'text-amber-600' },
          { label: 'Completed', value: serviceRequests.filter(s => s.status === 'Completed').length.toLocaleString(), color: 'text-emerald-600' },
          { label: 'Cancelled', value: serviceRequests.filter(s => s.status === 'Cancelled').length.toLocaleString(), color: 'text-slate-400' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{card.label}</span>
            <p className={`text-2xl font-black mt-2 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table & Filters */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search service requests..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-blue-500 font-medium transition"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-bold">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-650 outline-none"><option>All Districts</option></select>
            <button className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-3.5 py-2 font-bold transition">
              <Download className="w-4 h-4 text-slate-500" /> Export
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Request ID</th>
                <th className="p-4">Vendor Name</th>
                <th className="p-4">Service Type</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Agent</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {serviceRequests.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 text-slate-600 font-bold transition">
                  <td className="p-4 font-mono text-slate-450">{s.id}</td>
                  <td className="p-4 text-slate-800 font-extrabold">{s.vendor}</td>
                  <td className="p-4 text-slate-650">{s.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.priority === 'High' ? 'bg-red-50 text-red-650' : 'bg-blue-50 text-blue-650'}`}>{s.priority}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${s.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>{s.status}</span>
                  </td>
                  <td className="p-4 text-slate-550">{s.agent}</td>
                  <td className="p-4 text-slate-500">{s.date}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-450">
                      <button className="hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {serviceRequests.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-semibold">No service requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderFeedback = () => (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Vendor Feedback</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Track and review vendor feedback and ratings.</p>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Feedback', value: feedbacks.length.toLocaleString(), color: 'bg-blue-50 border-blue-100 text-blue-650' },
          { label: 'Average Rating', value: feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + (f.rating || 5), 0) / feedbacks.length).toFixed(1) + ' / 5' : '0.0 / 5', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
          { label: 'Positive Feedback', value: feedbacks.filter(f => f.rating >= 4).length.toLocaleString(), color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
          { label: 'Negative Feedback', value: feedbacks.filter(f => f.rating < 4).length.toLocaleString(), color: 'bg-rose-50 border-rose-100 text-rose-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
              <p className="text-2xl font-black text-slate-800 mt-1">{card.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
              <Star className="w-6 h-6 fill-current" />
            </div>
          </div>
        ))}
      </div>

      {/* Table & Filters */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search feedback..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-blue-500 font-medium transition"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-bold">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-650 outline-none"><option>All Districts</option></select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-650 outline-none"><option>All Ratings</option></select>
            <button className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-3.5 py-2 font-bold transition">
              <Download className="w-4 h-4 text-slate-500" /> Export
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Feedback ID</th>
                <th className="p-4">Vendor Name</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Feedback Comment</th>
                <th className="p-4">Service Type</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feedbacks.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/50 text-slate-600 font-bold transition">
                  <td className="p-4 font-mono text-slate-450">{f.id}</td>
                  <td className="p-4 text-slate-800 font-extrabold">{f.vendor}</td>
                  <td className="p-4">
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: f.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                  </td>
                  <td className="p-4 text-slate-605 max-w-xs truncate">{f.comment}</td>
                  <td className="p-4 text-slate-550">{f.type}</td>
                  <td className="p-4 text-slate-500">{f.date}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-405">
                      <button className="hover:text-blue-600"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {feedbacks.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">No feedback found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6 text-slate-800">
      {(activeTab === 'overview' || activeTab === 'list' || !activeTab) && renderOverview()}
      {activeTab === 'queries' && renderQueries()}
      {activeTab === 'complaints' && renderComplaints()}
      {activeTab === 'services' && renderServices()}
      {activeTab === 'feedback' && renderFeedback()}

      {/* Creation Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Add Vendor</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-655">
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

            <form onSubmit={handleCreateVendor} className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div>
                <label className="block mb-1.5">Vendor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="rajesh@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 lowercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">District</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="600001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg mt-3 uppercase tracking-widest text-xs transition duration-200"
              >
                {submitting ? 'Adding vendor...' : 'Save Vendor'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VendorManagement;
