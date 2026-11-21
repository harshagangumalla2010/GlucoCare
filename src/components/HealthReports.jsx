import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Activity,
  Droplet,
  TrendingUp,
  Sparkles,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  ShieldAlert,
  CheckCircle2
} from './Icons';
import {
  calculateEstimatedA1C,
  calculateTimeInRange,
  calculateStandardDeviation,
  classifyGlucose,
  generateId,
  formatDate
} from '../utils/helpers';

export function HealthReports({
  patientProfile,
  glucoseReadings,
  meals,
  reminders,
  notes,
  onAddNote,
  onDeleteNote
}) {
  const [reportRange, setReportRange] = useState('14d'); // 7d, 14d, 30d
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('Doctor Prep');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isNoteImportant, setIsNoteImportant] = useState(false);

  // Filter readings by selected range
  const now = new Date();
  const filteredReadings = [...glucoseReadings].filter((r) => {
    const rDate = new Date(r.timestamp);
    const diffDays = (now - rDate) / (1000 * 60 * 60 * 24);
    if (reportRange === '7d') return diffDays <= 7;
    if (reportRange === '14d') return diffDays <= 14;
    return diffDays <= 30;
  });

  const values = filteredReadings.map((r) => Number(r.value));
  const avgGlucose = values.length
    ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    : 0;
  const estimatedA1C = calculateEstimatedA1C(avgGlucose);
  const stdDev = calculateStandardDeviation(filteredReadings);
  const tir = calculateTimeInRange(filteredReadings, 70, 140);

  const fastingReadings = filteredReadings.filter((r) =>
    r.type.toLowerCase().includes('fasting')
  );
  const fastingAvg = fastingReadings.length
    ? Math.round(
        fastingReadings.reduce((sum, r) => sum + r.value, 0) /
          fastingReadings.length
      )
    : 0;

  const postMealReadings = filteredReadings.filter(
    (r) =>
      r.type.toLowerCase().includes('after') ||
      r.type.toLowerCase().includes('post')
  );
  const postMealAvg = postMealReadings.length
    ? Math.round(
        postMealReadings.reduce((sum, r) => sum + r.value, 0) /
          postMealReadings.length
      )
    : 0;

  const lowestReading = values.length ? Math.min(...values) : 0;
  const highestReading = values.length ? Math.max(...values) : 0;

  // Daily Averages Bar Breakdown (last 7 recorded days)
  const daysMap = {};
  filteredReadings.forEach((r) => {
    const day = r.timestamp.slice(0, 10);
    if (!daysMap[day]) daysMap[day] = [];
    daysMap[day].push(r.value);
  });

  const dailyAverages = Object.keys(daysMap)
    .sort()
    .slice(-7)
    .map((day) => {
      const arr = daysMap[day];
      const avg = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
      const dateObj = new Date(day);
      const label = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      return { day, label, avg, count: arr.length };
    });

  const handlePrint = () => {
    window.print();
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newNote = {
      id: generateId('hn'),
      date: new Date().toISOString().slice(0, 10),
      category: newNoteCategory,
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      important: isNoteImportant
    };

    onAddNote(newNote);
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsNoteImportant(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Range Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">Clinical Analytics & Health Report</h2>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Verified Metrics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated biometrics formatted for clinical consultation with your endocrinologist
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Range Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {['7d', '14d', '30d'].map((r) => (
              <button
                key={r}
                onClick={() => setReportRange(r)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  reportRange === r
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '14d' ? '14 Days' : '30 Days'}
              </button>
            ))}
          </div>

          {/* Print Report Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Clinical Summary</span>
          </button>
        </div>
      </div>

      {/* Primary Clinical Biometrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estimated A1C Card */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-3xl p-6 shadow-lg shadow-teal-500/15 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-white/10">
            <Activity className="w-32 h-32" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-100 block">
            Estimated HbA1c (eA1C)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight">{estimatedA1C}%</span>
            <span className="text-xs font-semibold text-teal-200">Target &lt; 6.5%</span>
          </div>
          <p className="text-[11px] text-teal-100 mt-2 leading-relaxed">
            Nathan formula: (Avg + 46.7) / 28.7. Serves as clinical estimate; laboratory blood draw confirms.
          </p>
        </div>

        {/* Average Blood Glucose */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mean Glucose (Period)
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 tracking-tight">{avgGlucose}</span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Fasting: <strong className="text-slate-800">{fastingAvg || '--'} mg/dL</strong></span>
            <span>Post: <strong className="text-slate-800">{postMealAvg || '--'} mg/dL</strong></span>
          </div>
        </div>

        {/* Time in Range (TIR) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Time in Range (70-140)
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 tracking-tight">{tir.inRange}%</span>
            <span className="text-xs font-bold text-emerald-600">ADA &gt; 70%</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Low: <strong className="text-amber-600">{tir.low}%</strong></span>
            <span>High: <strong className="text-rose-600">{tir.high}%</strong></span>
          </div>
        </div>

        {/* Glucose Variability (Std Dev) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Variability (Std Dev)
            </span>
            <div className="p-2 rounded-xl bg-navy-50 text-navy-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 tracking-tight">±{stdDev}</span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Min: <strong className="text-slate-800">{lowestReading}</strong></span>
            <span>Max: <strong className="text-slate-800">{highestReading}</strong></span>
          </div>
        </div>
      </div>

      {/* Daily Average Glucose Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Daily Average Glucose Comparison</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily mean levels compared against the 140 mg/dL target threshold
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
            Target Ceiling: 140 mg/dL
          </span>
        </div>

        {/* Bar Visualizer */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-7 gap-3">
          {dailyAverages.length === 0 ? (
            <div className="col-span-7 text-center py-8 text-slate-400 text-xs">
              No daily readings in this range.
            </div>
          ) : (
            dailyAverages.map((item) => {
              const isOverTarget = item.avg > 140;
              const isLow = item.avg < 70;
              const barHeight = Math.min(100, Math.max(20, (item.avg / 200) * 100));

              return (
                <div key={item.day} className="flex flex-col items-center">
                  <span className="text-xs font-extrabold text-slate-900 mb-2">
                    {item.avg} <span className="text-[10px] text-slate-400 font-normal">mg/dL</span>
                  </span>

                  <div className="w-full bg-slate-100 rounded-2xl h-36 flex items-end p-1.5 justify-center">
                    <div
                      className={`w-full rounded-xl transition-all duration-500 ${
                        isLow
                          ? 'bg-amber-400'
                          : isOverTarget
                          ? 'bg-rose-400'
                          : 'bg-teal-500'
                      }`}
                      style={{ height: `${barHeight}%` }}
                      title={`${item.label}: ${item.avg} mg/dL (${item.count} readings)`}
                    ></div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-600 mt-2 truncate text-center">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.count} logs
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Personal Health Notes & Doctor Consultation Prep */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Add Note Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Doctor Consultation Notes</h3>
              <p className="text-xs text-slate-500">Record symptoms, questions & lifestyle notes</p>
            </div>
          </div>

          <form onSubmit={handleAddNote} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Note Topic / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Discuss recent hypoglycemia event"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Note Category
              </label>
              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value)}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-white focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="Doctor Prep">🩺 Doctor Consultation Question</option>
                <option value="Symptom Observation">⚠️ Symptom Observation</option>
                <option value="Lifestyle & Nutrition">🥗 Lifestyle & Diet Reaction</option>
                <option value="Medication Query">💊 Medication Observation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Details & Clinical Observations *
              </label>
              <textarea
                rows="4"
                required
                placeholder="Write specific observations, times, reactions, or questions you wish to present to your clinician..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="importantNote"
                checked={isNoteImportant}
                onChange={(e) => setIsNoteImportant(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <label htmlFor="importantNote" className="text-xs font-bold text-slate-700 cursor-pointer">
                Mark as high priority for next visit
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Save Clinical Note</span>
            </button>
          </form>
        </div>

        {/* Saved Notes Feed (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">Recorded Health Observations</h3>
            <span className="text-xs font-semibold text-slate-500">
              {notes.length} saved note{notes.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {notes.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No clinical notes recorded yet.
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    note.important
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-slate-50/60 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">
                          {note.title}
                        </span>
                        {note.important && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            High Priority
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                        {note.category} • Recorded {note.date}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete note"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 mt-2.5 whitespace-pre-line leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
