import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import { GitFork, Mail, Send } from "lucide-react";

const currentYear = new Date().getFullYear();
const GITHUB_URL = "https://github.com/renneco27-crypto/CORTES-Engineering-Portfolio";

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ senderName: "", senderEmail: "", messageBody: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
  emailjs.init({
    publicKey,
    limitRate: {
      id: "contact_form",
      throttle: 60000,
    },
  });
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string }>({
    type: "success",
    text: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setFeedback({ type: "success", text: "" });

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const contactTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT!;
    const autoreplyTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_AUTOREPLY!;

    try {
      await emailjs.send(
        serviceId,
        contactTemplateId,
        {
          name: form.senderName,
          from_email: form.senderEmail,
          title: form.messageBody.slice(0, 60),
          message: form.messageBody,
        },
        publicKey
      );

      await emailjs.send(
        serviceId,
        autoreplyTemplateId,
        {
          name: form.senderName,
          from_email: form.senderEmail,
          title: form.messageBody.slice(0, 60),
          message: form.messageBody,
        },
        publicKey
      );

      setStatus("success");
      setFeedback({ type: "success", text: "Message sent! Lawrence will get back to you soon." });
      setForm({ senderName: "", senderEmail: "", messageBody: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setFeedback({ type: "error", text: "Failed to send message. Please try again." });
    }
  }

  return (
    <section id="contact" className="py-24 px-6 bg-zinc-950 border-t border-zinc-800/50">
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        <div>
          <span className="font-mono text-xs text-violet-400 uppercase tracking-widest">Contact</span>
          <h2 className="text-4xl font-bold text-white mt-2">Let's Build Something</h2>
          <p className="text-zinc-400 mt-2">Internship inquiries, freelance projects, or just say hi.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 rounded-2xl border border-zinc-700/40 bg-zinc-900 p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600/20 border border-violet-500/30 text-lg font-bold text-violet-300">LC</div>
              <div>
                <p className="font-semibold text-white">Lawrence Cortes</p>
                <p className="text-xs text-zinc-500">Ormoc City, Leyte, Philippines 🇵🇭</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Open to internships · {currentYear}
            </span>

            <div className="flex flex-col gap-3 border-t border-zinc-800 pt-4">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-zinc-400 hover:text-violet-400 transition-colors group">
                <GitFork size={16} className="text-violet-400" />
                <div>
                  <p className="text-white text-xs font-medium group-hover:text-violet-300">CORTES Engineering Portfolio</p>
                  <p className="text-zinc-600 text-xs font-mono">github.com/renneco27-crypto</p>
                </div>
              </a>
              <a href="https://www.facebook.com/Rennejay.Dev.21" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-zinc-400 hover:text-violet-400 transition-colors">
                <Mail size={16} />
                facebook.com/Rennejay.Dev.21
              </a>
            </div>

            <a
              href="/resume/lawrence-cortes-resume.pdf"
              download
              className="mt-auto flex items-center justify-center gap-2 rounded-lg border border-violet-500/30 px-4 py-2 text-sm text-violet-400 hover:bg-violet-500/10 transition-colors"
            >
              Resume PDF ↓
            </a>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="md:col-span-3 flex flex-col gap-4">
            <p className="text-sm font-medium text-white">Send a message</p>

            <input
              value={form.senderName}
              onChange={(e) => setForm({ ...form, senderName: e.target.value })}
              placeholder="Your name"
              required
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500 transition-colors"
            />
            <input
              type="email"
              value={form.senderEmail}
              onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
              placeholder="Your email"
              required
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500 transition-colors"
            />
            <textarea
              value={form.messageBody}
              onChange={(e) => setForm({ ...form, messageBody: e.target.value })}
              placeholder="Message"
              rows={5}
              required
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500 transition-colors resize-none"
            />

            <button
              type="button"
              onClick={() => formRef.current?.requestSubmit()}
              disabled={status === "sending"}
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-medium text-white hover:bg-violet-500 transition-colors disabled:opacity-50"
            >
              <Send size={14} />
              {status === "sending" ? "Sending..." : status === "success" ? "Message sent!" : "Get in Touch →"}
            </button>

            {feedback.text && (
              <p className={`text-xs text-center font-mono ${feedback.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                {feedback.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
