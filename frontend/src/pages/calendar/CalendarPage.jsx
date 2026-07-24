import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import api from '../../services/api.js';

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [customEvents, setCustomEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & form states
  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventType, setEventType] = useState('Meeting');

  useEffect(() => {
    fetchRealEvents();
  }, [currentMonth, customEvents]);

  const fetchRealEvents = async () => {
    try {
      setLoading(true);
      const [shopsRes, reportsRes] = await Promise.all([
        api.get('/api/shops').catch(() => ({ data: [] })),
        api.get('/api/reports').catch(() => ({ data: [] }))
      ]);

      const shopEvents = (shopsRes.data || []).map(shop => {
        const date = new Date(shop.createdAt);
        return {
          date,
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          title: shop.name || shop.shopName || 'Shop',
          type: 'Shop Registered',
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
        };
      });

      const reportEvents = (reportsRes.data || []).map(report => {
        const date = new Date(report.createdAt);
        return {
          date,
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          title: report.title,
          type: 'Report Submitted',
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          color: 'bg-blue-50 text-blue-600 border-blue-100'
        };
      });

      setEvents([...shopEvents, ...reportEvents, ...customEvents]);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate) return;

    const parsedDate = new Date(eventDate);
    const newEvent = {
      date: parsedDate,
      day: parsedDate.getDate(),
      month: parsedDate.getMonth(),
      year: parsedDate.getFullYear(),
      title: eventTitle,
      type: eventType,
      time: eventTime ? new Date(`1970-01-01T${eventTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
      color: eventType === 'Meeting' ? 'bg-purple-50 text-purple-600 border-purple-100' :
             eventType === 'Task' ? 'bg-blue-50 text-blue-600 border-blue-100' :
             eventType === 'Deadline' ? 'bg-rose-50 text-rose-650 border-rose-100' :
             'bg-slate-50 text-slate-650 border-slate-100'
    };

    setCustomEvents(prev => [...prev, newEvent]);
    setShowModal(false);

    // Reset fields
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventType('Meeting');
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar calculations
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  // Days from previous month to show at start of grid
  const prevMonthDays = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push(totalDaysInPrevMonth - i);
  }

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Calendar</h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">View schedules, meetings and important dates.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-md flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3 font-bold text-xs">
            <button onClick={handleToday} className="bg-slate-50 hover:bg-slate-100 border border-slate-150 px-3.5 py-2 rounded-lg text-slate-700">Today</button>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button onClick={handlePrevMonth} className="p-2 bg-slate-50 hover:bg-slate-100 border-r border-slate-200"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
              <button onClick={handleNextMonth} className="p-2 bg-slate-50 hover:bg-slate-100"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
            </div>
            <span className="text-base font-black text-slate-800 pl-2">{monthNames[month]} {year}</span>
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
          {prevMonthDays.map((d, idx) => (
            <div key={`prev-${idx}`} className="bg-slate-50/50 p-2 rounded-xl border border-slate-100 min-h-24 text-slate-400 text-xs font-bold">
              {d}
            </div>
          ))}

          {/* Days of current month */}
          {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const dayEvents = events.filter((ev) => ev.day === day && ev.month === month && ev.year === year);
            return (
              <div key={idx} className="bg-white hover:bg-slate-50 p-2 rounded-xl border border-slate-200 min-h-24 transition flex flex-col justify-between cursor-pointer">
                <span className="text-xs font-black text-slate-800">{day}</span>
                <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-20 custom-scrollbar">
                  {dayEvents.map((ev, eIdx) => (
                    <div key={eIdx} className={`text-[8.5px] font-bold p-1 rounded border truncate ${ev.color}`} title={`${ev.type}: ${ev.title}`}>
                      <span className="block font-black leading-tight truncate">{ev.title}</span>
                      <span className="block text-[7.5px] opacity-75">{ev.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 normal-case">Add New Event</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-4">
              <div>
                <label className="block mb-1.5">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Division Review Meeting"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500 font-medium normal-case"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500 font-medium normal-case"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Time</label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500 font-medium normal-case"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500 font-medium normal-case"
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Task">Task</option>
                  <option value="Deadline">Deadline</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg shadow-md transition uppercase tracking-wider"
              >
                Add Event to Calendar
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarPage;
