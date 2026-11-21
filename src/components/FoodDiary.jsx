import React, { useState } from 'react';
import {
  Utensils,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  AlertCircle,
  TrendingDown,
  Info
} from './Icons';
import { generateId, formatDate, formatTime } from '../utils/helpers';

export function FoodDiary({ meals, onAddMeal, onDeleteMeal }) {
  const now = new Date();
  const defaultDate = now.toISOString().slice(0, 10);
  const defaultTime = now.toTimeString().slice(0, 5);

  // Form State
  const [mealType, setMealType] = useState('Breakfast');
  const [foodDescription, setFoodDescription] = useState('');
  const [carbsGrams, setCarbsGrams] = useState('');
  const [glycemicIndex, setGlycemicIndex] = useState('Low');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Filter State
  const [filterType, setFilterType] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodDescription.trim()) {
      setError('Please enter a food description.');
      return;
    }

    const carbsNum = parseFloat(carbsGrams);
    if (isNaN(carbsNum) || carbsNum < 0 || carbsNum > 400) {
      setError('Please enter realistic estimated carbohydrate grams (0–400g).');
      return;
    }

    const isoTimestamp = `${date}T${time}:00`;
    const newMeal = {
      id: generateId('m'),
      timestamp: isoTimestamp,
      mealType,
      foodDescription: foodDescription.trim(),
      carbsGrams: Math.round(carbsNum),
      glycemicIndex,
      calories: Math.round(carbsNum * 4 + 200), // Approximate estimation
      notes: notes.trim() || 'Balanced meal record'
    };

    onAddMeal(newMeal);

    // Reset Form
    setFoodDescription('');
    setCarbsGrams('');
    setNotes('');
    setError('');
  };

  // Filter and sort meals
  const filteredMeals = [...meals]
    .filter((m) => {
      if (filterType === 'All') return true;
      return m.mealType.toLowerCase() === filterType.toLowerCase();
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Today's summary stats
  const todayStr = defaultDate;
  const todayMeals = meals.filter(
    (m) => m.timestamp && m.timestamp.slice(0, 10) === todayStr
  );
  const todayTotalCarbs = todayMeals.reduce(
    (sum, m) => sum + (Number(m.carbsGrams) || 0),
    0
  );
  const lowGICount = meals.filter((m) => m.glycemicIndex === 'Low').length;
  const lowGIRatio = meals.length ? Math.round((lowGICount / meals.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Section: Form on Left, Nutritional Insights on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Meal Entry Form Card (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Record Meal</h3>
              <p className="text-xs text-slate-500">Log carbohydrate intake and meal items</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Meal Type Buttons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Meal Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setMealType(type)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      mealType === type
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Items Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Food Description & Ingredients *
              </label>
              <textarea
                rows="2"
                required
                placeholder="e.g. Grilled salmon, roasted asparagus, 1/2 cup brown rice with olive oil"
                value={foodDescription}
                onChange={(e) => {
                  setFoodDescription(e.target.value);
                  setError('');
                }}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>

            {/* Carbs & Glycemic Index Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Estimated Carbs (g) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="400"
                    required
                    placeholder="e.g. 30"
                    value={carbsGrams}
                    onChange={(e) => {
                      setCarbsGrams(e.target.value);
                      setError('');
                    }}
                    className="w-full text-sm font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    grams
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Glycemic Index (GI)
                </label>
                <select
                  value={glycemicIndex}
                  onChange={(e) => setGlycemicIndex(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-white focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="Low">Low GI (Oats, greens, legumes)</option>
                  <option value="Medium">Medium GI (Sweet potato, whole grain)</option>
                  <option value="High">High GI (White rice, bread, sweets)</option>
                </select>
              </div>
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
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
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
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Post-Meal Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Felt satisfied, steady energy"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Save Meal Entry</span>
            </button>
          </form>
        </div>

        {/* Nutritional Insights & Guidelines (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Daily Carbs Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Daily Carbohydrate Budget
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Target individual carb allowance recommended by clinical dietitian
            </p>

            <div className="grid grid-cols-2 gap-4 my-5">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-xs font-bold text-amber-700 uppercase block">Today Logged</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-amber-900">{todayTotalCarbs}</span>
                  <span className="text-xs font-semibold text-amber-700">grams</span>
                </div>
                <span className="text-[11px] text-amber-600 mt-1 block">
                  {todayMeals.length} meal{todayMeals.length !== 1 ? 's' : ''} recorded today
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
                <span className="text-xs font-bold text-teal-700 uppercase block">Low GI Ratio</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-teal-900">{lowGIRatio}%</span>
                </div>
                <span className="text-[11px] text-teal-600 mt-1 block">
                  {lowGICount} of {meals.length} meals are Low GI
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600">Daily Target (~130g carb max):</span>
                <span className="text-slate-900 font-bold">{Math.round((todayTotalCarbs / 130) * 100)}% Used</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((todayTotalCarbs / 130) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Diabetic Plate Method Educational Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                <Info className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">ADA Diabetes Plate Method</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When building meals, aim for the golden clinical ratio:
            </p>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-teal-400 font-extrabold text-base block">1/2 Plate</span>
                <span className="text-[10px] text-slate-300">Non-starchy vegetables</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-amber-400 font-extrabold text-base block">1/4 Plate</span>
                <span className="text-[10px] text-slate-300">Lean protein sources</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-blue-400 font-extrabold text-base block">1/4 Plate</span>
                <span className="text-[10px] text-slate-300">Complex carbs / whole grain</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meal History Table & Cards */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Meal Log History</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredMeals.length} recorded meals
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'].map((f) => (
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

        {/* Meal List */}
        <div className="mt-4 divide-y divide-slate-100">
          {filteredMeals.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No meal records found for this filter.
            </div>
          ) : (
            filteredMeals.map((meal) => (
              <div
                key={meal.id}
                className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
              >
                {/* Left: Meal Category & Icon */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {meal.mealType}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        {meal.carbsGrams}g Carbs
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        meal.glycemicIndex === 'Low'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : meal.glycemicIndex === 'Medium'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {meal.glycemicIndex} GI
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {meal.foodDescription}
                    </p>

                    {meal.notes && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        "{meal.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Date, Time & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs">
                  <div className="text-left sm:text-right">
                    <span className="font-semibold text-slate-700 block">
                      {formatDate(meal.timestamp)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {formatTime(meal.timestamp)}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteMeal(meal.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete meal record"
                    aria-label="Delete meal record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
