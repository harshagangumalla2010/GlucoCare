import React from 'react';
import {
  LayoutDashboard,
  Droplet,
  Utensils,
  Bell,
  FileText,
  HeartPulse,
  ShieldAlert,
  RefreshCw,
  X,
  ChevronRight
} from './Icons';

export function Sidebar({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  onOpenEmergency,
  onResetDemoData,
  unreadRemindersCount = 0
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Daily health overview'
    },
    {
      id: 'tracker',
      label: 'Glucose Tracker',
      icon: Droplet,
      badge: null,
      desc: 'Log & analyze blood sugar'
    },
    {
      id: 'food',
      label: 'Food Diary',
      icon: Utensils,
      badge: null,
      desc: 'Meals & carb tracking'
    },
    {
      id: 'reminders',
      label: 'Reminders',
      icon: Bell,
      badge: unreadRemindersCount > 0 ? unreadRemindersCount : null,
      badgeColor: 'bg-amber-500 text-white',
      desc: 'Medications & routines'
    },
    {
      id: 'reports',
      label: 'Health Reports',
      icon: FileText,
      badge: 'eA1C',
      badgeColor: 'bg-teal-100 text-teal-800',
      desc: 'Clinical trend analysis'
    }
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-navy-950 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Droplet className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Gluco<span className="text-teal-400">Care</span>
              </span>
              <span className="text-[10px] text-teal-400/80 block uppercase tracking-widest font-semibold">
                Clinical Health OS
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Identity Badge */}
        <div className="mx-4 my-4 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold text-sm shrink-0">
            SJ
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white truncate">Sarah Jenkins</h4>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active Monitoring"></span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Type 2 Diabetes • Tgt &lt; 6.5%</p>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Patient Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-600/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-900 text-teal-400 group-hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-sm leading-tight">{item.label}</span>
                    <span
                      className={`text-[10px] block mt-0.5 leading-tight ${
                        isActive ? 'text-teal-100' : 'text-slate-400'
                      }`}
                    >
                      {item.desc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Action Support & Emergency */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-navy-950/90">
          <button
            onClick={onOpenEmergency}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Emergency & Rule of 15</span>
          </button>

          <button
            onClick={onResetDemoData}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 flex items-center justify-center gap-2 text-[11px] font-medium transition-colors cursor-pointer"
            title="Reset demonstration records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Records</span>
          </button>

          <div className="pt-2 text-center">
            <span className="text-[10px] text-slate-400 block">
              GlucoCare v1.0.4 • HIPAA Compliant UI
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
