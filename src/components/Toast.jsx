import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from './Icons';

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 flex items-start gap-3 p-4 rounded-xl shadow-xl border bg-white ${
              isSuccess
                ? 'border-teal-200 shadow-teal-500/10'
                : isError
                ? 'border-rose-200 shadow-rose-500/10'
                : 'border-amber-200 shadow-amber-500/10'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
              isSuccess
                ? 'bg-teal-50 text-teal-600'
                : isError
                ? 'bg-rose-50 text-rose-600'
                : 'bg-amber-50 text-amber-600'
            }`}>
              {isSuccess && <CheckCircle2 className="w-5 h-5" />}
              {isError && <AlertCircle className="w-5 h-5" />}
              {isWarning && <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-slate-900 leading-tight">
                {toast.title || (isSuccess ? 'Success' : 'Notice')}
              </h5>
              <p className="text-xs text-slate-600 mt-1 leading-normal">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
