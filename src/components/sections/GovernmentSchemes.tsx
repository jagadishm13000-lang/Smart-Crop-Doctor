import React from "react";
import { Landmark, ExternalLink, ShieldCheck, Calendar, Bell, Info } from "lucide-react";
import { motion } from "motion/react";

interface Scheme {
  id: string;
  title: string;
  description: string;
  ministry: string;
  link: string;
  category: string;
  updated: string;
  isOfficial: boolean;
}

const SCHEMES: Scheme[] = [
  {
    id: "pib-agri",
    title: "Press Information Bureau – Agriculture Scheme Announcement",
    description: "Official repository for the latest agriculture sector government announcements, policy updates, and subsidy releases.",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    link: "https://share.google/GSTYZx1SUkSZD9sRC",
    category: "Announcements",
    updated: "May 2026",
    isOfficial: true
  },
  {
    id: "pm-kisan",
    title: "PM-Kisan Samman Nidhi",
    description: "Direct income support of ₹6,000 per year to all landholding farmer families across the country.",
    ministry: "Government of India",
    link: "https://pmkisan.gov.in/",
    category: "Direct Benefit",
    updated: "Active",
    isOfficial: true
  }
];

export default function GovernmentSchemes() {
  return (
    <section id="schemes" className="py-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Landmark size={20} />
            </div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Integrated Hub</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-4">
            Government <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">& Schemes</span>
          </h2>
          <p className="text-slate-500 max-w-2xl font-medium leading-relaxed">
            Direct access to verified agricultural resources, subsidies, and official notifications 
            curated for modern sustainable farming operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SCHEMES.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 rounded-[32px] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              
              <div className="relative h-full glass rounded-[32px] border border-white/5 p-8 flex flex-col hover:border-emerald-500/30 transition-all duration-500 overflow-hidden bg-slate-900/40 backdrop-blur-3xl">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 rotate-12 pointer-events-none group-hover:opacity-[0.07] transition-opacity">
                  <Landmark size={120} />
                </div>

                <div className="flex items-start justify-between mb-8">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      {scheme.category}
                    </span>
                    {scheme.isOfficial && (
                      <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                        <ShieldCheck size={10} />
                        Verified Source
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-black text-white mb-4 leading-tight group-hover:text-emerald-400 transition-colors">
                  {scheme.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                  {scheme.description}
                </p>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Bell size={10} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Ministry</span>
                      </div>
                      <div className="text-[10px] text-white font-bold truncate">{scheme.ministry}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Calendar size={10} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Last Update</span>
                      </div>
                      <div className="text-[10px] text-white font-bold">{scheme.updated}</div>
                    </div>
                  </div>

                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink size={14} strokeWidth={3} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Dynamic Placeholder Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-[32px] bg-white/[0.02] text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-slate-600 mb-6">
              <Info size={32} />
            </div>
            <h4 className="text-lg font-black text-white/40 italic mb-2">Expanding Database...</h4>
            <p className="text-slate-600 text-xs font-medium max-w-[200px]">
              Our AI is currently indexing more regional and specialized schemes. 
              Stay connected for updates.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
