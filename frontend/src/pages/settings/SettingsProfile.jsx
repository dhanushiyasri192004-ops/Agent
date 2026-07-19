import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Settings, Shield, Award, Calendar, FileText, Phone, Mail } from 'lucide-react';

const SettingsProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('Personal Information');

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
              SA
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Tamil Nadu State Agent</h3>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">State Agent</span>
            </div>
          </div>

          <div className="w-full space-y-3.5 text-xs font-bold text-slate-655 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4.5 h-4.5 text-slate-400" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4.5 h-4.5 text-slate-400 animate-pulse" />
              <span className="break-all">stateagent@tamilnadu.gov.in</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Shield className="w-4.5 h-4.5 text-slate-400" />
              <span>TN-SA-001</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4.5 h-4.5 text-slate-400" />
              <span>15 Jan 2024</span>
            </div>
          </div>

          <button className="w-full bg-blue-50 border border-blue-100 hover:bg-blue-100/50 text-blue-600 font-extrabold py-2.5 rounded-lg text-xs transition duration-150">
            Edit Profile
          </button>
        </div>

        {/* Right Panel: Form Fields */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">Profile Details</h3>
          
          <form className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5">Full Name</label>
                <input
                  type="text"
                  readOnly
                  value="Tamil Nadu State Agent"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed font-semibold"
                />
              </div>
              <div>
                <label className="block mb-1.5">State</label>
                <input
                  type="text"
                  readOnly
                  value="Tamil Nadu"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5">Mobile Number</label>
                <input
                  type="text"
                  readOnly
                  value="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed font-semibold"
                />
              </div>
              <div>
                <label className="block mb-1.5">Email Address</label>
                <input
                  type="text"
                  readOnly
                  value="stateagent@tamilnadu.gov.in"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed font-semibold normal-case"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5">Address</label>
              <input
                type="text"
                readOnly
                value="Chennai, Tamil Nadu - 600005"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed font-semibold"
              />
            </div>

            <div>
              <label className="block mb-1.5">Designation</label>
              <input
                type="text"
                readOnly
                value="State Agent"
                className="w-full bg-slate-50 border border-slate-200 text-slate-850 px-3.5 py-2.5 rounded-lg outline-none cursor-not-allowed font-semibold"
              />
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};

export default SettingsProfile;
