/* Camel Editorial Atelier: asymmetric editorial folio, warm parchment surfaces, expressive DM Serif display type, and precision Manrope utility text. */
import { useState, type FormEvent } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Code2,
  Coffee,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Moon,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import CatAssistant from "@/components/CatAssistant";

const CV_URL = "/manus-storage/Rebecca-Adams-CV_31bdf2d7.pdf";
const HEADSHOT_URL = "/manus-storage/rebecca-adams-headshot_2abac0ae.jpeg";
const HERO_ART_URL = "/manus-storage/rebecca-editorial-hero_5ee1710e.jpg";
const LOGO_URL = "/manus-storage/rebecca-ra-emblem_d4e7c3e6.png";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnpqaoby";

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

const certificates = [
  { title: "AI for Everyone", url: "/manus-storage/AI-for-Everyone_Rebecca-Adams_5bd21a53.pdf", status: "Certificate PDF" },
  { title: "Google AI Essentials", url: "/manus-storage/Google-AI-Essentials_Rebecca-Adams_0442c889.pdf", status: "Certificate PDF" },
  { title: "Introduction To Generative AI", url: "/manus-storage/Introduction-to-Generative-AI_Rebecca-Adams_1dc93601.pdf", status: "Certificate PDF" },
  { title: "Prompt Engineering Basics", url: "/manus-storage/Prompt-Engineering-Basics_Rebecca-Adams_edfd51ea.pdf", status: "Certificate PDF" },
  { title: "Business Analysis Fundamentals", url: "/manus-storage/Business-Analysis-Fundamentals_Rebecca-Adams_4474b629.webp", status: "Certificate image", image: true },
  { title: "Python for Data Science, AI & Development", url: "/manus-storage/Python-for-Data-Science-AI-and-Development_Rebecca-Adams_7317dfde.pdf", status: "Certificate PDF" },
  { title: "Supervised Machine Learning", url: "/manus-storage/Supervised-Machine-Learning_Rebecca-Adams_0e8f3738.pdf", status: "Certificate PDF" },
];

type FormState = "idle" | "sending" | "success" | "error" | "unconfigured";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeCertificate, setActiveCertificate] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formState, setFormState] = useState<FormState>("idle");
  const selectedCertificate = certificates[activeCertificate];

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!FORMSPREE_ENDPOINT) {
      setFormState("unconfigured");
      return;
    }
    setFormState("sending");
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, { method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ ...form, _subject: `Portfolio enquiry from ${form.name}` }) });
      if (!response.ok) throw new Error("Unable to deliver message");
      setForm({ name: "", email: "", message: "" });
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
        <div className="hero-copy"><p className="eyebrow hero-kicker"><span className="dot" /> Cape Town, South Africa <span>•</span> Available for junior roles</p><p className="hero-intro">Hello, I’m Rebecca —</p><h1 id="hero-title">Junior<br /><em>Web Developer</em></h1><p className="hero-summary">An emerging tech professional bringing creative, solution-based web development from a strong customer service foundation.</p><div className="hero-actions"><a className="button-primary" href="#work">View selected work <ArrowDownRight size={18} /></a><a className="text-link" href="#about">My story <ArrowRight size={15} /></a></div><div className="hero-credentials"><span>Currently building through</span><strong>CAPACITI</strong><span>12-month programme</span></div></div>
        <div className="hero-visual"><div className="hero-art" style={{ backgroundImage: `url(${HERO_ART_URL})` }} /><div className="portrait-wrap"><div className="portrait-frame"><img src={HEADSHOT_URL} alt="Rebecca Adams" /></div><p className="portrait-note">People-first<br />problem solver <Sparkles size={15} /></p></div><span className="hero-orbit orbit-one">CREATIVE TECH</span><span className="hero-orbit orbit-two">SYSTEMS &amp; STORIES</span></div>
        <a href="#about" className="hero-scroll"><span>Scroll to explore</span><i /></a>
      </section>

      <section className="about-section section-wrap" id="about" aria-labelledby="about-title">
        <div className="section-index"><span>01</span><i /> Profile</div><div className="about-layout"><div className="about-title-wrap"><p className="eyebrow">A career story in progress</p><h2 id="about-title">I build with <em>care</em>, clarity, and a belief that every new skill can open a door.</h2></div><div className="about-copy"><p>I entered the workforce straight after matriculating in 2024 to help support my family. That beginning taught me resilience, real-world accountability, and the value of listening carefully before offering a solution.</p><p>Customer service and claims processing sharpened my ability to move calmly through changing priorities. Then I discovered the creative logic of technology: design a better path, build it thoughtfully, and make someone’s day easier.</p><p>Today, I am growing rapidly through CAPACITI. I bring a grounded work ethic to web development — and a fresh eye for experiences that feel capable, clear, and human.</p><a className="button-outline" href={CV_URL} target="_blank" rel="noreferrer"><Download size={16} /> Download CV <span>PDF</span></a></div></div><div className="quote-band"><span>“</span><p>Creative solutions work best when they are built around the person using them.</p><i>R.A.</i></div>
      </section>

      <section className="journey-section section-wrap" aria-labelledby="journey-title">
        <div className="section-index"><span>02</span><i /> The pivot</div><div className="journey-intro"><div><p className="eyebrow">Customer service → creative technology</p><h2 id="journey-title">Transferable skills,<br /><em>new terrain.</em></h2></div><p>Every role has added a layer: responsive communication, accurate systems work, then technical curiosity. Together, they shape how I approach the web.</p></div>
        <ol className="timeline enhanced-timeline">{timeline.map((item, index) => { const Icon = item.icon; return <li key={item.year} className={index % 2 ? "timeline-right" : "timeline-left"}><div className="timeline-marker"><span><Icon size={17} /></span></div><div className="timeline-year">{item.year}</div><article className="timeline-card"><span>{item.eyebrow}</span><h3>{item.title}</h3><p>{item.body}</p></article></li>; })}</ol>
        <div className="pivot-pill"><BriefcaseBusiness size={16} /><span>Customer insight</span><i>→</i><span>Digital problem-solving</span></div>
      </section>

      <section className="skills-section section-wrap" aria-labelledby="skills-title"><div className="section-index"><span>03</span><i /> Toolkit</div><div className="skills-top"><div><p className="eyebrow">What I bring to the table</p><h2 id="skills-title">Skill, <em>with</em><br /> context.</h2></div><p>My toolkit is both technical and human. I’m attentive to the details inside a system — and to the people moving through it.</p></div><div className="skill-cloud" role="list" aria-label="Rebecca's skills">{skills.map((skill, index) => <span key={skill.name} role="listitem" className={`skill skill-${skill.type.toLowerCase()} skill-${(index % 5) + 1}`}><small>{skill.type}</small>{skill.name}</span>)}</div></section>

      <section className="work-section" id="work" aria-labelledby="work-title"><div className="work-header section-wrap"><div className="section-index light-index"><span>04</span><i /> Selected work</div><div className="work-heading"><div><p className="eyebrow">Small details. Bigger possibility.</p><h2 id="work-title">Ideas, made<br /><em>useful.</em></h2></div><p>Three concept-to-interface studies that bring together product empathy, practical constraints, and clear digital journeys.</p></div></div><div className="project-rail">{projects.map((project) => <article key={project.id} className="project-card"><div className="project-card-top"><span className="project-number">{project.id}</span><span className="project-category">{project.category}</span></div><h3>{project.title}</h3><div className="project-dossier"><div><span>Problem</span><p>{project.problem}</p></div><div><span>Solution</span><p>{project.solution}</p></div><div className="result"><span>Result</span><p>{project.result}</p></div><div className="project-footer"><div>{project.tags.map(tag => <b key={tag}>{tag}</b>)}</div><div className="project-links"><a href={project.repo} target="_blank" rel="noreferrer">GitHub <Github size={14} /></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live <ExternalLink size={14} /></a>}</div></div></div></article>)}</div></section>

      <section className="credentials-section section-wrap" aria-labelledby="credentials-title"><div className="section-index"><span>05</span><i /> Certificates</div><div className="credentials-heading"><div><p className="eyebrow">Coursera learning record</p><h2 id="credentials-title">Credentials,<br /><em>on display.</em></h2></div><p>Select a certificate to read it directly on the page. Each card is ready for its dedicated source document, creating a clear, employer-friendly evidence library.</p></div><div className="certificate-library"><div className="certificate-list" role="tablist" aria-label="Coursera certificate documents">{certificates.map((certificate, index) => <button key={certificate.title} role="tab" aria-selected={activeCertificate === index} onClick={() => setActiveCertificate(index)} className={`certificate-tab ${activeCertificate === index ? "is-active" : ""}`}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{certificate.title}</b><i>{certificate.status}</i></div><ArrowRight size={16} /></button>)}</div><div className="certificate-viewer" role="tabpanel" aria-label={selectedCertificate.title}><div className="viewer-toolbar"><span><Award size={15} /> Coursera certificate</span><a href={selectedCertificate.url} target="_blank" rel="noreferrer">Open source <ExternalLink size={14} /></a></div>{selectedCertificate.image ? <img className="certificate-image" src={selectedCertificate.url} alt={`${selectedCertificate.title} certificate`} /> : <iframe title={`${selectedCertificate.title} certificate`} src={`${selectedCertificate.url}#view=FitH`} />}</div></div></section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="contact-left"><div className="section-index contact-index"><span>06</span><i /> Say hello</div><p className="eyebrow">Open to potential employers &amp; recruiters</p><h2 id="contact-title">Let’s make<br />something <em>clearer.</em></h2><p className="contact-note">This inbox is open to hiring managers, recruiters, and collaborators looking for a thoughtful junior web developer. If you see a role where curiosity, reliability, and people-centred problem-solving would add value, I would be glad to connect.</p><div className="social-links"><a href="mailto:camissa.adams17@gmail.com"><Mail size={16} /> Email me</a><a href="https://github.com/rebeccacamissa" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a><a href="https://www.linkedin.com/in/rebecca-adams-tech" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a></div></div><form className="contact-form" onSubmit={submitForm}><div className="form-heading"><span>New message</span><p>Your message will be securely routed to Rebecca’s inbox.</p></div><label>Your name<input name="name" required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="How should I say hello?" /></label><label>Email address<input name="email" required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label><label>Message<textarea name="message" required value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} placeholder="What would you like to build?" rows={4} /></label><button className="button-send" type="submit" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Send message"} <Send size={17} /></button>{formState === "success" && <p className="form-success">Thank you — your message has been sent directly to Rebecca.</p>}{formState === "error" && <p className="form-error">Your message could not be sent. Please try again or email Rebecca directly.</p>}{formState === "unconfigured" && <p className="form-error">The secure form endpoint still needs to be connected. Please email Rebecca directly for now.</p>}</form></section>

      <footer><span>© {new Date().getFullYear()} Rebecca Adams</span><span>Built with care in Cape Town</span><a href="#top">Back to top <ArrowRight size={13} /></a></footer><CatAssistant cvUrl={CV_URL} />
    </main>
  );
}
