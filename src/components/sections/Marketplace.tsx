import React from "react";
import { motion } from "motion/react";
import AgroProducts from "../modules/AgroProducts.tsx";
import { Sparkles, ShoppingBag } from "lucide-react";

export default function Marketplace() {
  return (
    <section id="marketplace" className="py-24 px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 rounded-full border border-cyan-500/20"
          >
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Premium Resource Gateway</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase">
            Agricultural <span className="text-emerald-400">Marketplace</span>
          </h2>
          <p className="text-slate-500 max-w-2xl font-medium">
            Connect with verified supply chains providing specialized agricultural materials directly 
            integrated for high-yield farming success.
          </p>
        </div>

        <AgroProducts />
        
        {/* Marketplace Stat Bar */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Partner Sites", val: "12+", icon: <ShoppingBag size={14} /> },
            { label: "Supply Reach", val: "Global", icon: <Sparkles size={14} /> },
            { label: "Product Cert", val: "ISO 9001", icon: <Sparkles size={14} /> },
            { label: "Support", val: "24/7", icon: <Sparkles size={14} /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 glass rounded-2xl border-white/5 flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-sm text-white font-bold">{stat.val}</p>
              </div>
              <div className="text-cyan-400 opacity-20">
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
