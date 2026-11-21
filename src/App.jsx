import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { GlucoseTracker } from './components/GlucoseTracker';
import { FoodDiary } from './components/FoodDiary';
import { Reminders } from './components/Reminders';
import { HealthReports } from './components/HealthReports';
import { QuickLogModal } from './components/QuickLogModal';
import { EmergencyModal } from './components/EmergencyModal';
import { ToastContainer } from './components/Toast';
import { MedicalDisclaimerBanner } from './components/MedicalDisclaimer';
import {
  INITIAL_PATIENT_PROFILE,
  INITIAL_GLUCOSE_READINGS,
  INITIAL_MEALS,
  INITIAL_REMINDERS,
  INITIAL_HEALTH_NOTES
} from './data/initialData';
import {
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
  generateId
} from './utils/helpers';

export function App() {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Data State with LocalStorage Persistence
  const [patientProfile, setPatientProfile] = useState(() =>
    loadFromStorage(STORAGE_KEYS.PROFILE, INITIAL_PATIENT_PROFILE)
  );
  const [glucoseReadings, setGlucoseReadings] = useState(() =>
    loadFromStorage(STORAGE_KEYS.GLUCOSE, INITIAL_GLUCOSE_READINGS)
  );
  const [meals, setMeals] = useState(() =>
    loadFromStorage(STORAGE_KEYS.MEALS, INITIAL_MEALS)
  );
  const [reminders, setReminders] = useState(() =>
    loadFromStorage(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS)
  );
  const [notes, setNotes] = useState(() =>
    loadFromStorage(STORAGE_KEYS.NOTES, INITIAL_HEALTH_NOTES)
  );

  // Sync state changes to LocalStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GLUCOSE, glucoseReadings);
  }, [glucoseReadings]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MEALS, meals);
  }, [meals]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.REMINDERS, reminders);
  }, [reminders]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTES, notes);
  }, [notes]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROFILE, patientProfile);
  }, [patientProfile]);

  // Toast Notification Helper
  const addToast = (title, message, type = 'success') => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Glucose Handlers
  const handleAddGlucoseReading = (newReading) => {
    setGlucoseReadings((prev) => [newReading, ...prev]);
    addToast(
      'Glucose Reading Saved',
      `Logged ${newReading.value} mg/dL (${newReading.type}) into your health record.`,
      'success'
    );
  };

  const handleDeleteGlucoseReading = (id) => {
    setGlucoseReadings((prev) => prev.filter((r) => r.id !== id));
    addToast('Reading Removed', 'The glucose entry has been deleted.', 'warning');
  };

  // Meal Handlers
  const handleAddMeal = (newMeal) => {
    setMeals((prev) => [newMeal, ...prev]);
    addToast(
      'Meal Logged Successfully',
      `Added ${newMeal.mealType} (${newMeal.carbsGrams}g carbs) to your food diary.`,
      'success'
    );
  };

  const handleDeleteMeal = (id) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    addToast('Meal Record Removed', 'The food record has been deleted.', 'warning');
  };

  // Reminder Handlers
  const handleAddReminder = (newReminder) => {
    setReminders((prev) => [newReminder, ...prev]);
    addToast(
      'Reminder Added',
      `Scheduled ${newReminder.name} for ${newReminder.time}.`,
      'success'
    );
  };

  const handleToggleReminder = (id) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.completedToday;
          if (nextState) {
            addToast('Routine Completed!', `Marked ${r.name} as taken for today.`, 'success');
          }
          return {
            ...r,
            completedToday: nextState,
            lastCompletedDate: nextState ? new Date().toISOString().slice(0, 10) : r.lastCompletedDate
          };
        }
        return r;
      })
    );
  };

  const handleDeleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    addToast('Reminder Removed', 'Scheduled reminder removed from daily list.', 'warning');
  };

  // Health Notes Handlers
  const handleAddNote = (newNote) => {
    setNotes((prev) => [newNote, ...prev]);
    addToast('Clinical Note Saved', 'Observation added to your doctor consultation prep sheet.', 'success');
  };

  const handleDeleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    addToast('Note Deleted', 'Clinical note removed from records.', 'warning');
  };

  // Reset Demo Data
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

  // Pending reminders count
  const pendingReminders = reminders.filter((r) => !r.completedToday).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Clinical Safety Disclaimer Banner */}
      <MedicalDisclaimerBanner />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onResetDemoData={handleResetDemoData}
          unreadRemindersCount={pendingReminders}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
          {/* Header */}
          <Header
            activeTab={activeTab}
            onOpenMobileSidebar={() => setIsMobileOpen(true)}
            onOpenQuickLog={() => setIsQuickLogOpen(true)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            patientProfile={patientProfile}
          />

          {/* Dynamic Tab View Container */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard
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
              <GlucoseTracker
                glucoseReadings={glucoseReadings}
                onAddReading={handleAddGlucoseReading}
                onDeleteReading={handleDeleteGlucoseReading}
              />
            )}

            {activeTab === 'food' && (
              <FoodDiary
                meals={meals}
                onAddMeal={handleAddMeal}
                onDeleteMeal={handleDeleteMeal}
              />
            )}

            {activeTab === 'reminders' && (
              <Reminders
                reminders={reminders}
                onAddReminder={handleAddReminder}
                onToggleReminder={handleToggleReminder}
                onDeleteReminder={handleDeleteReminder}
              />
            )}

            {activeTab === 'reports' && (
              <HealthReports
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

          {/* Modern Footer */}
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

      {/* Modals & Toasts */}
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

export default App;
