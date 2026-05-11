import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  ExternalLink, 
  Sprout, 
  Droplets, 
  Zap, 
  Package, 
  Thermometer, 
  Leaf, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

const CATEGORIES = [
  { id: 'seeds', label: 'Hybrid Seeds', icon: <Sprout size={14} />, color: 'text-emerald-400' },
  { id: 'fert', label: 'Fertilizers', icon: <Package size={14} />, color: 'text-cyan-400' },
  { id: 'pest', label: 'Pesticides', icon: <ShieldCheck size={14} />, color: 'text-rose-400' },
  { id: 'tools', label: 'Smart Tools', icon: <Zap size={14} />, color: 'text-amber-400' },
  { id: 'irrig', label: 'Irrigation', icon: <Droplets size={14} />, color: 'text-blue-400' },
  { id: 'org', label: 'Organic', icon: <Leaf size={14} />, color: 'text-lime-400' },
];

const PREVIEW_PRODUCTS = [
  { name: 'Nano Fertilizer', price: '$24.99', category: 'Fertilizers', image: '🧪' },
  { name: 'Hybrid Wheat', price: '$45.00', category: 'Seeds', image: '🌾' },
  { name: 'Moisture Sensor', price: '$89.00', category: 'Smart Tools', image: '📡' },
];

export default function AgroProducts() {
  const [isOpening, setIsOpening] = useState(false);
  const MARKETPLACE_LINK = "https://share.google/yK3Fe3sBjoWzg6knn";

  const handleExplore = () => {
    setIsOpening(true);
    setTimeout(() => {
      window.open(MARKETPLACE_LINK, '_blank', 'noopener,noreferrer');
      setIsOpening(false);
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-[40px] p-8 md:p-10 relative overflow-hidden group border-white/5"
    >
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Badge */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <CheckCircle2 size={12} className="text-emerald-400" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Verified Marketplace</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
          <ShieldCheck size={12} className="text-cyan-400" />
          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">Trusted Source</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                <ShoppingBag size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
                Agro Products
              </h2>
            </div>
            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-lg">
              Unlock access to premium fertilizers, hybrid seeds, advanced irrigation tools, and essential farming equipment through our trusted portal.
            </p>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 cursor-default transition-all group/chip"
              >
                <span className={`${cat.color} group-hover/chip:scale-110 transition-transform`}>
                  {cat.icon}
                </span>
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  {cat.label}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={handleExplore}
            disabled={isOpening}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl text-slate-950 font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_-10px_rgba(34,211,238,0.4)] hover:shadow-[0_20px_60px_-5px_rgba(34,211,238,0.5)] transition-all relative overflow-hidden group/btn"
          >
            <AnimatePresence mode="wait">
              {isOpening ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 border-3 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Redirecting...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <span>Explore Products</span>
                  <ExternalLink size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Product Previews / Visualizer */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent blur-3xl rounded-full" />
          
          <div className="grid grid-cols-2 gap-4 relative z-10">
            {PREVIEW_PRODUCTS.map((prod, i) => (
              <motion.div
                key={prod.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-6 glass rounded-[32px] border-white/5 flex flex-col gap-4 ${i === 2 ? 'col-span-2' : ''}`}
              >
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">
                  {prod.image}
                </div>
                <div>
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">{prod.category}</p>
                  <h4 className="text-white font-bold tracking-tight">{prod.name}</h4>
                  <p className="text-emerald-400 font-black mt-2">{prod.price}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 w-16 h-16 glass rounded-2xl flex items-center justify-center text-2xl border-white/10 shadow-2xl"
          >
            🌾
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-6 w-20 h-20 glass rounded-[30%] flex items-center justify-center text-3xl border-white/10 shadow-2xl"
          >
            🚜
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
