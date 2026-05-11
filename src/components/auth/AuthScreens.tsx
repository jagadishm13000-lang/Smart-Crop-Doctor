import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogIn, 
  Phone, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Smartphone,
  Sprout,
  ShieldCheck,
  Languages
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬಿ' },
];

export default function AuthScreens() {
  const { user, login, isOnboarded, completeOnboarding, setLanguage, language: currentLang } = useAuth();
  const { t } = useTranslation();
  const [view, setView] = useState<'login' | 'otp' | 'onboarding'>(
    user ? 'onboarding' : 'login'
  );
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Logic to handle "routing" through internal states if they haven't finished onboarding
  React.useEffect(() => {
    if (user && !isOnboarded) {
      setView('onboarding');
    }
  }, [user, isOnboarded]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login({
        name: "Darshan 🌱",
        email: "darshan.demo@gmail.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Darshan"
      });
      setIsLoading(false);
      setView('onboarding');
    }, 1500);
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError("Please enter a valid 10-digit number");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('otp');
      setError(null);
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "1234") {
      setIsLoading(true);
      setTimeout(() => {
        login({
          name: "Farmer Friend",
          phone: phoneNumber
        });
        setIsLoading(false);
        setView('onboarding');
      }, 1000);
    } else {
      setError("Invalid OTP. For demo purposes use 1234");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.05)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-64 -left-64 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-64 -right-64 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full" 
        />
      </div>

      <AnimatePresence mode="wait">
        {view === 'login' && (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-md glass rounded-[40px] p-10 border-white/5 relative z-10 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center mb-10">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center text-slate-950 mb-6 shadow-[0_0_40px_-5px_rgba(34,211,238,0.4)]"
              >
                <Sprout size={40} />
              </motion.div>
              <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Smart Crop Doctor</h1>
              <p className="text-slate-500 text-sm font-medium tracking-wide uppercase">AI Powered Agriculture</p>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-4 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-white group"
              >
                {isLoading ? <Loader2 className="animate-spin text-cyan-400" /> : (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                    <Smartphone size={18} />
                  </div>
                  <input 
                    type="tel"
                    placeholder="Enter Mobile Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                  />
                </div>
                {error && <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl text-slate-950 font-black uppercase tracking-widest hover:shadow-[0_10px_30px_-5px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Send OTP <ArrowRight size={18} /></>}
                </button>
              </form>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2 text-slate-600">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">SECURE DEMO MODE ACTIVE</span>
            </div>
          </motion.div>
        )}

        {view === 'otp' && (
          <motion.div 
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md glass rounded-[40px] p-10 border-white/5 relative z-10 shadow-2xl"
          >
            <button 
               onClick={() => setView('login')}
               className="mb-8 text-slate-500 hover:text-white flex items-center gap-2 text-xs font-bold transition-colors"
            >
               <ArrowRight size={14} className="rotate-180" /> Back to login
            </button>

            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic mb-2">Verify Phone</h2>
              <p className="text-slate-500 text-sm font-medium">OTP sent to +91 {phoneNumber}</p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-8">
              <div className="flex justify-center gap-4">
                <input 
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 text-center text-3xl font-black tracking-[1em] text-cyan-400 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
              
              {error && <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>}

              <div className="space-y-4">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl text-slate-950 font-black uppercase tracking-widest hover:shadow-[0_10px_30px_-5px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Verify & Continue <CheckCircle2 size={18} /></>}
                </button>
                <button type="button" className="w-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Resend OTP in 30s</button>
              </div>
            </form>
          </motion.div>
        )}

        {view === 'onboarding' && (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl glass rounded-[40px] p-10 border-white/5 relative z-10 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
            
            <div className="flex flex-col items-center text-center mb-12">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 mb-4">
                  <Languages size={24} />
               </div>
               <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Choose Your Language</h2>
               <p className="text-slate-500 font-medium">{t('onboarding_subtitle')}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`relative p-6 rounded-3xl border transition-all group overflow-hidden ${
                    currentLang === lang.code 
                    ? 'bg-cyan-500/10 border-cyan-500 text-white' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {currentLang === lang.code && (
                    <motion.div layoutId="activeLang" className="absolute inset-0 bg-cyan-500/20 blur-xl" />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <span className="text-xl font-black italic">{lang.native}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">{lang.name}</span>
                  </div>
                  {currentLang === lang.code && (
                    <div className="absolute top-3 right-3 text-cyan-400">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button 
                onClick={completeOnboarding}
                className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl text-slate-950 font-black uppercase tracking-widest shadow-[0_20px_50px_-10px_rgba(34,211,238,0.5)] hover:bg-white transition-all flex items-center gap-3 group"
              >
                Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
