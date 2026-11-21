import React from 'react';
import { Menu, Plus, Phone, Bell, Droplet, Calendar, ShieldAlert } from './Icons';

export function Header({
  activeTab,
  onOpenMobileSidebar,
  onOpenQuickLog,
  onOpenEmergency,
  patientProfile
}) {
  const titles = {
    dashboard: { title: 'Dashboard Overview', subtitle: "Welcome back, Sarah. Here's your health status today." },
    tracker: { title: 'Glucose Tracker', subtitle: 'Log, filter, and analyze glycemic fluctuations over time.' },
    food: { title: 'Nutritional Food Diary', subtitle: 'Track meal compositions, carbohydrate intake, and glycemic impact.' },
    reminders: { title: 'Medications & Routines', subtitle: 'Daily schedule, prescription adherence, and health checks.' },
    reports: { title: 'Clinical Health Reports', subtitle: 'Estimated A1C, time-in-range metrics, and doctor consultation notes.' }
  };

  const current = titles[activeTab] || titles.dashboard;

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-navy-900 tracking-tight leading-tight truncate">
              {current.title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block truncate mt-0.5">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Date, Emergency & Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Today Date Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{todayDateFormatted}</span>
          </div>

          {/* Emergency Alert Shortcut */}
          <button
            onClick={onOpenEmergency}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
            title="Emergency care protocol & Rule of 15"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Emergency Info</span>
          </button>

          {/* Primary Quick Log Action Button */}
          <button
            onClick={onOpenQuickLog}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Glucose</span>
          </button>
        </div>
      </div>
    </header>
  );
}
