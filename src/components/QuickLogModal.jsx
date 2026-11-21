import React, { useState } from 'react';
import { Droplet, X, Clock, Calendar, Check, AlertCircle } from './Icons';
import { classifyGlucose, generateId } from '../utils/helpers';

export function QuickLogModal({ isOpen, onClose, onSaveReading }) {
  if (!isOpen) return null;

  const now = new Date();
  const defaultDate = now.toISOString().slice(0, 10);
  const defaultTime = now.toTimeString().slice(0, 5);

  const [value, setValue] = useState('');
  const [readingType, setReadingType] = useState('Fasting');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const classification = value ? classifyGlucose(value, readingType) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (isNaN(num) || num < 20 || num > 600) {
      setError('Please enter a realistic blood glucose reading between 20 and 600 mg/dL.');
      return;
    }

    const isoTimestamp = `${date}T${time}:00`;
    const newEntry = {
      id: generateId('g'),
      timestamp: isoTimestamp,
      value: Math.round(num),
      type: readingType,
      notes: notes.trim() || 'Manual entry',
      tags: [readingType.includes('After') ? 'Post-Meal' : readingType.includes('Fasting') ? 'Fasting' : 'Routine']
    };

    onSaveReading(newEntry);
    onClose();
  };

  const presetTypes = [
    'Fasting',
    'Before Breakfast',
    'After Breakfast',
    'Before Lunch',
    'After Lunch',
    'Before Dinner',
    'After Dinner',
    'Bedtime',
    'Random'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog" 
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Droplet className="w-6 h-6 fill-teal-400" />
            </div>
            <div>
              <span className="text-teal-400 text-[10px] font-bold tracking-wider uppercase">Biometric Entry</span>
              <h3 className="text-xl font-bold text-white">Log Blood Glucose</h3>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Reading Value Input & Live Classification */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Glucose Level (mg/dL) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="20"
                max="600"
                required
                autoFocus
                placeholder="e.g. 110"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError('');
                }}
                className="w-full text-2xl font-black text-slate-900 placeholder:text-slate-300 pl-4 pr-20 py-3 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                mg/dL
              </span>
            </div>

            {/* Instant Clinical Range Feedback */}
            {classification && (
              <div className={`mt-2.5 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${classification.badgeClass}`}>
                <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${classification.dotClass}`}></span>
                <div>
                  <span className="font-bold block">{classification.label}</span>
                  <p className="text-[11px] opacity-90 mt-0.5 leading-snug">{classification.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Context Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Measurement Context
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {presetTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setReadingType(type)}
                  className={`py-2 px-2 text-[11px] font-semibold rounded-xl border transition-all text-center truncate ${
                    readingType === type
                      ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Clinical Notes / Symptoms (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. 2 hours post oatmeal, felt good, 20m walk..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all cursor-pointer"
            >
              Save Reading
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
