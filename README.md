# GlucoCare — Modern Diabetes Healthcare Platform 🩺🩸

GlucoCare is a modern, responsive, and clinical-grade diabetes management web application designed for patients with Type 1 and Type 2 diabetes. It combines modern healthcare startup aesthetics (navy blue and teal palette, rounded cards, clean typography) with real, reactive biometrics tracking, nutritional logging, and clinical doctor consultation preparation.

![GlucoCare Platform](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Application Sections

### 1. 📊 Executive Dashboard
- **Dynamic Welcome & Context**: Personalized greeting, patient status tag, and glycemic stability indicators.
- **Biometric Summary Cards**:
  - Latest glucose reading with colored clinical range badges.
  - 14-day average glucose with estimated HbA1c ($eA1C$).
  - Time in Range (TIR %) visual progression bar (Low, In Range, High).
  - Daily medication adherence percentage.
- **Quick Action Modules**: One-click shortcuts to log glucose, record meals, schedule reminders, and open clinical reports.
- **Target Distribution Alignment**: Interactive ADA clinical target range comparison.
- **Live Activity Feed**: Real-time unified timeline of recent glucose logs, meals, and completed medications.

### 2. 🩸 Glucose Tracker & Trend Curve
- **Capillary & CGM Entry Form**:
  - Glucose value (mg/dL) with instant live classification:
    - Low / Hypoglycemia: `< 70 mg/dL`
    - Fasting Target: `70 - 130 mg/dL`
    - Post-Meal Target: `70 - 180 mg/dL`
    - High / Hyperglycemia: `> 180 mg/dL`
  - Measurement contexts: Fasting, Before/After Breakfast, Before/After Lunch, Before/After Dinner, Bedtime, Random.
  - Date & time pickers, symptoms/context notes.
- **Interactive SVG Glucose Trend Curve**:
  - Interactive plot showing glycemic readings over time.
  - Soft-shaded green/teal target band ($70 - 140\text{ mg/dL}$).
  - 180 mg/dL and 70 mg/dL clinical threshold guideline lines.
  - Data points colored by classification (Teal for normal, Amber for low, Rose for high).
  - Clickable points showing exact details and timestamps.
  - Period filters: Last 7 Days, Last 14 Days, All.
- **Reading History Table**:
  - Filter by reading type (All, Fasting, Post-Meal, Low, High).
  - Date, time, value, status badges, notes, and delete actions.

### 3. 🥗 Nutritional Food Diary
- **Meal Entry Form**:
  - Category selector: Breakfast 🥐, Lunch 🥗, Dinner 🍲, Snack 🍎.
  - Detailed food description & ingredient logging.
  - Estimated carbohydrate grams with daily budget tracking.
  - Glycemic Index (GI) classification (Low, Medium, High).
- **Nutritional Insights**:
  - Daily carbohydrate budget meter (compared against ~130g target).
  - Low GI meal ratio indicator.
  - ADA Diabetes Plate Method visual guide ($1/2$ non-starchy vegetables, $1/4$ lean protein, $1/4$ complex carbohydrates).
- **Meal History Table**:
  - Filter by meal type with carb badges and glycemic tags.

### 4. 💊 Reminders & Medication Adherence
- **Schedule Reminder Form**:
  - Prescriptions, vitals checks, physical activity, and hydration reminders.
  - Dosage and clinical instructions (e.g., "Take with food to avoid GI upset").
  - Reminder time and custom frequency (Daily with meals, Twice daily, Every 2 days, etc.).
- **Interactive Daily Adherence**:
  - One-click completion checkboxes.
  - Visual strikethrough, glowing emerald badges, and celebratory notifications.
  - Real-time today's adherence score ($0 - 100\%$).
  - Medication safety guardrails.

### 5. 📑 Clinical Health Reports
- **Multi-Period Analytics** (7 Days, 14 Days, 30 Days):
  - **Estimated HbA1c ($eA1C$)** using the Nathan formula: $\frac{\text{Avg Glucose} + 46.7}{28.7}$.
  - **Glucose Variability (Standard Deviation)**: $\pm\text{SD}$ in mg/dL.
  - **Time in Range (TIR)** breakdown percentages: In Target ($70 - 140\text{ mg/dL}$), Low ($< 70$), High ($> 140$).
  - Fasting vs Post-meal averages.
- **Daily Average Glucose Comparison Bar Chart**:
  - Visual comparison of daily means against the $140\text{ mg/dL}$ ceiling.
- **Doctor Consultation Preparation Sheet**:
  - Record symptoms, observations, and questions for upcoming endocrinologist appointments.
  - High-priority tagging.
- **Print / Export Summary**:
  - Formatted print stylesheet (`window.print()`) that creates a clean, doctor-ready printed summary.

---

## 🛡️ Medical Safety & Clinical Guardrails

GlucoCare is engineered with strict adherence to healthcare software safety:
1. **No Medical Diagnoses**: The platform does not diagnose diabetes, metabolic syndrome, or related conditions.
2. **No Insulin Dosing Calculations**: The app explicitly never calculates, recommends, or modifies insulin units or medication dosages.
3. **No Treatment Alterations**: Users are warned never to adjust prescribed medications without direct clinical guidance.
4. **Hypoglycemia "Rule of 15" Protocol**: Integrated emergency protocol modal explaining the standard American Diabetes Association protocol for blood glucose below $70\text{ mg/dL}$.
5. **Prominent Disclaimers**: Displayed at the top of the interface, in footers, and on clinical reports.

---

## 💻 Tech Stack & Architecture

- **Frontend**: React 18, React-DOM
- **Styling**: Tailwind CSS (customized navy and teal healthcare palette), Google Fonts (Plus Jakarta Sans & Inter)
- **Icons**: Clean, standalone SVG icons (Activity, Droplet, Utensils, Bell, HeartPulse, ShieldAlert, etc.)
- **State Management**: Reactive React Hooks with persistent browser `localStorage` synchronization
- **Testing & Tooling**: Zero external build dependencies required for local execution; fully compatible with Vite, GitHub, and Vercel.

---

## 🚀 Running the Application

### Option A: Instant Launcher (Windows)
Double-click `start.bat` in the project folder. It will launch the local development server and serve the application at:
```
http://localhost:3000
```

### Option B: Node.js Dev Server
```bash
node server.js
```
Then open [http://localhost:3000](http://localhost:3000) in any web browser.

### Option C: Standard Vite Workflow (with npm)
```bash
npm install
npm run dev
```

---

## ☁️ Deployment to Vercel

1. Push this repository to GitHub.
2. In the Vercel Dashboard, click **New Project** and select this repository.
3. Vercel will automatically detect `vercel.json` and deploy either via Vite or static output.
4. Your application will be live with a secure HTTPS URL.

---

## 📄 License
MIT License. Created for demonstration and personal healthcare management.
