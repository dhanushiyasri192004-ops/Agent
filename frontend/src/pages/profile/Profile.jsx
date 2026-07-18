import React from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Phone, MapPin, Award } from 'lucide-react';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const info = user?.agentInfo;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="text-forge-gold w-6 h-6" /> User Profile Info
        </h1>
        <p className="text-xs text-forge-grayText mt-0.5 font-medium">Verify your profile status and assigned location scope details.</p>
      </div>

      {/* Main card */}
      <div className="bg-forge-dark border border-forge-card/40 rounded-xl p-6 shadow-lg space-y-6">
        
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 border-b border-forge-card/45 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-forge-card border border-forge-gold/30 flex items-center justify-center font-black text-xl text-forge-gold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-black text-white">{user?.name || 'System Admin'}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-forge-gold/10 text-forge-gold border border-forge-gold/20 font-bold text-[10px] uppercase block w-fit mt-1 tracking-wider">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-forge-grayText">
          
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-forge-gold shrink-0" />
            <div>
              <p className="uppercase text-[10px] font-bold">Email Address</p>
              <p className="text-white font-semibold mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-forge-gold shrink-0" />
            <div>
              <p className="uppercase text-[10px] font-bold">Phone Number</p>
              <p className="text-white font-semibold mt-0.5">{info?.phone || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-forge-gold shrink-0" />
            <div>
              <p className="uppercase text-[10px] font-bold">Account Status</p>
              <p className="text-emerald-400 font-semibold mt-0.5">Active</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-forge-gold shrink-0" />
            <div>
              <p className="uppercase text-[10px] font-bold">Assigned State</p>
              <p className="text-white font-semibold mt-0.5">{info?.state || 'All India (Admin)'}</p>
            </div>
          </div>

        </div>

        {/* Territory details */}
        {info && (
          <div className="pt-6 border-t border-forge-card/45">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Assigned Territory Scope</h3>
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              
              {info.division && (
                <div className="bg-forge-card/30 border border-forge-card p-3 rounded-lg">
                  <p className="text-forge-grayText uppercase text-[9px] font-bold">Division</p>
                  <p className="text-white font-bold mt-1">{info.division}</p>
                </div>
              )}

              {info.district && (
                <div className="bg-forge-card/30 border border-forge-card p-3 rounded-lg">
                  <p className="text-forge-grayText uppercase text-[9px] font-bold">District</p>
                  <p className="text-white font-bold mt-1">{info.district}</p>
                </div>
              )}

              {info.pincode && (
                <div className="bg-forge-card/30 border border-forge-card p-3 rounded-lg">
                  <p className="text-forge-grayText uppercase text-[9px] font-bold">Pincode Area</p>
                  <p className="text-forge-gold font-bold mt-1">{info.pincode}</p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Profile;
