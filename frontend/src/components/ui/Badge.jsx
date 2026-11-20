import React from 'react';

const VARIANTS = {
  sell: 'bg-indigo-subtle text-indigo-DEFAULT border-indigo',
  rent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  defect: 'bg-amber-50 text-amber-700 border-amber-200',
  hostel: 'bg-purple-50 text-purple-700 border-purple-200',
  condition: 'bg-sky-50 text-sky-700 border-sky-200',
  default: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  const styles = VARIANTS[variant] || VARIANTS.default;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles} ${className}`}
    >
      {children}
    </span>
  );
}
