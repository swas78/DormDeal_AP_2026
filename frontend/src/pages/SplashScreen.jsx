import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Flame,
  Tag,
  Repeat,
  Radio,
  Clock,
  Compass,
  Star,
  Users,
} from 'lucide-react';

const FUNNY_LOAD_STEPS = [
  'Waking up the roommates in Block B...',
  'Scanning campus common rooms for bargains...',
  'Inspecting scientific calculators & drafters...',
  'Verifying student enrollment IDs...',
  'Unlocking 1-click WhatsApp hostel handovers...',
  'Syncing live campus broadcasts...',
  'All deals verified! Launching DormDeal...',
];

const TICKER_ITEMS = [
  '🔥 Casio FX-991CW Calculator listed in Block B',
  '⚡ Placement Blazer rented for 2-day placement drive',
  '📚 Microeconomics Handwritten Notes available',
  '🚲 Decathlon Rockrider Cycle posted in Block A',
  '☕ Prestige Induction Kettle rented in Room 204',
  '📢 ISO: Room cooler wanted urgently before exams',
  '🛡️ 100% Verified Campus Students Only',
  '🤝 Zero Commission • Physical Handover • Cash/UPI',
];

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [particles, setParticles] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isLogoJumping, setIsLogoJumping] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');

  // Trigger sound-free tactile emoji particle explosion on logo click
  const triggerBurst = (e) => {
    setIsLogoJumping(true);
    setTimeout(() => setIsLogoJumping(false), 600);

    const burstEmojis = ['🎒', '⚡', '💸', '📚', '💻', '🤝', '🔥', '🎓', '✨', '☕'];
    const newParticles = [];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * 2 * Math.PI;
      const distance = 80 + Math.random() * 120;
      newParticles.push({
        id: Date.now() + i,
        emoji: burstEmojis[Math.floor(Math.random() * burstEmojis.length)],
        startX: centerX,
        startY: centerY,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        rotate: (Math.random() - 0.5) * 180,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 900);
  };

  // Progress Bar ticker
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 5;
        const currentStep = Math.min(
          Math.floor((next / 100) * FUNNY_LOAD_STEPS.length),
          FUNNY_LOAD_STEPS.length - 1
        );
        setStepIndex(currentStep);
        return next;
      });
    }, 140);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Navigate when 100% complete
  useEffect(() => {
    if (!loading && progress >= 100) {
      const timer = setTimeout(() => {
        handleProceed();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [loading, progress]);

  // Spacebar or Enter to jump straight in
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleProceed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, user, loading]);

  const handleProceed = () => {
    if (isAuthenticated) {
      if (user?.disclaimerAccepted) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/disclaimer', { replace: true });
      }
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FFFDF8] text-[#1c1c1d] flex flex-col justify-between overflow-hidden select-none bg-dot-pattern">
      {/* Soft warm ambient lighting layers */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FDF3E0] rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFF9EE] rounded-full blur-3xl opacity-80 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#FFF9EE]/50 rounded-full blur-3xl pointer-events-none" />

      {/* TOP MARQUEE TICKER (Infinite Campus Live Stream) */}
      <div className="relative z-30 w-full bg-[#1c1c1d] text-[#FFFDF8] py-2 overflow-hidden border-b-2 border-[#1c1c1d] shadow-sm">
        <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-bold tracking-tight">
          {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
            <span key={idx} className="mx-6 inline-flex items-center gap-2">
              <span>{item}</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
            </span>
          ))}
        </div>
      </div>

      {/* FLOATING RETRO CAMPUS STICKERS & BADGES (Animated around the screen) */}
      {/* 1. Top Left Badge */}
      <div className="hidden md:flex absolute top-16 left-8 lg:left-14 z-20 animate-float pointer-events-auto">
        <div className="bg-[#FFF9EE] border-2 border-[#1c1c1d] rounded-2xl px-4 py-2.5 shadow-sharp -rotate-6 hover:rotate-0 transition-transform duration-300 flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-[#1c1c1d] text-amber-300 flex items-center justify-center font-black text-sm">
            0%
          </div>
          <div className="text-left">
            <p className="text-[11px] font-black uppercase tracking-wider text-[#1c1c1d]">Zero Cut</p>
            <p className="text-[10px] text-[#464649] font-medium">100% Student Keeps Price</p>
          </div>
        </div>
      </div>

      {/* 2. Top Right Badge */}
      <div className="hidden md:flex absolute top-20 right-8 lg:right-16 z-20 animate-float-delayed pointer-events-auto">
        <div className="bg-white border-2 border-[#1c1c1d] rounded-2xl px-4 py-2.5 shadow-sharp rotate-6 hover:rotate-0 transition-transform duration-300 flex items-center gap-2.5 cursor-pointer">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-black tracking-tight text-[#1c1c1d]">Rishihood Enrolled</p>
            </div>
            <p className="text-[10px] text-[#464649] font-semibold">Strict ID Verification</p>
          </div>
        </div>
      </div>

      {/* 3. Bottom Left Sticker */}
      <div className="hidden lg:flex absolute bottom-28 left-12 z-20 animate-wiggle pointer-events-auto">
        <div className="bg-[#1c1c1d] text-white rounded-2xl px-4 py-3 shadow-[4px_4px_0px_#464649] rotate-3 hover:rotate-0 transition-transform flex items-center gap-3 cursor-pointer">
          <Zap className="w-5 h-5 text-amber-300 animate-bounce" />
          <div>
            <p className="text-xs font-black tracking-wide">1-Click WhatsApp</p>
            <p className="text-[10px] text-zinc-300">Instant Handover Chat</p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Right Sticker */}
      <div className="hidden lg:flex absolute bottom-28 right-12 z-20 animate-float pointer-events-auto">
        <div className="bg-[#FFF9EE] border-2 border-[#1c1c1d] rounded-2xl px-4 py-2.5 shadow-sharp -rotate-3 hover:rotate-0 transition-transform flex items-center gap-2.5 cursor-pointer">
          <Repeat className="w-5 h-5 text-[#1c1c1d]" />
          <div className="text-left">
            <p className="text-xs font-black uppercase text-[#1c1c1d]">Short-Term Rentals</p>
            <p className="text-[10px] text-[#464649]">Security Deposit Guarded</p>
          </div>
        </div>
      </div>

      {/* MAIN CENTERSTAGE KINETIC HERO */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-6 text-center max-w-4xl mx-auto w-full">
        {/* Campus Header Pill */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF9EE] border-2 border-[#1c1c1d] shadow-[2px_2px_0px_#1c1c1d] text-xs font-black uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Rishihood University • DormDeal 2026</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>

        {/* LOGO BOX WITH CRAZY ORBITING PARTICLES & BOUNCE */}
        <div className="relative mb-6">
          {/* Outer Pulsing Aura Ring */}
          <div className="absolute inset-0 -m-6 rounded-3xl border-2 border-dashed border-[#1c1c1d]/30 animate-spin-slow pointer-events-none" />

          {/* Interactive Logo Container */}
          <button
            onClick={triggerBurst}
            title="Click for a campus burst!"
            className={`group relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-[#1c1c1d] text-white border-3 border-[#1c1c1d] shadow-[8px_8px_0px_#464649] flex items-center justify-center transition-all duration-300 cursor-pointer hover:shadow-[12px_12px_0px_#1c1c1d] hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#1c1c1d] ${
              isLogoJumping ? 'scale-110 rotate-6' : ''
            }`}
          >
            <ShoppingBag className="w-14 h-14 sm:w-18 sm:h-18 text-[#FFFDF8] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -top-2 -right-2 bg-amber-400 text-[#1c1c1d] p-1.5 rounded-xl border-2 border-[#1c1c1d] shadow-sm animate-bounce">
              <Sparkles className="w-4 h-4" />
            </div>

            {/* Tap Hint */}
            <span className="absolute -bottom-7 text-[10px] font-black uppercase tracking-widest text-[#464649] opacity-75 group-hover:opacity-100 transition-opacity">
              Tap for burst!
            </span>
          </button>

          {/* Orbiting mini campus tags */}
          <div className="absolute -top-3 -left-6 bg-white border-2 border-[#1c1c1d] px-2.5 py-1 rounded-xl shadow-sharp text-[10px] font-black -rotate-12 pointer-events-none animate-pulse">
            BUY
          </div>
          <div className="absolute -bottom-3 -right-6 bg-[#FFF9EE] border-2 border-[#1c1c1d] px-2.5 py-1 rounded-xl shadow-sharp text-[10px] font-black rotate-12 pointer-events-none animate-pulse">
            RENT
          </div>
        </div>

        {/* TYPOGRAPHY TITLE */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.05em] leading-none mb-3 text-[#1c1c1d]">
          Dorm<span className="text-[#828288] underline decoration-4 decoration-amber-400 underline-offset-8">Deal</span>
        </h1>

        <p className="text-base sm:text-xl font-bold tracking-tight text-[#464649] max-w-xl mx-auto mb-2">
          Your Dorm. Your Deals. Zero Middlemen.
        </p>

        <p className="text-xs sm:text-sm text-[#464649]/90 max-w-md mx-auto mb-6 font-medium">
          Buy, rent, and borrow campus essentials, drafters, blazers, and kettles directly within your hostel block.
        </p>

        {/* ANIMATED NEO-BRUTALIST PROGRESS BAR & STAGE STEP */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="w-full max-w-md bg-white border-2 border-[#1c1c1d] rounded-2xl p-4 shadow-sharp mb-6 transition-all duration-200"
        >
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-[#1c1c1d]">
              <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span className="truncate">{FUNNY_LOAD_STEPS[stepIndex]}</span>
            </span>
            <span className="font-mono bg-[#FFF9EE] border border-[#1c1c1d] px-2 py-0.5 rounded-md text-[11px] font-black text-[#1c1c1d]">
              {progress}%
            </span>
          </div>

          {/* Segmented Progress Track */}
          <div className="h-3.5 w-full bg-[#FFF9EE] border-2 border-[#1c1c1d] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-[#1c1c1d] rounded-full transition-all duration-150 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Striped barber-pole animation inside progress */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,rgba(255,255,255,0.4)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0.4)_75%,transparent_75%,transparent)] bg-[length:16px_16px]" />
            </div>
          </div>

          <p className="text-[10px] text-[#464649] text-center mt-2 font-medium">
            {isPaused ? '⏸️ Auto-launch paused on hover' : '⚡ Auto-launching in a moment...'}
          </p>
        </div>

        {/* ACTION CTA ROW */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-md">
          <button
            onClick={handleProceed}
            className="flex-1 min-w-[200px] px-6 py-3.5 rounded-2xl bg-[#1c1c1d] hover:bg-[#2d2d30] text-[#FFFDF8] font-black text-sm border-2 border-[#1c1c1d] shadow-[4px_4px_0px_#464649] hover:shadow-[2px_2px_0px_#1c1c1d] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Enter Marketplace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <Link
            to="/login"
            className="px-5 py-3.5 rounded-2xl bg-[#FFF9EE] hover:bg-white text-[#1c1c1d] font-bold text-sm border-2 border-[#1c1c1d] shadow-sharp hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="px-5 py-3.5 rounded-2xl bg-white hover:bg-[#FFF9EE] text-[#1c1c1d] font-bold text-sm border-2 border-[#1c1c1d] shadow-sharp hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all"
          >
            New Student
          </Link>
        </div>

        {/* Keyboard shortcut footnote */}
        <p className="text-[11px] text-[#464649] mt-4 font-semibold">
          Pro-tip: Press <kbd className="px-1.5 py-0.5 bg-[#FFF9EE] border border-[#1c1c1d] rounded text-[10px] font-mono shadow-[1px_1px_0px_#1c1c1d]">SPACE</kbd> or <kbd className="px-1.5 py-0.5 bg-[#FFF9EE] border border-[#1c1c1d] rounded text-[10px] font-mono shadow-[1px_1px_0px_#1c1c1d]">ENTER</kbd> to jump straight in
        </p>
      </main>

      {/* DYNAMIC EMOJI BURST CONTAINER (Rendered on logo click) */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50 text-2xl transition-all duration-700 ease-out"
          style={{
            left: `${p.startX}px`,
            top: `${p.startY}px`,
            transform: `translate(${p.dx}px, ${p.dy}px) rotate(${p.rotate}deg)`,
            opacity: 0,
            animation: 'fade-out 0.8s forwards',
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* FOOTER BAR */}
      <footer className="relative z-20 py-3 px-4 border-t-2 border-[#1c1c1d] bg-[#FFF9EE] text-center text-xs font-bold text-[#464649] flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Hostel Blocks A, B, C Connected</span>
        </div>
        <div>
          <span>DormDeal &bull; Rishihood University Campus Second-Hand Marketplace &bull; 2026</span>
        </div>
        <div className="text-[11px] text-[#828288]">
          No Platform Fees &bull; Offline P2P Handover
        </div>
      </footer>
    </div>
  );
};

export default SplashScreen;
