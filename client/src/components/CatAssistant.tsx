/* Camel Editorial Atelier: Rebecca's cat guide remains an unboxed, transparent and quietly playful part of the parchment editorial system. */
import { Download, MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CatMood = "excited" | "normal" | "sleeping";
type CatAnswer = "welcome" | "about" | "skills" | "resume";

const CAT_IMAGES: Record<CatMood, string> = {
  excited: "/manus-storage/rebecca-cat-excited_1a4a1ef1.png",
  normal: "/manus-storage/rebecca-cat-normal_b1705901.png",
  sleeping: "/manus-storage/rebecca-cat-sleeping_a76e0b0c.png",
};

const responses: Record<CatAnswer, string> = {
  welcome: "Welcome in — I saved the details that show how Rebecca thinks, learns, and turns everyday problems into clearer digital experiences.",
  about: "Rebecca is an emerging junior web developer with a resilient, people-centred foundation. After matriculating in 2024, she entered the workforce to support her family, building composure and accountability in customer-facing and operations roles. That experience sparked a fascination with creative technology: she now uses CAPACITI’s intensive programme to turn practical insight into thoughtful, user-aware digital work.",
  skills: "Rebecca combines the reliability of a customer-service professional with a growing digital toolkit. She brings precise data handling, Google Workspace and Microsoft 365 fluency, UX-minded problem-solving, and a strong instinct for clear communication. Just as importantly, her teamwork, time management, adaptability, and rapid-learning mindset help her contribute steadily in fast-moving environments while she continues to build technical depth.",
  resume: "Rebecca’s CV is opening in a new tab. It offers a focused view of her operations experience, data and digital-skills training, customer-service strengths, and current direction as a junior web developer. Thank you for taking the time to learn more about the person behind the portfolio.",
};

export default function CatAssistant({ cvUrl }: { cvUrl: string }) {
  const [mood, setMood] = useState<CatMood>("excited");
  const [open, setOpen] = useState(true);
  const [answer, setAnswer] = useState<CatAnswer>("welcome");
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sleepTimer: ReturnType<typeof setTimeout>;
    const setActive = () => {
      setMood("normal");
      if (answer === "welcome") setAnswer("welcome");
      clearTimeout(sleepTimer);
      sleepTimer = setTimeout(() => setMood("sleeping"), 11500);
    };

    const trackEyes = (event: MouseEvent) => {
      const bounds = mascotRef.current?.getBoundingClientRect();
      if (bounds) {
        const eyeCenterX = bounds.left + bounds.width * 0.62;
        const eyeCenterY = bounds.top + bounds.height * 0.25;
        const angle = Math.atan2(event.clientY - eyeCenterY, event.clientX - eyeCenterX);
        setPupil({ x: Math.cos(angle) * 1.5, y: Math.sin(angle) * 1.5 });
      }
      setActive();
    };

    const initialTimer = setTimeout(setActive, 3800);
    window.addEventListener("mousemove", trackEyes, { passive: true });
    window.addEventListener("scroll", setActive, { passive: true });
    window.addEventListener("keydown", setActive);
    window.addEventListener("touchstart", setActive, { passive: true });

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(sleepTimer);
      window.removeEventListener("mousemove", trackEyes);
      window.removeEventListener("scroll", setActive);
      window.removeEventListener("keydown", setActive);
      window.removeEventListener("touchstart", setActive);
    };
  }, [answer]);

  const chooseAnswer = (kind: Exclude<CatAnswer, "welcome">) => {
    setMood(kind === "resume" ? "excited" : "normal");
    setAnswer(kind);
    if (kind === "resume") window.open(cvUrl, "_blank", "noopener,noreferrer");
  };

  if (!open) {
    return <button className="cat-reopen" onClick={() => setOpen(true)} aria-label="Open Rebecca's portfolio assistant"><img src={CAT_IMAGES.normal} alt="Rebecca's cat portfolio guide" /></button>;
  }

  return (
    <aside className={`cat-assistant cat-${mood}`} aria-label="Rebecca's portfolio guide">
      <div className="cat-copy">
        <span className="cat-status"><MessageCircle size={13} /> Portfolio guide</span>
        <p>{mood === "sleeping" && answer === "welcome" ? "I’m recharging for a moment. Move your cursor or use a prompt when you’re ready." : responses[answer]}</p>
      </div>
      <div className="cat-mascot" ref={mascotRef} aria-hidden="true">
        <img src={CAT_IMAGES[mood]} alt="" />
        {mood === "normal" && <><i className="cat-eye cat-eye-left" style={{ transform: `translate(${pupil.x}px, ${pupil.y}px)` }} /><i className="cat-eye cat-eye-right" style={{ transform: `translate(${pupil.x}px, ${pupil.y}px)` }} /></>}
      </div>
      <button className="cat-close" onClick={() => setOpen(false)} aria-label="Close portfolio guide"><X size={14} /></button>
      <div className="cat-prompts">
        <button onClick={() => chooseAnswer("about")}>Tell me about Rebecca</button>
        <button onClick={() => chooseAnswer("skills")}>What are her core skills?</button>
        <button className="cat-download" onClick={() => chooseAnswer("resume")}><Download size={13} /> Download résumé</button>
      </div>
    </aside>
  );
}
