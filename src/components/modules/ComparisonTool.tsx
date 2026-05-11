import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Layers, Upload, Scan, 
  ChevronRight, BrainCircuit, Activity,
  Split, Search, Sparkles, AlertCircle, Info, Beaker
} from "lucide-react";

interface AnalysisResult {
  cause: string;
  explanation: string;
  variance: string;
  chlorophyll: string;
  necrosis: string;
  degradation: string;
}

export default function ComparisonTool({ onClose }: { onClose: () => void }) {
  const [imgA, setImgA] = useState<string | null>(null);
  const [imgB, setImgB] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e as MouseEvent).clientX - rect.left) / rect.width;
    setSliderPos(Math.max(0, Math.min(100, x * 100)));
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const up = () => setIsResizing(false);
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isResizing]);

  useEffect(() => {
    if (imgA && imgB) {
      setIsAnalyzing(true);
      setAnalysis(null);
      // Simulate Deep AI Analysis
      const timer = setTimeout(() => {
        setAnalysis({
          cause: "Pathogenic Infiltration & Nutrient Depletion",
          explanation: "Comparison indicates advanced stage Interveinal Necrosis. The pathogen has compromised the vascular integrity, leading to a localized shutdown of photosynthetic processes in the target specimen.",
          variance: "6.4%",
          chlorophyll: "-28.5%",
          necrosis: "High Intensity (Interveinal)",
          degradation: "Advanced Cellular Breakdown"
        });
        setIsAnalyzing(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [imgA, imgB]);

  const onSelectFile = (index: 'A' | 'B') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        if (index === 'A') setImgA(url);
        else setImgB(url);
      }
    };
    input.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-auto"
    >
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-7xl glass rounded-[40px] border-white/5 overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.8)]"
      >
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <Split size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">A/B Phenotypic Analysis</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Activity size={10} className="text-emerald-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Diagnostic Correlation Tool</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={onClose} 
                className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all group font-black text-[10px] uppercase tracking-widest"
              >
                <span>Back to Home</span>
              </button>
              <button 
                onClick={onClose} 
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-rose-500 hover:bg-rose-500/10 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all cursor-pointer relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-rose-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <X size={20} className="relative z-10" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Sample Input Pipeline</p>
                <div className="relative">
                  <button 
                    onClick={() => onSelectFile('A')}
                    className={`w-full p-5 group rounded-3xl border transition-all ${imgA ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-900/50 border-white/5 hover:border-emerald-500/20'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-slate-400 group-hover:text-emerald-400">
                        {imgA ? <Scan size={20} /> : <Upload size={20} />}
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-black text-slate-500 uppercase">Input A</div>
                        <div className="text-xs font-bold text-white">{imgA ? 'Baseline Specimen' : 'Upload Control'}</div>
                      </div>
                    </div>
                  </button>
                  {imgA && <div className="absolute top-1/2 -right-2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 z-10" />}
                </div>

                <div className="relative">
                  <button 
                    onClick={() => onSelectFile('B')}
                    className={`w-full p-5 group rounded-3xl border transition-all ${imgB ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-slate-900/50 border-white/5 hover:border-indigo-500/20'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-slate-400 group-hover:text-indigo-400">
                        {imgB ? <Search size={20} /> : <Upload size={20} />}
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-black text-slate-500 uppercase">Input B</div>
                        <div className="text-xs font-bold text-white">{imgB ? 'Target Analysis' : 'Upload Subject'}</div>
                      </div>
                    </div>
                  </button>
                  {imgB && <div className="absolute top-1/2 -right-2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full border-2 border-slate-950 z-10" />}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                 <div className="flex items-center gap-3 text-emerald-400 mb-2">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Observation</span>
                 </div>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Visualizing phenotypic variance at a macro and microscopic scale. 
                 </p>
                 <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Load</span>
                      <span className="text-[9px] font-black text-emerald-400 uppercase">Optimized</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "65%" }}
                        className="h-full bg-emerald-500" 
                       />
                    </div>
                 </div>

                 <button 
                  onClick={onClose}
                  className="w-full mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest md:hidden"
                 >
                   <X size={14} />
                   Back to Home
                 </button>
              </div>
            </div>

            {/* Viewport */}
            <div className="lg:col-span-6">
              <div 
                ref={containerRef}
                className="w-full aspect-[4/3] bg-slate-950 rounded-[40px] border border-white/5 overflow-hidden relative group cursor-ew-resize select-none shadow-[inset_0_0_80px_rgba(0,0,0,1)]"
                onMouseDown={() => setIsResizing(true)}
              >
                {!imgA && !imgB && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                      <Split size={48} className="text-slate-700 animate-pulse" />
                      <div className="absolute inset-0 blur-xl bg-emerald-500/10 rounded-full" />
                    </div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Awaiting Visual Input</p>
                  </div>
                )}

                {imgA && (
                  <div className="absolute inset-0">
                    <img src={imgA} className="w-full h-full object-cover opacity-80" alt="Sample A" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  </div>
                )}

                {imgB && (
                  <div 
                    className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-emerald-500 z-10 shadow-[20px_0_100px_rgba(16,185,129,0.4)]"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img 
                      src={imgB} 
                      className="absolute inset-0 h-full object-cover" 
                      style={{ width: `${100 / (sliderPos / 100)}%` }} 
                      alt="Sample B" 
                    />
                    <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay" />
                    <div className="scan-line !bg-emerald-500/50" />
                    
                    <div className="absolute top-6 left-6 px-4 py-2 bg-emerald-500/20 backdrop-blur-md rounded-xl border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <Beaker size={12} />
                      Target Analysis
                    </div>
                  </div>
                )}

                {imgA && imgB && (
                  <>
                    <div 
                      className="absolute inset-y-0 z-20 w-[2px] bg-emerald-500/50 pointer-events-none" 
                      style={{ left: `${sliderPos}%` }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-8 border-slate-950 flex items-center justify-center text-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                         <div className="flex gap-0.5">
                            <ChevronRight className="rotate-180" size={12} strokeWidth={4} />
                            <ChevronRight size={12} strokeWidth={4} />
                         </div>
                      </div>
                    </div>
                    
                    {/* Measurement Overlays */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-30">
                       <div className="px-6 py-3 glass rounded-2xl border-white/5 flex items-center gap-4">
                          <div className="text-center">
                             <div className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Specimen A</div>
                             <div className="text-xs font-black text-white">CONTROL</div>
                          </div>
                          <div className="w-px h-6 bg-white/10" />
                          <div className="text-center">
                             <div className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Specimen B</div>
                             <div className="text-xs font-black text-emerald-400">ANALYZED</div>
                          </div>
                       </div>
                    </div>
                  </>
                )}
                
                {imgA && (
                  <div className="absolute top-6 right-6 px-4 py-2 bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest z-0 flex items-center gap-2">
                    <Info size={12} />
                    Baseline Specimen
                  </div>
                )}

                {isAnalyzing && (
                  <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
                     <BrainCircuit size={48} className="text-emerald-400 animate-pulse mb-4" />
                     <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Running Neural Correlation...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Detailed Analysis */}
            <div className="lg:col-span-3 space-y-6">
              <AnimatePresence mode="wait">
                {analysis ? (
                  <motion.div 
                    key="analysis-data"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="p-6 bg-emerald-500/10 rounded-[32px] border border-emerald-500/20 relative overflow-hidden group">
                       <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                          <Beaker size={100} />
                       </div>
                       <div className="flex items-center gap-3 text-emerald-400 mb-4">
                          <AlertCircle size={18} />
                          <h3 className="text-xs font-black uppercase tracking-widest">Inferred Cause</h3>
                       </div>
                       <p className="text-sm font-bold text-white leading-tight mb-2">
                          {analysis.cause}
                       </p>
                       <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
                          "{analysis.explanation}"
                       </p>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phenotypic Metrics</p>
                       
                       <div className="grid grid-cols-1 gap-2">
                          {[
                            { label: "Stomatal Variance", value: analysis.variance, icon: <Activity size={12} /> },
                            { label: "Chlorophyll Density", value: analysis.chlorophyll, icon: <Layers size={12} />, sub: "Degradation detected" },
                            { label: "Necrosis Depth", value: analysis.necrosis, icon: <Scan size={12} /> },
                            { label: "Cellular Integrity", value: analysis.degradation, icon: <Info size={12} /> }
                          ].map((item, idx) => (
                            <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                               <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2 text-slate-500">
                                     {item.icon}
                                     <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
                                  </div>
                                  <span className="text-xs font-black text-white">{item.value}</span>
                               </div>
                               {item.sub && <div className="text-[8px] font-bold text-emerald-500/80 uppercase">{item.sub}</div>}
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 leading-none">Diagnostic Summary</p>
                       <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-[11px] text-indigo-200 font-medium leading-relaxed">
                          Slide to visualize the cellular level degradation. Highlighting contrasts in chlorophyll density and interveinal necrosis. The variance suggests a biological pathogen rather than environmental stress.
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-[40px] opacity-40 shadow-[inset_0_0_40px_rgba(255,255,255,0.02)]"
                  >
                    <Split size={40} className="mb-6 text-slate-600" />
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Correlation Engine Idle</p>
                    <p className="text-[10px] text-slate-600 font-bold max-w-[160px]">Load both specimens to initialize deep phenotypic analysis.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

