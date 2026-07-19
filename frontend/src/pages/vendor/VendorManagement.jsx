import React, { useState } from 'react';
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
  const activeTab = queryParams.get('tab') || 'overview';

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

  // Mock Data arrays matching the layouts
  const mockVendorsList = [
    { id: 'VEN10001', name: 'Rajesh Kumar', phone: '+91 98765 43210', district: 'Chennai', pincode: '600001', category: 'Electronics', agent: 'Karthik S', status: 'Active', email: 'rajesh@gmail.com' },
    { id: 'VEN10002', name: 'Priya M', phone: '+91 91234 56789', district: 'Coimbatore', pincode: '641001', category: 'Hardware', agent: 'Monica R', status: 'Active', email: 'priya@gmail.com' },
    { id: 'VEN10003', name: 'Suresh B', phone: '+91 99887 76655', district: 'Madurai', pincode: '625001', category: 'Medical', agent: 'Suresh B', status: 'Active', email: 'suresh@gmail.com' },
    { id: 'VEN10004', name: 'Anitha P', phone: '+91 87654 32109', district: 'Salem', pincode: '636001', category: 'Clothing', agent: 'Deepak K', status: 'Inactive', email: 'anitha@gmail.com' },
    { id: 'VEN10005', name: 'Vijay R', phone: '+91 90012 34567', district: 'Trichy', pincode: '620001', category: 'Stationery', agent: 'Vijayalakshmi', status: 'Active', email: 'vijay@gmail.com' }
  ];

  const mockQueries = [
    { id: 'QRY12001', vendor: 'Rajesh Kumar', phone: '+91 98765 43210', type: 'Pricing', priority: 'High', status: 'Open', agent: 'Karthik S', date: '15 May 2025' },
    { id: 'QRY12002', vendor: 'Priya M', phone: '+91 91234 56789', type: 'Delivery', priority: 'High', status: 'Open', agent: 'Monica R', date: '15 May 2025' },
    { id: 'QRY12003', vendor: 'Suresh B', phone: '+91 99887 76655', type: 'Product', priority: 'Low', status: 'Resolved', agent: 'Suresh B', date: '15 May 2025' },
    { id: 'QRY12004', vendor: 'Anitha P', phone: '+91 87654 32109', type: 'Service', priority: 'High', status: 'Open', agent: 'Deepak K', date: '15 May 2025' },
    { id: 'QRY12005', vendor: 'Vijay R', phone: '+91 90012 34567', type: 'Billing', priority: 'Medium', status: 'Pending', agent: 'Vijayalakshmi', date: '15 May 2025' }
  ];

  const mockComplaints = [
    { id: 'CMP22001', vendor: 'Rajesh Kumar', category: 'Product', priority: 'High', status: 'Open', agent: 'Karthik S', date: '15 May 2025' },
    { id: 'CMP22002', vendor: 'Priya M', category: 'Delivery', priority: 'High', status: 'Open', agent: 'Monica R', date: '15 May 2025' },
    { id: 'CMP22003', vendor: 'Suresh B', category: 'Billing', priority: 'Low', status: 'Resolved', agent: 'Suresh B', date: '15 May 2025' },
    { id: 'CMP22004', vendor: 'Anitha P', category: 'Service', priority: 'High', status: 'Open', agent: 'Deepak K', date: '15 May 2025' },
    { id: 'CMP22005', vendor: 'Vijay R', category: 'Quality', priority: 'Medium', status: 'Pending', agent: 'Vijayalakshmi', date: '15 May 2025' }
  ];

  const mockServiceRequests = [
    { id: 'SRV32001', vendor: 'Rajesh Kumar', type: 'AC Service', priority: 'High', status: 'In Progress', agent: 'Karthik S', date: '15 May 2025' },
    { id: 'SRV32002', vendor: 'Priya M', type: 'Electrical', priority: 'Medium', status: 'Completed', agent: 'Monica R', date: '15 May 2025' },
    { id: 'SRV32003', vendor: 'Suresh B', type: 'Plumbing', priority: 'Low', status: 'Completed', agent: 'Suresh B', date: '15 May 2025' },
    { id: 'SRV32004', vendor: 'Anitha P', type: 'Washing Machine', priority: 'High', status: 'Pending', agent: 'Deepak K', date: '15 May 2025' },
    { id: 'SRV32005', vendor: 'Vijay R', type: 'RO Purifier', priority: 'Medium', status: 'Pending', agent: 'Vijayalakshmi', date: '15 May 2025' }
  ];

  const mockFeedbacks = [
    { id: 'FDB42001', vendor: 'Rajesh Kumar', rating: 5, comment: 'Excellent service and response time', type: 'AC Service', date: '15 May 2025' },
    { id: 'FDB42002', vendor: 'Priya M', rating: 4, comment: 'Good response time', type: 'Electrical', date: '15 May 2025' },
    { id: 'FDB42003', vendor: 'Suresh B', rating: 5, comment: 'Very professional team', type: 'Plumbing', date: '15 May 2025' },
    { id: 'FDB42004', vendor: 'Anitha P', rating: 3, comment: 'Need improvement in quality', type: 'Washing Machine', date: '15 May 2025' },
    { id: 'FDB42005', vendor: 'Vijay R', rating: 5, comment: 'Good support', type: 'RO Purifier', date: '15 May 2025' }
  ];

  const [vendors, setVendors] = useState(mockVendorsList);

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
          { label: 'Total Vendors', value: '8,75,231', sub: 'View all vendors', color: 'text-blue-600', icon: Users },
          { label: 'Active Vendors', value: '8,10,450', sub: '92.61% of total', color: 'text-emerald-600', icon: Users },
          { label: 'New Vendors', value: '245', sub: 'View new vendors', color: 'text-indigo-600', icon: Users },
          { label: 'Vendor Queries', value: '1,268', sub: 'View all queries', color: 'text-amber-600', icon: MessageSquare },
          { label: 'Open Complaints', value: '156', sub: 'View complaints', color: 'text-rose-600', icon: ShieldAlert },
          { label: 'Resolved', value: '1,112', sub: 'View resolved', color: 'text-teal-600', icon: Check },
          { label: 'VSAT Rate', value: '94%', sub: 'View feedback', color: 'text-blue-600', icon: Star },
          { label: 'Service Requests', value: '12,845', sub: 'View requests', color: 'text-slate-500', icon: FileText }
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
                        <span
                          onClick={() => handleStatusToggle(cust.id)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border cursor-pointer select-none transition ${
                            cust.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}
                        >
                          {cust.status}
                        </span>
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
                <span className="text-lg font-black text-slate-800">1,268</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Queries</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800">Recent Vendor Activities</h3>
            <div className="space-y-4">
              {[
                { text: 'New vendor Arjun K registered', time: 'Today, 10:30 AM', color: 'bg-blue-500' },
                { text: 'Complaint #CMP1234 submitted by Priya M', time: 'Today, 09:45 AM', color: 'bg-emerald-500' },
                { text: 'Service request #SR5678 completed', time: 'Today, 08:20 AM', color: 'bg-indigo-500' }
              ].map((act, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${act.color}`}></div>
                  <div>
                    <p className="font-bold text-slate-700 leading-snug">{act.text}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
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
          { label: 'Total Vendors', value: '8,75,231', color: 'bg-blue-50 border-blue-100 text-blue-600' },
          { label: 'Active Vendors', value: '8,10,450', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
          { label: 'New Vendors', value: '245', color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
          { label: 'Inactive Vendors', value: '64,781', color: 'bg-rose-50 border-rose-100 text-rose-600' }
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
          { label: 'Total Queries', value: '1,268', color: 'bg-blue-50 text-blue-600' },
          { label: 'Open', value: '336', color: 'bg-rose-50 text-rose-600' },
          { label: 'In Progress', value: '285', color: 'bg-indigo-50 text-indigo-650' },
          { label: 'Pending', value: '210', color: 'bg-amber-50 text-amber-600' },
          { label: 'Resolved', value: '367', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Escalated', value: '70', color: 'bg-red-50 text-red-600' }
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
              {mockQueries.map((q) => (
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
                  <td className="p-4 text-slate-500">{q.agent}</td>
                  <td className="p-4 text-slate-500">{q.date}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-450">
                      <button className="hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
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
          { label: 'Total Complaints', value: '1,468', color: 'text-blue-600' },
          { label: 'Open', value: '156', color: 'text-rose-600' },
          { label: 'In Progress', value: '328', color: 'text-indigo-600' },
          { label: 'Pending', value: '210', color: 'text-amber-600' },
          { label: 'Resolved', value: '1,112', color: 'text-emerald-600' },
          { label: 'Escalated', value: '70', color: 'text-red-600' }
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
              {mockComplaints.map((c) => (
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Charts at bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Complaints by Category</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: 'Product', value: 345 },
                  { name: 'Delivery', value: 210 },
                  { name: 'Billing', value: 256 },
                  { name: 'Service', value: 185 },
                  { name: 'Quality', value: 148 }
                ]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Complaint Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={regTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={9} stroke="#64748b" />
                <YAxis fontSize={9} stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="Vendors" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
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
          { label: 'Total Requests', value: '12,845', color: 'text-blue-600' },
          { label: 'New Requests', value: '245', color: 'text-rose-600' },
          { label: 'In Progress', value: '5,632', color: 'text-indigo-650' },
          { label: 'Pending', value: '3,210', color: 'text-amber-600' },
          { label: 'Completed', value: '3,458', color: 'text-emerald-600' },
          { label: 'Cancelled', value: '300', color: 'text-slate-400' }
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
              {mockServiceRequests.map((s) => (
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
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Requests by Service Type</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: 'AC Service', value: 4000 },
                  { name: 'Electrical', value: 3000 },
                  { name: 'Plumbing', value: 2000 },
                  { name: 'Washing Machine', value: 2780 },
                  { name: 'RO Purifier', value: 1890 }
                ]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Request Status Overview</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'New', value: 245 },
                { name: 'In Progress', value: 5632 },
                { name: 'Pending', value: 3210 },
                { name: 'Completed', value: 3458 },
                { name: 'Cancelled', value: 300 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
          { label: 'Total Feedback', value: '5,842', color: 'bg-blue-50 border-blue-100 text-blue-650' },
          { label: 'Average Rating', value: '4.6 / 5', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
          { label: 'Positive Feedback', value: '4,852', color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
          { label: 'Negative Feedback', value: '990', color: 'bg-rose-50 border-rose-100 text-rose-600' }
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
              {mockFeedbacks.map((f) => (
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
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6 text-slate-800">
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'list' && renderList()}
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
