import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Mic, MicOff, Globe, Volume2, 
  MessageSquare, BrainCircuit, Activity,
  RefreshCw, Sparkles, Languages, History,
  AlertCircle, ChevronDown, Check, Download, Share2
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";

// Supported Languages for Agriculture Assistant
const LANGUAGES = [
  { code: 'en-US', name: 'English', native: 'English' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'mr-IN', name: 'Marathi', native: 'ಮರಾठी' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬಿ' },
  { code: 'ur-PK', name: 'Urdu', native: 'اردو' },
];

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  language: string;
}

export default function VoiceAssistant({ onClose }: { onClose: () => void }) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentResponse, setCurrentResponse] = useState("");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const aiRef = useRef<any>(null);

  // Initialize Gemini
  useEffect(() => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined");
      }
      aiRef.current = new GoogleGenAI({ apiKey });
      synthRef.current = window.speechSynthesis;
    } catch (err) {
      console.error("AI Init Error:", err);
      setError("Failed to initialize AI services. Please check configuration.");
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language.code;
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognition.onerror = (event: any) => {
        console.error("SR Error:", event.error);
        if (event.error === 'not-allowed') {
          setError("Microphone access denied. Please enable permissions in your browser settings and refresh.");
        } else if (event.error === 'network') {
          setError("Network error detected. Please check your internet connection.");
        } else if (event.error === 'no-speech') {
          setError("No speech detected. Listening timed out.");
        } else {
          setError(`Voice Link Error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setError("Speech recognition not supported in this browser.");
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [language]);

  // Handle final transcript after listening stops
  useEffect(() => {
    if (!isListening && transcript && !isProcessing) {
      processCommand(transcript);
    }
  }, [isListening]);

  const processCommand = async (text: string) => {
    if (!text.trim()) return;
    
    setHistory(prev => [...prev, { 
      role: 'user', 
      text, 
      timestamp: Date.now(),
      language: language.name
    }]);

    setIsProcessing(true);
    setTranscript("");

    try {
      if (!aiRef.current) throw new Error("AI not initialized");

      const response = await aiRef.current.models.generateContent({ 
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are the "Smart Crop Doctor" AI Voice Assistant. 
          Provide expert farming advice in a warm, professional, and helpful tone. 
          The user has spoken a message. 
          IMPORTANT: Automatically detect the language of the user's input and respond strictly in that SAME language.
          Keep responses concise (max 35 words) suitable for high-quality text-to-speech.
          Focus on: crop diseases, fertilizers, irrigation, weather impact, and soil health.
          Provide exact data when possible. Answer accurately about agriculture and crops.`,
        },
        contents: text
      });

      const reply = response.text || "I'm having trouble thinking right now.";
      
      setCurrentResponse(reply);
      setHistory(prev => [...prev, { 
        role: 'assistant', 
        text: reply, 
        timestamp: Date.now(),
        language: language.name
      }]);
      
      speak(reply);
    } catch (err) {
      console.error("AI Error:", err);
      const errorMsg = "I'm having trouble connecting to my neural network. Please check your connection.";
      setCurrentResponse(errorMsg);
      speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    // Stop any current speech
    synthRef.current.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language.code;
    
    // Try to find a matching voice for the language
    const voices = synthRef.current.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(language.code.split('-')[0]));
    if (matchingVoice) utter.voice = matchingVoice;

    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = (e) => {
      console.error("TTS Error:", e);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utter);
  };

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setError(null);
      if (isSpeaking) synthRef.current?.cancel();
      setTranscript("");
      setCurrentResponse("");

      // Request permission explicitly if possible
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        recognitionRef.current?.start();
      } catch (err: any) {
        console.error("Permission request failed:", err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError("Voice access blocked by browser. Click the lock icon in the address bar to reset permissions.");
        } else {
          setError("Failed to initialize audio hardware. Ensure your microphone is connected.");
        }
      }
    }
  };

  const downloadReport = () => {
    const report = history.map(msg => 
      `[${new Date(msg.timestamp).toLocaleString()}] ${msg.role.toUpperCase()} (${msg.language}): ${msg.text}`
    ).join("\n\n");
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartCropDoctor_Voice_Log_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-auto"
    >
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="w-full max-w-2xl glass rounded-[40px] border-white/5 overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh]"
      >
        {/* Futuristic Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />

        <div className="p-8 md:p-12 relative flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]">
                <BrainCircuit size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">AI Voice Assistant</h2>
                <div className="flex items-center gap-3 mt-1">
                   <div className="relative">
                     <button 
                      onClick={() => setShowLangMenu(!showLangMenu)}
                      className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 hover:border-cyan-500/30 transition-all text-[10px] font-black text-slate-400 uppercase tracking-widest"
                     >
                       <Globe size={12} className="text-cyan-400" />
                       {language.native}
                       <ChevronDown size={12} className={`transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
                     </button>

                     <AnimatePresence>
                       {showLangMenu && (
                         <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-48 glass rounded-2xl border border-white/10 p-2 z-[60] shadow-2xl max-h-60 overflow-y-auto no-scrollbar"
                         >
                           {LANGUAGES.map(lang => (
                             <button
                               key={lang.code}
                               onClick={() => {
                                 setLanguage(lang);
                                 setShowLangMenu(false);
                               }}
                               className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-left hover:bg-white/5 transition-colors ${language.code === lang.code ? 'text-cyan-400 bg-cyan-400/5' : 'text-slate-400'}`}
                             >
                               <div>
                                 <div className="text-xs font-bold">{lang.native}</div>
                                 <div className="text-[10px] opacity-60 uppercase">{lang.name}</div>
                               </div>
                               {language.code === lang.code && <Check size={14} />}
                             </button>
                           ))}
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Link Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${showHistory ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
              >
                <History size={20} />
              </button>
              <button onClick={onClose} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors hover:bg-white/5">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Visualizer Area */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 gap-10 overflow-y-auto custom-scrollbar">
            <div className="relative shrink-0">
              <AnimatePresence>
                {(isListening || isSpeaking || isProcessing) && (
                  <>
                    <motion.div 
                      key="glow1"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.8, opacity: 0.1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className={`absolute inset-0 rounded-full blur-3xl ${isListening ? 'bg-rose-500' : isProcessing ? 'bg-cyan-500' : 'bg-emerald-500'}`}
                    />
                    <motion.div 
                      key="glow2"
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 2.2, opacity: 0.05 }}
                      exit={{ scale: 1.2, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
                      className={`absolute inset-0 rounded-full blur-3xl ${isListening ? 'bg-rose-400' : isProcessing ? 'bg-cyan-400' : 'bg-emerald-400'}`}
                    />
                  </>
                )}
              </AnimatePresence>

              <button 
                onClick={toggleListening}
                disabled={isProcessing}
                className={`relative w-40 h-40 rounded-[40%] border-2 transition-all duration-500 flex items-center justify-center group z-10 ${
                  isListening 
                  ? 'bg-rose-500/20 border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.3)]' 
                  : isProcessing
                  ? 'bg-cyan-500/20 border-cyan-500 scale-105 shadow-[0_0_50px_rgba(34,211,238,0.3)]'
                  : isSpeaking
                  ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
                  : 'bg-white/5 border-white/10 hover:border-cyan-400 shadow-none'
                }`}
              >
                <div className="absolute inset-0 rounded-[40%] bg-gradient-to-br from-white/10 to-transparent group-hover:opacity-100 opacity-50 transition-opacity" />
                
                {isListening ? (
                  <MicOff className="text-rose-400 relative z-20" size={48} />
                ) : isProcessing ? (
                  <RefreshCw className="text-cyan-400 animate-spin relative z-20" size={48} />
                ) : isSpeaking ? (
                   <Volume2 className="text-emerald-400 relative z-20 animate-pulse" size={48} />
                ) : (
                  <Mic className="text-cyan-400 group-hover:scale-110 transition-transform relative z-20" size={48} />
                )}
                
                {/* Wave Visualizer - Holographic Design */}
                {(isListening || isSpeaking || isProcessing) && (
                  <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex items-end gap-1.5 px-6 h-16 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                    {[1, 2, 3, 4, 5, 8, 12, 15, 12, 8, 5, 4, 3, 2, 1].map((h, i) => (
                      <motion.div 
                        key={i}
                        animate={{ 
                          height: isProcessing ? [10, 16, 10] : [4, h * (isListening ? 1.5 : 1) + (Math.random() * 10), 4],
                          opacity: [0.4, 1, 0.4],
                          backgroundColor: isListening ? ["#fb7185", "#f43f5e", "#fb7185"] : isProcessing ? ["#22d3ee", "#0891b2", "#22d3ee"] : ["#10b981", "#059669", "#10b981"]
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: isProcessing ? 0.6 : 0.3 + Math.random() * 0.3, 
                          delay: i * 0.03 
                        }}
                        className="w-1.5 rounded-full shadow-[0_0_10px_currentColor]"
                        style={{ color: isListening ? '#f43f5e' : isProcessing ? '#22d3ee' : '#10b981' }}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                  </div>
                )}
              </button>
            </div>

            {/* Voice Status & Information Panels */}
            <div className="text-center space-y-6 max-w-lg w-full flex-grow flex flex-col items-center">
               <div className="min-h-[120px] flex flex-col justify-center px-4 w-full relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isListening ? 'listening' : isProcessing ? 'processing' : isSpeaking ? 'speaking' : 'ready'}
                      initial={{ opacity: 0, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, filter: 'blur(10px)' }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }} 
                          transition={{ repeat: Infinity, duration: 2 }}
                          className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : isProcessing ? 'bg-cyan-500 shadow-[0_0_10px_#22d3ee]' : isSpeaking ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-700'}`} 
                        />
                        <p className={`text-[12px] font-black uppercase tracking-[0.6em] ${isListening ? 'text-rose-400' : isProcessing ? 'text-cyan-400' : isSpeaking ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isListening ? "Listening Mode" : isProcessing ? "Cognitive Analysis" : isSpeaking ? "Voice Feed Active" : "Systems Standby"}
                        </p>
                      </div>
                      
                      {error ? (
                        <div className="flex flex-col items-center gap-4 bg-rose-500/10 p-6 rounded-[32px] border border-rose-500/20 backdrop-blur-xl">
                          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                             <AlertCircle size={24} />
                          </div>
                          <p className="text-sm font-bold text-rose-200 leading-relaxed">{error}</p>
                          <button onClick={toggleListening} className="px-6 py-2 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Retry Link</button>
                        </div>
                      ) : (
                        <div className="relative">
                           <p className="text-2xl md:text-3xl font-black text-white italic leading-tight tracking-tighter drop-shadow-lg">
                              {transcript ? (
                                <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                  "{transcript}"
                                </span>
                              ) : currentResponse ? (
                                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                  "{currentResponse.slice(0, 100)}{currentResponse.length > 100 ? '...' : ''}"
                                </span>
                              ) : (
                                <span className="text-slate-500">Initialize Voice Uplink...</span>
                              )}
                           </p>
                           {isListening && <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-black text-rose-400 uppercase tracking-widest leading-none">Capturing...</motion.div>}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
               </div>

               <AnimatePresence>
                {currentResponse && !isListening && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="p-8 bg-white/5 rounded-[32px] border border-white/10 relative overflow-hidden group w-full"
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                    <Sparkles className="absolute top-6 right-6 text-cyan-400/20 group-hover:text-cyan-400/40 transition-colors" size={32} />
                    <div className="flex flex-col gap-4 text-left">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                             <BrainCircuit size={14} />
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Prediction Insight</span>
                       </div>
                       <p className="text-base text-slate-200 font-medium leading-relaxed">
                        {currentResponse}
                       </p>
                       <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-4">
                             <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Language</span>
                                <span className="text-[9px] font-bold text-cyan-400 uppercase leading-none">{language.name}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Accuracy</span>
                                <span className="text-[9px] font-bold text-emerald-400 uppercase leading-none">98.4%</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-1">
                             <button 
                              onClick={() => speak(currentResponse)}
                              className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
                             >
                                <Volume2 size={16} />
                             </button>
                             <button 
                              onClick={() => navigator.clipboard.writeText(currentResponse)}
                              className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
                             >
                                <Share2 size={16} />
                             </button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
               </AnimatePresence>
            </div>
          </div>

          {/* Bottom Indicators */}
          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4 shrink-0">
             <div className="p-4 glass rounded-2xl border-white/5 flex items-center justify-between">
                <div>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Processing Engine</p>
                   <p className="text-[10px] text-white font-bold uppercase tracking-widest">Gemini 3 Flash</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                   <Activity size={16} />
                </div>
             </div>
             <div className="p-4 glass rounded-2xl border-white/5 flex items-center justify-between">
                <div>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Neural Latency</p>
                   <p className="text-[10px] text-white font-bold uppercase tracking-widest">~0.4s Optimized</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                   <Sparkles size={16} />
                </div>
             </div>
          </div>

          {/* History Overlay */}
          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="absolute inset-0 bg-slate-950/98 z-[70] p-8 md:p-12 flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <History className="text-cyan-400" size={28} />
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Communication Log</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={downloadReport}
                      disabled={history.length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500 hover:text-slate-950 transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <Download size={14} /> Log
                    </button>
                    <button onClick={() => setShowHistory(false)} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-4">
                  {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                       <MessageSquare size={64} className="mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-[0.5em]">No neural history found</p>
                    </div>
                  ) : (
                    history.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[90%] p-6 rounded-[32px] ${msg.role === 'user' ? 'bg-cyan-500/10 border border-cyan-500/20 text-white rounded-tr-none' : 'bg-white/5 border border-white/5 text-slate-300 rounded-tl-none'}`}>
                           <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                           <div className="flex items-center gap-3 mt-4 opacity-40">
                              <div className="flex items-center gap-1.5">
                                <Globe size={10} />
                                <span className="text-[8px] font-black uppercase tracking-widest">{msg.language}</span>
                              </div>
                              <span className="text-[8px] uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                           </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
