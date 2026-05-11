import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, History, Trash2, Calendar, 
  ChevronRight, ArrowRight, Eye,
  AlertTriangle, CheckCircle, Activity,
  Search, Filter, Download, Printer, Share2,
  FileText, ShieldCheck, Zap, Microscope,
  Droplets, Thermometer, Info
} from "lucide-react";
import { AnalysisResult } from "../../types.ts";
import { jsPDF } from "jspdf";

export default function HistoryLog({ onClose }: { onClose: () => void }) {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scan_history") || "[]");
    setHistory(saved);
  }, []);

  const deleteItem = (idx: number) => {
    const next = history.filter((_, i) => i !== idx);
    setHistory(next);
    localStorage.setItem("scan_history", JSON.stringify(next));
  };

  const clearAll = () => {
    if (confirm("Initiate data wipe? All diagnostic records will be permanently purged.")) {
      setHistory([]);
      localStorage.removeItem("scan_history");
    }
  };

  const generatePDF = (report: AnalysisResult) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = 210;
    let y = 30;

    // --- PROFESSIONAL HEADER ---
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, pageWidth, 45, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("SMART CROP DOCTOR", margin, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129); 
    doc.text("AI-DRIVEN AGRICULTURAL PATHOLOGY ANALYSIS", margin, 32);
    
    // Scan Meta - Right Aligned
    doc.setTextColor(148, 163, 184); 
    doc.setFontSize(8);
    const dateStr = new Date(report.timestamp).toLocaleString();
    doc.text(`Doc ID: ARCH-${report.timestamp.slice(-10).toUpperCase()}`, pageWidth - margin - 10, 18, { align: "right" });
    doc.text(`Issue Date: ${dateStr}`, pageWidth - margin - 10, 24, { align: "right" });
    doc.text(`Location: ${report.location || "Satellite Verify"}`, pageWidth - margin - 10, 30, { align: "right" });

    y = 60;
    
    // --- CROP IMAGE SECTION ---
    if (report.image) {
      try {
        // Draw frame for image
        doc.setDrawColor(241, 245, 249);
        doc.rect(margin, y, 40, 40);
        doc.addImage(report.image, "JPEG", margin + 1, y + 1, 38, 38, undefined, "FAST");
      } catch (e) {
        console.error("Image render fail", e);
      }
    }

    // --- DISEASE EXECUTIVE SUMMARY ---
    const contentX = report.image ? margin + 50 : margin;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(report.name.toUpperCase(), contentX, y + 8);
    
    y += 18;
    // Severity Badge
    const sevColor: [number, number, number] = 
      report.severity === 'Critical' ? [244, 63, 94] : 
      report.severity === 'High' ? [249, 115, 22] : [16, 185, 129];
    
    doc.setFillColor(...sevColor);
    doc.roundedRect(contentX, y - 5, 30, 8, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(report.severity.toUpperCase(), contentX + 15, y + 1, { align: "center" });

    doc.setTextColor(100, 116, 139);
    doc.text(`Confidence: ${report.confidence.toFixed(2)}%`, contentX + 35, y + 1);
    
    y += 12;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(report.description, pageWidth - contentX - margin);
    doc.text(splitDesc, contentX, y);
    
    y = Math.max(y + (splitDesc.length * 5), 115);

    // --- TELEMETRY DATA TABLE ---
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y - 5, pageWidth - (margin * 2), 20, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("ENVIRONMENTAL TELEMETRY", margin + 5, y + 2);
    
    doc.setTextColor(15, 23, 42);
    doc.text(`TEMPERATURE: ${report.weather?.temp || "28"}\u00B0C`, margin + 5, y + 10);
    doc.text(`HUMIDITY: ${report.weather?.humidity || "60"}%`, margin + 55, y + 10);
    doc.text(`PRECIPITATION: ${report.weather?.rain || "Low"}`, margin + 105, y + 10);
    doc.text(`CROP: ${report.cropType || "General"}`, margin + 145, y + 10);

    y += 30;

    // --- DIAGNOSTIC BREAKDOWN ---
    const colWidth = (pageWidth - (margin * 2) - 10) / 2;
    
    // Symptoms
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVED SYMPTOMS", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    report.symptoms.forEach((s, i) => {
      doc.text(`\u2022 ${s}`, margin + 2, y + 8 + (i * 6));
    });

    // Causes
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("ROOT CAUSE ANALYSIS", margin + colWidth + 10, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    report.causes.forEach((c, i) => {
      doc.text(`\u2022 ${c}`, margin + colWidth + 12, y + 8 + (i * 6));
    });

    y += Math.max(report.symptoms.length, report.causes.length) * 6 + 20;

    // --- TREATMENT PROTOCOLS (EXECUTIVE BOX) ---
    doc.setFillColor(236, 253, 245);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 55, 3, 3, "F");
    doc.setTextColor(6, 78, 59);
    doc.setFont("helvetica", "bold");
    doc.text("NEURAL RECOVERY & TREATMENT PROTOCOLS", margin + 5, y + 10);
    
    doc.setFontSize(9);
    doc.text("PRIMARY INTERVENTION:", margin + 5, y + 20);
    doc.setFont("helvetica", "normal");
    doc.text(report.remedies.immediate, margin + 45, y + 20);
    
    doc.setFont("helvetica", "bold");
    doc.text("ORGANIC SOLUTIONS:", margin + 5, y + 30);
    doc.setFont("helvetica", "normal");
    const organic = report.remedies.organic.join(", ");
    doc.text(doc.splitTextToSize(organic, 120), margin + 45, y + 30);

    if (report.remedies.chemical && report.remedies.chemical.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("CHEMICAL OPTIONS:", margin + 5, y + 45);
      doc.setFont("helvetica", "normal");
      doc.text(report.remedies.chemical.join(", "), margin + 45, y + 45);
    }

    y += 70;

    // --- FOOTER NOTE ---
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    const footerText = "DISCLAIMER: This automated report is generated by Smart Crop Doctor using Neural Vision Analytics. It is intended for early-stage screening. Consult a verified agronomist for critical chemical applications.";
    doc.text(doc.splitTextToSize(footerText, 160), pageWidth / 2, 285, { align: "center" });

    doc.save(`CropReport_${report.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const shareReport = async (report: AnalysisResult) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Crop Diagnosis: ${report.name}`,
          text: `I just diagnosed my crop using Smart Crop Doctor AI. Results: ${report.name} (${report.severity} severity). Check it out!`,
          url: window.location.href,
        });
      } catch (e) {
        console.error("Sharing failed", e);
      }
    } else {
      alert("Sharing not supported on this platform. Try downloading the PDF.");
    }
  };

  const filteredHistory = history.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

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
        className="w-full max-w-5xl glass rounded-[40px] border-white/5 overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.8)]"
      >
        <div className="p-8 md:p-12 h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <History size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Diagnostic Archives</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Activity size={10} className="text-emerald-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">AI Persistent History</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {history.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="px-6 py-3 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 hover:border-rose-500/20"
                >
                  Clear History
                </button>
              )}
              <button onClick={onClose} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8 flex-shrink-0">
             <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="SEARCH HISTORICAL DIAGNOSTICS..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-700"
                />
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            {filteredHistory.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-8 opacity-40">
                <div className="w-24 h-24 rounded-[40%] bg-white/5 flex items-center justify-center border-2 border-dashed border-white/10">
                  <History size={48} className="text-slate-600" />
                </div>
                <div className="text-center">
                   <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-2">No Records Found</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Run a neural scan to populate archives.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {filteredHistory.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 glass rounded-[32px] border-white/5 hover:border-emerald-500/20 transition-all group relative"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl border ${
                          item.severity === "Critical" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                          item.severity === "High" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                          "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}>
                          {item.severity === "Critical" ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white italic tracking-tight">{item.name}</h4>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteItem(i); }}
                        className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed font-bold line-clamp-2 italic mb-6 opacity-70">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                      <button 
                        onClick={() => setSelectedReport(item)}
                        className="flex-1 py-3 glass hover:bg-emerald-500 text-slate-400 hover:text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                         <Eye size={14} /> Full View
                      </button>
                      <button 
                        onClick={() => shareReport(item)}
                        className="p-3 glass hover:bg-emerald-500 text-slate-400 hover:text-slate-950 rounded-xl transition-all"
                        title="Share Report"
                      >
                        <Share2 size={16} />
                      </button>
                      <button 
                        onClick={() => generatePDF(item)}
                        className="p-3 glass hover:bg-emerald-500 text-slate-400 hover:text-slate-950 rounded-xl transition-all"
                        title="Download PDF Report"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Report Preview Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" onClick={() => setSelectedReport(null)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-4xl glass max-h-[90vh] rounded-[40px] border-white/10 overflow-hidden relative flex flex-col"
            >
              <div className="p-8 bg-slate-900/50 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xl italic uppercase tracking-tighter">{selectedReport.name} Report</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(selectedReport.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => shareReport(selectedReport)}
                    className="p-3 glass text-slate-400 hover:text-emerald-400 rounded-2xl transition-all"
                  >
                    <Share2 size={18} />
                  </button>
                  <button 
                    onClick={() => generatePDF(selectedReport)}
                    className="px-6 py-3 bg-emerald-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <Download size={14} /> Download PDF
                  </button>
                  <button onClick={() => setSelectedReport(null)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
                {/* Visual Header */}
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 glass rounded-3xl p-4 border-emerald-500/20 overflow-hidden">
                    <div className="aspect-square bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 overflow-hidden">
                       {selectedReport.image ? (
                         <img src={selectedReport.image} alt="Crop Scan" className="w-full h-full object-cover" />
                       ) : (
                         <Microscope size={48} className="opacity-20" />
                       )}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-6">
                    <div className="flex flex-wrap gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex-1 min-w-[120px]">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Confidence</p>
                        <p className="text-2xl font-black text-emerald-400 italic">{selectedReport.confidence.toFixed(1)}%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex-1 min-w-[120px]">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Severity</p>
                        <p className={`text-2xl font-black italic ${
                          selectedReport.severity === 'Critical' ? 'text-rose-400' : 
                          selectedReport.severity === 'High' ? 'text-orange-400' : 'text-emerald-400'
                        }`}>{selectedReport.severity}</p>
                      </div>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Info size={12} /> Diagnosis
                       </h4>
                       <p className="text-sm text-slate-300 leading-relaxed font-semibold">{selectedReport.description}</p>
                    </div>
                  </div>
                </div>

                {/* Symptoms & Causes */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest italic flex items-center gap-3">
                      <Search className="text-rose-400" size={18} /> Symptoms Catalog
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedReport.symptoms.map(s => (
                        <div key={s} className="px-5 py-3 glass rounded-2xl border-white/5 text-[10px] font-bold text-slate-300">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest italic flex items-center gap-3">
                      <Zap className="text-rose-400" size={18} /> Environmental Vectors
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedReport.causes.map(c => (
                        <div key={c} className="px-5 py-3 glass rounded-2xl border-white/5 text-[10px] font-bold text-slate-300">
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Treatment Grid */}
                <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] space-y-8">
                   <div className="flex items-center gap-4">
                      <ShieldCheck className="text-emerald-400" size={24} />
                      <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">Neural Recovery Protocols</h4>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                         <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Immediate Response</h5>
                         <p className="text-sm text-emerald-100 font-bold italic leading-relaxed">{selectedReport.remedies.immediate}</p>
                      </div>
                      <div className="space-y-4">
                         <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Organic Interventions</h5>
                         <ul className="space-y-2">
                           {selectedReport.remedies.organic.map((r, i) => (
                             <li key={i} className="text-xs text-slate-400 font-medium flex items-center gap-2">
                               <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                               {r}
                             </li>
                           ))}
                         </ul>
                      </div>
                   </div>
                </div>

                {/* Telemetry Advice */}
                <div className="grid md:grid-cols-3 gap-6">
                   <div className="p-6 glass rounded-3xl border-white/5">
                      <Droplets className="text-blue-400 mb-4" size={24} />
                      <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Hydration Adjust</h5>
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{selectedReport.farmingAdvice.irrigation}</p>
                   </div>
                   <div className="p-6 glass rounded-3xl border-white/5">
                      <Thermometer className="text-orange-400 mb-4" size={24} />
                      <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Climate Shield</h5>
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{selectedReport.farmingAdvice.weatherPrecautions}</p>
                   </div>
                   <div className="p-6 glass rounded-3xl border-white/5">
                      <Activity className="text-emerald-400 mb-4" size={24} />
                      <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Recovery Estimate</h5>
                      <p className="text-[10px] text-emerald-400 font-black italic">{selectedReport.recoveryExpectation}</p>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
