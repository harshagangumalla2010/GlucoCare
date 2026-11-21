// Standard Clinical Reference Helpers for Diabetes Management (ADA Guidelines)

export const GLUCOSE_THRESHOLDS = {
  VERY_LOW: 54,    // Severe Hypoglycemia
  LOW: 70,         // Hypoglycemia alert value
  TARGET_FASTING_MAX: 130, // Normal fasting target for adults with diabetes
  TARGET_POST_PRANDIAL_MAX: 180, // Normal post-meal target (1-2h)
  HIGH: 180,       // Hyperglycemia alert
  VERY_HIGH: 250   // Marked Hyperglycemia
};

/**
 * Classifies a glucose reading based on value and context
 */
export function classifyGlucose(value, type = 'Random') {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    return {
      status: 'invalid',
      label: 'Invalid Value',
      color: 'gray',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      dotClass: 'bg-slate-400',
      description: 'Please enter a valid reading.'
    };
  }

  if (num < GLUCOSE_THRESHOLDS.LOW) {
    return {
      status: 'low',
      label: 'Low (Hypoglycemia)',
      color: 'amber',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-200',
      dotClass: 'bg-amber-500 animate-pulse',
      cardBorder: 'border-l-4 border-l-amber-500',
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
        color: 'teal',
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-300 ring-1 ring-teal-200',
        dotClass: 'bg-teal-500',
        cardBorder: 'border-l-4 border-l-teal-500',
        description: 'Optimal fasting level within ADA target range (70-130 mg/dL).'
      };
    }
  } else if (isPostMeal) {
    if (num <= 180) {
      return {
        status: 'normal',
        label: 'In Range (Post-Meal Target)',
        color: 'teal',
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-300 ring-1 ring-teal-200',
        dotClass: 'bg-teal-500',
        cardBorder: 'border-l-4 border-l-teal-500',
        description: 'Well-controlled post-prandial level (< 180 mg/dL).'
      };
    }
  } else {
    if (num <= 140) {
      return {
        status: 'normal',
        label: 'In Range (Target)',
        color: 'teal',
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-300 ring-1 ring-teal-200',
        dotClass: 'bg-teal-500',
        cardBorder: 'border-l-4 border-l-teal-500',
        description: 'Balanced reading inside healthy glycemic range.'
      };
    }
  }

  if (num > GLUCOSE_THRESHOLDS.VERY_HIGH) {
    return {
      status: 'very_high',
      label: 'Very High (Hyperglycemia)',
      color: 'rose',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-200',
      dotClass: 'bg-rose-600 animate-pulse',
      cardBorder: 'border-l-4 border-l-rose-500',
      description: 'Significantly elevated (> 250 mg/dL). Hydrate and monitor closely.'
    };
  }

  return {
    status: 'high',
    label: 'Elevated (Above Target)',
    color: 'rose',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-100',
    dotClass: 'bg-rose-500',
    cardBorder: 'border-l-4 border-l-rose-400',
    description: 'Higher than typical target. Consider physical activity or meal review.'
  };
}

/**
 * Calculates Estimated A1C from average glucose using Nathan et al. formula
 * eA1C = (Average Glucose + 46.7) / 28.7
 */
export function calculateEstimatedA1C(averageGlucose) {
  if (!averageGlucose || averageGlucose <= 0) return 0;
  const a1c = (averageGlucose + 46.7) / 28.7;
  return Number(a1c.toFixed(1));
}

/**
 * Calculates Time in Range (TIR) metrics
 */
export function calculateTimeInRange(readings, targetMin = 70, targetMax = 140) {
  if (!readings || readings.length === 0) {
    return { inRange: 0, low: 0, high: 0, total: 0 };
  }

  let inRangeCount = 0;
  let lowCount = 0;
  let highCount = 0;

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
    inRangeCount,
    lowCount,
    highCount,
    total
  };
}

/**
 * Standard Deviation for Glucose Variability
 */
export function calculateStandardDeviation(readings) {
  if (!readings || readings.length < 2) return 0;
  const values = readings.map(r => Number(r.value));
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
  return Math.round(Math.sqrt(variance));
}

/**
 * Format timestamp into user friendly strings
 */
export function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * LocalStorage Helpers
 */
export const STORAGE_KEYS = {
  GLUCOSE: 'glucocare_readings',
  MEALS: 'glucocare_meals',
  REMINDERS: 'glucocare_reminders',
  NOTES: 'glucocare_notes',
  PROFILE: 'glucocare_profile'
};

export function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved);
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
