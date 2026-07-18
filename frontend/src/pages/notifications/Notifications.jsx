import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bell, Check, Trash2, MailOpen, Mail } from 'lucide-react';
import api from '../../services/api.js';

const Notifications = () => {
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="text-forge-gold w-6 h-6" /> System Notifications
          </h1>
          <p className="text-xs text-forge-grayText mt-0.5">Manage and track system events and actions assigned to your account.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-xs font-bold text-forge-gold hover:underline"
          >
            <Check className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="bg-forge-dark border border-forge-card/40 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-forge-grayText">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-forge-grayText">You have no notifications.</div>
        ) : (
          <div className="divide-y divide-forge-card/25">
            {notifications.map((noti) => (
              <div
                key={noti._id}
                className={`p-5 flex items-center justify-between gap-4 transition text-xs ${!noti.isRead ? 'bg-forge-card/15 font-medium border-l-2 border-forge-gold' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${!noti.isRead ? 'bg-forge-gold/10 text-forge-gold border border-forge-gold/20' : 'bg-forge-card/30 text-forge-grayText'}`}>
                    {!noti.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={`${!noti.isRead ? 'text-white' : 'text-slate-300'}`}>{noti.message}</p>
                    <span className="text-[10px] text-forge-grayText block mt-1">
                      {new Date(noti.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!noti.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(noti._id)}
                    className="text-xs font-bold text-forge-gold hover:text-white shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
