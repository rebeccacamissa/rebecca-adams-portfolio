/* Camel Editorial Atelier: Adam is a stationary, transparent portfolio companion; the drawer is intentional, glassy, and completely hidden until the visitor activates it. */
import { Download, ExternalLink, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { formatRelativeDate, type GitHubActivity, type GitHubStatus } from "@/lib/github";

type PromptKey = "about" | "skills" | "cases" | "resume";
type MascotMode = "excited" | "awake" | "sleeping";
type ChatMessage = { role: "visitor" | "adam"; text: string };

const CAT_ASSETS: Record<Exclude<MascotMode, "awake"> | "awake", string> = {
  excited: "/manus-storage/rebecca-cat-excited-transparent_ccf7f184.png",
  awake: "/manus-storage/rebecca-cat-awake-transparent_106172d1.png",
  sleeping: "/manus-storage/rebecca-cat-sleeping-transparent_2a3853b4.png",
};

const responses: Record<PromptKey, string> = {
  about: "Rebecca Adams is a Junior Web Developer whose career is shaped by resilience, curiosity, and a deeply people-first way of thinking. After matriculating in 2024, she entered customer-facing work to support her family and built composure, accountability, and practical problem-solving in fast-moving environments. That foundation led her toward creative technology, and she is now accelerating her growth through the CAPACITI 12-month programme, where she is turning real human needs into thoughtful web and AI experiences.",
  skills: "Rebecca brings together the reliability of a customer-service professional and the curiosity of an emerging technologist. Her strongest workplace qualities are Teamwork & Collaboration, Time Management, Adaptability, Rapid Learning – High Attention to Detail, Professional Verbal/Written English, and Customer Enquiry Handling. She also works with responsive UI thinking, GitHub, data analysis, Advanced Excel, Google Workspace, Microsoft 365, HubSpot CRM, UX-minded problem-solving, and clear digital communication.",
  cases: "Rebecca’s selected work explores how a good digital product can remove friction from everyday decisions. Bantu Connect turns a fragmented local beauty sector into a hyper-local marketplace with a Smart Budget Matcher, Power-Ready toggle, and zero-friction WhatsApp booking. Kumbayaaa replaces travel-planning form fatigue with conversational AI that brings time savings and financial clarity to the planning journey. Atelier AI Workspace brings email, task planning, and drafting into one focused productivity environment, reducing drafting time by 80%.",
  resume: "Rebecca’s CV is available to view or download in a new tab. It gives employers a concise view of her customer-facing and operations experience, data and digital-skills training, CAPACITI development, and transition into junior web development. If you would like to discuss a role, project, or internship, the quickest route is the contact form at the bottom of this page or Rebecca’s LinkedIn profile.",
};

const promptLabels: Array<{ key: PromptKey; label: string }> = [
  { key: "about", label: "Tell me about Rebecca" },
  { key: "skills", label: "What are your core skills?" },
  { key: "cases", label: "Case Studies Overview" },
  { key: "resume", label: "Download Resume" },
];

function githubResponse(activity: GitHubActivity[], status: GitHubStatus): string {
  if (status === "loading") return "I’m checking Rebecca’s public GitHub activity now. Give me a moment and I’ll bring back the latest commit notes from her repositories.";
  if (status === "error") return "GitHub’s public activity feed is temporarily unavailable, so I can’t safely claim what Rebecca shipped most recently. You can still browse her repositories directly at github.com/rebeccacamissa, and I’ll keep the rest of her portfolio profile available here.";
  if (activity.length === 0) return "Rebecca’s public GitHub feed did not return any recent commits just now. Her repositories are still available at github.com/rebeccacamissa for the full history.";
  const notes = activity.slice(0, 3).map((item) => `${item.repo}: “${item.message}” (${formatRelativeDate(item.date)})`).join("; ");
  return `Here are Rebecca’s latest public commit notes: ${notes}. Each item links back to its original GitHub commit in the live activity panel, so you can follow the work in context rather than relying on a static summary.`;
}

function answerForQuestion(question: string, activity: GitHubActivity[], status: GitHubStatus): string {
  const normalized = question.toLowerCase();
  if (normalized.includes("github") || normalized.includes("commit") || normalized.includes("latest") || normalized.includes("recent") || normalized.includes("shipped") || normalized.includes("activity")) return githubResponse(activity, status);
  if (normalized.includes("skill") || normalized.includes("good at") || normalized.includes("strength")) return responses.skills;
  if (normalized.includes("project") || normalized.includes("case") || normalized.includes("bantu") || normalized.includes("kumb") || normalized.includes("atelier")) return responses.cases;
  if (normalized.includes("cv") || normalized.includes("resume") || normalized.includes("hire") || normalized.includes("recruit")) return responses.resume;
  return responses.about;
}

export default function CatAssistant({ cvUrl, githubActivity = [], githubStatus = "loading" }: { cvUrl: string; githubActivity?: GitHubActivity[]; githubStatus?: GitHubStatus }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<MascotMode>("excited");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMode("awake"), 3200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let idleTimer: number | undefined;
    const resetIdle = () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      setMode((current) => current === "sleeping" ? "awake" : current);
      idleTimer = window.setTimeout(() => setMode("sleeping"), 15000);
    };
    const events: Array<keyof WindowEventMap> = ["mousemove", "scroll", "keydown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetIdle, { passive: true }));
    resetIdle();
    return () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      events.forEach((event) => window.removeEventListener(event, resetIdle));
    };
  }, []);

  const choosePrompt = (key: PromptKey) => {
    setMessages((current) => [...current, { role: "visitor", text: promptLabels.find((item) => item.key === key)?.label ?? "Tell me more" }, { role: "adam", text: responses[key] }]);
    if (key === "resume") window.open(cvUrl, "_blank", "noopener,noreferrer");
  };

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;
    setMessages((current) => [...current, { role: "visitor", text: question }, { role: "adam", text: answerForQuestion(question, githubActivity, githubStatus) }]);
    setDraft("");
  };

  const openOrClose = () => {
    setMode((current) => current === "sleeping" ? "awake" : current);
    setIsOpen((current) => !current);
  };

  return (
    <aside className={`cat-assistant ${isOpen ? "is-open" : ""}`} aria-label="Adam, Rebecca's portfolio helper">
      {isOpen && (
        <section className="cat-dialog" role="dialog" aria-modal="false" aria-label="Ask Adam about Rebecca" aria-live="polite">
          <div className="cat-dialog-header">
            <div>
              <p className="cat-dialog-kicker">Adam / portfolio companion</p>
              <h2>What can I help you find?</h2>
            </div>
            <button className="cat-close" onClick={() => setIsOpen(false)} aria-label="Close Adam"><X size={15} /></button>
          </div>
          <div className="cat-transcript">
            {messages.length === 0 ? (
              <p className="cat-empty">Ask about Rebecca’s journey, strengths, selected projects, or résumé. I’ll point you in the right direction.</p>
            ) : messages.map((message, index) => (
              <p key={`${message.role}-${index}`} className={`cat-message cat-message-${message.role}`}>{message.text}</p>
            ))}
          </div>
          <div className="cat-options" aria-label="Suggested questions">
            {promptLabels.map((prompt) => <button key={prompt.key} onClick={() => choosePrompt(prompt.key)}>{prompt.key === "resume" && <Download size={12} />}{prompt.label}</button>)}
          </div>
          <form className="cat-input-row" onSubmit={submitQuestion}>
            <label className="sr-only" htmlFor="adam-question">Ask Adam a question</label>
            <input id="adam-question" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask a question…" autoComplete="off" />
            <button type="submit" aria-label="Send question"><Send size={14} /></button>
          </form>
          <p className="cat-drawer-foot"><MessageCircle size={12} /> For opportunities, use the contact form below.</p>
        </section>
      )}
      <button className={`cat-mascot cat-mode-${mode}`} onClick={openOrClose} aria-expanded={isOpen} aria-label={isOpen ? "Close Adam's helper" : "Open Adam's helper"}>
        <span className="cat-mascot-art" style={{ backgroundImage: `url(${CAT_ASSETS[mode]})` }} aria-hidden="true" />
        <span className="sr-only">{isOpen ? "Close Adam's helper" : "Open Adam's helper"}</span>
      </button>
    </aside>
  );
}
