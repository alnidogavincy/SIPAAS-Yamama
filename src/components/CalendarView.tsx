import { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, ChevronLeft, ChevronRight, Tag, BookOpen, AlertCircle, Plus } from 'lucide-react';
import { mockAgendaEvents } from '../data';
import { AgendaEvent } from '../types';

export default function CalendarView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(mockAgendaEvents[0]);

  // Calendar setup for June 2026
  // June 1, 2026 is Monday
  const daysInMonth = 30;
  const startOffset = 1; // Mon (Sun=0, Mon=1)
  const monthName = "Juni 2026";

  const categories = ['Semua', 'Keagamaan', 'Akademik', 'Kesiswaan', 'Umum'];

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'keagamaan': return 'bg-purple-500 border-purple-600 text-purple-700';
      case 'akademik': return 'bg-blue-500 border-blue-600 text-blue-700';
      case 'kesiswaan': return 'bg-rose-500 border-rose-600 text-rose-700';
      case 'wali': return 'bg-amber-500 border-amber-600 text-amber-700';
      default: return 'bg-emerald-500 border-emerald-600 text-emerald-700';
    }
  };

  const getEventsForDay = (day: number) => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-06-${dayStr}`;
    return mockAgendaEvents.filter(evt => evt.date === dateStr);
  };

  const filteredEvents = mockAgendaEvents.filter(evt => {
    if (selectedCategory === 'Semua') return true;
    return evt.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const renderCells = () => {
    const cells = [];
    // Empty cells for offset
    for (let i = 0; i < startOffset; i++) {
      cells.push(<div key={`empty-${i}`} className="h-16 border border-slate-100 bg-slate-50/50"></div>);
    }

    // Days in October 2024
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isSelected = selectedDay === day;
      const hasEvents = dayEvents.length > 0;

      cells.push(
        <div
          key={`day-${day}`}
          onClick={() => {
            setSelectedDay(day);
            if (dayEvents.length > 0) {
              setSelectedEvent(dayEvents[0]);
            }
          }}
          className={`h-20 border border-slate-100 p-1.5 transition-all relative cursor-pointer hover:bg-emerald-50/30 flex flex-col justify-between ${
            isSelected ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-600/10' : 'bg-white'
          }`}
          id={`cal-day-${day}`}
        >
          <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
            hasEvents ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-slate-600'
          }`}>
            {day}
          </span>

          {/* Render dot indicators for events */}
          <div className="flex flex-wrap gap-1 mt-1 overflow-hidden max-h-8">
            {dayEvents.map(evt => {
              const bgClass = getCategoryColor(evt.category).split(' ')[0];
              return (
                <div
                  key={evt.id}
                  className={`w-1.5 h-1.5 rounded-full ${bgClass}`}
                  title={evt.title}
                />
              );
            })}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans px-4 sm:px-6 lg:px-8" id="agenda-section">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <CalendarIcon className="text-emerald-700" size={32} />
              <span>Agenda & Kalender Pesantren</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kalender resmi kegiatan, ujian, liburan, kajian, dan pertemuan wali santri Pondok Pesantren Yamama.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5" id="agenda-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar & Detail Splitscreen */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kalender Panel (Col-span 2) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col" id="calendar-grid-card">
            
            {/* Calendar Year/Month Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-800">{monthName}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold border border-emerald-200">
                  Tahun Ajaran 25/26
                </span>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 px-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition" disabled>
                  <ChevronLeft size={18} />
                </button>
                <button className="p-1 px-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition" disabled>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Days of week Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
              <div>Min</div>
              <div>Sen</div>
              <div>Sel</div>
              <div>Rab</div>
              <div>Kam</div>
              <div>Jum</div>
              <div>Sab</div>
            </div>

            {/* Main Day Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCells()}
            </div>

            {/* Bottom Color legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 block"></span>
                <span>Keagamaan</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block"></span>
                <span>Akademik</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
                <span>Kesiswaan</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                <span>Umum / Lainnya</span>
              </span>
            </div>

          </div>

          {/* Right Column: Events list & Detail */}
          <div className="space-y-6" id="agenda-details-sidebar">
            
            {/* Event Detail View */}
            {selectedEvent ? (
              <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-md border border-emerald-900 flex flex-col justify-between min-h-[220px]" id="selected-event-detail">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-emerald-950">
                      {selectedEvent.category}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-300">
                      {selectedEvent.date}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-amber-300 leading-snug">{selectedEvent.title}</h3>
                  <p className="text-xs text-emerald-200 mt-2 leading-relaxed opacity-90">{selectedEvent.description}</p>
                </div>

                <div className="border-t border-emerald-800 pt-4 mt-4 space-y-2 text-xs text-emerald-100">
                  <div className="flex items-center space-x-2">
                    <Clock size={14} className="text-amber-400 shrink-0" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} className="text-amber-400 shrink-0" />
                    <span className="truncate">{selectedEvent.location}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 text-slate-500 rounded-2xl p-6 text-center border-2 border-dashed border-slate-200 flex flex-col items-center justify-center h-[220px]">
                <AlertCircle size={32} className="text-slate-300 mb-2" />
                <p className="text-xs font-semibold">Pilih tanggal untuk melihat detail agenda khusus.</p>
              </div>
            )}

            {/* List Agenda Sesuai Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-150">
                Daftar Agenda ({filteredEvents.length})
              </h3>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1" id="agenda-events-list">
                {filteredEvents.map((evt) => {
                  const isSelected = selectedEvent?.id === evt.id;
                  const [, , day] = evt.date.split('-');
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center space-x-3 hover:bg-slate-50 ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500' 
                          : 'border-slate-100 bg-slate-50/50'
                      }`}
                    >
                      <div className="bg-emerald-900 text-amber-300 font-bold p-2.5 w-11 h-11 rounded-lg flex flex-col justify-center items-center shrink-0">
                        <span className="text-xs font-mono leading-none">Jun</span>
                        <span className="text-sm font-bold leading-none mt-0.5">{day}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{evt.title}</h4>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                          <span className="truncate max-w-[100px] font-medium">{evt.location}</span>
                          <span>•</span>
                          <span className="font-semibold">{evt.category}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    Tidak ada agenda untuk kategori ini.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
