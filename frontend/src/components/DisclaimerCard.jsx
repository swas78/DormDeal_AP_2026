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
      text: 'DormDeal acts only as a peer platform connecting student buyers, lenders, and sellers within our university community.',
    },
    {
      id: 2,
      icon: FileCheck,
      text: 'Users are responsible for verifying the condition and authenticity of products physically before concluding any purchase or rental.',
    },
    {
      id: 3,
      icon: MapPin,
      text: 'Always meet in safe and public university locations (such as the Central Library, Cafeteria, or Student Activity Center) for handovers.',
    },
    {
      id: 4,
      icon: Lock,
      text: 'Do not share passwords, OTPs or sensitive personal information with anyone on or off the platform.',
    },
    {
      id: 5,
      icon: AlertTriangle,
      text: 'Avoid suspicious transactions, requests for unverified advance wire transfers, and fraudulent or misleading listings.',
    },
    {
      id: 6,
      icon: ShieldAlert,
      text: 'DormDeal does not process online payments and is not liable for private cash/UPI disputes between students.',
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
    <div className="bg-white rounded-3xl border-2 border-[#1c1c1d] shadow-sharp overflow-hidden max-w-3xl w-full mx-auto">
      {/* Header Banner */}
      <div className="bg-[#1c1c1d] p-6 sm:p-8 text-[#FFFDF8] border-b border-[#1c1c1d]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
            Official Campus Safety Protocols
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Welcome to DormDeal!
        </h2>
        <p className="mt-2 text-sm text-stone-300 leading-relaxed max-w-2xl">
          DormDeal is an online marketplace created exclusively for university students to buy, sell, and rent second-hand items within their campus community.
        </p>
      </div>

      {/* Guidelines Content */}
      <div className="p-6 sm:p-8 space-y-6 bg-[#FFFDF8]">
        <div>
          <h3 className="text-base font-bold text-[#1c1c1d] flex items-center gap-2">
            <span>Please review these campus trading guidelines:</span>
          </h3>
          <p className="text-xs text-[#464649] mt-1">
            As a verified student member, your adherence to these principles keeps our campus marketplace safe and reliable.
          </p>
        </div>

        {/* 8 Numbered Guidelines */}
        <div className="space-y-3.5 divide-y divide-[#1c1c1d]/10">
          {guidelines.map((item) => (
            <div key={item.id} className="pt-3.5 first:pt-0 flex items-start gap-3.5 group">
              <div className="w-7 h-7 rounded-lg bg-[#FFF9EE] border border-[#1c1c1d]/20 flex-shrink-0 flex items-center justify-center text-[#1c1c1d] font-bold text-xs group-hover:bg-[#1c1c1d] group-hover:text-white transition-colors">
                {item.id}
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-[#1c1c1d] leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Checkbox agreement & Submit */}
        <form onSubmit={handleSubmit} className="pt-4 border-t border-[#1c1c1d]/15 space-y-4">
          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFF9EE] border border-[#1c1c1d]/30 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[#1c1c1d] text-[#1c1c1d] focus:ring-[#1c1c1d] cursor-pointer"
            />
            <span className="text-xs font-bold text-[#1c1c1d] leading-normal select-none">
              I have read, understood, and agree to adhere strictly to the DormDeal safety guidelines and university code of conduct.
            </span>
          </label>

          <button
            type="submit"
            disabled={!agreed || loading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-sm font-bold shadow-sharp hover:shadow-sharp-lg active:translate-x-0.5 active:translate-y-0.5 border border-[#1c1c1d] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Recording acceptance...</span>
            ) : (
              <>
                <span>Accept Guidelines & Enter DormDeal</span>
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
