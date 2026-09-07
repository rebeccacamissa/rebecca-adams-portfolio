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

const ADAM_SYSTEM_INSTRUCTIONS = "Answer as Adam, Rebecca’s warm but professional portfolio companion. Give complete, useful answers rather than one-line summaries. Use the portfolio facts accurately, explain why details matter, connect Rebecca’s customer-service foundation to her technology work, and finish with a practical next step or relevant link when one exists.";
const ADAM_GENERATION_CONFIG = {
  temperature: 0.72,
  topP: 0.92,
  minSentences: 5,
  maxParagraphs: 3,
};

function composeAdamResponse(paragraphs: string[]) {
  return paragraphs.slice(0, ADAM_GENERATION_CONFIG.maxParagraphs).join("\n\n");
}

const responses: Record<PromptKey, string> = {
  about: composeAdamResponse([
    "Rebecca Adams is a Junior Web Developer whose story is grounded in resilience, curiosity, and a people-first way of solving problems. After matriculating in 2024, she entered the workforce to support her family, building calm communication, accountability, and practical judgement in customer-facing environments. Those experiences taught her to listen closely, clarify what people actually need, and keep moving when a situation is busy or unfamiliar.",
    "That foundation became the bridge into creative technology. Through the CAPACITI 12-month programme, Rebecca is accelerating her growth in web development, AI-enabled workflows, data-informed thinking, and digital product design. She is especially interested in the space where a clear interface can make a complicated task feel more human. Her portfolio reflects that direction: thoughtful concepts, useful interactions, and a strong attention to the details that help people trust a digital experience.",
    "For an employer, Rebecca brings more than early-career technical ambition. She brings the adaptability of someone who has worked directly with people, the discipline to learn quickly, and the empathy to design around real-world constraints. Explore her selected work below, read her CV, or use the contact form if you would like to discuss a junior web development, support, or digital operations opportunity."
  ]),
  skills: composeAdamResponse([
    "Rebecca’s strengths sit at the intersection of dependable workplace practice and emerging technical confidence. Her core human and workplace skills are Teamwork & Collaboration, Time Management, Adaptability, RAPID LEARNING - HIGH ATTENTION TO DETAIL, PROFESSIONAL VERBAL\\WRITTEN ENGLISH, and CUSTOMER ENQUIRY HANDLING. In practice, that means she can absorb new information quickly, communicate clearly with different audiences, keep track of detail, and remain constructive when priorities shift.",
    "Her technical and digital toolkit includes responsive interface thinking, GitHub workflows, data analysis, Advanced Excel, Google Workspace, Microsoft 365, HubSpot CRM, AI-assisted problem solving, and structured content planning. She does not treat tools as the whole story; she uses them to make a process clearer, reduce friction, and create a better experience for the person on the other side of the screen.",
    "This combination is particularly valuable in junior roles where learning speed, follow-through, and communication matter as much as the first set of tools on a CV. You can browse the skills matrix for more detail, or ask me about a specific capability and I’ll connect it to Rebecca’s projects and career transition."
  ]),
  cases: composeAdamResponse([
    "Rebecca’s selected case studies are built around a consistent question: how can technology remove friction without losing the human context behind a problem? Each project begins with a real-world constraint, translates it into a focused digital concept, and then makes the value visible through a clearer journey.",
    "Bantu Connect responds to a fragmented beauty sector by bringing discovery and booking into one approachable platform. Its Smart Budget Matcher helps users find realistic options, the Power-Ready toggle makes availability more practical, and zero-friction WhatsApp booking helps independent beauty professionals convert interest into action. Kumbayaaa AI tackles travel-planning form fatigue through a conversational experience that gathers intent more naturally and helps people see time and budget implications sooner.",
    "Atelier AI Workspace addresses cognitive fragmentation by bringing email context, task planning, and drafting into one focused workspace, with an 80% reduction in drafting time as the headline outcome. Together, the projects show Rebecca’s product instincts: start with the user’s actual friction, keep the interface purposeful, and measure success by whether the experience becomes easier to use."
  ]),
  resume: composeAdamResponse([
    "Rebecca’s CV is available to view or download in a new tab. It gives employers a fuller picture of her customer-facing and operations experience, the transferable habits she developed in those roles, her data and digital-skills training, her CAPACITI development, and the direction of her move into junior web development.",
    "The strongest through-line is her ability to combine people skills with careful systems work. She is building technical confidence while bringing an existing foundation in enquiry handling, professional communication, accuracy, adaptability, and service-minded problem solving. That makes her a thoughtful candidate for junior web development, digital support, product operations, or technology-adjacent roles where learning and follow-through are valued.",
    "I’ve opened the CV for you. If you are reviewing Rebecca for an opportunity, the most direct next step is to use the employer-friendly contact form at the bottom of the portfolio or connect through LinkedIn so you can discuss the role, team, and timing directly."
  ]),
};

const promptLabels: Array<{ key: PromptKey; label: string }> = [
  { key: "about", label: "Tell me about Rebecca" },
  { key: "skills", label: "What are your core skills?" },
  { key: "cases", label: "Case Studies Overview" },
  { key: "resume", label: "Download Resume" },
];

function githubResponse(activity: GitHubActivity[], status: GitHubStatus): string {
  if (status === "loading") return composeAdamResponse([
    "I’m checking Rebecca’s public GitHub activity now rather than guessing from an old portfolio snapshot. The live feed looks at her public profile, recently pushed repositories, and the latest commit messages returned by GitHub.",
    "Once the request finishes, I’ll summarise the most recent commit notes with repository names and relative dates. You’ll also be able to follow each item back to the original GitHub commit in the activity panel, which keeps the answer transparent and verifiable."
  ]);
  if (status === "error") return composeAdamResponse([
    "GitHub’s public activity feed is temporarily unavailable, so I won’t invent a claim about what Rebecca shipped most recently. The rest of my portfolio knowledge is still available, including her journey, skills, selected projects, and CV.",
    "You can also browse the source directly at github.com/rebeccacamissa. When the public feed is reachable again, Adam will use the returned commit notes and dates rather than relying on a static summary."
  ]);
  if (activity.length === 0) return composeAdamResponse([
    "Rebecca’s public GitHub feed did not return any recent commits just now. That does not necessarily mean the repositories are inactive; it means there was no recent public commit data available in this visit’s response.",
    "You can browse the complete repository history at github.com/rebeccacamissa, and I can still talk you through the portfolio projects and the product problems they were designed to address."
  ]);
  const notes = activity.slice(0, 4).map((item) => `${item.repo}: “${item.message}” (${formatRelativeDate(item.date)})`).join("; ");
  return composeAdamResponse([
    `Rebecca’s latest public commit notes are: ${notes}. These entries are read from GitHub when the portfolio loads, so the dates and repository names reflect the current public feed rather than a manually typed activity log.`,
    "The recent activity gives visitors a useful sense of how Rebecca works in public: iterating on projects, refining portfolio details, and keeping her learning artefacts visible. Each commit in the live activity panel links to GitHub, where you can inspect the original change and its surrounding repository context.",
    "If you are assessing her for a role, I recommend pairing the activity feed with the selected case studies. The feed shows ongoing practice; the case studies explain the product thinking, user problem, and intended outcome behind the work."
  ]);
}

function detailedFallback(question: string) {
  return composeAdamResponse([
    `That’s a thoughtful question about Rebecca’s portfolio: “${question}”. I don’t want to invent a detail that is not supported by the information she has provided, but I can still help you navigate the strongest evidence available here.`,
    "Rebecca’s profile is best understood through three connected themes: a customer-service foundation that shaped her communication and adaptability, a CAPACITI-led transition into creative technology, and a set of projects that turn messy real-world problems into clearer digital journeys.",
    "Try asking about her career story, core skills, selected projects, CV, or recent GitHub activity. If you are an employer or recruiter, the contact section is the most direct way to ask about availability, role fit, or a conversation with Rebecca."
  ]);
}

function answerForQuestion(question: string, activity: GitHubActivity[], status: GitHubStatus): string {
  const normalized = question.toLowerCase();
  if (normalized.includes("github") || normalized.includes("commit") || normalized.includes("latest") || normalized.includes("recent") || normalized.includes("shipped") || normalized.includes("activity")) return githubResponse(activity, status);
  if (normalized.includes("skill") || normalized.includes("good at") || normalized.includes("strength")) return responses.skills;
  if (normalized.includes("project") || normalized.includes("case") || normalized.includes("bantu") || normalized.includes("kumb") || normalized.includes("atelier")) return responses.cases;
  if (normalized.includes("cv") || normalized.includes("resume") || normalized.includes("hire") || normalized.includes("recruit")) return responses.resume;
  if (normalized.includes("about") || normalized.includes("who") || normalized.includes("journey") || normalized.includes("story")) return responses.about;
  return detailedFallback(question);
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
