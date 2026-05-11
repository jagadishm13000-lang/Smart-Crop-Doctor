import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Stethoscope, Globe, ChevronDown, LogOut, User, Menu, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬಿ' },
];

export default function Navbar() {
  const { user, logout, language, setLanguage } = useAuth();
  const { t } = useTranslation();
  const [showProfile, setShowProfile] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 inset-x-0 z-[100] p-6 lg:p-8 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        <a href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2.5 bg-emerald-500 rounded-2xl text-slate-950 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Stethoscope size={24} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">SmartCrop<span className="text-emerald-400 underline decoration-emerald-500/30 decoration-4 underline-offset-4">Doctor</span></span>
        </a>

        <div className="hidden lg:flex items-center gap-2 p-1.5 glass rounded-2xl shadow-2xl">
           {["Scanner", "Features", "Demo", "Dashboard", "Marketplace"].map((item) => (
             <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="px-6 py-2.5 text-sm font-black text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest"
             >
                {t(item.toLowerCase()) || item}
             </a>
           ))}
        </div>

        <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLanguage(!showLanguage)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <Globe size={14} className="text-cyan-400" />
                <span className="hidden sm:inline">{currentLangObj.native}</span>
                <ChevronDown size={14} className={`transition-transform ${showLanguage ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showLanguage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-3 w-48 glass rounded-2xl border border-white/10 p-2 shadow-2xl"
                  >
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLanguage(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${language === lang.code ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                      >
                        <span className="text-xs font-bold">{lang.native}</span>
                        <span className="text-[10px] opacity-40">{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 p-1 pr-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black overflow-hidden border border-white/10">
                  {user?.avatar ? <img src={user.avatar} alt="avatar" /> : <User size={18} />}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-[10px] font-black text-white uppercase tracking-tighter">{user?.name}</span>
                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Verified</span>
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-3 w-56 glass rounded-3xl border border-white/10 p-2 shadow-2xl"
                  >
                    <div className="px-5 py-4 border-b border-white/5 mb-2">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Signed in as</p>
                       <p className="text-xs font-bold text-white truncate">{user?.email || user?.phone}</p>
                    </div>
                    <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-bold">
                       <User size={16} /> Edit Profile
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-xs font-bold"
                    >
                       <LogOut size={16} /> Logout System
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </div>
      </div>
    </motion.nav>
  );
}
