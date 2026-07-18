import React, { useState } from 'react';
import { Settings, ShieldAlert, Check } from 'lucide-react';

const SettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setSuccess('Password updated successfully (Simulated)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="text-forge-gold w-6 h-6" /> Account Settings
        </h1>
        <p className="text-xs text-forge-grayText mt-0.5">Manage preferences, theme properties, and change security details.</p>
      </div>

      <div className="bg-forge-dark border border-forge-card/40 rounded-xl p-6 shadow-lg space-y-6">
        
        {/* Security Password Change Section */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Change Password</h3>
          
          {error && (
            <div className="mb-4 bg-red-950/50 border border-red-800 text-red-200 text-xs px-3 py-2 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-xs px-3 py-2 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handlePasswordReset} className="space-y-4 text-xs font-semibold text-forge-grayText uppercase tracking-wider">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1.5">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-forge-card/45 border border-forge-card text-white px-3 py-2 rounded-lg outline-none focus:border-forge-gold"
                />
              </div>
              <div>
                <label className="block mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-forge-card/45 border border-forge-card text-white px-3 py-2 rounded-lg outline-none focus:border-forge-gold"
                />
              </div>
              <div>
                <label className="block mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-forge-card/45 border border-forge-card text-white px-3 py-2 rounded-lg outline-none focus:border-forge-gold"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="bg-forge-gold hover:bg-forge-goldHover text-forge-dark font-bold px-4 py-2 rounded-lg transition uppercase tracking-wider text-[10px]"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* General Application Preferences Mock */}
        <div className="pt-6 border-t border-forge-card/45 text-xs">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Application Preferences</h3>
          <div className="space-y-3 font-semibold text-forge-grayText">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="accent-forge-gold w-4 h-4" />
              <span>Enable real-time push alerts for sub-agent registrations</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="accent-forge-gold w-4 h-4" />
              <span>Send daily activity summary email digests</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="accent-forge-gold w-4 h-4" />
              <span>Use high-contrast theme components inside charts dashboard</span>
            </label>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SettingsPage;
