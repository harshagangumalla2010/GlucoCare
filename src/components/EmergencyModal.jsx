import React from 'react';
import { Phone, ShieldAlert, X, HeartPulse, CheckCircle2 } from './Icons';

export function EmergencyModal({ isOpen, onClose, patientProfile }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog" 
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-navy-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-teal-400 text-xs font-bold tracking-wider uppercase">Medical Quick Response</span>
              <h3 className="text-xl font-bold text-white">Emergency & Care Protocol</h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Immediate Action Notice */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-950">Severe Emergency Assistance</h4>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                If the patient is unconscious, confused, unable to swallow, or experiencing severe distress, do not give liquids or food. 
                Call emergency dispatch immediately.
              </p>
              <div className="mt-2.5">
                <a 
                  href="tel:911" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Emergency (911)
                </a>
              </div>
            </div>
          </div>

          {/* Hypoglycemia Rule of 15 Protocol */}
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
                <span>Once normalized (&gt; 70 mg/dL), eat a small snack with protein & complex carbs to prevent rebound drops.</span>
              </li>
            </ol>
          </div>

          {/* Key Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Care Team</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <span className="text-[10px] font-bold text-teal-600 uppercase">Endocrinologist</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{patientProfile?.physician?.name}</p>
                <p className="text-xs text-slate-500">{patientProfile?.physician?.clinic}</p>
                <a 
                  href={`tel:${patientProfile?.physician?.phone}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 hover:text-teal-600"
                >
                  <Phone className="w-3.5 h-3.5" /> {patientProfile?.physician?.phone}
                </a>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <span className="text-[10px] font-bold text-navy-600 uppercase">Emergency Contact</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{patientProfile?.emergencyContact?.name}</p>
                <p className="text-xs text-slate-500">{patientProfile?.emergencyContact?.relation}</p>
                <a 
                  href={`tel:${patientProfile?.emergencyContact?.phone}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 hover:text-teal-600"
                >
                  <Phone className="w-3.5 h-3.5" /> {patientProfile?.emergencyContact?.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            Close Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
