import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Play, Cpu, Globe, Leaf } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppModule } from "../../types.ts";

export default function Hero({ onOpenModule }: { onOpenModule: (module: AppModule) => void }) {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Next Gen AI Diagnosis
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter italic">
            Smart Crop <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Doctor
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed max-w-xl font-medium">
            {t('slogan')}
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#scanner"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl flex items-center gap-2 group transition-all"
            >
              {t('scanner_mode')}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </a>
            <a
              href="https://www.youtube.com/watch?v=Vauqyn1WJMU"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-900/50 hover:bg-slate-800 text-white font-bold rounded-2xl border border-white/10 flex items-center gap-2 transition-all group hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:border-white/20"
            >
              <Play size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" />
              Watch Demo
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative lg:block hidden"
        >
          <div className="absolute -inset-10 bg-emerald-500/20 blur-[120px] rounded-full"></div>
          {/* Holographic UI Elements */}
          <div className="relative">
             <div 
              onClick={() => onOpenModule("scanner")}
              className="absolute -top-10 -left-10 p-6 glass rounded-3xl shadow-2xl animate-float cursor-pointer hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all z-20 group"
             >
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 shadow-[0_0_15px_rgba(74,222,128,0.3)] group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Cpu size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Processing</p>
                        <p className="text-white font-bold tracking-tight">AI Diagnostics</p>
                    </div>
                 </div>
             </div>

             <div className="absolute -bottom-10 -right-10 p-6 glass rounded-3xl shadow-2xl animate-float [animation-delay:1s]">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                        <Globe size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global</p>
                        <p className="text-white font-bold tracking-tight">Satellite Sync</p>
                    </div>
                 </div>
             </div>

             <div className="p-12 glass rounded-[40px] backdrop-blur-3xl flex items-center justify-center h-[500px] w-full relative group">
                <Leaf className="text-emerald-500 opacity-20 w-64 h-64 absolute" />
                <div className="relative z-10 text-center">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-80 h-80 border-4 border-dashed border-emerald-500/10 rounded-full flex items-center justify-center"
                    >
                        <div className="w-64 h-64 border-2 border-emerald-500/20 rounded-full p-8">
                             <div className="w-full h-full border border-emerald-500/30 rounded-full animate-pulse" />
                        </div>
                    </motion.div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
