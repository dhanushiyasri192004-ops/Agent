import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bell, Check, Trash2, MailOpen, Mail, UserCheck, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import api from '../../services/api.js';

const Notifications = () => {
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications');
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('/api/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const mockNotis = [
    { id: 1, type: 'New Agent', message: 'New agent registration request received from Karthik S (Trichy District)', time: '10:30 AM', tag: 'New Registration', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: UserCheck },
    { id: 2, type: 'Report', message: 'Monthly report submitted by Madurai District Agent', time: '09:45 AM', tag: 'Report', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: FileText },
    { id: 3, type: 'Achievement', message: 'Target achieved for Coimbatore Division for April 2025', time: 'Yesterday', tag: 'Achievement', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: TrendingUp },
    { id: 4, type: 'Alert', message: 'Vendor subscription expired for 15 vendors in Salem District', time: 'Yesterday', tag: 'Alert', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: AlertTriangle },
    { id: 5, type: 'Project', message: 'New government project assigned: "Smart School Initiative"', time: '2 Days Ago', tag: 'Project', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: FileText }
  ];

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Stay updated with all important activities.</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
        >
          Mark all as read
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest gap-5 pb-2">
        {['All (12)', 'Important (3)', 'System'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 transition select-none ${activeTab === tab.split(' ')[0] || (activeTab === 'All' && tab.startsWith('All')) ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {mockNotis.map((noti) => (
          <div key={noti.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-350 transition duration-150 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${noti.color}`}>
              <noti.icon className="w-5.5 h-5.5" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${noti.color}`}>{noti.tag}</span>
                <span className="text-[10px] text-slate-400 font-bold">{noti.time}</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800">{noti.message}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Notifications;
