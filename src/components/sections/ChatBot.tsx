import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, Send, X, Mic, Sparkles, 
  Trash2, Volume2, Globe, Command, 
  CornerDownLeft, MicOff, Cpu, VolumeX,
  Languages
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: "user" | "bot";
  text: string;
  timestamp: string;
}

const SUGGESTIONS = [
  "How to treat tomato late blight?",
  "Best organic fertilizer for potatoes?",
  "Kannada: ಟೊಮ್ಯಾಟೊ ರೋಗ ಹತೋಟಿ ಹೇಗೆ?",
  "Prevent leaf fungus in humid weather",
  "Irrigation tips for corn",
  "Organic pest control methods"
];

const SYSTEM_INSTRUCTION = `You are "Smart Crop Doctor", a world-class, futuristic AI agriculture expert and plant pathologist. 
Your mission is to provide intelligent, scientific, yet actionable advice to farmers.

Greeting & Conversation Behavior:
- If the user says "hi", "hello", "hey", or "good morning", respond naturally with something like:
  "Welcome to Smart Crop Doctor 🌱 How can I help you today?"
  "Hello Farmer 👋 I’m your AI farming assistant. Ask me anything about crops, diseases, fertilizers, weather, or farming guidance."
- Understand conversational messages and maintain context logic.
- Answer farming-related questions intelligently (diseases, pesticides, irrigation, fertilizers, subsidy information, weather precautions, crop suitability, sustainable farming methods).

Language Support:
- Support English and Kannada.
- If asked in Kannada (ಕರ್ನಾಟಕ), reply in Kannada.
- Handle transliterated Kannada (Kannada written in English script) if possible.

Tone: Professional, helpful, trustworthy, and encouraging. Use clean formatting.`;

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("crop_doctor_chat_v3");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // initial greeting
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([{
        role: "bot",
        text: "Welcome to Smart Crop Doctor 👋 I'm your real-time farming assistant powered by Google AI. How can I help you today?",
        timestamp
      }]);
    }

    // Listen for global open event
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, []);

  const speak = (text: string) => {
    if (!isVoiceEnabled) return;
    const synth = window.speechSynthesis;
    synth.cancel(); // clear previous
    const utter = new SpeechSynthesisUtterance(text);
    if (/[ಅ-೯]/.test(text)) {
      utter.lang = 'kn-IN';
    } else {
      utter.lang = 'en-US';
    }
    utter.rate = 1;
    utter.pitch = 1;
    synth.speak(utter);
  };

  // Save history on changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("crop_doctor_chat_v3", JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || loading) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { role: "user", text: textToSend, timestamp };
    
    setInput("");
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });
      
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: messages.map(m => ({
          role: m.role === "bot" ? "model" : "user",
          parts: [{ text: m.text }]
        })),
      });

      const response = await chat.sendMessage({ message: textToSend });
      const responseText = response.text || "I'm having trouble connecting to my neural core. Please try again.";
      
      const botMsg: Message = { 
        role: "bot", 
        text: responseText, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, botMsg]);
      speak(responseText);
    } catch (error) {
      console.error("AI Failure:", error);
      setMessages(prev => [...prev, { 
        role: "bot", 
        text: "System communication error. Please check your connectivity.", 
        timestamp: "ERR" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear all AI diagnostic history?")) {
      setMessages([]);
      localStorage.removeItem("crop_doctor_chat_v3");
    }
  };

  const toggleVoice = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    if (!isListening) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        }
      } catch (err) {
        console.error("Mic permission denied:", err);
        return;
      }
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[100] p-4 bg-emerald-500 text-slate-950 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center gap-2 group font-bold overflow-hidden"
      >
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" />
        <MessageSquare size={24} className="relative z-10" />
        <span className="relative z-10 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">
           AI Farm Assistant
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 z-[110] w-[90vw] max-w-[440px] h-[650px] max-h-[80vh] glass rounded-[40px] shadow-[0_32px_128px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900/40 border-b border-white/5 flex items-center justify-between relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                  <Cpu size={24} className={loading ? "animate-spin" : ""} />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg tracking-tight italic uppercase">Agri-Companion</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-[10px] uppercase font-black tracking-widest opacity-80">AI Core Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className={`p-2 transition-all ${isVoiceEnabled ? 'text-emerald-400' : 'text-slate-600'}`}
                >
                  {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button 
                  onClick={clearChat}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar bg-slate-950/20">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] space-y-1.5 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    <div
                      className={`p-4 px-5 rounded-[24px] text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-emerald-500 text-slate-950 font-bold rounded-tr-none"
                          : "glass text-slate-200 border-white/10 rounded-tl-none font-medium"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className="text-[9px] font-black tracking-widest text-slate-600 uppercase">
                      {msg.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="glass p-4 px-6 rounded-3xl rounded-tl-none flex gap-3 items-center">
                    <div className="flex gap-1">
                      <motion.span animate={{ scale:[1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      <motion.span animate={{ scale:[1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      <motion.span animate={{ scale:[1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Listening / Waveform */}
            <AnimatePresence>
              {isListening && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 44 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-500/10 flex items-center justify-center gap-1.5"
                >
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 24, 8, 20, 6] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.6, 
                        delay: i * 0.04,
                        ease: "linear"
                      }}
                      className="w-1 bg-emerald-500 rounded-full"
                    />
                  ))}
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] ml-4">Listening...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-6 bg-slate-950/60 border-t border-white/10 space-y-4">
              {messages.length < 8 && !loading && (
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {SUGGESTIONS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSend(tag)}
                      className="whitespace-nowrap px-4 py-2 glass hover:bg-emerald-500/20 border-white/5 rounded-xl text-[10px] text-slate-400 hover:text-emerald-400 font-bold transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything about farming..."
                  className="w-full h-16 glass border-white/10 text-white rounded-[24px] pl-6 pr-24 focus:outline-none focus:border-emerald-500/50 transition-all font-semibold text-sm"
                />
                
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <button
                    onClick={toggleVoice}
                    className={`h-10 w-10 rounded-xl transition-all flex items-center justify-center ${
                      isListening 
                        ? "bg-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]" 
                        : "text-slate-500 hover:text-emerald-400"
                    }`}
                  >
                    <Mic size={20} className={isListening ? "animate-pulse" : ""} />
                  </button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="h-10 w-10 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 rounded-xl text-slate-950 shadow-lg flex items-center justify-center font-bold"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                   <Languages size={12} className="text-emerald-500" />
                   <span className="text-[9px] text-slate-600 font-black tracking-widest uppercase italic">Multilingual Engine</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   <span className="text-[9px] text-slate-600 font-black tracking-widest uppercase">Verified AI Core</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
