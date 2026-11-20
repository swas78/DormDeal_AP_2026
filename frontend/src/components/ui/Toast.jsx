import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in
    const show = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 3500);
    return () => {
      cancelAnimationFrame(show);
      clearTimeout(timer);
    };
  }, [onDismiss]);

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300
        ${isSuccess ? 'bg-white border-emerald-200 text-emerald-800' : 'bg-white border-red-200 text-red-800'}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {isSuccess ? (
        <CheckCircle size={18} className="text-emerald-500 shrink-0" />
      ) : (
        <XCircle size={18} className="text-red-500 shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
        className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
