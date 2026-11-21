import React from 'react';
import {
  Activity,
  Droplet,
  Utensils,
  Bell,
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Plus,
  Clock,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from './Icons';
import {
  classifyGlucose,
  calculateEstimatedA1C,
  calculateTimeInRange,
  formatTime,
  formatDateTime
} from '../utils/helpers';

export function Dashboard({
  patientProfile,
  glucoseReadings,
  meals,
  reminders,
  notes,
  setActiveTab,
  onOpenQuickLog,
  onOpenEmergency
}) {
  // Sort readings descending by timestamp
  const sortedReadings = [...glucoseReadings].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  const latestReading = sortedReadings[0];
  const classification = latestReading ? classifyGlucose(latestReading.value, latestReading.type) : null;

  // Filter today's readings
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayReadings = sortedReadings.filter(
    (r) => r.timestamp && r.timestamp.slice(0, 10) === todayStr
  );

  // Time in Range calculations across recent readings (last 14 days)
  const tirStats = calculateTimeInRange(sortedReadings.slice(0, 30), 70, 140);

  // Average glucose
  const recentValues = sortedReadings.slice(0, 30).map((r) => r.value);
  const avgGlucose = recentValues.length
    ? Math.round(recentValues.reduce((a, b) => a + b, 0) / recentValues.length)
    : 0;
  const estimatedA1C = calculateEstimatedA1C(avgGlucose);

  // Medication adherence today
  const completedReminders = reminders.filter((r) => r.completedToday);
  const medPercent = reminders.length
    ? Math.round((completedReminders.length / reminders.length) * 100)
    : 0;

  // Today's meals & carbs
  const todayMeals = meals.filter(
    (m) => m.timestamp && m.timestamp.slice(0, 10) === todayStr
  );
  const todayCarbs = todayMeals.reduce((sum, m) => sum + (Number(m.carbsGrams) || 0), 0);

  // Combined recent activities (top 6 items)
  const activityItems = [
    ...sortedReadings.slice(0, 5).map((r) => ({
      id: r.id,
      kind: 'glucose',
      timestamp: r.timestamp,
      title: `${r.value} mg/dL • ${r.type}`,
      subtitle: r.notes || 'Recorded blood glucose',
      icon: Droplet,
      iconClass: 'bg-teal-50 text-teal-600 border border-teal-200',
      badge: classifyGlucose(r.value, r.type).label,
      badgeClass: classifyGlucose(r.value, r.type).badgeClass
    })),
    ...meals.slice(0, 4).map((m) => ({
      id: m.id,
      kind: 'meal',
      timestamp: m.timestamp,
      title: `${m.mealType} • ${m.carbsGrams}g Carbs`,
      subtitle: m.foodDescription,
      icon: Utensils,
      iconClass: 'bg-amber-50 text-amber-600 border border-amber-200',
      badge: `${m.glycemicIndex} GI`,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-100'
    })),
    ...reminders
      .filter((rem) => rem.completedToday)
      .map((rem) => ({
        id: `med-${rem.id}`,
        kind: 'med',
        timestamp: `${todayStr}T${rem.time}:00`,
        title: `${rem.name} (${rem.dosage})`,
        subtitle: `Completed ${rem.frequency}`,
        icon: Bell,
        iconClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        badge: 'Completed',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-100'
      }))
  ]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6);

  // Dynamic greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimal Glycemic Stability</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {greeting}, {patientProfile?.name?.split(' ')[0] || 'Patient'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Your recent time-in-range is at <strong className="text-teal-400 font-bold">{tirStats.inRange}%</strong>. 
              {todayReadings.length > 0 
                ? ` You have recorded ${todayReadings.length} reading${todayReadings.length > 1 ? 's' : ''} today.` 
                : ' Remember to log your post-meal or bedtime reading.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenQuickLog}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs sm:text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Reading</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-all cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>View Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Latest Glucose */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Latest Glucose
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {latestReading ? latestReading.value : '--'}
            </span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          {latestReading && classification && (
            <div className="mt-3 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${classification.badgeClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${classification.dotClass}`}></span>
                {classification.label}
              </span>
              <span className="text-[11px] text-slate-400">
                {formatTime(latestReading.timestamp)}
              </span>
            </div>
          )}
        </div>

        {/* Card 2: 14-Day Average Glucose */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              14-Day Average
            </span>
            <div className="p-2 rounded-xl bg-navy-50 text-navy-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {avgGlucose || '--'}
            </span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Est. HbA1c</span>
            <span className="font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              ~{estimatedA1C}% (Target &lt; 6.5%)
            </span>
          </div>
        </div>

        {/* Card 3: Time in Range (TIR) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Time in Range (70-140)
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {tirStats.inRange}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 font-bold">ADA Target &gt; 70%</span>
          </div>
          {/* Visual Progress Bar */}
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div style={{ width: `${tirStats.low}%` }} className="bg-amber-400" title={`Low: ${tirStats.low}%`}></div>
            <div style={{ width: `${tirStats.inRange}%` }} className="bg-teal-500" title={`In Range: ${tirStats.inRange}%`}></div>
            <div style={{ width: `${tirStats.high}%` }} className="bg-rose-400" title={`High: ${tirStats.high}%`}></div>
          </div>
        </div>

        {/* Card 4: Medication Adherence Today */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Medication Today
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {completedReminders.length} / {reminders.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">scheduled</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">{medPercent}% Adherence</span>
            <button
              onClick={() => setActiveTab('reminders')}
              className="text-teal-600 font-bold hover:underline cursor-pointer"
            >
              Check schedule →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Quick Actions & Tools
          </h3>
          <span className="text-xs text-slate-400">One-click health modules</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab('tracker')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <Droplet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-600 transition-colors">
              Glucose Log
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">Enter & view readings</p>
          </button>

          <button
            onClick={() => setActiveTab('food')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <Utensils className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
              Food Diary
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{todayCarbs}g carbs logged today</p>
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <Bell className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
              Reminders
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{reminders.length - completedReminders.length} pending today</p>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-600 transition-colors">
              Clinical Reports
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">Print summary for Dr.</p>
          </button>
        </div>
      </div>

      {/* Main Grid: Today's Summary & Recent Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Target Distribution & Day Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Glycemic Distribution Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" />
                  Glycemic Distribution & Target Alignment
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clinical target ranges based on ADA non-pregnant adult recommendations
                </p>
              </div>
              <button
                onClick={() => setActiveTab('tracker')}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                Full Tracker <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Target Breakdown Row */}
            <div className="grid grid-cols-3 gap-3 my-5 text-center">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[11px] font-bold text-amber-700 uppercase block">Low (&lt;70)</span>
                <span className="text-xl font-black text-amber-800 block mt-1">{tirStats.low}%</span>
                <span className="text-[10px] text-amber-600">{tirStats.lowCount} events</span>
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200">
                <span className="text-[11px] font-bold text-teal-700 uppercase block">In Range (70-140)</span>
                <span className="text-xl font-black text-teal-800 block mt-1">{tirStats.inRange}%</span>
                <span className="text-[10px] text-teal-600">{tirStats.inRangeCount} readings</span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200">
                <span className="text-[11px] font-bold text-rose-700 uppercase block">High (&gt;140)</span>
                <span className="text-xl font-black text-rose-800 block mt-1">{tirStats.high}%</span>
                <span className="text-[10px] text-rose-600">{tirStats.highCount} events</span>
              </div>
            </div>

            {/* Target Guidance Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-600 text-white shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="leading-relaxed">
                <strong>Clinician Insight:</strong> Fasting blood glucose is remaining steady between 
                104–112 mg/dL. Pairing carbohydrate intake with lean protein and fiber during lunch has reduced 
                post-prandial spikes below 140 mg/dL.
              </p>
            </div>
          </div>

          {/* Quick Doctor Follow-up Card */}
          <div className="bg-gradient-to-r from-teal-900 to-navy-950 text-white rounded-3xl p-6 shadow-md border border-teal-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">Upcoming Consultation</span>
              <h4 className="text-lg font-bold text-white mt-1">{patientProfile?.physician?.name}</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {patientProfile?.physician?.clinic} • Next: {patientProfile?.physician?.nextAppointment}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-4 py-2.5 rounded-xl bg-white text-navy-950 font-bold text-xs hover:bg-teal-50 transition-colors shrink-0 cursor-pointer"
            >
              Prepare Doctor Notes
            </button>
          </div>
        </div>

        {/* Right Column: Recent Activities Timeline */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Recent Activities</h3>
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Live Log
            </span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[460px] pr-1">
            {activityItems.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No recent activity recorded yet.
              </div>
            ) : (
              activityItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="py-3.5 flex items-start gap-3 group">
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${item.iconClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </h5>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                      {item.badge && (
                        <span
                          className={`mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeClass}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2">
            <button
              onClick={onOpenQuickLog}
              className="w-full py-2.5 rounded-xl border border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/50 hover:bg-teal-50 text-teal-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Activity</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
