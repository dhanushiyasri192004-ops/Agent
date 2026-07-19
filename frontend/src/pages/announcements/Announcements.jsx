import React, { useState } from 'react';
import { Megaphone, Pin, Plus, Calendar, Users } from 'lucide-react';

const Announcements = () => {
  const [activeTab, setActiveTab] = useState('All Announcements');

  const list = [
    { title: 'Monthly Report Submission Reminder', desc: 'All agents must submit their monthly reports on or before 15th May 2025.', date: '01 May 2025', target: 'All Agents', isPinned: true, status: 'Active' },
    { title: 'Training Program for Pincode Agents', desc: 'Training program will be conducted from 20th May to 25th May 2025.', date: '18 May 2025', target: 'Pincode Agents', isPinned: false, status: 'Scheduled' },
    { title: 'New Government Project Launch', desc: 'Smart City Clean Drive is now launched in all major divisions.', date: '10 May 2025', target: 'Divisional Agents', isPinned: false, status: 'Active' }
  ];

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Announcements</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Create and manage announcements for all agents.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-md flex items-center gap-1.5 transition">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest gap-5 pb-2">
        {['All Announcements', 'Pinned', 'Scheduled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 transition select-none ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {list.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-350 transition flex items-start gap-4">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${item.isPinned ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
              <Megaphone className="w-5.5 h-5.5" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-slate-850">{item.title}</h4>
                  {item.isPinned && (
                    <span className="bg-emerald-50 text-emerald-650 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5"><Pin className="w-3 h-3" /> Pinned</span>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-650 border border-emerald-100' : 'bg-blue-50 text-blue-650 border border-blue-100'}`}>{item.status}</span>
              </div>
              <p className="text-xs text-slate-500 font-bold">{item.desc}</p>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold pt-1.5 border-t border-slate-50">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {item.target}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Announcements;
