import React from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { AppModule } from "../../types.ts";
import { 
  TrendingUp, 
  Activity, 
  Heart, 
  ShieldCheck, 
  Calendar,
  ChevronRight,
  ShoppingBag,
  ArrowRight
} from "lucide-react";

const recentReports = [
  { id: "REP-001", crop: "Tomatoes", status: "Healthy", date: "2 mins ago" },
  { id: "REP-002", crop: "Potatoes", status: "Infected", date: "1 hour ago" },
  { id: "REP-003", crop: "Apples", status: "At Risk", date: "3 hours ago" },
];

export default function Dashboard({ onOpenModule }: { onOpenModule: (module: AppModule) => void }) {
  const { t } = useTranslation();
  return (
    <section id="dashboard" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{t('dashboard')}</h2>
            <p className="text-slate-500 mt-2 font-medium">Real-time agricultural insights and analytics.</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 border border-white/5 rounded-2xl p-2 px-4 shadow-xl px-6">
             <Calendar className="text-emerald-400" size={18} />
             <span className="text-white text-xs font-black uppercase tracking-widest">May 9, 2026</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Stat Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "AI Accuracy", value: "98.4%", icon: <ShieldCheck />, color: "text-emerald-400", neon: "neon-text-cyan" },
                { label: "Detections", value: "1,280", icon: <Activity />, color: "text-cyan-400", neon: "" },
                { label: "Health Index", value: "A+", icon: <Heart />, color: "text-rose-400", neon: "" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-6 rounded-3xl"
                >
                  <div className={`mb-4 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <h4 className={`text-3xl font-black text-white tracking-tight ${stat.neon}`}>{stat.value}</h4>
                </motion.div>
              ))}
            </div>

            <div 
              onClick={() => onOpenModule("history")}
              className="glass rounded-[40px] p-8 h-[400px] flex items-center justify-center relative overflow-hidden group cursor-pointer border border-white/5 hover:border-emerald-500/20 transition-all"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
               <div className="text-center relative z-10">
                  <TrendingUp className="text-emerald-400 w-16 h-16 mx-auto mb-6 opacity-20 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white text-xl font-bold mb-2 tracking-tight">Health Analytics Visualization</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">Historical data analysis and trend prediction engine (Powered by ML).</p>
                  
                  {/* Decorative Chart placeholder */}
                  <div className="mt-12 flex items-baseline gap-2 justify-center h-20">
                     {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                       <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        className="w-8 bg-emerald-500/20 rounded-t-lg relative"
                       >
                         <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: '30%' }}
                          className="w-full bg-emerald-400/40 rounded-t-lg absolute bottom-0"
                         />
                       </motion.div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-8">
             <div className="glass rounded-[40px] p-6 lg:p-8">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
                   <button 
                    onClick={() => onOpenModule("history")}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                   >
                      <ChevronRight size={20} />
                   </button>
                </div>

                <div className="space-y-6">
                  {recentReports.map((report, i) => (
                    <div key={i} className={`flex items-center justify-between group p-3 rounded-xl border-l-4 ${
                        report.status === 'Healthy' ? 'neon-border-green border-emerald-400' : 
                        report.status === 'Infected' ? 'border-rose-400' : 'border-amber-400'
                     }`}>
                       <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                             report.status === 'Healthy' ? 'bg-emerald-400 animate-pulse' : 
                             report.status === 'Infected' ? 'bg-rose-400' : 'bg-amber-400'
                          }`} />
                          <div>
                             <p className="text-white text-sm font-bold tracking-tight">{report.crop}</p>
                             <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{report.id}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={`text-xs font-bold ${
                             report.status === 'Healthy' ? 'text-emerald-400' : 
                             report.status === 'Infected' ? 'text-rose-400' : 'text-amber-400'
                          }`}>{report.status}</p>
                          <p className="text-slate-600 text-[10px] font-medium">{report.date}</p>
                       </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => onOpenModule("history")}
                  className="w-full mt-12 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white text-sm font-bold transition-all"
                >
                   View All Reports
                </button>
             </div>

             <div className="glass rounded-[40px] p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                         <ShoppingBag size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Agro Products</h3>
                   </div>
                   <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                      Trusted fertilizers, seeds, and irrigation tools available at your fingertips.
                   </p>
                   <a 
                     href="#marketplace"
                     className="inline-flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest hover:gap-3 transition-all"
                   >
                      Explore Marketplace <ArrowRight size={14} />
                   </a>
                </div>
             </div>

             <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-[40px] p-8 text-slate-950 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <ShieldCheck size={120} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tighter">Premium Expert Support</h3>
                <p className="text-slate-950/70 text-sm font-medium mb-8">
                   Connect with certified agronomists for detailed soil analysis and field planning.
                </p>
                <button className="px-6 py-3 bg-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                   Upgrade Now
                </button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
