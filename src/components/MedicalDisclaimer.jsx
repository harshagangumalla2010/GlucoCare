import React, { useState } from 'react';
import { ShieldAlert, X, Info } from './Icons';

export function MedicalDisclaimerBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span>GlucoCare Patient Portal — Personal Logging Tool</span>
        </div>
        <button 
          onClick={() => setIsDismissed(false)} 
          className="text-teal-400 hover:text-teal-300 underline font-medium text-xs ml-2 cursor-pointer"
        >
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
            <ShieldAlert className="w-4 h-4" />
          </div>
          <p className="text-slate-200 leading-relaxed">
            <strong className="text-teal-300 font-semibold uppercase tracking-wider text-[11px] mr-1.5">
              Medical Safety Notice:
            </strong>
            GlucoCare is an informational tracking tool and does not provide clinical diagnoses, recommend insulin doses, or alter treatment regimens. 
            Always consult your qualified healthcare provider or endocrinologist before making any medication, dietary, or insulin therapy changes.
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          title="Minimize Disclaimer"
          aria-label="Minimize Disclaimer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}

export function MedicalSafetyCard() {
  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
      <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
        <Info className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-amber-950">Patient Safety & Clinical Boundary</h4>
        <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
          This system records self-reported biometric values for personal trend awareness. 
          Target ranges (Fasting: 70–130 mg/dL, Post-meal: &lt;180 mg/dL) reflect standard ADA non-pregnant adult guidelines, 
          but your personalized targets should always be determined by your physician.
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] font-medium text-amber-800">
          <span className="bg-amber-100/80 px-2.5 py-1 rounded-full">• Never self-adjust insulin dosing</span>
          <span className="bg-amber-100/80 px-2.5 py-1 rounded-full">• Not a diagnostic device</span>
          <span className="bg-amber-100/80 px-2.5 py-1 rounded-full">• For emergencies call 911 / 112</span>
        </div>
      </div>
    </div>
  );
}
