import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ClipboardList, Plus, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';

const TaskManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('My Tasks');
  const [showModal, setShowModal] = useState(false);

  const [tasks, setTasks] = useState([]);

  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDue, setTaskDue] = useState('');
  const [taskFrom, setTaskFrom] = useState('');
  const [taskTarget, setTaskTarget] = useState('My Tasks'); // Which tab it belongs to
  const [taskSteps, setTaskSteps] = useState(1);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask = {
      title: taskTitle,
      priority: taskPriority,
      due: taskDue ? new Date(taskDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No Limit',
      from: taskFrom || 'System',
      completed: 0,
      total: parseInt(taskSteps) || 1,
      isMyTask: taskTarget === 'My Tasks',
      isAssigned: taskTarget === 'Assigned Tasks',
      isCompleted: false
    };

    setTasks(prev => [newTask, ...prev]);
    setShowModal(false);

    // Reset fields
    setTaskTitle('');
    setTaskPriority('Medium');
    setTaskDue('');
    setTaskFrom('');
    setTaskTarget('My Tasks');
    setTaskSteps(1);
  };

  const totalCount = tasks.length;
  const todoCount = tasks.filter(t => t.completed === 0).length;
  const inProgressCount = tasks.filter(t => t.completed > 0 && t.completed < t.total).length;
  const completedCount = tasks.filter(t => t.completed === t.total).length;

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Task Management</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Create, assign and track tasks across all levels.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-md flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', val: totalCount, color: 'text-blue-600', icon: ClipboardList, bg: 'bg-blue-50 border-blue-100' },
          { label: 'To Do', val: todoCount, color: 'text-slate-600', icon: Clock, bg: 'bg-slate-50 border-slate-150' },
          { label: 'In Progress', val: inProgressCount, color: 'text-amber-600', icon: AlertTriangle, bg: 'bg-amber-50 border-amber-100' },
          { label: 'Completed', val: completedCount, color: 'text-emerald-600', icon: CheckCircle, bg: 'bg-emerald-50 border-emerald-100' }
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
        {tasks
          .filter((task) => {
            if (activeTab === 'Assigned Tasks') return task.isAssigned;
            if (activeTab === 'Completed') return task.isCompleted;
            return task.isMyTask;
          })
          .map((task, idx) => (
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

      {/* Hierarchical Target Cascade Workflow */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">Hierarchical Target Cascade Workflow</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Cascade targets down the hierarchy: Admin → State → District → Division → Pincode Agent.</p>
          </div>
          <span className="text-xs font-bold text-forge-gold bg-amber-50 border border-forge-gold/30 px-2.5 py-1 rounded">RBAC Scoped</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { level: '1. Admin', title: 'Sets State Target', assignTo: 'State Agent', target: '500 Shops / Mo' },
            { level: '2. State Agent', title: 'Distributes to District', assignTo: 'District Agents', target: '100 Shops / Dist' },
            { level: '3. District Agent', title: 'Distributes to Division', assignTo: 'Divisional Agents', target: '25 Shops / Div' },
            { level: '4. Divisional Agent', title: 'Distributes to Pincode', assignTo: 'Pincode Agents', target: '5 Shops / Pin' },
            { level: '5. Pincode Agent', title: 'Executes Registrations', assignTo: 'Local Shops', target: 'On-Field Visits' },
          ].map((step, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl space-y-1.5 text-xs">
              <span className="text-[10px] font-black text-forge-gold uppercase tracking-wider block">{step.level}</span>
              <h4 className="font-bold text-slate-800">{step.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium">Recipient: <strong className="text-slate-700">{step.assignTo}</strong></p>
              <span className="inline-block bg-white border border-slate-200 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                {step.target}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 normal-case">Create New Task / Target</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block mb-1.5">Task Title / Target Goal</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Register 25 Shops in Salem East Division"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500 font-medium normal-case"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500 font-medium normal-case"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5">Target Level</label>
                  <select
                    value={taskTarget}
                    onChange={(e) => setTaskTarget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500 font-medium normal-case"
                  >
                    <option value="My Tasks">My Tasks</option>
                    <option value="Assigned Tasks">Assigned Tasks</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Issuer / Authority</label>
                  <input
                    type="text"
                    placeholder="e.g. District Agent"
                    value={taskFrom}
                    onChange={(e) => setTaskFrom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500 font-medium normal-case"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Target Quota (Shops)</label>
                  <input
                    type="number"
                    min="1"
                    value={taskSteps}
                    onChange={(e) => setTaskSteps(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500 font-medium normal-case"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5">Target Deadline</label>
                <input
                  type="date"
                  value={taskDue}
                  onChange={(e) => setTaskDue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500 font-medium normal-case"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg shadow-md transition uppercase tracking-wider"
              >
                Publish & Distribute Target
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskManagement;
