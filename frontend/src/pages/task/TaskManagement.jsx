import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ClipboardList, Plus, CheckCircle, Clock, AlertTriangle, ShieldAlert, Check } from 'lucide-react';

const TaskManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('My Tasks');

  const tasks = [
    { title: 'Collect Monthly Reports', priority: 'High', due: '22 May 2025', from: 'District Agents', completed: 0, total: 5 },
    { title: 'Verify New Vendor Registrations', priority: 'Medium', due: '27 May 2025', from: 'All Districts', completed: 12, total: 20 },
    { title: 'Government Project Review Meeting', priority: 'High', due: '30 May 2025', from: 'Divisional Agents', completed: 0, total: 1 },
    { title: 'Training for Pincode Agents', priority: 'Low', due: '30 May 2025', from: 'Pincode Agents', completed: 3, total: 8 }
  ];

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Task Management</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Create, assign and track tasks across all levels.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-md flex items-center gap-1.5 transition">
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', val: '256', color: 'text-blue-600', icon: ClipboardList, bg: 'bg-blue-50 border-blue-100' },
          { label: 'To Do', val: '78', color: 'text-slate-600', icon: Clock, bg: 'bg-slate-50 border-slate-150' },
          { label: 'In Progress', val: '96', color: 'text-amber-600', icon: AlertTriangle, bg: 'bg-amber-50 border-amber-100' },
          { label: 'Completed', val: '68', color: 'text-emerald-600', icon: CheckCircle, bg: 'bg-emerald-50 border-emerald-100' }
        ].map((card, idx) => (
          <div key={idx} className={`border p-5 rounded-xl flex items-center justify-between shadow-sm bg-white ${card.bg}`}>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
              <span className="text-2xl font-black text-slate-855 block mt-1">{card.val}</span>
            </div>
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest gap-5 pb-2">
        {['My Tasks', 'Assigned Tasks', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 transition select-none ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition duration-150 cursor-pointer flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-extrabold text-slate-800">{task.title}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${task.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>{task.priority}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">From: {task.from}</p>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>Progress: {task.completed} / {task.total} completed</span>
                <span className="text-[10px] text-slate-400">Due: {task.due}</span>
              </div>
              <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(task.completed / task.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TaskManagement;
