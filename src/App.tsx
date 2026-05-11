/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { Github, Twitter } from "lucide-react";
import Background3D from "./components/3d/Background3D.tsx";
import Navbar from "./components/sections/Navbar.tsx";
import Hero from "./components/sections/Hero.tsx";
import AIScanner from "./components/sections/AIScanner.tsx";
import Features from "./components/sections/Features.tsx";
import DemoSection from "./components/sections/DemoSection.tsx";
import Sustainability from "./components/sections/Sustainability.tsx";
import Dashboard from "./components/sections/Dashboard.tsx";
import Marketplace from "./components/sections/Marketplace.tsx";
import GovernmentSchemes from "./components/sections/GovernmentSchemes.tsx";
import ChatBot from "./components/sections/ChatBot.tsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.tsx";
import AuthScreens from "./components/auth/AuthScreens.tsx";
import { AnimatePresence } from "motion/react";
import { AppModule } from "./types.ts";

// Import modules
import VoiceAssistant from "./components/modules/VoiceAssistant.tsx";
import WeatherAdvisor from "./components/modules/WeatherAdvisor.tsx";
import HistoryLog from "./components/modules/HistoryLog.tsx";
import CropYieldPlanner from "./components/modules/CropYieldPlanner.tsx";
import ComparisonTool from "./components/modules/ComparisonTool.tsx";

function AppContent() {
  const { user, isOnboarded } = useAuth();
  const [activeModule, setActiveModule] = React.useState<AppModule>(null);

  useEffect(() => {
    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e: any) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  if (!user || !isOnboarded) {
    return <AuthScreens />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      <div className="mesh-gradient fixed inset-0 pointer-events-none opacity-50"></div>
      <Background3D />
      <Navbar />
      
      <main className="relative z-10">
        <Hero onOpenModule={setActiveModule} />
        <AIScanner />
        <Features onOpenModule={setActiveModule} />
        <DemoSection />
        <Sustainability />
        <Dashboard onOpenModule={setActiveModule} />
        <Marketplace />
        <GovernmentSchemes />
      </main>

      <AnimatePresence>
        {activeModule === "voice" && <VoiceAssistant onClose={() => setActiveModule(null)} />}
        {activeModule === "weather" && <WeatherAdvisor onClose={() => setActiveModule(null)} />}
        {activeModule === "history" && <HistoryLog onClose={() => setActiveModule(null)} />}
        {activeModule === "yield" && <CropYieldPlanner onClose={() => setActiveModule(null)} />}
        {activeModule === "compare" && <ComparisonTool onClose={() => setActiveModule(null)} />}
      </AnimatePresence>

      <footer className="py-20 border-t border-white/5 relative z-10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h3 className="text-2xl font-black text-white mb-6 tracking-tighter italic underline decoration-emerald-500 decoration-4">Smart Crop Doctor</h3>
            <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
              Leading the digital transformation of agriculture through advanced neural networks 
              and sustainable farming practices. Join us in building a greener future.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500 transition-all cursor-pointer">
                  {i === 1 ? <Github size={18} /> : i === 2 ? <Twitter size={18} /> : <span>in</span>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-medium">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">AI Diagnostics</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Farming Tips</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">API for Developers</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-medium">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Vision</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Legal</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-600 text-[10px] uppercase font-bold tracking-[0.4em]">© 2026 Smart Crop Doctor. All Systems Operational.</p>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

