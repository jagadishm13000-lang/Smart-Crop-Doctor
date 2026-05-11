import React from "react";
import { motion } from "motion/react";
import { TreeDeciduous, Droplets, FlaskConical, Users } from "lucide-react";

const stats = [
  { label: "Crop Loss Reduction", value: "85", suffix: "%", icon: <TreeDeciduous className="text-emerald-400" /> },
  { label: "Water Conversation", value: "1.2", suffix: "M Ltr", icon: <Droplets className="text-cyan-400" /> },
  { label: "Pesticide Reduction", value: "40", suffix: "%", icon: <FlaskConical className="text-amber-400" /> },
  { label: "Empowered Farmers", value: "24", suffix: "K+", icon: <Users className="text-indigo-400" /> },
];

export default function Sustainability() {
  return (
    <section className="py-32 px-6 bg-emerald-500/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">
                Grow More. <br />
                <span className="text-emerald-400">Waste Less.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                Sustainability is at the core of Smart Crop Doctor. By optimizing pesticide use 
                and detecting diseases early, we help farmers minimize environmental impact 
                while maximizing food security for future generations.
            </p>

            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white flex items-baseline gap-1">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative"
          >
             <div className="absolute -inset-4 bg-emerald-500/10 rounded-[40px] blur-2xl"></div>
             <div className="relative bg-slate-900/50 border border-white/5 rounded-[40px] p-8 overflow-hidden">
                <div className="aspect-[4/5] bg-gradient-to-br from-slate-800 to-slate-950 rounded-[32px] p-6 relative flex flex-col justify-end">
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="px-2 py-1 bg-emerald-400 text-slate-950 text-[10px] font-black rounded tracking-widest uppercase">Direct Impact</div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Sustainable Ecosystem</h3>
                        <p className="text-slate-400 text-sm italic">
                            Every scan contributes to a global map of plant health, enabling automated 
                            biosecurity alerts and eco-friendly treatment distribution.
                        </p>
                    </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
