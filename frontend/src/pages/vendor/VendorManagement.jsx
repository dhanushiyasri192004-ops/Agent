import React, { useState } from 'react';
import {
  Users, Plus, ShieldAlert, Check, X, Phone, Mail, Compass, MapPin, Store,
  FileCheck, FileText, Upload, Clock, Settings, Search, Filter, Edit2, Eye,
  RefreshCw, MoreVertical, Download, Send, Layers, BarChart2, Info, Bell,
  MessageSquare, Star
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const VendorManagement = () => {
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Initial mockup vendors list
  const initialMockVendors = [
    {
      id: 'VEN10001',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      district: 'Chennai',
      pincode: '600001',
      agent: 'Karthik S',
      status: 'Active',
      email: 'rajesh@gmail.com'
    },
    {
      id: 'VEN10002',
      name: 'Priya M',
      phone: '+91 91234 56789',
      district: 'Coimbatore',
      pincode: '641001',
      agent: 'Monica R',
      status: 'Active',
      email: 'priya@gmail.com'
    },
    {
      id: 'VEN10003',
      name: 'Suresh B',
      phone: '+91 99887 76655',
      district: 'Madurai',
      pincode: '625001',
      agent: 'Suresh B',
      status: 'Active',
      email: 'suresh@gmail.com'
    },
    {
      id: 'VEN10004',
      name: 'Anitha P',
      phone: '+91 87654 32109',
      district: 'Salem',
      pincode: '636001',
      agent: 'Deepak K',
      status: 'Inactive',
      email: 'anitha@gmail.com'
    },
    {
      id: 'VEN10005',
      name: 'Vijay R',
      phone: '+91 90012 34567',
      district: 'Trichy',
      pincode: '620001',
      agent: 'Vijayalakshmi',
      status: 'Active',
      email: 'vijay@gmail.com'
    }
  ];

  const [vendors, setVendors] = useState(initialMockVendors);

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

  // Filter vendors
  const filteredVendors = vendors.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.phone.includes(searchTerm) ||
                          c.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = selectedDistrict === 'All Districts' || c.district === selectedDistrict;
    const matchesStatus = selectedStatus === 'All Status' || c.status === selectedStatus;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  // Recharts chart data
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

  return (
    <div className="space-y-6 text-slate-800">
      
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
        
        {/* Total Vendors */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total Vendors</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-slate-800">8,75,231</p>
            <span className="text-[10px] text-blue-500 hover:underline cursor-pointer font-bold block mt-1">View all vendors</span>
          </div>
        </div>

        {/* Active Vendors */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Active Vendors</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-slate-800">8,10,450</p>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">92.61% of total</span>
          </div>
        </div>

        {/* New Vendors Today */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">New Vendors</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-slate-800">245</p>
            <span className="text-[10px] text-indigo-500 hover:underline cursor-pointer font-bold block mt-1">View new vendors</span>
          </div>
        </div>

        {/* Vendor Queries */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Vendor Queries</span>
            <MessageSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-slate-800">1,268</p>
            <span className="text-[10px] text-amber-500 hover:underline cursor-pointer font-bold block mt-1">View all queries</span>
          </div>
        </div>

        {/* Open Complaints */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Open Complaints</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-slate-800">156</p>
            <span className="text-[10px] text-rose-600 hover:underline cursor-pointer font-bold block mt-1">View complaints</span>
          </div>
        </div>

        {/* Resolved Complaints */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Resolved</span>
            <Check className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-slate-800">1,112</p>
            <span className="text-[10px] text-teal-600 hover:underline cursor-pointer font-bold block mt-1">View resolved</span>
          </div>
        </div>

        {/* Vendor Satisfaction */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">VSAT Rate</span>
            <Star className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-slate-800">94%</p>
            <span className="text-[10px] text-blue-500 hover:underline cursor-pointer font-bold block mt-1">View feedback</span>
          </div>
        </div>

        {/* Total Service Requests */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Requests</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-slate-800">12,845</p>
            <span className="text-[10px] text-slate-500 hover:underline cursor-pointer font-bold block mt-1">View requests</span>
          </div>
        </div>

      </div>

      {/* Main body layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Table & Filters */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters Bar */}
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
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none"
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

          {/* Vendor Table List */}
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
                            cust.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                          }`}
                        >
                          {cust.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2 text-slate-400">
                          <button className="hover:text-blue-600 transition" title="Edit Vendor">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="hover:text-emerald-600 transition" title="View Profile">
                            <Eye className="w-3.5 h-3.5" />
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
              <span>Showing 1 to {filteredVendors.length} of {filteredVendors.length} entries</span>
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

        {/* Right Side: Charts & Recent Feedback */}
        <div className="space-y-6">
          
          {/* Vendor Query Overview */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Vendor Query Overview</h3>
              <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            
            <div className="flex flex-col items-center justify-center min-h-[160px]">
              <div className="w-28 h-28 rounded-full border-8 border-slate-100 flex items-center justify-center flex-col">
                <span className="text-lg font-black text-slate-800">1,268</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Queries</span>
              </div>
              <div className="w-full grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 mt-4 border-t border-slate-50 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Open: 336 (26.5%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Progress: 285 (22.5%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Resolved: 367 (28.9%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Escalated: 70 (5.5%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Vendor Activities */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Recent Vendor Activities</h3>
              <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-4">
              {[
                { text: 'New vendor Arjun K registered', time: 'Today, 10:30 AM', color: 'bg-blue-500' },
                { text: 'Complaint #CMP1234 submitted by Priya M', time: 'Today, 09:45 AM', color: 'bg-emerald-500' },
                { text: 'Service request #SR5678 completed', time: 'Today, 08:20 AM', color: 'bg-indigo-500' },
                { text: 'Feedback received from Ramesh Kumar', time: 'Today, 06:50 AM', color: 'bg-amber-500' },
                { text: 'Profile updated by Suresh B', time: 'Today, 06:15 AM', color: 'bg-teal-500' }
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

      {/* Row 4: Vendor Registration Trend & Division Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Vendor Registration Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Vendor Registration Trend</h3>
            <span className="text-xs text-blue-600 font-bold">This Month</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={regTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={9} stroke="#64748b" />
                <YAxis fontSize={9} stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="Vendors" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendors by Division */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Vendors by Division</h3>
            <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>
          <div className="space-y-3">
            {divisionData.map((d, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-600">{d.name}</span>
                  <span className="text-slate-800">{d.value.toLocaleString()}</span>
                </div>
                <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(d.value / 245231) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complaint Analysis */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Complaint Analysis</h3>
              <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-3.5">
              {[
                { name: 'Electrical', count: 345, pct: '22.1%' },
                { name: 'Plumbing', count: 210, pct: '13.4%' },
                { name: 'AC Services', count: 256, pct: '16.4%' },
                { name: 'Washing Machine', count: 185, pct: '11.8%' },
                { name: 'Refrigerator', count: 148, pct: '9.5%' }
              ].map((c, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                  <span className="font-extrabold text-slate-700">{c.name}</span>
                  <div className="text-right">
                    <span className="font-black text-slate-800">{c.count} </span>
                    <span className="text-slate-400">({c.pct})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vendor Satisfaction Rating */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Vendor Satisfaction</h3>
            <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px]">
            <div className="w-28 h-28 rounded-full border-8 border-slate-100 flex items-center justify-center flex-col">
              <span className="text-lg font-black text-slate-800">94%</span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase">Excellent</span>
            </div>
            
            <div className="w-full grid grid-cols-4 gap-1 text-[9px] font-bold text-slate-500 mt-4 border-t border-slate-50 pt-3 text-center">
              <div>
                <span className="block text-emerald-600">Excellent</span>
                <span className="block text-slate-800 text-xs">72%</span>
              </div>
              <div>
                <span className="block text-blue-500">Good</span>
                <span className="block text-slate-800 text-xs">22%</span>
              </div>
              <div>
                <span className="block text-amber-500">Average</span>
                <span className="block text-slate-800 text-xs">4%</span>
              </div>
              <div>
                <span className="block text-rose-500">Poor</span>
                <span className="block text-slate-800 text-xs">2%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 5: Districts list, Map, and Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Districts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Top Districts by Vendors</h3>
              <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Chennai', count: '1,25,000' },
                { name: 'Coimbatore', count: '95,400' },
                { name: 'Madurai', count: '84,300' },
                { name: 'Salem', count: '73,200' },
                { name: 'Trichy', count: '68,700' }
              ].map((d, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-slate-700">{d.name}</span>
                  </div>
                  <span className="font-black text-slate-800">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vendor Feedback */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Latest Vendor Feedback</h3>
              <span className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-3.5">
              {[
                { name: 'Rajesh Kumar', comment: 'Excellent service and quick response!', stars: 5, dist: 'Chennai' },
                { name: 'Priya M', comment: 'Technician was very professional.', stars: 4, dist: 'Coimbatore' },
                { name: 'Suresh B', comment: 'Good support and assistance.', stars: 5, dist: 'Madurai' }
              ].map((f, idx) => (
                <div key={idx} className="space-y-1.5 border-b border-slate-50 pb-3 last:border-0 last:pb-0 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-800">{f.name} ({f.dist})</span>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: f.stars }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-500 leading-snug">{f.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Footer Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <button
              onClick={() => setShowModal(true)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2 group"
            >
              <Plus className="w-5.5 h-5.5 text-blue-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Add Vendor</span>
            </button>
            <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2 group">
              <Download className="w-5.5 h-5.5 text-emerald-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Vendor Report</span>
            </button>
            <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2 group">
              <Send className="w-5.5 h-5.5 text-purple-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Send Notification</span>
            </button>
            <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition gap-2 group">
              <Download className="w-5.5 h-5.5 text-orange-600 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-bold text-slate-700 uppercase leading-none mt-1">Export List</span>
            </button>
          </div>
        </div>

      </div>

      {/* Creation Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Add Vendor</h3>
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
