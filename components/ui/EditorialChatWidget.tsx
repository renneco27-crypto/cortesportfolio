"use client";

import React, { useState, useEffect, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

type Message = { id: string; role: 'user' | 'assistant'; content: string };

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const TARGET_GREETING = "ready. ask me about my experience or projects.";

export default function EditorialChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  // Terminal boot animation states
  const [bootStep, setBootStep] = useState<number>(0); // 0: idle, 1: downloading, 2: linked, 3: typing, 4: ready
  const [spinnerIndex, setSpinnerIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [typedGreeting, setTypedGreeting] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (messages.length === 0) {
        setBootStep(0);
        setProgressPct(0);
        setTypedGreeting("");
      }
      return;
    }

    if (messages.length > 0) return;

    let isCancelled = false;
    let spinnerTimer: ReturnType<typeof setInterval>;
    let progressTimer: ReturnType<typeof setInterval>;
    let typeTimer: ReturnType<typeof setInterval>;
    let stageTimeout: ReturnType<typeof setTimeout>;

    setBootStep(1);
    setProgressPct(0);
    setTypedGreeting("");

    // Rotating npm spinner
    spinnerTimer = setInterval(() => {
      setSpinnerIndex((prev) => (prev + 1) % SPINNER_FRAMES.length);
    }, 60);

    // Progress bar simulation (0 to 100% over ~550ms)
    let currentPct = 0;
    progressTimer = setInterval(() => {
      currentPct += 14;
      if (currentPct >= 100) {
        currentPct = 100;
        clearInterval(progressTimer);
        clearInterval(spinnerTimer);
        if (!isCancelled) {
          setProgressPct(100);
          setBootStep(2);

          // Transition to typewriter after verification
          stageTimeout = setTimeout(() => {
            if (isCancelled) return;
            setBootStep(3);
            let charIndex = 0;
            typeTimer = setInterval(() => {
              charIndex++;
              setTypedGreeting(TARGET_GREETING.slice(0, charIndex));
              if (charIndex >= TARGET_GREETING.length) {
                clearInterval(typeTimer);
                if (!isCancelled) setBootStep(4);
              }
            }, 18);
          }, 260);
        }
      } else {
        if (!isCancelled) setProgressPct(currentPct);
      }
    }, 55);

    return () => {
      isCancelled = true;
      clearInterval(spinnerTimer);
      clearInterval(progressTimer);
      clearInterval(typeTimer);
      clearTimeout(stageTimeout);
    };
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, turnstileToken }),
      });
      const data = await res.json();
      
      const assistantMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: data.reply || "Connection terminated. Neural link lost." 
      };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (err) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Error connecting to systems." }]);
      } finally {
        setIsLoading(false);
        // Turnstile tokens are single-use — reset so onSuccess fires again
        // with a fresh token before the next message is sent.
        setTurnstileToken(null);
        turnstileRef.current?.reset();
      }
  };

  if (!hasMounted) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70] flex flex-col items-end">
      {/* Flat Editorial Panel */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden bg-[#050505] border border-[#222] shadow-2xl origin-bottom-right
        ${isOpen ? 'w-[calc(100vw-32px)] max-w-[380px] h-[480px] max-h-[75vh] opacity-100 scale-100 mb-3 sm:mb-4' : 'w-[calc(100vw-32px)] max-w-[380px] h-0 opacity-0 scale-95 mb-0 border-transparent'}`}
      >
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-[#1c1c1c] bg-[#080808]">
            <div className="font-mono text-xs text-[#e63946] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#e63946] rounded-full animate-pulse"></span>
              SYSTEM.AI_NODE
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[#666] hover:text-white transition-colors text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-[#050505] scrollbar-hide font-mono text-[0.8rem] leading-relaxed">
            {messages.length === 0 && (
              <div className="text-[#888] font-mono text-[0.78rem] leading-relaxed select-none space-y-2">
                <div>
                  <span className="text-[#e63946] font-semibold">$</span> init neural-link...
                </div>

                {bootStep === 1 && (
                  <div className="text-[#aaa] flex items-center gap-2">
                    <span className="text-[#e63946] font-bold">{SPINNER_FRAMES[spinnerIndex]}</span>
                    <span>fetching packages [
                      <span className="text-[#e63946]">{"■".repeat(Math.min(10, Math.floor((progressPct / 100) * 10)))}</span>
                      <span className="text-[#444]">{"□".repeat(10 - Math.min(10, Math.floor((progressPct / 100) * 10)))}</span>
                    ] {progressPct}%</span>
                  </div>
                )}

                {bootStep >= 2 && (
                  <div className="text-[#4ade80] flex items-center gap-1.5 text-[0.75rem]">
                    <span>✔</span>
                    <span className="text-[#888]">neural-link@2.4.0 verified in 380ms</span>
                  </div>
                )}

                {bootStep >= 3 && (
                  <div className="text-white pt-1">
                    <span className="text-[#e63946] font-semibold">&gt;</span>{" "}
                    <span>{typedGreeting}</span>
                    <span className="inline-block w-2 h-3.5 bg-[#e63946] ml-1.5 align-middle animate-cursor" />
                  </div>
                )}

                {bootStep === 0 && (
                  <div className="text-[#555]">
                    <span className="text-[#e63946]">&gt;</span> awaiting signal...
                    <span className="inline-block w-2 h-3.5 bg-[#e63946] ml-1.5 align-middle animate-cursor" />
                  </div>
                )}
              </div>
            )}
            
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-[0.6rem] text-[#444] uppercase mb-1">
                  {m.role === 'user' ? 'USER_INPUT' : 'SYS_RESPONSE'}
                </span>
                <div className={`p-3 max-w-[85%] ${m.role === 'user' ? 'bg-[#111] text-[#ccc] border border-[#222]' : 'bg-transparent text-white border-l-2 border-[#e63946]'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex flex-col items-start">
                <span className="text-[0.6rem] text-[#444] uppercase mb-1">SYS_PROCESSING</span>
                <div className="p-3 bg-transparent text-[#666] border-l-2 border-[#e63946] flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#1c1c1c] bg-[#080808]">
            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
              <div className="hidden">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onSuccess={(token) => setTurnstileToken(token)}
                />
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex relative items-center">
              <span className="absolute left-3 text-[#555] font-mono text-sm">$</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type command..."
                className="w-full bg-[#111] border border-[#222] text-white font-mono text-xs pl-8 pr-10 py-3 focus:outline-none focus:border-[#555] transition-colors rounded-none placeholder:text-[#444]"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim() || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
                className="absolute right-3 text-[#888] hover:text-white disabled:opacity-50 transition-colors"
              >
                ↵
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Redesigned Floating Chat Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI Chat" : "Chat with Lawrence's AI Assistant"}
        className="group relative flex items-center gap-2.5 sm:gap-3 rounded-full border border-white/15 bg-black/85 backdrop-blur-xl px-4 py-2.5 sm:px-5 sm:py-3 text-white shadow-[0_12px_32px_rgba(0,0,0,0.6)] hover:border-lime/60 hover:bg-black/95 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
      >
        <span className="relative flex h-2 w-2">
          {!isOpen && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]' : 'bg-lime shadow-[0_0_8px_rgba(184,255,1,0.9)]'}`} />
        </span>
        <span className="font-mono text-[0.72rem] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 group-hover:text-white transition-colors">
          {isOpen ? "Close Terminal" : "Ask Lawrence AI"}
        </span>
        <span className="text-[10px] text-lime opacity-80 group-hover:opacity-100 transition-opacity font-mono">
          {isOpen ? "✕" : "✦"}
        </span>
      </button>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes cursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .animate-cursor {
          animation: cursorBlink 0.8s infinite;
        }
      `}</style>
    </div>
  );
}
