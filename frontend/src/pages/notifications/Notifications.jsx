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
        {[`All (${notifications.length})`, 'Important', 'System'].map((tab) => {
          const tabName = tab.startsWith('All') ? 'All' : tab.startsWith('Important') ? 'Important' : 'System';
          const isActive = activeTab === tabName;
          return (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`pb-1 transition select-none ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-700'}`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-4">
        {notifications
          .filter((noti) => {
            if (activeTab === 'Important') return noti.isImportant;
            if (activeTab === 'System') return noti.isSystem;
            return true;
          })
          .map((noti) => (
            <div key={noti._id || noti.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-350 transition duration-150 flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-600 border border-blue-100">
                <Bell className="w-5.5 h-5.5" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">{noti.type || 'NOTIFICATION'}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{new Date(noti.createdAt || Date.now()).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm font-extrabold text-slate-800">{noti.message || noti.title}</p>
              </div>
            </div>
          ))}
        {notifications.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 font-semibold shadow-sm">
            No notifications found.
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
