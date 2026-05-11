import React from "react";
import { motion } from "motion/react";
import { AppModule } from "../../types.ts";
import { 
  Zap, 
  Mic2, 
  CloudSun, 
  Bot, 
  History, 
  Layers, 
  WifiOff,
  TrendingUp,
  Sparkles,
  LucideIcon
} from "lucide-react";

interface FeatureItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: LucideIcon;
  moduleId?: AppModule;
}

const featuresData: FeatureItem[] = [
  {
    id: 1,
    title: "AI Disease Detection",
    date: "Real-time",
    content: "Upload leaf images and get instant results with 98% accuracy using our advanced neural engine.",
    category: "Diagnosis",
    icon: Zap,
    moduleId: "scanner"
  },
  {
    id: 2,
    title: "Regional Voice Support",
    date: "Multi-modal",
    content: "Full multilingual interface with regional language voice guidance (Kannada, Hindi, Tamil).",
    category: "Accessibility",
    icon: Mic2,
    moduleId: "voice"
  },
  {
    id: 3,
    title: "Farming Forecasts",
    date: "Hyper-local",
    content: "Personalized agricultural tips based on real-time local weather data and soil parameters.",
    category: "Insights",
    icon: CloudSun,
    moduleId: "weather"
  },
  {
    id: 4,
    title: "AI Chat Assistant",
    date: "24/7 Specialist",
    content: "Our custom-trained LLM provides instant answers to complex farming queries and pests.",
    category: "Support",
    icon: Bot,
    moduleId: null // ChatBot is global, handled differently or just opens chat
  },
  {
    id: 5,
    title: "History Tracking",
    date: "Temporal Log",
    content: "A secure digital archive of every scan. Visualize farm health trends over months.",
    category: "Data",
    icon: History,
    moduleId: "history"
  },
  {
    id: 6,
    title: "Crop Yield Planner",
    date: "Predictive",
    content: "Advanced planning algorithm for calculating acreage and expected yield.",
    category: "Planning",
    icon: TrendingUp,
    moduleId: "yield"
  },
  {
    id: 7,
    title: "A/B Comparison",
    date: "Visual Engine",
    content: "Side-by-side visualizer for comparing samples against healthy vegetation libraries.",
    category: "Learning",
    icon: Layers,
    moduleId: "compare"
  },
  {
    id: 8,
    title: "Offline Support",
    date: "Field Ready",
    content: "Edge AI technology allows core diagnosis even when no cellular connectivity is available.",
    category: "Stability",
    icon: WifiOff,
    moduleId: "scanner" // Focus on scanning
  }
];

export default function Features({ onOpenModule }: { onOpenModule: (module: AppModule) => void }) {
  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden bg-slate-950/20">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-8"
          >
            <Sparkles size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">System Capabilities</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase mb-6"
          >
             Core <span className="text-emerald-400">Integrated</span> Ecosystem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl font-medium"
          >
            Smart Crop Doctor combines satellite precision with local intelligence to provide 
            everything a modern farmer needs to succeed.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuresData.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                if (feature.moduleId) onOpenModule(feature.moduleId);
                else if (feature.title === "AI Chat Assistant") window.dispatchEvent(new CustomEvent("open-chatbot"));
              }}
              className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl hover:border-emerald-500/50 transition-all group relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all" />
              
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                <feature.icon size={24} />
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{feature.category}</span>
                <span className="text-[10px] font-mono text-emerald-500/70">{feature.date}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 tracking-tight italic uppercase">
                {feature.title}
              </h3>
              
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {feature.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
