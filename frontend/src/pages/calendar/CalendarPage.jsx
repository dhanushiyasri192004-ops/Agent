import React from 'react';
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarPage = () => {
  const events = [
    { day: 2, title: 'State Meeting', time: '10:00 AM', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { day: 8, title: 'District Review', time: '10:00 AM', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { day: 12, title: 'Vendor Meeting', time: '02:00 PM', color: 'bg-amber-50 text-amber-605 border-amber-100' },
    { day: 15, title: 'Report Deadline', time: 'All Day', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    { day: 21, title: 'Pincode Training', time: '10:00 AM', color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { day: 27, title: 'Monthly Review', time: '10:00 AM', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
  ];

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Calendar</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">View schedules, meetings and important dates.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-md flex items-center gap-1.5 transition">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3 font-bold text-xs">
            <button className="bg-slate-50 hover:bg-slate-100 border border-slate-150 px-3.5 py-2 rounded-lg text-slate-700">Today</button>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button className="p-2 bg-slate-50 hover:bg-slate-100 border-r border-slate-200"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
              <button className="p-2 bg-slate-50 hover:bg-slate-100"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
            </div>
            <span className="text-base font-black text-slate-800 pl-2">May 2025</span>
          </div>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-xs font-bold text-slate-600">
            <button className="px-4 py-2 bg-blue-50 text-blue-600 font-extrabold border-r border-slate-200">Month</button>
            <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100">Week</button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Days from previous month */}
          <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100 min-h-24 text-slate-400 text-xs font-bold">27</div>
          <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100 min-h-24 text-slate-400 text-xs font-bold">28</div>
          <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100 min-h-24 text-slate-400 text-xs font-bold">29</div>
          <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100 min-h-24 text-slate-400 text-xs font-bold">30</div>

          {/* Days of current month */}
          {Array.from({ length: 31 }).map((_, idx) => {
            const day = idx + 1;
            const dayEvents = events.filter((ev) => ev.day === day);
            return (
              <div key={idx} className="bg-white hover:bg-slate-50 p-2 rounded-xl border border-slate-200 min-h-24 transition flex flex-col justify-between cursor-pointer">
                <span className="text-xs font-black text-slate-800">{day}</span>
                {dayEvents.map((ev, eIdx) => (
                  <div key={eIdx} className={`text-[9px] font-bold p-1 rounded border mt-1 truncate ${ev.color}`}>
                    <span className="block font-extrabold">{ev.title}</span>
                    <span className="block text-[8px] opacity-75">{ev.time}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CalendarPage;
