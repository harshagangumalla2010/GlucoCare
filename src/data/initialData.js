export const INITIAL_PATIENT_PROFILE = {
  name: "Sarah Jenkins",
  age: 42,
  gender: "Female",
  condition: "Type 2 Diabetes (Managed)",
  diagnosedYear: 2022,
  targetA1C: 6.5,
  targetGlucoseRange: {
    min: 70,
    max: 140,
    fastingMax: 130,
    postMealMax: 180
  },
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

export const INITIAL_GLUCOSE_READINGS = [
  {
    id: "g-1",
    timestamp: "2026-11-21T07:45:00",
    value: 108,
    type: "Fasting",
    notes: "Felt rested, 8h sleep. Fasting overnight 10h.",
    tags: ["Routine", "Morning"]
  },
  {
    id: "g-2",
    timestamp: "2026-11-21T13:15:00",
    value: 138,
    type: "After Lunch",
    notes: "2 hours post grilled chicken quinoa bowl. Smooth recovery.",
    tags: ["Post-Meal"]
  },
  {
    id: "g-3",
    timestamp: "2026-11-21T18:45:00",
    value: 114,
    type: "Before Dinner",
    notes: "Pre-dinner check. Energy steady.",
    tags: ["Pre-Meal"]
  },
  {
    id: "g-4",
    timestamp: "2026-11-20T07:30:00",
    value: 112,
    type: "Fasting",
    notes: "Good morning check.",
    tags: ["Morning"]
  },
  {
    id: "g-5",
    timestamp: "2026-11-20T10:15:00",
    value: 142,
    type: "After Breakfast",
    notes: "Post scrambled eggs & whole wheat toast.",
    tags: ["Post-Meal"]
  },
  {
    id: "g-6",
    timestamp: "2026-11-20T14:00:00",
    value: 128,
    type: "After Lunch",
    notes: "Post salmon salad.",
    tags: ["Post-Meal"]
  },
  {
    id: "g-7",
    timestamp: "2026-11-20T21:30:00",
    value: 118,
    type: "Bedtime",
    notes: "Bedtime reading. Right in target range.",
    tags: ["Night"]
  },
  {
    id: "g-8",
    timestamp: "2026-11-19T07:40:00",
    value: 105,
    type: "Fasting",
    notes: "Optimal fasting reading.",
    tags: ["Morning"]
  },
  {
    id: "g-9",
    timestamp: "2026-11-19T13:30:00",
    value: 165,
    type: "After Lunch",
    notes: "Whole wheat pasta lunch. Slightly elevated but within post-meal guidelines.",
    tags: ["Elevated"]
  },
  {
    id: "g-10",
    timestamp: "2026-11-19T20:45:00",
    value: 122,
    type: "After Dinner",
    notes: "Light evening walk helped lower post-dinner level.",
    tags: ["Post-Meal"]
  },
  {
    id: "g-11",
    timestamp: "2026-11-18T07:50:00",
    value: 119,
    type: "Fasting",
    notes: "Morning baseline.",
    tags: ["Morning"]
  },
  {
    id: "g-12",
    timestamp: "2026-11-18T14:15:00",
    value: 132,
    type: "After Lunch",
    notes: "Mediterranean bowl.",
    tags: ["Post-Meal"]
  },
  {
    id: "g-13",
    timestamp: "2026-11-18T18:10:00",
    value: 64,
    type: "Before Dinner",
    notes: "Mild hypoglycemia after intense stairs. Consumed 15g fast glucose; resolved back to 95 mg/dL.",
    tags: ["Low", "Symptom"]
  },
  {
    id: "g-14",
    timestamp: "2026-11-17T07:35:00",
    value: 104,
    type: "Fasting",
    notes: "Consistent fasting control.",
    tags: ["Morning"]
  },
  {
    id: "g-15",
    timestamp: "2026-11-17T13:20:00",
    value: 136,
    type: "After Lunch",
    notes: "Turkey avocado wrap on low-carb tortilla.",
    tags: ["Post-Meal"]
  },
  {
    id: "g-16",
    timestamp: "2026-11-17T21:00:00",
    value: 115,
    type: "Bedtime",
    notes: "Ready for sleep.",
    tags: ["Night"]
  },
  {
    id: "g-17",
    timestamp: "2026-11-16T07:45:00",
    value: 110,
    type: "Fasting",
    notes: "Normal fasting level.",
    tags: ["Morning"]
  },
  {
    id: "g-18",
    timestamp: "2026-11-16T14:30:00",
    value: 188,
    type: "After Lunch",
    notes: "Team celebration pizza lunch. High carb spike observed. Extra hydration taken.",
    tags: ["High", "Spike"]
  },
  {
    id: "g-19",
    timestamp: "2026-11-16T20:30:00",
    value: 130,
    type: "After Dinner",
    notes: "Low carb dinner stabilized levels.",
    tags: ["Post-Meal"]
  },
  {
    id: "g-20",
    timestamp: "2026-11-15T07:30:00",
    value: 106,
    type: "Fasting",
    notes: "Restful weekend morning.",
    tags: ["Morning"]
  }
];

export const INITIAL_MEALS = [
  {
    id: "m-1",
    timestamp: "2026-11-21T08:15:00",
    mealType: "Breakfast",
    foodDescription: "Steel-cut oatmeal with 1 tbsp almond butter, chia seeds, and 1/2 cup fresh organic blueberries.",
    carbsGrams: 34,
    glycemicIndex: "Low",
    calories: 340,
    notes: "Satisfying breakfast with sustained energy; no post-meal sluggishness."
  },
  {
    id: "m-2",
    timestamp: "2026-11-21T13:00:00",
    mealType: "Lunch",
    foodDescription: "Grilled lemon-herb chicken breast, Mediterranean Greek salad (olive oil, cucumber, tomatoes, kalamata olives, feta) with 1/2 cup tricolor quinoa.",
    carbsGrams: 26,
    glycemicIndex: "Low",
    calories: 510,
    notes: "High fiber and healthy fats kept post-meal glucose very stable at 138 mg/dL."
  },
  {
    id: "m-3",
    timestamp: "2026-11-21T16:30:00",
    mealType: "Snack",
    foodDescription: "Small handful of roasted unsalted almonds and crisp celery sticks with 2 tbsp roasted red pepper hummus.",
    carbsGrams: 9,
    glycemicIndex: "Low",
    calories: 160,
    notes: "Quick afternoon snack before evening chores."
  },
  {
    id: "m-4",
    timestamp: "2026-11-20T08:00:00",
    mealType: "Breakfast",
    foodDescription: "Two scrambled pasture-raised eggs with baby spinach, half an avocado, and 1 slice sprouted grain toast with grass-fed butter.",
    carbsGrams: 16,
    glycemicIndex: "Low",
    calories: 380,
    notes: "Low carb profile, excellent glycemic stability."
  },
  {
    id: "m-5",
    timestamp: "2026-11-20T12:45:00",
    mealType: "Lunch",
    foodDescription: "Pan-seared Atlantic salmon fillet with sautéed garlic asparagus and roasted sweet potato wedges (100g).",
    carbsGrams: 32,
    glycemicIndex: "Medium",
    calories: 540,
    notes: "Sweet potato provides good micronutrients and steady energy."
  },
  {
    id: "m-6",
    timestamp: "2026-11-20T19:15:00",
    mealType: "Dinner",
    foodDescription: "Slow-cooked turkey and black bean chili topped with fresh cilantro, diced avocado, and a dollop of 2% Greek yogurt.",
    carbsGrams: 28,
    glycemicIndex: "Low",
    calories: 460,
    notes: "Hearty and comforting; fiber from black beans moderates carb absorption."
  },
  {
    id: "m-7",
    timestamp: "2026-11-19T08:10:00",
    mealType: "Breakfast",
    foodDescription: "Unsweetened 2% Greek yogurt layered with crushed walnuts, ground flax seeds, cinnamon, and raspberries.",
    carbsGrams: 14,
    glycemicIndex: "Low",
    calories: 290,
    notes: "High protein, minimal carb impact."
  },
  {
    id: "m-8",
    timestamp: "2026-11-19T13:00:00",
    mealType: "Lunch",
    foodDescription: "Whole wheat penne with grilled chicken, roasted zucchini, bell peppers, and basil walnut pesto.",
    carbsGrams: 52,
    glycemicIndex: "Medium",
    calories: 590,
    notes: "Higher carb count; blood glucose peaked at 165 mg/dL."
  },
  {
    id: "m-9",
    timestamp: "2026-11-19T19:30:00",
    mealType: "Dinner",
    foodDescription: "Baked Alaskan cod with lemon garlic butter, riced cauliflower with herbs, and steamed green beans.",
    carbsGrams: 12,
    glycemicIndex: "Low",
    calories: 360,
    notes: "Ultra low-carb dinner to balance out lunch."
  }
];

export const INITIAL_REMINDERS = [
  {
    id: "r-1",
    name: "Metformin XR",
    dosage: "1000 mg",
    time: "08:00",
    category: "Oral Medication",
    frequency: "Daily with Breakfast",
    instructions: "Take with breakfast meal and a full glass of water to minimize GI discomfort.",
    completedToday: true,
    lastCompletedDate: "2026-11-21"
  },
  {
    id: "r-2",
    name: "Glipizide",
    dosage: "5 mg",
    time: "12:30",
    category: "Oral Medication",
    frequency: "Daily with Lunch",
    instructions: "Take 30 minutes before your midday meal. Do not skip lunch after taking.",
    completedToday: true,
    lastCompletedDate: "2026-11-21"
  },
  {
    id: "r-3",
    name: "Afternoon Brisk Walk",
    dosage: "20 - 30 Minutes",
    time: "17:30",
    category: "Physical Activity",
    frequency: "Daily",
    instructions: "Moderate cardio exercise improves cellular insulin sensitivity for up to 24 hours.",
    completedToday: false,
    lastCompletedDate: "2026-11-20"
  },
  {
    id: "r-4",
    name: "Atorvastatin",
    dosage: "20 mg",
    time: "21:30",
    category: "Oral Medication",
    frequency: "Daily at Bedtime",
    instructions: "Lipid management. Take nightly at approximately the same time.",
    completedToday: false,
    lastCompletedDate: "2026-11-20"
  },
  {
    id: "r-5",
    name: "Blood Pressure & Foot Check",
    dosage: "Vitals & Visual Exam",
    time: "20:00",
    category: "Health Check",
    frequency: "Every 2 Days",
    instructions: "Log blood pressure (target < 125/80 mmHg) and perform daily visual diabetic foot inspection.",
    completedToday: false,
    lastCompletedDate: "2026-11-19"
  }
];

export const INITIAL_HEALTH_NOTES = [
  {
    id: "hn-1",
    date: "2026-11-20",
    category: "Doctor Prep",
    title: "Upcoming Consultation with Dr. Reed (Dec 4)",
    content: "Key discussion points:\n1. Review the mild hypoglycemia event on Nov 18 (64 mg/dL after heavy stairs before dinner).\n2. Review fasting stability over the last 90 days.\n3. Request order for standard 3-month HbA1c lab test and lipid panel.\n4. Ask about continuous glucose monitoring (CGM) sensor prescription options.",
    important: true
  },
  {
    id: "hn-2",
    date: "2026-11-18",
    category: "Symptom Observation",
    title: "Hypoglycemia Experience (Nov 18)",
    content: "Around 6:10 PM felt slight shakiness and diaphoresis after climbing 4 flights of stairs at the office. Immediate fingerstick showed 64 mg/dL. Applied the standard 'Rule of 15': ingested 15g fast-acting glucose tablets (3 tablets), rested quietly for 15 minutes, retested at 92 mg/dL. Noted down to discuss with endocrinologist.",
    important: false
  },
  {
    id: "hn-3",
    date: "2026-11-15",
    category: "Lifestyle & Nutrition",
    title: "Post-Meal Glucose Stabilization",
    content: "Consistently noticed that starting meals with green vegetables or a protein buffer significantly reduces the 1-hour glucose peak compared to eating carbohydrates first. 15-minute post-lunch walk brings readings down by ~20 mg/dL reliably.",
    important: false
  }
];
