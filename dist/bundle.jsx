// GlucoCare Unified Standalone Application Bundle
// Compatible with In-Browser Babel Standalone & Direct Preview

const { useState, useEffect, useMemo, useRef } = React;

/* ==========================================================================
   1. CLINICAL CONSTANTS & INITIAL DEMONSTRATION DATA
   ========================================================================== */

const GLUCOSE_THRESHOLDS = {
  VERY_LOW: 54,
  LOW: 70,
  TARGET_FASTING_MAX: 130,
  TARGET_POST_PRANDIAL_MAX: 180,
  HIGH: 180,
  VERY_HIGH: 250
};

const INITIAL_PATIENT_PROFILE = {
  name: "Sarah Jenkins",
  age: 42,
  gender: "Female",
  condition: "Type 2 Diabetes (Managed)",
  diagnosedYear: 2022,
  targetA1C: 6.5,
  targetGlucoseRange: { min: 70, max: 140, fastingMax: 130, postMealMax: 180 },
  physician: {
    name: "Dr. Evelyn Reed, MD",
    specialty: "Endocrinology & Metabolism",
    clinic: "Metro Health Endocrinology Center",
    phone: "(555) 019-2831",
    email: "dr.reed@metrohealth.org",
    nextAppointment: "2026-12-04 at 10:30 AM"
  },
  emergencyContact: {
    name: "Mark Jenkins",
    relation: "Spouse",
    phone: "(555) 234-5678"
  }
};

const INITIAL_GLUCOSE_READINGS = [
  { id: "g-1", timestamp: "2026-11-21T07:45:00", value: 108, type: "Fasting", notes: "Felt rested, 8h sleep. Overnight fast 10h.", tags: ["Routine", "Morning"] },
  { id: "g-2", timestamp: "2026-11-21T13:15:00", value: 138, type: "After Lunch", notes: "2 hours post grilled chicken quinoa bowl. Smooth glycemic curve.", tags: ["Post-Meal"] },
  { id: "g-3", timestamp: "2026-11-21T18:45:00", value: 114, type: "Before Dinner", notes: "Pre-dinner baseline. Normal hunger cues.", tags: ["Pre-Meal"] },
  { id: "g-4", timestamp: "2026-11-20T07:30:00", value: 112, type: "Fasting", notes: "Optimal fasting morning reading.", tags: ["Morning"] },
  { id: "g-5", timestamp: "2026-11-20T10:15:00", value: 142, type: "After Breakfast", notes: "Post scrambled eggs and whole wheat slice.", tags: ["Post-Meal"] },
  { id: "g-6", timestamp: "2026-11-20T14:00:00", value: 128, type: "After Lunch", notes: "Post salmon avocado salad.", tags: ["Post-Meal"] },
  { id: "g-7", timestamp: "2026-11-20T21:30:00", value: 118, type: "Bedtime", notes: "Bedtime check; stable.", tags: ["Night"] },
  { id: "g-8", timestamp: "2026-11-19T07:40:00", value: 105, type: "Fasting", notes: "Good sleep, fasting level optimal.", tags: ["Morning"] },
  { id: "g-9", timestamp: "2026-11-19T13:30:00", value: 165, type: "After Lunch", notes: "Whole wheat pasta meal. Slightly elevated but within bounds.", tags: ["Elevated"] },
  { id: "g-10", timestamp: "2026-11-19T20:45:00", value: 122, type: "After Dinner", notes: "Light evening walk brought reading down smoothly.", tags: ["Post-Meal"] },
  { id: "g-11", timestamp: "2026-11-18T07:50:00", value: 119, type: "Fasting", notes: "Morning baseline check.", tags: ["Morning"] },
  { id: "g-12", timestamp: "2026-11-18T14:15:00", value: 132, type: "After Lunch", notes: "Mediterranean salad bowl.", tags: ["Post-Meal"] },
  { id: "g-13", timestamp: "2026-11-18T18:10:00", value: 64, type: "Before Dinner", notes: "Mild hypoglycemia after stair climbing. Ingested 15g fast carbs; resolved to 95 mg/dL.", tags: ["Low", "Symptom"] },
  { id: "g-14", timestamp: "2026-11-17T07:35:00", value: 104, type: "Fasting", notes: "Optimal fasting morning control.", tags: ["Morning"] },
  { id: "g-15", timestamp: "2026-11-17T13:20:00", value: 136, type: "After Lunch", notes: "Turkey avocado wrap with greens.", tags: ["Post-Meal"] },
  { id: "g-16", timestamp: "2026-11-17T21:00:00", value: 115, type: "Bedtime", notes: "Night reading before sleep.", tags: ["Night"] },
  { id: "g-17", timestamp: "2026-11-16T07:45:00", value: 110, type: "Fasting", notes: "Normal fasting reading.", tags: ["Morning"] },
  { id: "g-18", timestamp: "2026-11-16T14:30:00", value: 188, type: "After Lunch", notes: "Team pizza lunch. High carb spike. Drank extra water.", tags: ["High", "Spike"] },
  { id: "g-19", timestamp: "2026-11-16T20:30:00", value: 130, type: "After Dinner", notes: "Balanced dinner restored equilibrium.", tags: ["Post-Meal"] },
  { id: "g-20", timestamp: "2026-11-15T07:30:00", value: 106, type: "Fasting", notes: "Weekend morning fasting check.", tags: ["Morning"] }
];

const INITIAL_MEALS = [
  { id: "m-1", timestamp: "2026-11-21T08:15:00", mealType: "Breakfast", foodDescription: "Steel-cut oatmeal with almond butter, chia seeds, and 1/2 cup fresh blueberries.", carbsGrams: 34, glycemicIndex: "Low", calories: 340, notes: "Sustained morning energy without spike." },
  { id: "m-2", timestamp: "2026-11-21T13:00:00", mealType: "Lunch", foodDescription: "Grilled lemon-herb chicken breast, Mediterranean Greek salad (olive oil, cucumber, feta) with 1/2 cup quinoa.", carbsGrams: 26, glycemicIndex: "Low", calories: 510, notes: "Protein and fiber buffer stabilized post-lunch reading at 138 mg/dL." },
  { id: "m-3", timestamp: "2026-11-21T16:30:00", mealType: "Snack", foodDescription: "Handful of roasted unsalted almonds and celery sticks with 2 tbsp red pepper hummus.", carbsGrams: 9, glycemicIndex: "Low", calories: 160, notes: "Light afternoon fuel." },
  { id: "m-4", timestamp: "2026-11-20T08:00:00", mealType: "Breakfast", foodDescription: "Scrambled pasture eggs with baby spinach, avocado, and 1 slice sprouted grain toast.", carbsGrams: 16, glycemicIndex: "Low", calories: 380, notes: "Very low glycemic impact." },
  { id: "m-5", timestamp: "2026-11-20T12:45:00", mealType: "Lunch", foodDescription: "Pan-seared Atlantic salmon with roasted sweet potato wedges (100g) and garlic asparagus.", carbsGrams: 32, glycemicIndex: "Medium", calories: 540, notes: "Complex carbs provided steady afternoon focus." },
  { id: "m-6", timestamp: "2026-11-20T19:15:00", mealType: "Dinner", foodDescription: "Slow-cooked turkey and black bean chili topped with fresh cilantro, avocado, and plain Greek yogurt.", carbsGrams: 28, glycemicIndex: "Low", calories: 460, notes: "High fiber from black beans moderated carb absorption." },
  { id: "m-7", timestamp: "2026-11-19T08:10:00", mealType: "Breakfast", foodDescription: "Plain 2% Greek yogurt with crushed walnuts, ground flax, cinnamon, and raspberries.", carbsGrams: 14, glycemicIndex: "Low", calories: 290, notes: "High protein, minimal glycemic curve." },
  { id: "m-8", timestamp: "2026-11-19T13:00:00", mealType: "Lunch", foodDescription: "Whole wheat penne with grilled chicken, roasted peppers, and homemade basil pesto.", carbsGrams: 52, glycemicIndex: "Medium", calories: 590, notes: "Higher carb total; 1h peak at 165 mg/dL." },
  { id: "m-9", timestamp: "2026-11-19T19:30:00", mealType: "Dinner", foodDescription: "Baked Alaskan cod with lemon garlic butter, cauliflower mash, and steamed green beans.", carbsGrams: 12, glycemicIndex: "Low", calories: 360, notes: "Low-carb evening dinner." }
];

const INITIAL_REMINDERS = [
  { id: "r-1", name: "Metformin XR", dosage: "1000 mg", time: "08:00", category: "Oral Medication", frequency: "Daily with Breakfast", instructions: "Take with breakfast meal and full water glass to minimize GI discomfort.", completedToday: true, lastCompletedDate: "2026-11-21" },
  { id: "r-2", name: "Glipizide", dosage: "5 mg", time: "12:30", category: "Oral Medication", frequency: "Daily with Lunch", instructions: "Take 30 minutes before your midday meal. Do not skip lunch after taking.", completedToday: true, lastCompletedDate: "2026-11-21" },
  { id: "r-3", name: "Afternoon Brisk Walk", dosage: "20 - 30 Minutes", time: "17:30", category: "Physical Activity", frequency: "Daily", instructions: "Moderate cardio exercise improves cellular insulin sensitivity for up to 24 hours.", completedToday: false, lastCompletedDate: "2026-11-20" },
  { id: "r-4", name: "Atorvastatin", dosage: "20 mg", time: "21:30", category: "Oral Medication", frequency: "Daily at Bedtime", instructions: "Lipid management. Take nightly at bedtime.", completedToday: false, lastCompletedDate: "2026-11-20" },
  { id: "r-5", name: "Blood Pressure & Foot Check", dosage: "Vitals & Visual Exam", time: "20:00", category: "Health Check", frequency: "Every 2 Days", instructions: "Log blood pressure (target < 125/80 mmHg) and perform daily diabetic foot check.", completedToday: false, lastCompletedDate: "2026-11-19" }
];

const INITIAL_HEALTH_NOTES = [
  { id: "hn-1", date: "2026-11-20", category: "Doctor Prep", title: "Upcoming Consultation with Dr. Reed (Dec 4)", content: "Key discussion points:\n1. Review the mild hypoglycemia event on Nov 18 (64 mg/dL after heavy stairs before dinner).\n2. Review fasting stability over the last 90 days.\n3. Request order for standard 3-month HbA1c lab test and lipid panel.\n4. Ask about continuous glucose monitoring (CGM) sensor prescription options.", important: true },
  { id: "hn-2", date: "2026-11-18", category: "Symptom Observation", title: "Hypoglycemia Experience (Nov 18)", content: "Around 6:10 PM felt slight shakiness and diaphoresis after climbing 4 flights of stairs at the office. Immediate fingerstick showed 64 mg/dL. Applied the standard 'Rule of 15': ingested 15g fast-acting glucose tablets (3 tablets), rested quietly for 15 minutes, retested at 92 mg/dL. Noted down to discuss with endocrinologist.", important: false },
  { id: "hn-3", date: "2026-11-15", category: "Lifestyle & Nutrition", title: "Post-Meal Glucose Stabilization", content: "Consistently noticed that starting meals with green vegetables or a protein buffer significantly reduces the 1-hour glucose peak compared to eating carbohydrates first. 15-minute post-lunch walk brings readings down by ~20 mg/dL reliably.", important: false }
];

/* ==========================================================================
   2. CLINICAL & STORAGE HELPERS
   ========================================================================== */

function classifyGlucose(value, type = 'Random') {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    return { status: 'invalid', label: 'Invalid Value', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200', dotClass: 'bg-slate-400', description: 'Please enter a valid reading.' };
  }

  if (num < GLUCOSE_THRESHOLDS.LOW) {
    return {
      status: 'low',
      label: 'Low (Hypoglycemia)',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-200',
      dotClass: 'bg-amber-500 animate-pulse',
      description: 'Below 70 mg/dL. Consider standard 15g fast carbohydrate protocol if symptomatic.'
    };
  }

  const isFasting = type.toLowerCase().includes('fasting');
  const isPostMeal = type.toLowerCase().includes('after') || type.toLowerCase().includes('post');

  if (isFasting) {
    if (num <= 130) {
      return {
        status: 'normal',
        label: 'In Range (Fasting Target)',
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-300 ring-1 ring-teal-200',
        dotClass: 'bg-teal-500',
        description: 'Optimal fasting level within ADA target range (70-130 mg/dL).'
      };
    }
  } else if (isPostMeal) {
    if (num <= 180) {
      return {
        status: 'normal',
        label: 'In Range (Post-Meal Target)',
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-300 ring-1 ring-teal-200',
        dotClass: 'bg-teal-500',
        description: 'Well-controlled post-prandial level (< 180 mg/dL).'
      };
    }
  } else {
    if (num <= 140) {
      return {
        status: 'normal',
        label: 'In Range (Target)',
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-300 ring-1 ring-teal-200',
        dotClass: 'bg-teal-500',
        description: 'Balanced reading inside healthy glycemic range.'
      };
    }
  }

  if (num > GLUCOSE_THRESHOLDS.VERY_HIGH) {
    return {
      status: 'very_high',
      label: 'Very High (Hyperglycemia)',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-200',
      dotClass: 'bg-rose-600 animate-pulse',
      description: 'Significantly elevated (> 250 mg/dL). Hydrate and monitor closely.'
    };
  }

  return {
    status: 'high',
    label: 'Elevated (Above Target)',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-100',
    dotClass: 'bg-rose-500',
    description: 'Higher than typical target. Consider physical activity or meal review.'
  };
}

function calculateEstimatedA1C(averageGlucose) {
  if (!averageGlucose || averageGlucose <= 0) return 0;
  return Number(((averageGlucose + 46.7) / 28.7).toFixed(1));
}

function calculateTimeInRange(readings, targetMin = 70, targetMax = 140) {
  if (!readings || readings.length === 0) {
    return { inRange: 0, low: 0, high: 0, inRangeCount: 0, lowCount: 0, highCount: 0, total: 0 };
  }
  let inRangeCount = 0, lowCount = 0, highCount = 0;
  readings.forEach(r => {
    const val = Number(r.value);
    if (val < targetMin) lowCount++;
    else if (val > targetMax) highCount++;
    else inRangeCount++;
  });
  const total = readings.length;
  return {
    inRange: Math.round((inRangeCount / total) * 100),
    low: Math.round((lowCount / total) * 100),
    high: Math.round((highCount / total) * 100),
    inRangeCount, lowCount, highCount, total
  };
}

function calculateStandardDeviation(readings) {
  if (!readings || readings.length < 2) return 0;
  const values = readings.map(r => Number(r.value));
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
  return Math.round(Math.sqrt(variance));
}

function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

const STORAGE_KEYS = {
  GLUCOSE: 'glucocare_readings',
  MEALS: 'glucocare_meals',
  REMINDERS: 'glucocare_reminders',
  NOTES: 'glucocare_notes',
  PROFILE: 'glucocare_profile'
};

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
}

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/* ==========================================================================
   3. SVG ICONS
   ========================================================================== */

function ActivityIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function HeartPulseIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h4.27" />
    </svg>
  );
}

function DropletIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function UtensilsIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
      <path d="M15 2v10a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V2" />
      <path d="M12 15v7" />
      <path d="M18 15v7" />
    </svg>
  );
}

function BellIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function FileTextIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function LayoutDashboardIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function ShieldAlertIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function CheckIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CheckCircle2Icon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function AlertCircleIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

function PlusIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function Trash2Icon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function CalendarIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function ClockIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TrendingUpIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function MenuIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function XIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function PrinterIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect width="12" height="8" x="6" y="14" />
    </svg>
  );
}

function RefreshCwIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function PhoneIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function SparklesIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function InfoIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

/* ==========================================================================
   4. DISCLAIMER, TOASTS & MODALS
   ========================================================================== */

function MedicalDisclaimerBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  if (isDismissed) {
    return (
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span>GlucoCare Patient Portal — Personal Health Logging Tool</span>
        </div>
        <button onClick={() => setIsDismissed(false)} className="text-teal-400 hover:text-teal-300 underline font-medium text-xs ml-2 cursor-pointer">
          View Medical Disclaimer
        </button>
      </div>
    );
  }
  return (
    <aside aria-label="Medical Disclaimer" className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white text-xs border-b border-teal-500/30 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5 flex-1">
          <div className="p-1 rounded-md bg-teal-500/20 text-teal-300 shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlertIcon className="w-4 h-4" />
          </div>
          <p className="text-slate-200 leading-relaxed">
            <strong className="text-teal-300 font-semibold uppercase tracking-wider text-[11px] mr-1.5">
              Medical Safety Notice:
            </strong>
            GlucoCare is an informational tracking tool and does not provide clinical diagnoses, recommend insulin doses, or alter treatment regimens. 
            Always consult your qualified healthcare provider or endocrinologist before making any medication, dietary, or insulin therapy changes.
          </p>
        </div>
        <button onClick={() => setIsDismissed(true)} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors shrink-0 cursor-pointer" title="Minimize Disclaimer">
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isError = toast.type === 'error';
        return (
          <div key={toast.id} className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border bg-white ${isSuccess ? 'border-teal-200 shadow-teal-500/10' : isError ? 'border-rose-200 shadow-rose-500/10' : 'border-amber-200 shadow-amber-500/10'}`}>
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSuccess ? 'bg-teal-50 text-teal-600' : isError ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
              {isSuccess && <CheckCircle2Icon className="w-5 h-5" />}
              {isError && <AlertCircleIcon className="w-5 h-5" />}
              {!isSuccess && !isError && <InfoIcon className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-slate-900 leading-tight">{toast.title || 'Notification'}</h5>
              <p className="text-xs text-slate-600 mt-1 leading-normal">{toast.message}</p>
            </div>
            <button onClick={() => onDismiss(toast.id)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors shrink-0">
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function EmergencyModal({ isOpen, onClose, patientProfile }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-navy-900 text-white p-6 relative">
          <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <HeartPulseIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-teal-400 text-xs font-bold tracking-wider uppercase">Medical Quick Response</span>
              <h3 className="text-xl font-bold text-white">Emergency & Care Protocol</h3>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
              <ShieldAlertIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-950">Severe Emergency Assistance</h4>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                If the patient is unconscious, confused, unable to swallow, or experiencing severe distress, do not give liquids or food. 
                Call emergency dispatch immediately.
              </p>
              <div className="mt-2.5">
                <a href="tel:911" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors">
                  <PhoneIcon className="w-3.5 h-3.5" /> Call Emergency (911)
                </a>
              </div>
            </div>
          </div>
          <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                Hypoglycemia "Rule of 15" Protocol
              </h4>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Blood Glucose &lt; 70 mg/dL
              </span>
            </div>
            <ol className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <span>Consume <strong>15 grams</strong> of fast-acting carbohydrates (4 oz orange juice, 3–4 glucose tablets, or 1 tbsp honey).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <span>Wait <strong>15 minutes</strong> resting quietly. Avoid physical exertion during this window.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <span><strong>Retest blood glucose</strong>. If still below 70 mg/dL, repeat step 1.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                <span>Once normalized (&gt; 70 mg/dL), eat a small snack with protein & complex carbs.</span>
              </li>
            </ol>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Care Team</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <span className="text-[10px] font-bold text-teal-600 uppercase">Endocrinologist</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{patientProfile?.physician?.name}</p>
                <p className="text-xs text-slate-500">{patientProfile?.physician?.clinic}</p>
                <a href={`tel:${patientProfile?.physician?.phone}`} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 hover:text-teal-600">
                  <PhoneIcon className="w-3.5 h-3.5" /> {patientProfile?.physician?.phone}
                </a>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <span className="text-[10px] font-bold text-navy-600 uppercase">Emergency Contact</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{patientProfile?.emergencyContact?.name}</p>
                <p className="text-xs text-slate-500">{patientProfile?.emergencyContact?.relation}</p>
                <a href={`tel:${patientProfile?.emergencyContact?.phone}`} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 hover:text-teal-600">
                  <PhoneIcon className="w-3.5 h-3.5" /> {patientProfile?.emergencyContact?.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer">
            Close Protocol
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickLogModal({ isOpen, onClose, onSaveReading }) {
  if (!isOpen) return null;
  const now = new Date();
  const [val, setVal] = useState('');
  const [type, setType] = useState('Fasting');
  const [date, setDate] = useState(now.toISOString().slice(0, 10));
  const [time, setTime] = useState(now.toTimeString().slice(0, 5));
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState('');

  const cls = val ? classifyGlucose(val, type) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(val);
    if (isNaN(num) || num < 20 || num > 600) {
      setErr('Enter a valid glucose reading between 20 and 600 mg/dL.');
      return;
    }
    onSaveReading({
      id: generateId('g'),
      timestamp: `${date}T${time}:00`,
      value: Math.round(num),
      type,
      notes: notes.trim() || 'Manual entry',
      tags: [type.includes('After') ? 'Post-Meal' : type.includes('Fasting') ? 'Fasting' : 'Routine']
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-navy-950 to-slate-900 text-white p-6 relative">
          <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <DropletIcon className="w-6 h-6 fill-teal-400" />
            </div>
            <div>
              <span className="text-teal-400 text-[10px] font-bold tracking-wider uppercase">Biometric Entry</span>
              <h3 className="text-xl font-bold text-white">Log Blood Glucose</h3>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {err && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircleIcon className="w-4 h-4 shrink-0" />
              <span>{err}</span>
            </div>
          )}
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
                value={val}
                onChange={(e) => { setVal(e.target.value); setErr(''); }}
                className="w-full text-2xl font-black text-slate-900 placeholder:text-slate-300 pl-4 pr-20 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">mg/dL</span>
            </div>
            {cls && (
              <div className={`mt-2 p-2.5 rounded-xl border text-xs flex items-center gap-2 ${cls.badgeClass}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${cls.dotClass}`}></span>
                <span className="font-bold">{cls.label}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Measurement Context</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Date</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Time</label>
              <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Notes (Optional)</label>
            <input type="text" placeholder="e.g. Post-lunch walk, feeling great" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none" />
          </div>
          <div className="pt-2 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all cursor-pointer">Save Reading</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. NAVIGATION & CORE VIEWS
   ========================================================================== */

function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, onOpenEmergency, onResetDemoData, unreadRemindersCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, badge: null, desc: 'Daily health overview' },
    { id: 'tracker', label: 'Glucose Tracker', icon: DropletIcon, badge: null, desc: 'Log & analyze blood sugar' },
    { id: 'food', label: 'Food Diary', icon: UtensilsIcon, badge: null, desc: 'Meals & carb tracking' },
    { id: 'reminders', label: 'Reminders', icon: BellIcon, badge: unreadRemindersCount > 0 ? unreadRemindersCount : null, badgeColor: 'bg-amber-500 text-white', desc: 'Medications & routines' },
    { id: 'reports', label: 'Health Reports', icon: FileTextIcon, badge: 'eA1C', badgeColor: 'bg-teal-100 text-teal-800', desc: 'Clinical trend analysis' }
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (isMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity" onClick={() => setIsMobileOpen(false)} />
      )}
      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-navy-950 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
              <DropletIcon className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Gluco<span className="text-teal-400">Care</span>
              </span>
              <span className="text-[10px] text-teal-400/80 block uppercase tracking-widest font-semibold">Clinical Health OS</span>
            </div>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mx-4 my-4 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold text-sm shrink-0">
            SJ
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white truncate">Sarah Jenkins</h4>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Type 2 Diabetes • Tgt &lt; 6.5%</p>
          </div>
        </div>

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
                  isActive ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-600/20' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-slate-900 text-teal-400 group-hover:bg-slate-800'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-sm leading-tight">{item.label}</span>
                    <span className={`text-[10px] block mt-0.5 leading-tight ${isActive ? 'text-teal-100' : 'text-slate-400'}`}>{item.desc}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRightIcon className="w-4 h-4 text-white/80" />}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2 bg-navy-950/90">
          <button onClick={onOpenEmergency} className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer">
            <ShieldAlertIcon className="w-4 h-4 text-rose-400" />
            <span>Emergency & Rule of 15</span>
          </button>
          <button onClick={onResetDemoData} className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 flex items-center justify-center gap-2 text-[11px] font-medium transition-colors cursor-pointer" title="Reset demonstration records">
            <RefreshCwIcon className="w-3.5 h-3.5" />
            <span>Reset Demo Records</span>
          </button>
          <div className="pt-2 text-center">
            <span className="text-[10px] text-slate-400 block">GlucoCare v1.0.4 • HIPAA Compliant UI</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({ activeTab, onOpenMobileSidebar, onOpenQuickLog, onOpenEmergency, patientProfile }) {
  const titles = {
    dashboard: { title: 'Dashboard Overview', subtitle: "Welcome back, Sarah. Here's your health status today." },
    tracker: { title: 'Glucose Tracker', subtitle: 'Log, filter, and analyze glycemic fluctuations over time.' },
    food: { title: 'Nutritional Food Diary', subtitle: 'Track meal compositions, carbohydrate intake, and glycemic impact.' },
    reminders: { title: 'Medications & Routines', subtitle: 'Daily schedule, prescription adherence, and health checks.' },
    reports: { title: 'Clinical Health Reports', subtitle: 'Estimated A1C, time-in-range metrics, and doctor consultation notes.' }
  };
  const current = titles[activeTab] || titles.dashboard;
  const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <button onClick={onOpenMobileSidebar} className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors shrink-0">
            <MenuIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-navy-900 tracking-tight leading-tight truncate">
              {current.title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block truncate mt-0.5">{current.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
            <CalendarIcon className="w-4 h-4 text-slate-500" />
            <span>{todayFormatted}</span>
          </div>
          <button onClick={onOpenEmergency} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-colors cursor-pointer">
            <ShieldAlertIcon className="w-4 h-4 text-rose-600" />
            <span>Emergency Info</span>
          </button>
          <button onClick={onOpenQuickLog} className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer">
            <PlusIcon className="w-4 h-4 stroke-[3]" />
            <span>Log Glucose</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function DashboardView({ patientProfile, glucoseReadings, meals, reminders, notes, setActiveTab, onOpenQuickLog, onOpenEmergency }) {
  const sorted = [...glucoseReadings].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const latest = sorted[0];
  const cls = latest ? classifyGlucose(latest.value, latest.type) : null;
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayLogs = sorted.filter((r) => r.timestamp && r.timestamp.slice(0, 10) === todayStr);

  const tir = calculateTimeInRange(sorted.slice(0, 30), 70, 140);
  const recentVals = sorted.slice(0, 30).map((r) => r.value);
  const avg = recentVals.length ? Math.round(recentVals.reduce((a, b) => a + b, 0) / recentVals.length) : 0;
  const eA1C = calculateEstimatedA1C(avg);

  const completedRems = reminders.filter((r) => r.completedToday);
  const medPercent = reminders.length ? Math.round((completedRems.length / reminders.length) * 100) : 0;

  const todayMeals = meals.filter((m) => m.timestamp && m.timestamp.slice(0, 10) === todayStr);
  const todayCarbs = todayMeals.reduce((sum, m) => sum + (Number(m.carbsGrams) || 0), 0);

  const activities = [
    ...sorted.slice(0, 5).map((r) => ({ id: r.id, kind: 'glucose', timestamp: r.timestamp, title: `${r.value} mg/dL • ${r.type}`, subtitle: r.notes || 'Recorded blood glucose', icon: DropletIcon, iconClass: 'bg-teal-50 text-teal-600 border border-teal-200', badge: classifyGlucose(r.value, r.type).label, badgeClass: classifyGlucose(r.value, r.type).badgeClass })),
    ...meals.slice(0, 4).map((m) => ({ id: m.id, kind: 'meal', timestamp: m.timestamp, title: `${m.mealType} • ${m.carbsGrams}g Carbs`, subtitle: m.foodDescription, icon: UtensilsIcon, iconClass: 'bg-amber-50 text-amber-600 border border-amber-200', badge: `${m.glycemicIndex} GI`, badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' })),
    ...reminders.filter((rem) => rem.completedToday).map((rem) => ({ id: `med-${rem.id}`, kind: 'med', timestamp: `${todayStr}T${rem.time}:00`, title: `${rem.name} (${rem.dosage})`, subtitle: `Completed ${rem.frequency}`, icon: BellIcon, iconClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200', badge: 'Completed', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 mb-3">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Optimal Glycemic Stability</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {greeting}, {patientProfile?.name?.split(' ')[0] || 'Patient'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Your recent time-in-range is at <strong className="text-teal-400 font-bold">{tir.inRange}%</strong>. 
              {todayLogs.length > 0 ? ` You have logged ${todayLogs.length} reading${todayLogs.length > 1 ? 's' : ''} today.` : ' Remember to log your post-meal or bedtime reading.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onOpenQuickLog} className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs sm:text-sm shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center gap-2">
              <PlusIcon className="w-4 h-4 stroke-[3]" />
              <span>Log Reading</span>
            </button>
            <button onClick={() => setActiveTab('reports')} className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-all cursor-pointer flex items-center gap-2">
              <FileTextIcon className="w-4 h-4" />
              <span>View Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Latest Glucose</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600"><DropletIcon className="w-4 h-4" /></div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{latest ? latest.value : '--'}</span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          {latest && cls && (
            <div className="mt-3 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cls.badgeClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cls.dotClass}`}></span>
                {cls.label}
              </span>
              <span className="text-[11px] text-slate-400">{formatTime(latest.timestamp)}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">14-Day Average</span>
            <div className="p-2 rounded-xl bg-navy-50 text-navy-600"><ActivityIcon className="w-4 h-4" /></div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{avg || '--'}</span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Est. HbA1c</span>
            <span className="font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">~{eA1C}% (Target &lt; 6.5%)</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Time in Range (70-140)</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600"><TrendingUpIcon className="w-4 h-4" /></div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{tir.inRange}%</span>
            <span className="text-xs font-semibold text-emerald-600 font-bold">Target &gt; 70%</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div style={{ width: `${tir.low}%` }} className="bg-amber-400"></div>
            <div style={{ width: `${tir.inRange}%` }} className="bg-teal-500"></div>
            <div style={{ width: `${tir.high}%` }} className="bg-rose-400"></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Medication Today</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600"><BellIcon className="w-4 h-4" /></div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{completedRems.length} / {reminders.length}</span>
            <span className="text-xs font-semibold text-slate-500">scheduled</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">{medPercent}% Adherence</span>
            <button onClick={() => setActiveTab('reminders')} className="text-teal-600 font-bold hover:underline cursor-pointer">Check schedule →</button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Quick Actions & Tools</h3>
          <span className="text-xs text-slate-400">One-click modules</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button onClick={() => setActiveTab('tracker')} className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all text-left group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <DropletIcon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-600 transition-colors">Glucose Log</h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">Enter & view readings</p>
          </button>
          <button onClick={() => setActiveTab('food')} className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all text-left group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <UtensilsIcon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">Food Diary</h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{todayCarbs}g carbs logged today</p>
          </button>
          <button onClick={() => setActiveTab('reminders')} className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all text-left group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <BellIcon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">Reminders</h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{reminders.length - completedRems.length} pending today</p>
          </button>
          <button onClick={() => setActiveTab('reports')} className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all text-left group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <FileTextIcon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-600 transition-colors">Clinical Reports</h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">Print summary for Dr.</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ActivityIcon className="w-5 h-5 text-teal-600" />
                  Glycemic Distribution & Target Alignment
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Clinical target ranges based on ADA guidelines</p>
              </div>
              <button onClick={() => setActiveTab('tracker')} className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer">
                Full Tracker <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 my-5 text-center">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[11px] font-bold text-amber-700 uppercase block">Low (&lt;70)</span>
                <span className="text-xl font-black text-amber-800 block mt-1">{tir.low}%</span>
                <span className="text-[10px] text-amber-600">{tir.lowCount} events</span>
              </div>
              <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200">
                <span className="text-[11px] font-bold text-teal-700 uppercase block">In Range (70-140)</span>
                <span className="text-xl font-black text-teal-800 block mt-1">{tir.inRange}%</span>
                <span className="text-[10px] text-teal-600">{tir.inRangeCount} readings</span>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200">
                <span className="text-[11px] font-bold text-rose-700 uppercase block">High (&gt;140)</span>
                <span className="text-xl font-black text-rose-800 block mt-1">{tir.high}%</span>
                <span className="text-[10px] text-rose-600">{tir.highCount} events</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-600 text-white shrink-0 mt-0.5">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <p className="leading-relaxed">
                <strong>Clinician Insight:</strong> Fasting blood glucose is remaining steady between 
                104–112 mg/dL. Pairing carbohydrate intake with lean protein and fiber during lunch has reduced 
                post-prandial spikes below 140 mg/dL.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-900 to-navy-950 text-white rounded-3xl p-6 shadow-md border border-teal-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">Upcoming Consultation</span>
              <h4 className="text-lg font-bold text-white mt-1">{patientProfile?.physician?.name}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{patientProfile?.physician?.clinic} • Next: {patientProfile?.physician?.nextAppointment}</p>
            </div>
            <button onClick={() => setActiveTab('reports')} className="px-4 py-2.5 rounded-xl bg-white text-navy-950 font-bold text-xs hover:bg-teal-50 transition-colors shrink-0 cursor-pointer">
              Prepare Doctor Notes
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Recent Activities</h3>
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Live Log</span>
          </div>
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[460px] pr-1">
            {activities.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">No recent activity recorded yet.</div>
            ) : (
              activities.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="py-3.5 flex items-start gap-3 group">
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${item.iconClass}`}><Icon className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                        <span className="text-[10px] text-slate-400 shrink-0">{formatTime(item.timestamp)}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                      {item.badge && <span className={`mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeClass}`}>{item.badge}</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="pt-3 border-t border-slate-100 mt-2">
            <button onClick={onOpenQuickLog} className="w-full py-2.5 rounded-xl border border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/50 hover:bg-teal-50 text-teal-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <PlusIcon className="w-4 h-4" />
              <span>Record New Activity</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlucoseTrackerView({ glucoseReadings, onAddReading, onDeleteReading }) {
  const now = new Date();
  const [val, setVal] = useState('');
  const [type, setType] = useState('Fasting');
  const [date, setDate] = useState(now.toISOString().slice(0, 10));
  const [time, setTime] = useState(now.toTimeString().slice(0, 5));
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [timeRange, setTimeRange] = useState('14d');
  const [selectedPoint, setSelectedPoint] = useState(null);

  const cls = val ? classifyGlucose(val, type) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(val);
    if (isNaN(num) || num < 20 || num > 600) {
      setErr('Please enter a valid glucose reading between 20 and 600 mg/dL.');
      return;
    }
    onAddReading({
      id: generateId('g'),
      timestamp: `${date}T${time}:00`,
      value: Math.round(num),
      type,
      notes: notes.trim() || 'Manual entry',
      tags: [type.includes('After') ? 'Post-Meal' : type.includes('Fasting') ? 'Fasting' : 'Routine']
    });
    setVal('');
    setNotes('');
    setErr('');
  };

  const chronological = [...glucoseReadings].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const filteredForChart = chronological.filter((r) => {
    if (timeRange === 'all') return true;
    const diff = (now - new Date(r.timestamp)) / (1000 * 60 * 60 * 24);
    return timeRange === '7d' ? diff <= 7 : diff <= 14;
  });

  const history = [...glucoseReadings].filter((r) => {
    if (filterType === 'All') return true;
    if (filterType === 'Fasting') return r.type.toLowerCase().includes('fasting');
    if (filterType === 'Post-Meal') return r.type.toLowerCase().includes('after') || r.type.toLowerCase().includes('post');
    if (filterType === 'Low') return r.value < 70;
    if (filterType === 'High') return r.value > 140;
    return true;
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const chartVals = filteredForChart.map((r) => r.value);
  const minVal = chartVals.length ? Math.min(...chartVals) : 70;
  const maxVal = chartVals.length ? Math.max(...chartVals) : 180;
  const avgVal = chartVals.length ? Math.round(chartVals.reduce((a, b) => a + b, 0) / chartVals.length) : 0;

  const svgWidth = 800;
  const svgHeight = 260;
  const paddingX = 40;
  const paddingY = 30;
  const yMinDomain = Math.max(30, Math.min(minVal - 15, 60));
  const yMaxDomain = Math.min(300, Math.max(maxVal + 20, 200));

  const getYCoord = (v) => svgHeight - paddingY - ((v - yMinDomain) / ((yMaxDomain - yMinDomain) || 1)) * (svgHeight - paddingY * 2);
  const getXCoord = (i, total) => total <= 1 ? svgWidth / 2 : paddingX + (i / (total - 1)) * (svgWidth - paddingX * 2);

  const chartPoints = filteredForChart.map((r, i) => ({
    x: getXCoord(i, filteredForChart.length),
    y: getYCoord(r.value),
    data: r
  }));

  const pathD = chartPoints.reduce((acc, pt, i) => i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, '');
  const targetBandTop = getYCoord(140);
  const targetBandBottom = getYCoord(70);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <DropletIcon className="w-5 h-5 fill-teal-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">New Glucose Reading</h3>
                <p className="text-xs text-slate-500">Record a capillary or CGM reading</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {err && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircleIcon className="w-4 h-4 shrink-0" />
                  <span>{err}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Glucose Reading (mg/dL) *</label>
                <div className="relative">
                  <input
                    type="number"
                    min="20"
                    max="600"
                    required
                    placeholder="e.g. 115"
                    value={val}
                    onChange={(e) => { setVal(e.target.value); setErr(''); }}
                    className="w-full text-2xl font-black text-slate-900 placeholder:text-slate-300 pl-4 pr-20 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">mg/dL</span>
                </div>
                {cls && (
                  <div className={`mt-2 p-2.5 rounded-xl border text-xs flex items-center gap-2 ${cls.badgeClass}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${cls.dotClass}`}></span>
                    <span className="font-bold">{cls.label}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Measurement Context</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-white focus:border-teal-500 focus:outline-none cursor-pointer">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Time</label>
                  <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Notes (Optional)</label>
                <input type="text" placeholder="e.g. Post-lunch walk, feeling great" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none" />
              </div>

              <button type="submit" className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2">
                <PlusIcon className="w-4 h-4 stroke-[3]" />
                <span>Save Reading</span>
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">Glucose Trend Curve</h3>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Safe Target: 70–140 mg/dL</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Interactive trend plot with shaded target stability zone</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                {['7d', '14d', 'all'].map((r) => (
                  <button key={r} onClick={() => setTimeRange(r)} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${timeRange === r ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                    {r === 'all' ? 'All' : `${r.toUpperCase()}`}
                  </button>
                ))}
              </div>
            </div>

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

            <div className="relative w-full overflow-hidden bg-slate-50/50 rounded-2xl border border-slate-200/60 p-2">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-56 sm:h-64 overflow-visible">
                <rect x={paddingX} y={targetBandTop} width={svgWidth - paddingX * 2} height={Math.max(0, targetBandBottom - targetBandTop)} fill="#14b8a6" fillOpacity="0.08" />
                <line x1={paddingX} y1={getYCoord(180)} x2={svgWidth - paddingX} y2={getYCoord(180)} stroke="#fda4af" strokeDasharray="4 4" strokeWidth="1.5" />
                <text x={svgWidth - paddingX + 5} y={getYCoord(180) + 4} fill="#f43f5e" fontSize="10" fontWeight="bold">180</text>
                <line x1={paddingX} y1={targetBandTop} x2={svgWidth - paddingX} y2={targetBandTop} stroke="#14b8a6" strokeDasharray="3 3" strokeWidth="1" />
                <text x={svgWidth - paddingX + 5} y={targetBandTop + 4} fill="#0d9488" fontSize="10" fontWeight="bold">140</text>
                <line x1={paddingX} y1={targetBandBottom} x2={svgWidth - paddingX} y2={targetBandBottom} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth="1" />
                <text x={svgWidth - paddingX + 5} y={targetBandBottom + 4} fill="#d97706" fontSize="10" fontWeight="bold">70</text>
                {chartPoints.length > 1 && (
                  <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                )}
                {chartPoints.map((pt) => {
                  const val = pt.data.value;
                  const ptColor = val < 70 ? '#f59e0b' : val > 140 ? '#f43f5e' : '#0d9488';
                  const isSel = selectedPoint && selectedPoint.id === pt.data.id;
                  return (
                    <g key={pt.data.id} className="cursor-pointer" onClick={() => setSelectedPoint(pt.data)}>
                      <circle cx={pt.x} cy={pt.y} r={isSel ? 7 : 5} fill="#ffffff" stroke={ptColor} strokeWidth={isSel ? 3.5 : 2.5} />
                      {(isSel || chartPoints.length <= 10) && (
                        <text x={pt.x} y={pt.y - 9} textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="bold">{val}</text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {selectedPoint && (
              <div className="mt-3 p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">{selectedPoint.value} mg/dL</span>
                  <span className="text-slate-600 font-semibold">• {selectedPoint.type}</span>
                  <span className="text-slate-500">({formatDateTime(selectedPoint.timestamp)})</span>
                </div>
                <button onClick={() => setSelectedPoint(null)} className="text-teal-700 hover:text-teal-900 font-bold">Dismiss</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Glucose Reading History</h3>
            <p className="text-xs text-slate-500 mt-0.5">Showing {history.length} recorded entries</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Fasting', 'Post-Meal', 'Low', 'High'].map((f) => (
              <button key={f} onClick={() => setFilterType(f)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterType === f ? 'bg-navy-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 divide-y divide-slate-100 overflow-x-auto">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">No readings found matching this filter.</div>
          ) : (
            history.map((reading) => {
              const cls = classifyGlucose(reading.value, reading.type);
              return (
                <div key={reading.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 text-center">
                      <span className="text-xl font-black text-slate-900 leading-tight">{reading.value}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">mg/dL</span>
                    </div>
                    <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{reading.type}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cls.badgeClass}`}>{cls.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{reading.notes}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs">
                    <div className="text-left sm:text-right">
                      <span className="font-semibold text-slate-700 block">{formatDate(reading.timestamp)}</span>
                      <span className="text-[10px] text-slate-400 block">{formatTime(reading.timestamp)}</span>
                    </div>
                    <button onClick={() => onDeleteReading(reading.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer" title="Delete reading">
                      <Trash2Icon className="w-4 h-4" />
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

function FoodDiaryView({ meals, onAddMeal, onDeleteMeal }) {
  const now = new Date();
  const [mealType, setMealType] = useState('Breakfast');
  const [desc, setDesc] = useState('');
  const [carbs, setCarbs] = useState('');
  const [gi, setGi] = useState('Low');
  const [date, setDate] = useState(now.toISOString().slice(0, 10));
  const [time, setTime] = useState(now.toTimeString().slice(0, 5));
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState('');
  const [filterType, setFilterType] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc.trim()) { setErr('Please enter food description.'); return; }
    const cNum = parseFloat(carbs);
    if (isNaN(cNum) || cNum < 0 || cNum > 400) { setErr('Enter realistic carbohydrate grams (0–400g).'); return; }

    onAddMeal({
      id: generateId('m'),
      timestamp: `${date}T${time}:00`,
      mealType,
      foodDescription: desc.trim(),
      carbsGrams: Math.round(cNum),
      glycemicIndex: gi,
      calories: Math.round(cNum * 4 + 200),
      notes: notes.trim() || 'Balanced meal record'
    });
    setDesc('');
    setCarbs('');
    setNotes('');
    setErr('');
  };

  const filtered = [...meals].filter((m) => filterType === 'All' || m.mealType.toLowerCase() === filterType.toLowerCase()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const todayStr = now.toISOString().slice(0, 10);
  const todayMeals = meals.filter((m) => m.timestamp && m.timestamp.slice(0, 10) === todayStr);
  const todayCarbs = todayMeals.reduce((sum, m) => sum + (Number(m.carbsGrams) || 0), 0);
  const lowGICount = meals.filter((m) => m.glycemicIndex === 'Low').length;
  const lowGIRatio = meals.length ? Math.round((lowGICount / meals.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UtensilsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Record Meal</h3>
              <p className="text-xs text-slate-500">Log carbohydrate intake and meal items</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {err && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircleIcon className="w-4 h-4 shrink-0" />
                <span>{err}</span>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Meal Category</label>
              <div className="grid grid-cols-4 gap-2">
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((t) => (
                  <button key={t} type="button" onClick={() => setMealType(t)} className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${mealType === t ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Food Description & Ingredients *</label>
              <textarea rows="2" required placeholder="e.g. Grilled salmon, roasted asparagus, 1/2 cup brown rice" value={desc} onChange={(e) => { setDesc(e.target.value); setErr(''); }} className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Estimated Carbs (g) *</label>
                <div className="relative">
                  <input type="number" min="0" max="400" required placeholder="e.g. 30" value={carbs} onChange={(e) => { setCarbs(e.target.value); setErr(''); }} className="w-full text-sm font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">grams</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Glycemic Index (GI)</label>
                <select value={gi} onChange={(e) => setGi(e.target.value)} className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-white focus:border-amber-500 focus:outline-none cursor-pointer">
                  <option value="Low">Low GI (Oats, greens, legumes)</option>
                  <option value="Medium">Medium GI (Sweet potato, whole wheat)</option>
                  <option value="High">High GI (White rice, bread, sweets)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Date</label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Time</label>
                <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Notes (Optional)</label>
              <input type="text" placeholder="e.g. Felt satisfied, steady energy" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none" />
            </div>
            <button type="submit" className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2">
              <PlusIcon className="w-4 h-4 stroke-[3]" />
              <span>Save Meal Entry</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-amber-500" />
              Daily Carbohydrate Budget
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Recommended daily carbohydrate allowance</p>
            <div className="grid grid-cols-2 gap-4 my-5">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-xs font-bold text-amber-700 uppercase block">Today Logged</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-amber-900">{todayCarbs}</span>
                  <span className="text-xs font-semibold text-amber-700">grams</span>
                </div>
                <span className="text-[11px] text-amber-600 mt-1 block">{todayMeals.length} meal{todayMeals.length !== 1 ? 's' : ''} recorded today</span>
              </div>
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
                <span className="text-xs font-bold text-teal-700 uppercase block">Low GI Ratio</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-teal-900">{lowGIRatio}%</span>
                </div>
                <span className="text-[11px] text-teal-600 mt-1 block">{lowGICount} of {meals.length} meals are Low GI</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600">Daily Target (~130g max):</span>
                <span className="text-slate-900 font-bold">{Math.round((todayCarbs / 130) * 100)}% Used</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.round((todayCarbs / 130) * 100))}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400"><InfoIcon className="w-4 h-4" /></div>
              <h4 className="font-bold text-sm text-white">ADA Diabetes Plate Method</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">When building meals, aim for the golden clinical ratio:</p>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-teal-400 font-extrabold text-base block">1/2 Plate</span>
                <span className="text-[10px] text-slate-300">Non-starchy veggies</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-amber-400 font-extrabold text-base block">1/4 Plate</span>
                <span className="text-[10px] text-slate-300">Lean protein</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-blue-400 font-extrabold text-base block">1/4 Plate</span>
                <span className="text-[10px] text-slate-300">Complex carbs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Meal Log History</h3>
            <p className="text-xs text-slate-500 mt-0.5">Showing {filtered.length} recorded meals</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'].map((f) => (
              <button key={f} onClick={() => setFilterType(f)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterType === f ? 'bg-navy-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">No meal records found for this filter.</div>
          ) : (
            filtered.map((meal) => (
              <div key={meal.id} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50/60 px-2 rounded-xl transition-colors">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    <UtensilsIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{meal.mealType}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">{meal.carbsGrams}g Carbs</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${meal.glycemicIndex === 'Low' ? 'bg-teal-50 text-teal-800 border-teal-200' : meal.glycemicIndex === 'Medium' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>{meal.glycemicIndex} GI</span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{meal.foodDescription}</p>
                    {meal.notes && <p className="text-[11px] text-slate-400 mt-1 italic">"{meal.notes}"</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs">
                  <div className="text-left sm:text-right">
                    <span className="font-semibold text-slate-700 block">{formatDate(meal.timestamp)}</span>
                    <span className="text-[10px] text-slate-400 block">{formatTime(meal.timestamp)}</span>
                  </div>
                  <button onClick={() => onDeleteMeal(meal.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer" title="Delete meal">
                    <Trash2Icon className="w-4 h-4" />
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

function RemindersView({ reminders, onAddReminder, onToggleReminder, onDeleteReminder }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00');
  const [category, setCategory] = useState('Oral Medication');
  const [frequency, setFrequency] = useState('Daily with Breakfast');
  const [instructions, setInstructions] = useState('');
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Please provide a medication or task name.'); return; }
    onAddReminder({
      id: generateId('r'),
      name: name.trim(),
      dosage: dosage.trim() || 'As prescribed',
      time,
      category,
      frequency,
      instructions: instructions.trim() || 'Take as instructed by your healthcare provider.',
      completedToday: false,
      lastCompletedDate: null
    });
    setName('');
    setDosage('');
    setInstructions('');
    setErr('');
  };

  const filtered = reminders.filter((r) => {
    if (filter === 'Completed') return r.completedToday;
    if (filter === 'Pending') return !r.completedToday;
    return true;
  });

  const completedCount = reminders.filter((r) => r.completedToday).length;
  const adherence = reminders.length ? Math.round((completedCount / reminders.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BellIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Schedule New Reminder</h3>
              <p className="text-xs text-slate-500">Track prescriptions, vitals checks, and daily routines</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {err && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircleIcon className="w-4 h-4 shrink-0" />
                <span>{err}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Medication / Task Name *</label>
                <input type="text" required placeholder="e.g. Metformin XR" value={name} onChange={(e) => { setName(e.target.value); setErr(''); }} className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Dosage / Measure</label>
                <input type="text" placeholder="e.g. 500 mg or 1 tablet" value={dosage} onChange={(e) => setDosage(e.target.value)} className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none cursor-pointer">
                  <option value="Oral Medication">💊 Oral Medication</option>
                  <option value="Injectable">💉 Injectable / Insulin Pen</option>
                  <option value="Health Check">🩺 Blood Pressure / Vitals Check</option>
                  <option value="Physical Activity">🏃 Physical Activity / Walk</option>
                  <option value="Hydration">💧 Hydration Reminder</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Reminder Time *</label>
                <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none cursor-pointer">
                <option value="Daily with Breakfast">Daily with Breakfast</option>
                <option value="Daily with Lunch">Daily with Lunch</option>
                <option value="Daily with Dinner">Daily with Dinner</option>
                <option value="Daily at Bedtime">Daily at Bedtime</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="Every 2 Days">Every 2 Days</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Doctor Instructions / Notes</label>
              <textarea rows="2" placeholder="e.g. Take with food and a full glass of water. Do not crush." value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none resize-none" />
            </div>
            <button type="submit" className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2">
              <PlusIcon className="w-4 h-4 stroke-[3]" />
              <span>Add to Schedule</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-indigo-600" />
              Today's Adherence Score
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Consistent timing optimizes glycemic control</p>
            <div className="my-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Completion</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black text-indigo-950">{adherence}%</span>
                </div>
                <span className="text-xs text-indigo-800 font-semibold mt-1 block">{completedCount} of {reminders.length} items logged today</span>
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-indigo-200 flex items-center justify-center bg-white shadow-inner">
                <CheckCircle2Icon className={`w-10 h-10 ${adherence === 100 ? 'text-emerald-500' : 'text-indigo-600'}`} />
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${adherence}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400"><ShieldAlertIcon className="w-4 h-4" /></div>
              <h4 className="font-bold text-sm text-white">Medication Safety Guardrail</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never skip, double, or adjust prescription medication or insulin units without direct consultation 
              with your prescribing endocrinologist or clinical pharmacist.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Daily Schedule & Adherence</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click the checkmark to mark as completed for today</p>
          </div>
          <div className="flex items-center gap-1.5">
            {['All', 'Pending', 'Completed'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filter === f ? 'bg-navy-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">No reminders found matching this filter.</div>
          ) : (
            filtered.map((reminder) => {
              const isDone = reminder.completedToday;
              return (
                <div key={reminder.id} className={`py-4 px-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${isDone ? 'bg-emerald-50/40 border border-emerald-100' : 'hover:bg-slate-50/60'}`}>
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleReminder(reminder.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isDone ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500' : 'border-2 border-slate-300 hover:border-indigo-600 bg-white text-transparent hover:text-indigo-400'
                      }`}
                      title={isDone ? 'Mark as incomplete' : 'Mark as completed today'}
                    >
                      <CheckIcon className="w-5 h-5 stroke-[3]" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`text-sm font-bold transition-colors ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{reminder.name}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{reminder.dosage}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">{reminder.category}</span>
                        {isDone && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Completed Today</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">{reminder.instructions}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs">
                    <div className="text-left sm:text-right">
                      <span className="font-extrabold text-slate-900 block flex items-center gap-1.5 sm:justify-end">
                        <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                        {reminder.time}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">{reminder.frequency}</span>
                    </div>
                    <button onClick={() => onDeleteReminder(reminder.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer" title="Delete reminder">
                      <Trash2Icon className="w-4 h-4" />
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

function HealthReportsView({ patientProfile, glucoseReadings, meals, reminders, notes, onAddNote, onDeleteNote }) {
  const [reportRange, setReportRange] = useState('14d');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Doctor Prep');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const now = new Date();
  const filteredReadings = [...glucoseReadings].filter((r) => {
    const diff = (now - new Date(r.timestamp)) / (1000 * 60 * 60 * 24);
    return reportRange === '7d' ? diff <= 7 : reportRange === '14d' ? diff <= 14 : diff <= 30;
  });

  const values = filteredReadings.map((r) => Number(r.value));
  const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  const eA1C = calculateEstimatedA1C(avg);
  const stdDev = calculateStandardDeviation(filteredReadings);
  const tir = calculateTimeInRange(filteredReadings, 70, 140);

  const fasting = filteredReadings.filter((r) => r.type.toLowerCase().includes('fasting'));
  const fastingAvg = fasting.length ? Math.round(fasting.reduce((s, r) => s + r.value, 0) / fasting.length) : 0;

  const post = filteredReadings.filter((r) => r.type.toLowerCase().includes('after') || r.type.toLowerCase().includes('post'));
  const postAvg = post.length ? Math.round(post.reduce((s, r) => s + r.value, 0) / post.length) : 0;

  const lowest = values.length ? Math.min(...values) : 0;
  const highest = values.length ? Math.max(...values) : 0;

  const daysMap = {};
  filteredReadings.forEach((r) => {
    const day = r.timestamp.slice(0, 10);
    if (!daysMap[day]) daysMap[day] = [];
    daysMap[day].push(r.value);
  });

  const dailyAverages = Object.keys(daysMap).sort().slice(-7).map((day) => {
    const arr = daysMap[day];
    const dayAvg = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    const dateObj = new Date(day);
    const label = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    return { day, label, avg: dayAvg, count: arr.length };
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAddNote({
      id: generateId('hn'),
      date: new Date().toISOString().slice(0, 10),
      category,
      title: title.trim(),
      content: content.trim(),
      important: isImportant
    });
    setTitle('');
    setContent('');
    setIsImportant(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">Clinical Analytics & Health Report</h2>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Verified Metrics</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Aggregated biometrics formatted for clinical consultation with your endocrinologist</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {['7d', '14d', '30d'].map((r) => (
              <button key={r} onClick={() => setReportRange(r)} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${reportRange === r ? 'bg-navy-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                {r === '7d' ? '7 Days' : r === '14d' ? '14 Days' : '30 Days'}
              </button>
            ))}
          </div>
          <button onClick={() => window.print()} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm">
            <PrinterIcon className="w-4 h-4" />
            <span>Print Clinical Summary</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-3xl p-6 shadow-lg shadow-teal-500/15 relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-100 block">Estimated HbA1c (eA1C)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight">{eA1C}%</span>
            <span className="text-xs font-semibold text-teal-200">Target &lt; 6.5%</span>
          </div>
          <p className="text-[11px] text-teal-100 mt-2 leading-relaxed">Nathan formula: (Avg + 46.7) / 28.7. Serves as clinical estimate; laboratory blood draw confirms.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mean Glucose (Period)</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600"><DropletIcon className="w-4 h-4" /></div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 tracking-tight">{avg}</span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Fasting: <strong className="text-slate-800">{fastingAvg || '--'} mg/dL</strong></span>
            <span>Post: <strong className="text-slate-800">{postAvg || '--'} mg/dL</strong></span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Time in Range (70-140)</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600"><TrendingUpIcon className="w-4 h-4" /></div>
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

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Variability (Std Dev)</span>
            <div className="p-2 rounded-xl bg-navy-50 text-navy-600"><ActivityIcon className="w-4 h-4" /></div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 tracking-tight">±{stdDev}</span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Min: <strong className="text-slate-800">{lowest}</strong></span>
            <span>Max: <strong className="text-slate-800">{highest}</strong></span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Daily Average Glucose Comparison</h3>
            <p className="text-xs text-slate-500 mt-0.5">Daily mean levels compared against 140 mg/dL target threshold</p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">Target Ceiling: 140 mg/dL</span>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-7 gap-3">
          {dailyAverages.length === 0 ? (
            <div className="col-span-7 text-center py-8 text-slate-400 text-xs">No daily readings in this range.</div>
          ) : (
            dailyAverages.map((item) => {
              const isOver = item.avg > 140;
              const isLow = item.avg < 70;
              const barHeight = Math.min(100, Math.max(20, (item.avg / 200) * 100));
              return (
                <div key={item.day} className="flex flex-col items-center">
                  <span className="text-xs font-extrabold text-slate-900 mb-2">{item.avg} <span className="text-[10px] text-slate-400 font-normal">mg/dL</span></span>
                  <div className="w-full bg-slate-100 rounded-2xl h-36 flex items-end p-1.5 justify-center">
                    <div className={`w-full rounded-xl transition-all duration-500 ${isLow ? 'bg-amber-400' : isOver ? 'bg-rose-400' : 'bg-teal-500'}`} style={{ height: `${barHeight}%` }}></div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 mt-2 truncate text-center">{item.label}</span>
                  <span className="text-[10px] text-slate-400">{item.count} logs</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileTextIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Doctor Consultation Notes</h3>
              <p className="text-xs text-slate-500">Record symptoms, questions & lifestyle notes</p>
            </div>
          </div>
          <form onSubmit={handleAdd} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Note Topic / Title *</label>
              <input type="text" required placeholder="e.g. Discuss recent hypoglycemia event" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Note Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-white focus:border-teal-500 focus:outline-none cursor-pointer">
                <option value="Doctor Prep">🩺 Doctor Consultation Question</option>
                <option value="Symptom Observation">⚠️ Symptom Observation</option>
                <option value="Lifestyle & Nutrition">🥗 Lifestyle & Diet Reaction</option>
                <option value="Medication Query">💊 Medication Observation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Details & Clinical Observations *</label>
              <textarea rows="4" required placeholder="Write specific observations, times, reactions..." value={content} onChange={(e) => setContent(e.target.value)} className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none resize-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="importantNote" checked={isImportant} onChange={(e) => setIsImportant(e.target.checked)} className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
              <label htmlFor="importantNote" className="text-xs font-bold text-slate-700 cursor-pointer">Mark as high priority for next visit</label>
            </div>
            <button type="submit" className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center gap-2">
              <PlusIcon className="w-4 h-4 stroke-[3]" />
              <span>Save Clinical Note</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">Recorded Health Observations</h3>
            <span className="text-xs font-semibold text-slate-500">{notes.length} saved note{notes.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {notes.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">No clinical notes recorded yet.</div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className={`p-4 rounded-2xl border transition-all ${note.important ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50/60 border-slate-200/80'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{note.title}</span>
                        {note.important && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">High Priority</span>}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">{note.category} • Recorded {note.date}</span>
                    </div>
                    <button onClick={() => onDeleteNote(note.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" title="Delete note">
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 mt-2.5 whitespace-pre-line leading-relaxed">{note.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   6. ROOT CONTAINER & MOUNT
   ========================================================================== */

function GlucoCareApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [patientProfile, setPatientProfile] = useState(() => loadFromStorage(STORAGE_KEYS.PROFILE, INITIAL_PATIENT_PROFILE));
  const [glucoseReadings, setGlucoseReadings] = useState(() => loadFromStorage(STORAGE_KEYS.GLUCOSE, INITIAL_GLUCOSE_READINGS));
  const [meals, setMeals] = useState(() => loadFromStorage(STORAGE_KEYS.MEALS, INITIAL_MEALS));
  const [reminders, setReminders] = useState(() => loadFromStorage(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS));
  const [notes, setNotes] = useState(() => loadFromStorage(STORAGE_KEYS.NOTES, INITIAL_HEALTH_NOTES));

  useEffect(() => saveToStorage(STORAGE_KEYS.GLUCOSE, glucoseReadings), [glucoseReadings]);
  useEffect(() => saveToStorage(STORAGE_KEYS.MEALS, meals), [meals]);
  useEffect(() => saveToStorage(STORAGE_KEYS.REMINDERS, reminders), [reminders]);
  useEffect(() => saveToStorage(STORAGE_KEYS.NOTES, notes), [notes]);
  useEffect(() => saveToStorage(STORAGE_KEYS.PROFILE, patientProfile), [patientProfile]);

  const addToast = (title, message, type = 'success') => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const handleDismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleAddGlucoseReading = (newReading) => {
    setGlucoseReadings((prev) => [newReading, ...prev]);
    addToast('Glucose Reading Saved', `Logged ${newReading.value} mg/dL (${newReading.type}) into your health record.`, 'success');
  };

  const handleDeleteGlucoseReading = (id) => {
    setGlucoseReadings((prev) => prev.filter((r) => r.id !== id));
    addToast('Reading Removed', 'The glucose entry has been deleted.', 'warning');
  };

  const handleAddMeal = (newMeal) => {
    setMeals((prev) => [newMeal, ...prev]);
    addToast('Meal Logged Successfully', `Added ${newMeal.mealType} (${newMeal.carbsGrams}g carbs) to your food diary.`, 'success');
  };

  const handleDeleteMeal = (id) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    addToast('Meal Record Removed', 'The food record has been deleted.', 'warning');
  };

  const handleAddReminder = (newReminder) => {
    setReminders((prev) => [newReminder, ...prev]);
    addToast('Reminder Added', `Scheduled ${newReminder.name} for ${newReminder.time}.`, 'success');
  };

  const handleToggleReminder = (id) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.completedToday;
          if (nextState) addToast('Routine Completed!', `Marked ${r.name} as taken for today.`, 'success');
          return { ...r, completedToday: nextState, lastCompletedDate: nextState ? new Date().toISOString().slice(0, 10) : r.lastCompletedDate };
        }
        return r;
      })
    );
  };

  const handleDeleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    addToast('Reminder Removed', 'Scheduled reminder removed from daily list.', 'warning');
  };

  const handleAddNote = (newNote) => {
    setNotes((prev) => [newNote, ...prev]);
    addToast('Clinical Note Saved', 'Observation added to your doctor consultation prep sheet.', 'success');
  };

  const handleDeleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    addToast('Note Deleted', 'Clinical note removed from records.', 'warning');
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all records to standard demonstration clinical dataset?')) {
      setGlucoseReadings(INITIAL_GLUCOSE_READINGS);
      setMeals(INITIAL_MEALS);
      setReminders(INITIAL_REMINDERS);
      setNotes(INITIAL_HEALTH_NOTES);
      setPatientProfile(INITIAL_PATIENT_PROFILE);
      addToast('Records Restored', 'Demonstration medical dataset has been reset.', 'success');
    }
  };

  const pendingReminders = reminders.filter((r) => !r.completedToday).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      <MedicalDisclaimerBanner />
      <div className="flex-1 flex flex-col lg:flex-row">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onResetDemoData={handleResetDemoData}
          unreadRemindersCount={pendingReminders}
        />
        <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
          <Header
            activeTab={activeTab}
            onOpenMobileSidebar={() => setIsMobileOpen(true)}
            onOpenQuickLog={() => setIsQuickLogOpen(true)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            patientProfile={patientProfile}
          />
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                patientProfile={patientProfile}
                glucoseReadings={glucoseReadings}
                meals={meals}
                reminders={reminders}
                notes={notes}
                setActiveTab={setActiveTab}
                onOpenQuickLog={() => setIsQuickLogOpen(true)}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            )}
            {activeTab === 'tracker' && (
              <GlucoseTrackerView
                glucoseReadings={glucoseReadings}
                onAddReading={handleAddGlucoseReading}
                onDeleteReading={handleDeleteGlucoseReading}
              />
            )}
            {activeTab === 'food' && (
              <FoodDiaryView
                meals={meals}
                onAddMeal={handleAddMeal}
                onDeleteMeal={handleDeleteMeal}
              />
            )}
            {activeTab === 'reminders' && (
              <RemindersView
                reminders={reminders}
                onAddReminder={handleAddReminder}
                onToggleReminder={handleToggleReminder}
                onDeleteReminder={handleDeleteReminder}
              />
            )}
            {activeTab === 'reports' && (
              <HealthReportsView
                patientProfile={patientProfile}
                glucoseReadings={glucoseReadings}
                meals={meals}
                reminders={reminders}
                notes={notes}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
              />
            )}
          </main>
          <footer className="mt-auto border-t border-slate-200 bg-white/70 backdrop-blur-sm px-6 py-4 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
              <div>
                <strong className="text-slate-800 font-bold">GlucoCare</strong> • Modern Diabetes Health Management Platform
              </div>
              <div className="text-[11px] text-slate-400">
                Medical Disclaimer: Not a substitute for professional clinical advice, diagnosis, or treatment.
              </div>
            </div>
          </footer>
        </div>
      </div>

      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        onSaveReading={handleAddGlucoseReading}
      />
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        patientProfile={patientProfile}
      />
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

// Mount to DOM
const rootDomNode = document.getElementById('root');
if (rootDomNode) {
  const root = ReactDOM.createRoot(rootDomNode);
  root.render(<GlucoCareApp />);
}
