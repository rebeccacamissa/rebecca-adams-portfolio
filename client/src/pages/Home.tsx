/* Camel Editorial Atelier: asymmetric editorial folio, warm parchment surfaces, expressive DM Serif display type, and precision Manrope utility text. */
import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Award,
  BrainCircuit,
  ChevronRight,
  BriefcaseBusiness,
  Code2,
  Coffee,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  Loader2,
  Mail,
  Moon,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import CatAssistant from "@/components/CatAssistant";
import { fetchGitHubActivity, formatRelativeDate, GITHUB_LOGIN, type GitHubActivity, type GitHubProfile, type GitHubStatus } from "@/lib/github";

const CV_URL = "/manus-storage/Rebecca-Adams-CV_31bdf2d7.pdf";
const TEXT_RESUME_URL = "/manus-storage/rebecca-adams-resume_95c14e47.txt";
const HEADSHOT_URL = "/manus-storage/rebecca-adams-headshot_2abac0ae.jpeg";
const HERO_ART_URL = "/manus-storage/rebecca-editorial-hero_5ee1710e.jpg";
const LOGO_URL = "/manus-storage/rebecca-ra-emblem_d4e7c3e6.png";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnpqaoby";
const TYPEWRITER_PHRASES = ["Junior Web Developer", "AI Solutions Integrator", "Creative Problem Solver", "CAPACITI Tech Fellow"];

const growthSlots = [
  { label: "Princely M.", role: "CAPACITI programme colleague", title: "Professional, reliable, supportive.", body: "“I’ve really enjoyed working with Rebecca. She’s professional, reliable, supportive, and always brings a positive attitude to the team. I’d happily recommend her to any organisation.”", mark: "01", linkedin: "https://www.linkedin.com/in/princely-makhwara-096285197/", profileLabel: "LinkedIn profile for Princely M." },
  { label: "Laverne R.", role: "CAPACITI programme colleague", title: "An absolute driving force.", body: "“An absolute driving force in our group. Rebecca consistently brings innovative ideas to the table and ensures our deliverables are always top-tier.”", mark: "02", profileLabel: "Laverne does not have a LinkedIn profile." },
  { label: "Musa N.", role: "CAPACITI programme colleague", title: "Dependable and insightful.", body: "“Dependable, insightful, and incredibly hardworking. Becca is the kind of team member who elevates everyone else’s work just by being part of the process.”", mark: "03", linkedin: "https://www.linkedin.com/in/musa-nkosi-243a09308/", profileLabel: "LinkedIn profile for Musa N." },
  { label: "Sinawo M.", role: "CAPACITI programme colleague", title: "Dedication and clear communication.", body: "“I am always amazed by her dedication and clear communication. Rebecca has a unique talent for keeping the team focused and moving forward.”", mark: "04", linkedin: "https://www.linkedin.com/in/sinawo-mthiyane-508666308/", profileLabel: "LinkedIn profile for Sinawo M." },
  { label: "Dev Nova", role: "Web Development Team · group endorsement", title: "A phenomenal collaborator.", body: "“Rebecca is a phenomenal collaborator who consistently goes above and beyond to ensure our group succeeds. Any team would be lucky to have her on board.”", mark: "05", profileLabel: "Dev Nova group endorsement; no individual profile." },
];

const roadmap = [
  { phase: "Phase 1", title: "Web fundamentals", detail: "Responsive layout, semantic HTML, CSS systems, JavaScript foundations, accessibility, Git, and the habits that make an interface dependable.", icon: Code2 },
  { phase: "Phase 2", title: "AI & prompt engineering", detail: "Prompt structure, conversational UX, data-informed workflows, responsible AI thinking, and practical ways to turn ambiguous needs into useful tools.", icon: BrainCircuit },
  { phase: "Phase 3", title: "Full-stack architecture", detail: "Component architecture, API thinking, persistence, deployment patterns, and the systems mindset needed to connect polished interfaces to real outcomes.", icon: ShieldCheck },
];

const skills = [
  { name: "Responsive UI", type: "Web" },
  { name: "GitHub", type: "Web" },
  { name: "Data Analysis", type: "Data" },
  { name: "Advanced Excel", type: "Data" },
  { name: "Google Workspace", type: "Tools" },
  { name: "Microsoft 365", type: "Tools" },
  { name: "HubSpot CRM", type: "Tools" },
  { name: "UX Thinking", type: "Human" },
  { name: "Problem-solving", type: "Human" },
  { name: "Teamwork & Collaboration", type: "Workplace" },
  { name: "Time Management", type: "Workplace" },
  { name: "Adaptability", type: "Workplace" },
  { name: "RAPID LEARNING - HIGH ATTENTION TO DETAIL", type: "Workplace" },
  { name: "PROFESSIONAL VERBAL\\WRITTEN ENGLISH", type: "Workplace" },
  { name: "CUSTOMER ENQUIRY HANDLING", type: "Workplace" },
];

const timeline = [
  { year: "2024", eyebrow: "The starting point", title: "Matriculated — then stepped into the working world.", body: "After matriculating from Groote Schuur High School, I entered the workforce to support my family. It became an early lesson in commitment, responsibility, and meeting people where they are.", icon: GraduationCap },
  { year: "2025", eyebrow: "Customer service foundation", title: "Built calm in fast-moving service environments.", body: "At Shift Espresso Bar, I coordinated busy service moments, adopted POS tools quickly, and learned how thoughtful communication keeps a team moving under pressure.", icon: Coffee },
  { year: "2025—26", eyebrow: "Operations & claims", title: "Turned accuracy into a professional habit.", body: "As a Claims Specialist at EXL | Hollard, I handled high-volume enquiries, maintained precise digital records, and used structured problem-solving to navigate complex cases.", icon: ShieldCheck },
  { year: "Now", eyebrow: "Career acceleration", title: "Growing into creative technology through CAPACITI.", body: "I am accelerating my career through the CAPACITI 12-month programme, building modern web experiences that bring practical solutions and human insight together.", icon: Code2 },
];

const projects = [
  { id: "01", title: "Bantu Connect", category: "Community beauty platform", problem: "Independent beauty professionals face a fragmented client journey: pricing, availability, reliable power, and booking all live in separate conversations.", solution: "A people-first platform concept that brings discovery and decision-making into one place, centred on a Smart Budget Matcher and a Power-Ready toggle.", result: "A more empowered route for solopreneurs — giving clients a clear match and enabling zero-friction WhatsApp booking.", tags: ["Product thinking", "User flows", "Mobile-first"], repo: "https://github.com/rebeccacamissa/BANTU_CONNECT" },
  { id: "02", title: "Kumbayaaa AI", category: "Conversational travel planner", problem: "Travel planning forms ask users to know every detail before the journey has even begun — creating form fatigue and delaying momentum.", solution: "A conversational AI travel assistant that lets people think out loud while it shapes itineraries, ZAR budget estimates, map pins, stays, and activities around their constraints.", result: "Planning becomes faster and more natural, with meaningful time savings and financial clarity before the itinerary is locked in.", tags: ["AI UX", "Budget tools", "Privacy-minded"], repo: "https://github.com/rebeccacamissa/kumbaya-journeys", live: "https://kumbaya-journeys.lovable.app" },
  { id: "03", title: "Atelier AI Workspace", category: "Workplace productivity suite", problem: "High-value work is often fractured across inboxes, tasks, meeting notes, and research tabs — a costly drag on focus and follow-through.", solution: "A unified AI workspace that centralises email drafting, task planning, chat, meeting-note summaries, and research support in one tailored dashboard.", result: "A clearer working rhythm that can reduce drafting time by up to 80%, while giving priorities and communication a shared home.", tags: ["Productivity", "Prompt design", "Dashboard UX"], repo: "https://github.com/rebeccacamissa/AI-POWERED-ASSISTANT", live: "https://rebecca-adams-va-assistant.lovable.app" },
];

const skillMatrix = {
  technical: [
    { name: "Responsive UI", value: 78 },
    { name: "Data Analysis", value: 72 },
    { name: "Advanced Excel", value: 82 },
    { name: "Google Workspace", value: 92 },
    { name: "Microsoft 365", value: 88 },
    { name: "GitHub", value: 68 },
  ],
  soft: [
    { name: "Teamwork & Collaboration", value: 94 },
    { name: "Time Management", value: 88 },
    { name: "Adaptability", value: 96 },
    { name: "Rapid learning · high attention to detail", value: 91 },
    { name: "Professional verbal / written English", value: 93 },
    { name: "Customer enquiry handling", value: 97 },
  ],
} as const;

const certificates = [
  { title: "AI for Everyone", url: "/manus-storage/AI-for-Everyone_Rebecca-Adams_5bd21a53.pdf", status: "Certificate PDF" },
  { title: "Google AI Essentials", url: "/manus-storage/Google-AI-Essentials_Rebecca-Adams_0442c889.pdf", status: "Certificate PDF" },
  { title: "Introduction To Generative AI", url: "/manus-storage/Introduction-to-Generative-AI_Rebecca-Adams_1dc93601.pdf", status: "Certificate PDF" },
  { title: "Prompt Engineering Basics", url: "/manus-storage/Prompt-Engineering-Basics_Rebecca-Adams_edfd51ea.pdf", status: "Certificate PDF" },
  { title: "Business Analysis Fundamentals", url: "/manus-storage/Business-Analysis-Fundamentals_Rebecca-Adams_4474b629.webp", status: "Microsoft · Certificate image", image: true },
  { title: "Python for Data Science, AI & Development", url: "/manus-storage/Python-for-Data-Science-AI-and-Development_Rebecca-Adams_7317dfde.pdf", status: "Certificate PDF" },
  { title: "Supervised Machine Learning", url: "/manus-storage/Supervised-Machine-Learning_Rebecca-Adams_0e8f3738.pdf", status: "Certificate PDF" },
];

const initialForm = { name: "", email: "", message: "" };

type FormState = "idle" | "sending" | "success" | "error" | "unconfigured";
type FormErrors = Partial<Record<keyof typeof initialForm, string>>;

type SkillCategory = keyof typeof skillMatrix;

function useInView<T extends Element>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function useTypewriter(phrases: string[]) {
  const [text, setText] = useState(phrases[0] ?? "");
  useEffect(() => {
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timer: number;
    const tick = () => {
      const phrase = phrases[phraseIndex] ?? "";
      characterIndex += deleting ? -1 : 1;
      setText(phrase.slice(0, characterIndex));
      if (!deleting && characterIndex >= phrase.length) {
        deleting = true;
        timer = window.setTimeout(tick, 1550);
        return;
      }
      if (deleting && characterIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      timer = window.setTimeout(tick, deleting ? 46 : 82);
    };
    timer = window.setTimeout(tick, 900);
    return () => window.clearTimeout(timer);
  }, [phrases]);
  return text;
}

function useCountUp(target: number, enabled: boolean, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, enabled, target]);
  return value;
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeCertificate, setActiveCertificate] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [resumeFeedback, setResumeFeedback] = useState(false);
  const [skillCategory, setSkillCategory] = useState<SkillCategory>("soft");
  const [aboutRef, aboutVisible] = useInView<HTMLElement>();
  const [journeyRef, journeyVisible] = useInView<HTMLElement>();
  const [skillsRef, skillsVisible] = useInView<HTMLElement>();
  const [workRef, workVisible] = useInView<HTMLElement>();
  const [credentialsRef, credentialsVisible] = useInView<HTMLElement>();
  const [impactRef, impactVisible] = useInView<HTMLDivElement>();
  const [githubRef, githubVisible] = useInView<HTMLDivElement>();
  const [githubStatus, setGithubStatus] = useState<GitHubStatus>("loading");
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);
  const [githubActivity, setGithubActivity] = useState<GitHubActivity[]>([]);
  const [activeRoadmap, setActiveRoadmap] = useState(0);
  const [growthRef, growthVisible] = useInView<HTMLElement>();
  const [roadmapRef, roadmapVisible] = useInView<HTMLElement>();
  const [growthPaused, setGrowthPaused] = useState(false);
  const growthCarouselRef = useRef<HTMLDivElement | null>(null);
  const growthPauseTimer = useRef<number | null>(null);
  const resumeFeedbackTimer = useRef<number | null>(null);
  const typewriterText = useTypewriter(TYPEWRITER_PHRASES);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const projectsCount = useCountUp(3, impactVisible);
  const certificatesCount = useCountUp(7, impactVisible);
  const skillsCount = useCountUp(15, impactVisible);
  const selectedCertificate = certificates[activeCertificate];

  useEffect(() => {
    const controller = new AbortController();
    fetchGitHubActivity(controller.signal)
      .then(({ profile, activity }) => {
        setGithubProfile(profile);
        setGithubActivity(activity);
        setGithubStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setGithubStatus("error");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    let frame = 0;
    const handlePointerMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setParallax({ x: (event.clientX / window.innerWidth - 0.5) * 18, y: (event.clientY / window.innerHeight - 0.5) * 12 });
        frame = 0;
      });
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => { window.removeEventListener("pointermove", handlePointerMove); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    let lenis: { destroy: () => void } | undefined;
    let frame = 0;
    import("lenis").then(({ default: Lenis }) => {
      const smooth = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
      lenis = smooth;
      const raf = (time: number) => { smooth.raf(time); frame = requestAnimationFrame(raf); };
      frame = requestAnimationFrame(raf);
    });
    return () => { cancelAnimationFrame(frame); lenis?.destroy(); };
  }, []);

  const handleResumeDownload = () => {
    setResumeFeedback(true);
    if (resumeFeedbackTimer.current) window.clearTimeout(resumeFeedbackTimer.current);
    resumeFeedbackTimer.current = window.setTimeout(() => setResumeFeedback(false), 1700);
  };

  useEffect(() => {
    if (growthPaused) return;
    const autoPlay = window.setInterval(() => {
      growthCarouselRef.current?.scrollBy({ left: 360, behavior: "smooth" });
    }, 7200);
    return () => window.clearInterval(autoPlay);
  }, [growthPaused]);

  const pauseGrowth = () => {
    if (growthPauseTimer.current) window.clearTimeout(growthPauseTimer.current);
    setGrowthPaused(true);
  };

  const resumeGrowth = () => {
    if (growthPauseTimer.current) window.clearTimeout(growthPauseTimer.current);
    setGrowthPaused(false);
  };

  const handleGrowthKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    pauseGrowth();
    growthCarouselRef.current?.scrollBy({ left: event.key === "ArrowRight" ? 360 : -360, behavior: "smooth" });
    growthPauseTimer.current = window.setTimeout(resumeGrowth, 8000);
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!form.name.trim()) errors.name = "Please add your name.";
    else if (form.name.trim().length < 2) errors.name = "Please enter at least two characters.";
    if (!form.email.trim()) errors.email = "Please add your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Please enter a valid email address.";
    if (!form.message.trim()) errors.message = "Please tell Rebecca a little about your enquiry.";
    else if (form.message.trim().length < 12) errors.message = "Please add a little more detail so Rebecca can respond usefully.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateFormField = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
    if (formState === "success" || formState === "error") setFormState("idle");
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (!FORMSPREE_ENDPOINT) {
      setFormState("unconfigured");
      return;
    }
    setFormState("sending");
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, { method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ ...form, _subject: `Portfolio enquiry from ${form.name}` }) });
      if (!response.ok) throw new Error("Unable to deliver message");
      setForm(initialForm);
      setFormErrors({});
      setFormState("success");
    } catch {
      setFormState("error");
    }
  };

  return (
    <main className="site-shell">
      <header className="masthead">
        <a href="#top" className="brand" aria-label="Rebecca Adams home"><img src={LOGO_URL} alt="" className="brand-mark" /><span><b>Rebecca</b><i>Adams</i></span></a>
        <nav className="nav-links" aria-label="Primary navigation"><a href="#about">Story</a><a href="#work">Selected work</a><a href="#contact">Contact</a></nav>
        <div className="masthead-actions"><a className="nav-cv" href={CV_URL} target="_blank" rel="noreferrer"><Download size={14} /> CV</a><button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</button></div>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-grain" />
        <div className="hero-ambient" aria-hidden="true"><span className="ambient-glyph glyph-code" style={{ transform: `translate3d(${parallax.x * 0.32}px, ${parallax.y * 0.32}px, 0)` }}>&lt;/&gt;</span><span className="ambient-glyph glyph-spark" style={{ transform: `translate3d(${parallax.x * -0.22}px, ${parallax.y * -0.22}px, 0)` }}>✦</span><span className="ambient-ring ring-one" style={{ transform: `translate3d(${parallax.x * 0.18}px, ${parallax.y * 0.18}px, 0)` }} /><span className="ambient-ring ring-two" style={{ transform: `translate3d(${parallax.x * -0.14}px, ${parallax.y * -0.14}px, 0)` }} /></div>
        <div className="hero-copy"><p className="eyebrow hero-kicker"><span className="dot" /> Cape Town, South Africa <span>•</span> Available for junior roles</p><p className="hero-intro">Hello, I’m Rebecca —</p><h1 id="hero-title">Junior<br /><em>Web Developer</em></h1><p className="hero-typewriter" aria-live="polite"><span>{typewriterText}</span><i aria-hidden="true" /></p><p className="hero-summary">An emerging tech professional bringing creative, solution-based web development from a strong customer service foundation.</p><div className="hero-actions"><a className="button-primary" href="#work">View selected work <ArrowDownRight size={18} /></a><a className="button-outline hero-resume" href={CV_URL} target="_blank" rel="noreferrer" download onClick={handleResumeDownload}>Download resume <Download size={16} /></a><a className="text-link hero-text-resume" href={TEXT_RESUME_URL} target="_blank" rel="noreferrer" download onClick={handleResumeDownload}>Plain-text version <Download size={14} /></a>{resumeFeedback && <span className="resume-download-feedback" role="status" aria-live="polite"><b>✓</b><i /><i /><i /> Download ready</span>}<a className="text-link" href="#about">My story <ArrowRight size={15} /></a></div><div className="hero-credentials"><span>Currently building through</span><strong>CAPACITI</strong><span>12-month programme</span></div></div>
        <div className="hero-visual"><div className="hero-art" style={{ backgroundImage: `url(${HERO_ART_URL})` }} /><div className="portrait-wrap"><div className="portrait-frame"><img src={HEADSHOT_URL} alt="Rebecca Adams" /></div><p className="portrait-note">People-first<br />problem solver <Sparkles size={15} /></p></div><span className="hero-orbit orbit-one">CREATIVE TECH</span><span className="hero-orbit orbit-two">SYSTEMS &amp; STORIES</span></div>
        <a href="#about" className="hero-scroll"><span>Scroll to explore</span><i /></a>
      </section>

      <div className="ambient-field" aria-hidden="true"><span className="ambient-shape shape-one" /><span className="ambient-shape shape-two" /><span className="ambient-shape shape-three" /><span className="ambient-node node-one" /><span className="ambient-node node-two" /></div>

      <section ref={impactRef} className={`impact-row section-wrap reveal ${impactVisible ? "is-visible" : ""}`} aria-label="Measurable impact"><div className="impact-item"><strong>{projectsCount}</strong><span>concepts completed</span></div><div className="impact-item"><strong>{certificatesCount}</strong><span>learning records</span></div><div className="impact-item"><strong>{skillsCount}</strong><span>skills in practice</span></div><div className="impact-note">Small proof points.<br /><em>Real momentum.</em></div></section>

      <section ref={aboutRef} className={`about-section section-wrap reveal ${aboutVisible ? "is-visible" : ""}`} id="about" aria-labelledby="about-title">
        <div className="section-index"><span>01</span><i /> Profile</div><div className="about-layout"><div className="about-title-wrap"><p className="eyebrow">A career story in progress</p><h2 id="about-title">I build with <em>care</em>, clarity, and a belief that every new skill can open a door.</h2></div><div className="about-copy"><p>I entered the workforce straight after matriculating in 2024 to help support my family. That beginning taught me resilience, real-world accountability, and the value of listening carefully before offering a solution.</p><p>Customer service and claims processing sharpened my ability to move calmly through changing priorities. Then I discovered the creative logic of technology: design a better path, build it thoughtfully, and make someone’s day easier.</p><p>Today, I am growing rapidly through CAPACITI. I bring a grounded work ethic to web development — and a fresh eye for experiences that feel capable, clear, and human.</p><a className="button-outline" href={CV_URL} target="_blank" rel="noreferrer"><Download size={16} /> Download CV <span>PDF</span></a></div></div><div className="quote-band"><span>“</span><p>Creative solutions work best when they are built around the person using them.</p><i>R.A.</i></div>
      </section>

      <section ref={journeyRef} className={`journey-section section-wrap reveal ${journeyVisible ? "is-visible" : ""}`} aria-labelledby="journey-title">
        <div className="section-index"><span>02</span><i /> The pivot</div><div className="journey-intro"><div><p className="eyebrow">Customer service → creative technology</p><h2 id="journey-title">Transferable skills,<br /><em>new terrain.</em></h2></div><p>Every role has added a layer: responsive communication, accurate systems work, then technical curiosity. Together, they shape how I approach the web.</p></div>
        <ol className={`timeline enhanced-timeline timeline-track ${journeyVisible ? "is-drawn" : ""}`}>{timeline.map((item, index) => { const Icon = item.icon; return <li key={item.year} className={`${index % 2 ? "timeline-right" : "timeline-left"} timeline-node ${journeyVisible ? "is-lit" : ""}`} style={{ "--stagger": `${index * 90}ms` } as CSSProperties}><div className="timeline-marker"><span><Icon size={17} /></span></div><div className="timeline-year">{item.year}</div><article className="timeline-card"><span>{item.eyebrow}</span><h3>{item.title}</h3><p>{item.body}</p></article></li>; })}</ol>
        <div className="pivot-pill"><BriefcaseBusiness size={16} /><span>Customer insight</span><i>→</i><span>Digital problem-solving</span></div>
      </section>

      <section ref={growthRef} className={`growth-section section-wrap reveal ${growthVisible ? "is-visible" : ""}`} aria-labelledby="growth-title"><div className="section-index"><span>03</span><i /> Mentorship &amp; growth</div><div className="growth-heading"><div><p className="eyebrow">Room for real voices</p><h2 id="growth-title">What people<br /><em>say.</em></h2></div><p>A few verified reflections from colleagues who have worked alongside Rebecca — sharing the qualities they have seen in practice: reliability, initiative, clarity, and generous collaboration.</p></div><div className={`growth-carousel ${growthPaused ? "is-paused" : "is-playing"}`} ref={growthCarouselRef} tabIndex={0} onKeyDown={handleGrowthKeyDown} onMouseEnter={pauseGrowth} onMouseLeave={resumeGrowth} onFocus={pauseGrowth} onBlur={resumeGrowth} aria-label="Colleague reflections. Auto-playing every 7 seconds; use the left and right arrow keys to browse." aria-roledescription="carousel">{growthSlots.map((slot) => <article className="growth-card" key={slot.mark}><span className="growth-mark">{slot.mark}</span><div className="growth-card-meta"><div><p className="growth-label">{slot.label}</p><small>{slot.role}</small></div>{slot.linkedin ? <a href={slot.linkedin} target="_blank" rel="noreferrer" className="growth-linkedin" aria-label={slot.profileLabel} title="Open LinkedIn profile"><Linkedin size={15} /></a> : <span className="growth-linkedin is-unavailable" role="img" aria-label={slot.profileLabel} title={slot.profileLabel}><Linkedin size={15} /></span>}</div><h3>{slot.title}</h3><p>{slot.body}</p><span className="growth-placeholder">Verified colleague quote</span></article>)}</div></section>

      <section ref={roadmapRef} className={`roadmap-section section-wrap reveal ${roadmapVisible ? "is-visible" : ""}`} aria-labelledby="roadmap-title"><div className="section-index"><span>04</span><i /> Current journey</div><div className="roadmap-heading"><div><p className="eyebrow">CAPACITI · 12-month programme</p><h2 id="roadmap-title">Learning in<br /><em>layers.</em></h2></div><p>Tap a phase to see the specific capabilities Rebecca is building next, from dependable interfaces to integrated AI and full-stack thinking.</p></div><div className="roadmap-track" role="tablist" aria-label="CAPACITI learning phases">{roadmap.map((item, index) => { const Icon = item.icon; return <button key={item.phase} className={`roadmap-node ${activeRoadmap === index ? "is-active" : ""}`} role="tab" aria-selected={activeRoadmap === index} onClick={() => setActiveRoadmap(index)}><span className="roadmap-dot"><Icon size={16} /></span><span><b>{item.phase}</b><strong>{item.title}</strong></span></button>; })}</div><article className="roadmap-detail" role="tabpanel"><span>{roadmap[activeRoadmap].phase} · active focus</span><h3>{roadmap[activeRoadmap].title}</h3><p>{roadmap[activeRoadmap].detail}</p><ChevronRight size={18} /></article></section>

      <section ref={skillsRef} className={`skills-section section-wrap reveal ${skillsVisible ? "is-visible" : ""}`} aria-labelledby="skills-title"><div className="section-index"><span>05</span><i /> Toolkit</div><div className="skills-top"><div><p className="eyebrow">What I bring to the table</p><h2 id="skills-title">Skill, <em>with</em><br /> context.</h2></div><p>My toolkit is both technical and human. I’m attentive to the details inside a system — and to the people moving through it.</p></div><div className="skill-switcher" role="tablist" aria-label="Skill categories"><button className={skillCategory === "soft" ? "is-active" : ""} onClick={() => setSkillCategory("soft")} role="tab" aria-selected={skillCategory === "soft"}>Human &amp; workplace</button><button className={skillCategory === "technical" ? "is-active" : ""} onClick={() => setSkillCategory("technical")} role="tab" aria-selected={skillCategory === "technical"}>Tools &amp; technical</button></div><div className="skill-matrix" role="list" aria-label={`${skillCategory} skills`}>{skillMatrix[skillCategory].map((skill, index) => <div className="skill-meter" role="listitem" key={skill.name} style={{ "--skill-value": `${skill.value}%`, "--stagger": `${index * 70}ms` } as CSSProperties}><div><span>{skill.name}</span><b>{skill.value}%</b></div><i><em className={skillsVisible ? "is-filled" : ""} /></i></div>)}</div><div className="skill-cloud skill-cloud-compact" role="list" aria-label="Additional skills">{skills.filter(skill => !skillMatrix[skillCategory].some(item => item.name.toLowerCase() === skill.name.toLowerCase())).slice(0, 6).map((skill, index) => <span key={skill.name} role="listitem" className={`skill skill-${skill.type.toLowerCase()} skill-${(index % 5) + 1}`}><small>{skill.type}</small>{skill.name}</span>)}</div></section>

      <section ref={workRef} className={`work-section reveal ${workVisible ? "is-visible" : ""}`} id="work" aria-labelledby="work-title"><div className="work-header section-wrap"><div className="section-index light-index"><span>06</span><i /> Selected work</div><div className="work-heading"><div><p className="eyebrow">Small details. Bigger possibility.</p><h2 id="work-title">Ideas, made<br /><em>useful.</em></h2></div><p>Three concept-to-interface studies that bring together product empathy, practical constraints, and clear digital journeys.</p></div></div><div className="project-rail">{projects.map((project) => <article key={project.id} className="project-card tactile-card reveal-child" style={{ "--stagger": `${Number(project.id) * 100}ms` } as CSSProperties}><div className="project-card-top"><span className="project-number">{project.id}</span><span className="project-category">{project.category}</span></div><h3>{project.title}</h3><div className="project-dossier"><div><span>Problem</span><p>{project.problem}</p></div><div><span>Solution</span><p>{project.solution}</p></div><div className="result"><span>Result</span><p>{project.result}</p></div><div className="project-footer"><div>{project.tags.map(tag => <b key={tag}>{tag}</b>)}</div><div className="project-links"><a href={project.repo} target="_blank" rel="noreferrer">GitHub <Github size={14} /></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live <ExternalLink size={14} /></a>}</div></div></div></article>)}</div></section>

      <section ref={credentialsRef} className={`credentials-section section-wrap reveal ${credentialsVisible ? "is-visible" : ""}`} aria-labelledby="credentials-title"><div className="section-index"><span>07</span><i /> Certificates</div><div className="credentials-heading"><div><p className="eyebrow">Coursera learning record</p><h2 id="credentials-title">Credentials,<br /><em>on display.</em></h2></div><p>Select a certificate to read it directly on the page. Each card is ready for its dedicated source document, creating a clear, employer-friendly evidence library.</p></div><div className="certificate-library"><div className="certificate-list" role="tablist" aria-label="Coursera certificate documents">{certificates.map((certificate, index) => <button key={certificate.title} role="tab" aria-selected={activeCertificate === index} onClick={() => setActiveCertificate(index)} className={`certificate-tab reveal-child ${activeCertificate === index ? "is-active" : ""}`} style={{ "--stagger": `${index * 70}ms` } as CSSProperties}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{certificate.title}</b><i>{certificate.status}</i></div><ArrowRight size={16} /></button>)}</div><div className="certificate-viewer" role="tabpanel" aria-label={selectedCertificate.title}><div className="viewer-toolbar"><span><Award size={15} /> Coursera certificate</span><a href={selectedCertificate.url} target="_blank" rel="noreferrer">Open source <ExternalLink size={14} /></a></div>{selectedCertificate.image ? <img className="certificate-image" src={selectedCertificate.url} alt={`${selectedCertificate.title} certificate`} /> : <iframe title={`${selectedCertificate.title} certificate`} src={`${selectedCertificate.url}#view=FitH`} />}</div></div></section>

      <div ref={githubRef} className={`github-dashboard section-wrap reveal ${githubVisible ? "is-visible" : ""}`} aria-label="GitHub activity"><div className="github-copy"><p className="eyebrow">Live GitHub activity</p><h2>Work in <em>public.</em></h2><p>Adam and this portfolio read Rebecca’s public GitHub feed directly, so visitors can see what she has been shipping most recently.</p><div className="github-statline"><strong>{githubProfile?.public_repos ?? "—"}</strong><span>public repositories</span><strong>{githubActivity.length || "—"}</strong><span>recent commits found</span></div><a href={`https://github.com/${GITHUB_LOGIN}`} target="_blank" rel="noreferrer">Visit GitHub <Github size={15} /></a></div><div className="github-feed" aria-live="polite"><div className="github-feed-heading"><span>Latest commit notes</span><span>{githubStatus === "loading" ? "Refreshing…" : githubStatus === "ready" ? "Live now" : "Temporarily unavailable"}</span></div>{githubStatus === "loading" && <p className="github-feed-empty">Reading the public activity feed…</p>}{githubStatus === "error" && <p className="github-feed-empty">GitHub’s public feed is taking a quiet moment. Adam will still answer from Rebecca’s portfolio profile.</p>}{githubStatus === "ready" && githubActivity.length === 0 && <p className="github-feed-empty">No recent public commits were returned. Visit GitHub for the full repository history.</p>}{githubStatus === "ready" && githubActivity.slice(0, 5).map((activity) => <a className="github-commit" key={activity.id} href={activity.commitUrl} target="_blank" rel="noreferrer"><span className="github-commit-dot" /><div><strong>{activity.message}</strong><small>{activity.repo} · {formatRelativeDate(activity.date)} · {activity.sha}</small></div><ExternalLink size={14} /></a>)}</div><div className="github-meta"><span>{githubProfile?.name ?? "Rebecca Adams"} · @{GITHUB_LOGIN}</span><span>{githubStatus === "ready" ? "Public commits · refreshed on visit" : "Public activity feed"}</span></div></div>

      <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="contact-ambient" aria-hidden="true"><span className="ambient-glyph contact-code" style={{ transform: `translate3d(${parallax.x * 0.24}px, ${parallax.y * 0.24}px, 0)` }}>&lt;/&gt;</span><span className="ambient-glyph contact-spark" style={{ transform: `translate3d(${parallax.x * -0.18}px, ${parallax.y * -0.18}px, 0)` }}>✦</span><span className="ambient-ring contact-ring" style={{ transform: `translate3d(${parallax.x * 0.13}px, ${parallax.y * 0.13}px, 0)` }} /></div><div className="contact-left"><div className="section-index contact-index"><span>08</span><i /> Say hello</div><p className="eyebrow">Open to potential employers &amp; recruiters</p><h2 id="contact-title">Let’s make<br />something <em>clearer.</em></h2><p className="contact-note">This inbox is open to hiring managers, recruiters, and collaborators looking for a thoughtful junior web developer. If you see a role where curiosity, reliability, and people-centred problem-solving would add value, I would be glad to connect.</p><div className="social-links"><a href="mailto:camissa.adams17@gmail.com"><Mail size={16} /> Email me</a><a href="https://github.com/rebeccacamissa" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a><a href="https://www.linkedin.com/in/rebecca-adams-tech" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a></div></div><form className="contact-form" onSubmit={submitForm} noValidate><div className="form-heading"><span>New message</span><p>Your message will be securely routed to Rebecca’s inbox.</p></div><label className={formErrors.name ? "has-error" : ""}>Your name<input name="name" required value={form.name} onChange={event => updateFormField("name", event.target.value)} placeholder="How should I say hello?" aria-invalid={Boolean(formErrors.name)} aria-describedby={formErrors.name ? "name-error" : undefined} />{formErrors.name && <span className="field-error" id="name-error" role="alert">{formErrors.name}</span>}</label><label className={formErrors.email ? "has-error" : ""}>Email address<input name="email" required type="email" value={form.email} onChange={event => updateFormField("email", event.target.value)} placeholder="you@example.com" aria-invalid={Boolean(formErrors.email)} aria-describedby={formErrors.email ? "email-error" : undefined} />{formErrors.email && <span className="field-error" id="email-error" role="alert">{formErrors.email}</span>}</label><label className={formErrors.message ? "has-error" : ""}>Message<textarea name="message" required value={form.message} onChange={event => updateFormField("message", event.target.value)} placeholder="What would you like to build?" rows={4} aria-invalid={Boolean(formErrors.message)} aria-describedby={formErrors.message ? "message-error" : undefined} />{formErrors.message && <span className="field-error" id="message-error" role="alert">{formErrors.message}</span>}</label><button className="button-send" type="submit" disabled={formState === "sending"} aria-busy={formState === "sending"}>{formState === "sending" ? <><Loader2 className="submit-spinner" size={16} aria-hidden="true" /> Sending securely…</> : <>Send message <Send size={17} /></>}</button>{formState === "success" && <p className="form-success" role="status" aria-live="polite">Thank you — your message has been sent directly to Rebecca. She’ll be in touch as soon as possible.</p>}{formState === "error" && <p className="form-error" role="alert">Your message could not be sent. Please try again or email Rebecca directly.</p>}{formState === "unconfigured" && <p className="form-error" role="alert">The secure form endpoint still needs to be connected. Please email Rebecca directly for now.</p>}</form></section>

      <footer><span>© {new Date().getFullYear()} Rebecca Adams</span><span>Built with care in Cape Town</span><a href="#top">Back to top <ArrowRight size={13} /></a></footer><CatAssistant cvUrl={CV_URL} githubActivity={githubActivity} githubStatus={githubStatus} />
    </main>
  );
}
