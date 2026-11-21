import React, { useState } from 'react';
import {
  Bell,
  Pill,
  Plus,
  Trash2,
  CheckCircle2,
  Check,
  Clock,
  AlertCircle,
  ShieldAlert,
  Sparkles
} from './Icons';
import { generateId } from '../utils/helpers';

export function Reminders({
  reminders,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder
}) {
  // Form State
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00');
  const [category, setCategory] = useState('Oral Medication');
  const [frequency, setFrequency] = useState('Daily with Breakfast');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');

  // Filter State
  const [filter, setFilter] = useState('All'); // All, Pending, Completed

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a medication or task name.');
      return;
    }

    const newReminder = {
      id: generateId('r'),
      name: name.trim(),
      dosage: dosage.trim() || 'As prescribed',
      time,
      category,
      frequency,
      instructions: instructions.trim() || 'Take as instructed by your healthcare provider.',
      completedToday: false,
      lastCompletedDate: null
    };

    onAddReminder(newReminder);

    // Reset Form
    setName('');
    setDosage('');
    setInstructions('');
    setError('');
  };

  // Filter items
  const filteredReminders = reminders.filter((r) => {
    if (filter === 'Completed') return r.completedToday;
    if (filter === 'Pending') return !r.completedToday;
    return true;
  });

  const completedCount = reminders.filter((r) => r.completedToday).length;
  const adherenceRate = reminders.length
    ? Math.round((completedCount / reminders.length) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Section: Adherence Overview & Add Reminder Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Schedule New Reminder</h3>
              <p className="text-xs text-slate-500">Track prescriptions, vitals checks, and daily routines</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Name & Dosage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Medication / Task Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metformin XR"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Dosage / Measure
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500 mg or 1 tablet"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="Oral Medication">💊 Oral Medication</option>
                  <option value="Injectable">💉 Injectable / Insulin Pen</option>
                  <option value="Health Check">🩺 Blood Pressure / Vitals Check</option>
                  <option value="Physical Activity">🏃 Physical Activity / Walk</option>
                  <option value="Hydration">💧 Hydration Reminder</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Reminder Time *
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Frequency Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="Daily with Breakfast">Daily with Breakfast</option>
                <option value="Daily with Lunch">Daily with Lunch</option>
                <option value="Daily with Dinner">Daily with Dinner</option>
                <option value="Daily at Bedtime">Daily at Bedtime</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="Every 2 Days">Every 2 Days</option>
                <option value="Weekly">Weekly</option>
                <option value="As Needed (PRN)">As Needed (PRN)</option>
              </select>
            </div>

            {/* Clinical Instructions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Doctor Instructions / Notes
              </label>
              <textarea
                rows="2"
                placeholder="e.g. Take with food and a full glass of water. Do not crush."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add to Schedule</span>
            </button>
          </form>
        </div>

        {/* Adherence Rate & Safety Guardrail (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Adherence Progress Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Today's Adherence Score
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Consistent timing optimizes glycemic control
            </p>

            <div className="my-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Completion</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black text-indigo-950">{adherenceRate}%</span>
                </div>
                <span className="text-xs text-indigo-800 font-semibold mt-1 block">
                  {completedCount} of {reminders.length} items logged today
                </span>
              </div>

              <div className="w-20 h-20 rounded-full border-4 border-indigo-200 flex items-center justify-center bg-white shadow-inner">
                <CheckCircle2 className={`w-10 h-10 ${adherenceRate === 100 ? 'text-emerald-500' : 'text-indigo-600'}`} />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${adherenceRate}%` }}
              ></div>
            </div>
          </div>

          {/* Safety Prescription Notice */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">Medication Safety Guardrail</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never skip, double, or adjust prescription medication or insulin units without direct consultation 
              with your prescribing endocrinologist or clinical pharmacist.
            </p>
          </div>
        </div>
      </div>

      {/* Reminders List & Checkbox Schedule */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Daily Schedule & Adherence</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click the checkmark to mark as completed for today
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5">
            {['All', 'Pending', 'Completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Reminders List */}
        <div className="mt-4 divide-y divide-slate-100">
          {filteredReminders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No reminders found matching this filter.
            </div>
          ) : (
            filteredReminders.map((reminder) => {
              const isDone = reminder.completedToday;

              return (
                <div
                  key={reminder.id}
                  className={`py-4 px-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isDone ? 'bg-emerald-50/40 border border-emerald-100' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Left: Interactive Checkbox & Details */}
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    {/* Completion Toggle Button */}
                    <button
                      onClick={() => onToggleReminder(reminder.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500'
                          : 'border-2 border-slate-300 hover:border-indigo-600 bg-white text-transparent hover:text-indigo-400'
                      }`}
                      title={isDone ? 'Mark as incomplete' : 'Mark as completed today'}
                      aria-label="Toggle completion status"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`text-sm font-bold transition-colors ${
                            isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                          }`}
                        >
                          {reminder.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {reminder.dosage}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {reminder.category}
                        </span>
                        {isDone && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Completed Today
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-1 leading-snug">
                        {reminder.instructions}
                      </p>
                    </div>
                  </div>

                  {/* Right: Time, Frequency & Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs">
                    <div className="text-left sm:text-right">
                      <span className="font-extrabold text-slate-900 block flex items-center gap-1.5 sm:justify-end">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {reminder.time}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {reminder.frequency}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteReminder(reminder.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete reminder"
                      aria-label="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
