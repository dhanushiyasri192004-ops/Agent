import React from 'react';
import { useSelector } from 'react-redux';
import { MapPin, Info, Layers, Compass, Store, Users, CheckCircle2 } from 'lucide-react';

const AssignedArea = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Assigned Area</h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">Your designated geographical territory and limits.</p>
      </div>

      {/* Area Summary Info */}
      <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-200">Active Territory</h3>
            <p className="text-sm text-slate-400 mt-1">
              Pincode: <span className="text-white font-bold">{user?.agentInfo?.pincode || '641001'}</span> • Region: <span className="text-white font-bold">{user?.agentInfo?.district || 'Coimbatore'}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold">
            Status: Active
          </span>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Shops', value: '156', icon: Store, color: 'text-blue-600', bg: 'bg-blue-50/50' },
          { label: 'Active Shops', value: '133', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
          { label: 'Inactive Shops', value: '18', icon: Info, color: 'text-rose-600', bg: 'bg-rose-50/50' },
          { label: 'Vendors Registered', value: '132', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50/50' },
          { label: 'Total Customers', value: '125', icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50/50' }
        ].map((stat, idx) => (
          <div key={idx} className={`border border-slate-200 rounded-xl p-4 shadow-sm ${stat.bg}`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <p className="text-2xl font-black mt-3 text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Simulated Map view */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Area Map Coverage</h3>
          <button className="text-xs text-blue-600 hover:underline font-bold">View Full Map</button>
        </div>

        {/* Map visual mock */}
        <div className="w-full h-80 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center">
          
          {/* Decorative Grid Lines to represent map streets */}
          <div className="absolute inset-0 opacity-15" style={{
            backgroundImage: 'radial-gradient(circle, #000 10%, transparent 11%)',
            backgroundSize: '24px 24px'
          }}></div>
          
          {/* Simulated Route/Polygons */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-500/10 border-2 border-blue-500 rounded-2xl flex items-center justify-center">
            <span className="text-[10px] text-blue-600 font-black tracking-widest uppercase">Target Territory Boundary</span>
          </div>

          <div className="absolute top-1/3 left-1/3 w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 animate-ping"></div>
          <div className="absolute top-1/3 left-1/3 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px] font-bold"></div>
          
          {/* Mock Marker pins */}
          {[
            { top: '35%', left: '42%', label: 'Sri Murugan Stores' },
            { top: '60%', left: '30%', label: 'Kumar Medicals' },
            { top: '50%', left: '65%', label: 'Arul Electronics' }
          ].map((pin, idx) => (
            <div key={idx} className="absolute flex flex-col items-center" style={{ top: pin.top, left: pin.left }}>
              <MapPin className="w-5 h-5 text-red-500 fill-red-500" />
              <div className="bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                {pin.label}
              </div>
            </div>
          ))}
          
          <div className="absolute bottom-4 left-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow whitespace-nowrap">
            Center Coordinates: 11.0168° N, 76.9558° E
          </div>
        </div>
      </div>

    </div>
  );
};

export default AssignedArea;
