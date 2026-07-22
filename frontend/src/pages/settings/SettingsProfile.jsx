import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Settings, Shield, Award, Calendar, FileText, Phone, Mail, Lock, CheckCircle } from 'lucide-react';

const SettingsProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('Personal Information');

  // Derive dynamic user details
  const userName = user?.name || (user?.role ? `${user.role}` : 'Agent');
  const userRole = user?.role || 'Agent';
  const userEmail = user?.email || 'agent@forgeindia.com';
  const userPhone = user?.agentInfo?.phone || user?.phone || '+91 98765 43210';
  const userState = user?.agentInfo?.state || 'Tamil Nadu';
  
  // Format address dynamically based on agent level
  const formatAddress = () => {
    if (!user?.agentInfo) return 'Coimbatore, Tamil Nadu';
    const parts = [];
    if (user.agentInfo.pincode) parts.push(`Pincode ${user.agentInfo.pincode}`);
    if (user.agentInfo.district) parts.push(user.agentInfo.district);
    if (user.agentInfo.division) parts.push(`${user.agentInfo.division} Division`);
    if (user.agentInfo.state) parts.push(user.agentInfo.state);
    return parts.length > 0 ? parts.join(', ') : 'Tamil Nadu';
  };

  const userAddress = formatAddress();

  const agentCode = user?.agentId || (user?._id ? `TN-${userRole.includes('District') ? 'DA' : userRole.includes('Divisional') ? 'DIV' : userRole.includes('Pincode') ? 'PA' : 'SA'}-${user._id.slice(-4).toUpperCase()}` : (userRole === 'District Agent' ? 'TN-DA-042' : userRole === 'Divisional Agent' ? 'TN-DIV-012' : userRole === 'Pincode Agent' ? 'TN-PA-600001' : 'TN-SA-001'));

  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (userRole.includes('District') ? 'DA' : userRole.includes('Divisional') ? 'DIV' : userRole.includes('Pincode') ? 'PA' : 'SA');

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Settings & Profile</h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">Manage your account settings and profile.</p>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest gap-5 pb-2">
        {['Personal Information', 'Documents', 'Security'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 transition select-none ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel: Profile Summary Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-between space-y-6">
          <div className="flex flex-col items-center text-center space-y-3.5">
            <div className="w-20 h-20 rounded-full bg-blue-600/10 border border-blue-600/25 flex items-center justify-center font-bold text-2xl text-blue-600">
              {initials}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">{userName}</h3>
              <span className="text-xs text-[#d9a32c] font-bold uppercase tracking-wider block mt-0.5">{userRole}</span>
            </div>
          </div>

          <div className="w-full space-y-3.5 text-xs font-bold text-slate-655 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span>{userPhone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span className="break-all">{userEmail}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Shield className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span>{agentCode}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span>Joined 15 Jan 2024</span>
            </div>
          </div>

          <button className="w-full bg-blue-50 border border-blue-100 hover:bg-blue-100/50 text-blue-600 font-extrabold py-2.5 rounded-lg text-xs transition duration-150">
            Edit Profile
          </button>
        </div>

        {/* Right Panel: Form Fields */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">
            {activeTab}
          </h3>
          
          {activeTab === 'Personal Information' && (
            <form className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    readOnly
                    value={userName}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed font-semibold normal-case"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">State</label>
                  <input
                    type="text"
                    readOnly
                    value={userState}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed font-semibold normal-case"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Mobile Number</label>
                  <input
                    type="text"
                    readOnly
                    value={userPhone}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Email Address</label>
                  <input
                    type="text"
                    readOnly
                    value={userEmail}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed font-semibold normal-case"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5">Address / Region</label>
                <input
                  type="text"
                  readOnly
                  value={userAddress}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed font-semibold normal-case"
                />
              </div>

              <div>
                <label className="block mb-1.5">Designation / Role</label>
                <input
                  type="text"
                  readOnly
                  value={userRole}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-850 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed font-semibold normal-case"
                />
              </div>
            </form>
          )}

          {activeTab === 'Documents' && (
            <div className="space-y-4 pt-2">
              {[
                { name: 'Aadhaar Card / ID Proof', status: 'Verified', date: '15 Jan 2024' },
                { name: 'PAN Card / Tax Document', status: 'Verified', date: '15 Jan 2024' },
                { name: 'Agent Agreement Letter', status: 'Active', date: '15 Jan 2024' }
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-slate-800 block text-sm font-extrabold">{doc.name}</span>
                      <span className="text-slate-400 block text-[10px]">Uploaded on {doc.date}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> {doc.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-4 pt-2 text-xs font-bold text-slate-600">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                  <Lock className="w-4.5 h-4.5 text-blue-600" /> Two-Factor Authentication
                </div>
                <p className="text-slate-500 font-medium text-xs">Protect your agent portal account with multi-factor OTP login security.</p>
                <span className="inline-block bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded text-[10px] font-bold uppercase">Enabled</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                  <Shield className="w-4.5 h-4.5 text-blue-600" /> Active Session
                </div>
                <p className="text-slate-500 font-medium text-xs">Currently logged in from Web Browser as {userRole}.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default SettingsProfile;
