"use client";
import { FormEvent, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface ChatWidgetProps {
  systemPromptSummary: string;
  placeholderText: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget({ systemPromptSummary, placeholderText }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm Lawrence's AI. Ask me about his skills, projects, or internship availability.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(userMessage: string): Promise<string> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await res.json();
    return data.reply ?? "Sorry, something went wrong.";
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: "Sorry, I couldn't reach the assistant right now.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">LC</div>
              <div>
                <p className="text-xs font-medium text-white">Lawrence's AI</p>
                <p className="text-[10px] text-zinc-500 font-mono">Powered by NVIDIA</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto p-4 h-64">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-violet-600 text-white"
                      : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-zinc-800 px-3 py-2 text-xs text-zinc-400 font-mono">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-zinc-800 flex items-center gap-2 px-3 py-3">
            <input
              value={input}
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder={placeholderText}
              className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-600 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="text-violet-400 hover:text-violet-300 disabled:opacity-30"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-500 transition-colors"
        aria-label="Open AI chat"
      >
        <MessageCircle size={22} />
        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-zinc-950" />
      </button>
    </div>
  );
}
