import React, { useState } from 'react';
import { Megaphone, Pin, Plus, Calendar, Users, X, ShieldAlert, Check } from 'lucide-react';

const Announcements = () => {
  const [activeTab, setActiveTab] = useState('All Announcements');
  const [showModal, setShowModal] = useState(false);

  const [announcements, setAnnouncements] = useState([]);

  // Modal Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [target, setTarget] = useState('All Agents');
  const [status, setStatus] = useState('Active');
  const [isPinned, setIsPinned] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !desc) {
      setError('Please provide title and description for the announcement.');
      return;
    }

    setSubmitting(true);

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('en-US', { month: 'short' })} ${today.getFullYear()}`;

    const newAnnouncement = {
      title,
      desc,
      date: formattedDate,
      target,
      isPinned,
      status
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setSuccess('Announcement published successfully!');

    setTimeout(() => {
      setShowModal(false);
      setTitle('');
      setDesc('');
      setTarget('All Agents');
      setStatus('Active');
      setIsPinned(false);
      setSuccess('');
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Announcements</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Create and manage announcements for all agents.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-md flex items-center gap-1.5 transition"
        >
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
        {announcements
          .filter((item) => {
            if (activeTab === 'Pinned') return item.isPinned;
            if (activeTab === 'Scheduled') return item.status === 'Scheduled';
            return true;
          })
          .map((item, idx) => (
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

      {/* New Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">New Announcement</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-2.5 rounded-lg flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div>
                <label className="block mb-1.5">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Review Meeting Notification"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Target Audience</label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 font-bold"
                  >
                    <option value="All Agents">All Agents</option>
                    <option value="District Agents">District Agents</option>
                    <option value="Divisional Agents">Divisional Agents</option>
                    <option value="Pincode Agents">Pincode Agents</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pin-announcement"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="pin-announcement" className="text-slate-700 cursor-pointer font-bold select-none normal-case">
                  Pin this announcement to the top
                </label>
              </div>

              <div>
                <label className="block mb-1.5">Description / Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter details of the announcement..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg outline-none focus:bg-white focus:border-blue-500 normal-case"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg mt-3 uppercase tracking-widest text-xs transition duration-200"
              >
                {submitting ? 'Publishing...' : 'Publish Announcement'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Announcements;
