import React, { useState } from 'react';
import {
  Droplet,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Filter,
  TrendingUp,
  AlertCircle,
  Activity,
  ChevronRight
} from './Icons';
import {
  classifyGlucose,
  generateId,
  formatDateTime,
  formatDate,
  formatTime
} from '../utils/helpers';

export function GlucoseTracker({
  glucoseReadings,
  onAddReading,
  onDeleteReading
}) {
  const now = new Date();
  const defaultDate = now.toISOString().slice(0, 10);
  const defaultTime = now.toTimeString().slice(0, 5);

  // Form State
  const [value, setValue] = useState('');
  const [readingType, setReadingType] = useState('Fasting');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Filter & Range State
  const [filterType, setFilterType] = useState('All');
  const [timeRange, setTimeRange] = useState('14d'); // 7d, 14d, all
  const [selectedPoint, setSelectedPoint] = useState(null);

  const classification = value ? classifyGlucose(value, readingType) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (isNaN(num) || num < 20 || num > 600) {
      setError('Please enter a valid glucose reading between 20 and 600 mg/dL.');
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

    onAddReading(newEntry);

    // Reset Form
    setValue('');
    setNotes('');
    setError('');
  };

  // Sort readings chronologically for chart (oldest to newest)
  const chronologicalReadings = [...glucoseReadings].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  // Filter by time range for chart
  const filteredForChart = chronologicalReadings.filter((r) => {
    if (timeRange === 'all') return true;
    const readingDate = new Date(r.timestamp);
    const daysAgo = (now - readingDate) / (1000 * 60 * 60 * 24);
    if (timeRange === '7d') return daysAgo <= 7;
    if (timeRange === '14d') return daysAgo <= 14;
    return true;
  });

  // Sort readings descending for history table (newest first)
  const historyReadings = [...glucoseReadings]
    .filter((r) => {
      if (filterType === 'All') return true;
      if (filterType === 'Fasting') return r.type.toLowerCase().includes('fasting');
      if (filterType === 'Post-Meal') return r.type.toLowerCase().includes('after') || r.type.toLowerCase().includes('post');
      if (filterType === 'Low') return r.value < 70;
      if (filterType === 'High') return r.value > 140;
      return true;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Chart calculation metrics
  const chartValues = filteredForChart.map((r) => r.value);
  const minVal = chartValues.length ? Math.min(...chartValues) : 70;
  const maxVal = chartValues.length ? Math.max(...chartValues) : 180;
  const avgVal = chartValues.length
    ? Math.round(chartValues.reduce((a, b) => a + b, 0) / chartValues.length)
    : 0;

  // Chart dimensions & coordinates
  const svgWidth = 800;
  const svgHeight = 260;
  const paddingX = 40;
  const paddingY = 30;

  const yMinDomain = Math.max(30, Math.min(minVal - 15, 60));
  const yMaxDomain = Math.min(300, Math.max(maxVal + 20, 200));

  const getYCoord = (val) => {
    const range = yMaxDomain - yMinDomain;
    const ratio = (val - yMinDomain) / (range || 1);
    return svgHeight - paddingY - ratio * (svgHeight - paddingY * 2);
  };

  const getXCoord = (index, total) => {
    if (total <= 1) return svgWidth / 2;
    return paddingX + (index / (total - 1)) * (svgWidth - paddingX * 2);
  };

  const chartPoints = filteredForChart.map((r, i) => ({
    x: getXCoord(i, filteredForChart.length),
    y: getYCoord(r.value),
    data: r
  }));

  const pathD = chartPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Shaded target band (70 - 140 mg/dL)
  const targetBandTop = getYCoord(140);
  const targetBandBottom = getYCoord(70);
  const targetBandHeight = Math.max(0, targetBandBottom - targetBandTop);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Section: Form on Left, Chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Entry Form Card (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Droplet className="w-5 h-5 fill-teal-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">New Glucose Reading</h3>
                <p className="text-xs text-slate-500">Record a capillary or CGM reading</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Glucose Value Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Glucose Reading (mg/dL) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="20"
                    max="600"
                    required
                    placeholder="e.g. 115"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setError('');
                    }}
                    className="w-full text-2xl font-black text-slate-900 placeholder:text-slate-300 pl-4 pr-20 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    mg/dL
                  </span>
                </div>

                {/* Instant Classification Feedback */}
                {classification && (
                  <div className={`mt-2 p-2.5 rounded-xl border text-xs flex items-center gap-2 ${classification.badgeClass}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${classification.dotClass}`}></span>
                    <span className="font-bold">{classification.label}</span>
                  </div>
                )}
              </div>

              {/* Context Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Measurement Context
                </label>
                <select
                  value={readingType}
                  onChange={(e) => setReadingType(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-white focus:border-teal-500 focus:outline-none cursor-pointer"
                >
                  <option value="Fasting">Fasting (Morning Before Breakfast)</option>
                  <option value="Before Breakfast">Before Breakfast</option>
                  <option value="After Breakfast">After Breakfast (1-2h Post)</option>
                  <option value="Before Lunch">Before Lunch</option>
                  <option value="After Lunch">After Lunch (1-2h Post)</option>
                  <option value="Before Dinner">Before Dinner</option>
                  <option value="After Dinner">After Dinner (1-2h Post)</option>
                  <option value="Bedtime">Bedtime</option>
                  <option value="Random">Random Check</option>
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Context / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Post-lunch walk, feeling great"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Save Reading</span>
              </button>
            </form>
          </div>
        </div>

        {/* Glucose Trend Chart Card (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">Glucose Trend Curve</h3>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    Safe Target: 70–140 mg/dL
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Interactive trend plot with shaded target stability zone
                </p>
              </div>

              {/* Time Range Filter Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setTimeRange('7d')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    timeRange === '7d' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeRange('14d')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    timeRange === '14d' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  14 Days
                </button>
                <button
                  onClick={() => setTimeRange('all')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    timeRange === 'all' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Quick Stats Ribbon */}
            <div className="grid grid-cols-3 gap-2 my-4">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Period Min</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">{minVal} <span className="text-[10px] font-normal text-slate-500">mg/dL</span></span>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-200/60 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Period Avg</span>
                <span className="text-base font-black text-teal-800 block mt-0.5">{avgVal} <span className="text-[10px] font-normal text-teal-600">mg/dL</span></span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Period Max</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">{maxVal} <span className="text-[10px] font-normal text-slate-500">mg/dL</span></span>
              </div>
            </div>

            {/* SVG Interactive Chart */}
            <div className="relative w-full overflow-hidden bg-slate-50/50 rounded-2xl border border-slate-200/60 p-2">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-56 sm:h-64 overflow-visible"
              >
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Shaded Target Band (70 - 140 mg/dL) */}
                <rect
                  x={paddingX}
                  y={targetBandTop}
                  width={svgWidth - paddingX * 2}
                  height={targetBandHeight}
                  fill="#14b8a6"
                  fillOpacity="0.08"
                />
                
                {/* Reference Lines */}
                {/* 180 Line (Post-meal ceiling) */}
                <line
                  x1={paddingX}
                  y1={getYCoord(180)}
                  x2={svgWidth - paddingX}
                  y2={getYCoord(180)}
                  stroke="#fda4af"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
                <text x={svgWidth - paddingX + 5} y={getYCoord(180) + 4} fill="#f43f5e" fontSize="10" fontWeight="bold">
                  180
                </text>

                {/* 140 Line (Target Ceiling) */}
                <line
                  x1={paddingX}
                  y1={targetBandTop}
                  x2={svgWidth - paddingX}
                  y2={targetBandTop}
                  stroke="#14b8a6"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text x={svgWidth - paddingX + 5} y={targetBandTop + 4} fill="#0d9488" fontSize="10" fontWeight="bold">
                  140
                </text>

                {/* 70 Line (Low Floor) */}
                <line
                  x1={paddingX}
                  y1={targetBandBottom}
                  x2={svgWidth - paddingX}
                  y2={targetBandBottom}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text x={svgWidth - paddingX + 5} y={targetBandBottom + 4} fill="#d97706" fontSize="10" fontWeight="bold">
                  70
                </text>

                {/* Area under curve */}
                {chartPoints.length > 1 && (
                  <path
                    d={`${pathD} L ${chartPoints[chartPoints.length - 1].x} ${svgHeight - paddingY} L ${chartPoints[0].x} ${svgHeight - paddingY} Z`}
                    fill="url(#trendGradient)"
                  />
                )}

                {/* Main Curve Line */}
                {chartPoints.length > 1 && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {chartPoints.map((pt, i) => {
                  const val = pt.data.value;
                  const isLow = val < 70;
                  const isHigh = val > 140;
                  const ptColor = isLow ? '#f59e0b' : isHigh ? '#f43f5e' : '#0d9488';
                  const isSelected = selectedPoint && selectedPoint.id === pt.data.id;

                  return (
                    <g
                      key={pt.data.id}
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => setSelectedPoint(pt.data)}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 7 : 5}
                        fill="#ffffff"
                        stroke={ptColor}
                        strokeWidth={isSelected ? 3.5 : 2.5}
                      />
                      {/* Show point value label on top if selected or small dataset */}
                      {(isSelected || chartPoints.length <= 10) && (
                        <text
                          x={pt.x}
                          y={pt.y - 9}
                          textAnchor="middle"
                          fill="#1e293b"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {val}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected Point Detail Callout */}
            {selectedPoint && (
              <div className="mt-3 p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">{selectedPoint.value} mg/dL</span>
                  <span className="text-slate-600 font-semibold">• {selectedPoint.type}</span>
                  <span className="text-slate-500">({formatDateTime(selectedPoint.timestamp)})</span>
                </div>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="text-teal-700 hover:text-teal-900 font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Reading History Table with Filters */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Glucose Reading History</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {historyReadings.length} recorded entries
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Fasting', 'Post-Meal', 'Low', 'High'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterType === f
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* History List / Table */}
        <div className="mt-4 divide-y divide-slate-100 overflow-x-auto">
          {historyReadings.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No glucose readings found matching this filter.
            </div>
          ) : (
            historyReadings.map((reading) => {
              const cls = classifyGlucose(reading.value, reading.type);

              return (
                <div
                  key={reading.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                >
                  {/* Left: Value, Badge & Context */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 text-center">
                      <span className="text-xl font-black text-slate-900 leading-tight">
                        {reading.value}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-semibold">mg/dL</span>
                    </div>

                    <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {reading.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cls.badgeClass}`}>
                          {cls.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {reading.notes}
                      </p>
                    </div>
                  </div>

                  {/* Right: Date, Time & Delete Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs">
                    <div className="text-left sm:text-right">
                      <span className="font-semibold text-slate-700 block">
                        {formatDate(reading.timestamp)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {formatTime(reading.timestamp)}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteReading(reading.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete reading"
                      aria-label="Delete reading"
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
