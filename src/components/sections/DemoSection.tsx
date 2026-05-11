import React from "react";
import { motion } from "motion/react";
import { Play, TrendingUp, Monitor, Sparkles } from "lucide-react";

export default function DemoSection() {
  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -right-20 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4"
          >
            <Sparkles size={12} />
            System Walkthrough
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-6"
          >
            Watch Our AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">in Action</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 font-bold text-lg max-w-2xl mx-auto leading-relaxed"
          >
            See how Smart Crop Doctor uses AI to identify crop diseases instantly from a single leaf image 
            and provide intelligent farming recommendations.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          {/* Decorative Frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/50 to-cyan-500/50 rounded-[40px] blur opacity-25 group-hover:opacity-40 transition-opacity" />
          
          <div className="relative glass rounded-[40px] border-white/10 overflow-hidden shadow-2xl backdrop-blur-3xl aspect-video w-full max-w-5xl mx-auto">
            {/* Top Bar Decoration */}
            <div className="absolute top-0 inset-x-0 h-12 border-b border-white/5 bg-white/5 flex items-center justify-between px-6 z-20">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/40" />
                 <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                 <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                     <TrendingUp size={12} className="text-emerald-400" />
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Neural Link Active</span>
                  </div>
                  <Monitor size={14} className="text-white/20" />
               </div>
            </div>

            <iframe 
               src="https://www.youtube.com/embed/Vauqyn1WJMU?autoplay=0&rel=0&modestbranding=1" 
               title="Smart Crop Doctor Demo"
               className="w-full h-full pt-12 border-0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen
            />
          </div>

          {/* Floating UI Elements for decoration */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-12 -right-6 hidden lg:block p-4 glass rounded-2xl border-white/10"
          >
             <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                   <Play size={16} fill="currentColor" />
                </div>
                <div className="pr-4">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Status</p>
                   <p className="text-xs font-black text-white">Live Demonstration</p>
                </div>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
