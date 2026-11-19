import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Lock,
  FileCheck,
  Building2,
  ArrowRight,
} from 'lucide-react';

const DisclaimerCard = ({ onAccept, loading }) => {
  const [agreed, setAgreed] = useState(false);

  const guidelines = [
    {
      id: 1,
      icon: Building2,
      text: 'CampusKart acts only as a platform connecting buyers and sellers within our university community.',
    },
    {
      id: 2,
      icon: FileCheck,
      text: 'Users are responsible for verifying the condition and authenticity of products before concluding any purchase.',
    },
    {
      id: 3,
      icon: MapPin,
      text: 'Always meet in safe and public university locations (such as the Central Library, Cafeteria, or Student Activity Center) when exchanging products.',
    },
    {
      id: 4,
      icon: Lock,
      text: 'Do not share passwords, OTPs or sensitive personal information with anyone on or off the platform.',
    },
    {
      id: 5,
      icon: AlertTriangle,
      text: 'Avoid suspicious transactions, requests for advance wire transfers, and fraudulent or misleading listings.',
    },
    {
      id: 6,
      icon: ShieldAlert,
      text: 'CampusKart is not responsible for disputes between buyers and sellers regarding item performance or private agreements.',
    },
    {
      id: 7,
      icon: ShieldCheck,
      text: 'Users must provide accurate university registration information, enrollment credentials, and maintain civil communication.',
    },
    {
      id: 8,
      icon: AlertTriangle,
      text: 'Any fraudulent, misleading, or inappropriate activity will be reported to campus authorities and may result in immediate account suspension.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreed && onAccept) {
      onAccept();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl overflow-hidden max-w-3xl w-full mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111827] via-[#1E1B4B] to-[#4F46E5] p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6 text-[#818CF8]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
            Official Campus Safety Protocols
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Welcome to CampusKart!
        </h2>
        <p className="mt-2 text-sm text-indigo-100/90 leading-relaxed max-w-2xl">
          CampusKart is an online marketplace created exclusively for university students to buy and sell products within their campus community.
        </p>
      </div>

      {/* Guidelines Content */}
      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#4F46E5] flex items-center gap-2">
            <span>Please read these guidelines carefully:</span>
          </h3>
          <p className="text-xs text-[#6B7280] mt-1">
            As a verified student member, your adherence to these campus trading principles keeps our student marketplace secure and trustful.
          </p>
        </div>

        {/* 8 Numbered Guidelines */}
        <div className="space-y-3.5 divide-y divide-gray-100">
          {guidelines.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="pt-3.5 first:pt-0 flex items-start gap-3.5 group">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex-shrink-0 flex items-center justify-center text-[#4F46E5] font-bold text-xs group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                  {item.id}
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-[#111827] leading-relaxed font-normal">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing Notice */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#111827] leading-relaxed">
            <strong className="font-semibold text-[#4F46E5]">Important Notice: </strong>
            By continuing, you acknowledge and agree to these guidelines. You confirm that you will conduct all product inspections in person within university grounds.
          </p>
        </div>

        {/* Agreement Form */}
        <form onSubmit={handleSubmit} className="pt-4 border-t border-[#E5E7EB] space-y-5">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-[#111827] group-hover:text-[#4F46E5] select-none">
              I have thoroughly read, understood, and solemnly agree to comply with the <strong>CampusKart University Marketplace Safety & Trading Guidelines</strong>.
            </span>
          </label>

          <button
            type="submit"
            disabled={!agreed || loading}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 ${
              agreed && !loading
                ? 'bg-[#4F46E5] hover:bg-[#4338CA] text-white active:scale-98 shadow-indigo-100 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span>Recording your acceptance...</span>
            ) : (
              <>
                <span>Accept & Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DisclaimerCard;

