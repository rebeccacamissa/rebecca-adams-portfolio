/* Camel Editorial Atelier: a transparent, multi-frame cat sprite gives the portfolio a living edge detail; help remains entirely visitor-initiated. */
import { Download, X } from "lucide-react";
import { useEffect, useRef, useState, type AnimationEvent } from "react";

type CatAnswer = "about" | "skills" | "resume";
type CatPhase = "excited" | "walking" | "resting" | "sleeping";
type Direction = "right" | "left";

const CAT_SPRITE_URL = "/manus-storage/rebecca-cat-walk-sprite_a7307c84.png";

const responses: Record<CatAnswer, string> = {
  about: "Rebecca is an emerging junior web developer with a resilient, people-centred foundation. After matriculating in 2024, she entered the workforce to support her family, building composure and accountability in customer-facing and operations roles. That experience sparked a fascination with creative technology: she now uses CAPACITI’s intensive programme to turn practical insight into thoughtful, user-aware digital work.",
  skills: "Rebecca combines the reliability of a customer-service professional with a growing digital toolkit. She brings precise data handling, Google Workspace and Microsoft 365 fluency, UX-minded problem-solving, and a strong instinct for clear communication. Just as importantly, her teamwork, time management, adaptability, and rapid-learning mindset help her contribute steadily in fast-moving environments while she continues to build technical depth.",
  resume: "Rebecca’s CV has opened in a new tab. It offers a focused view of her operations experience, data and digital-skills training, customer-service strengths, and current direction as a junior web developer. Thank you for taking the time to learn more about the person behind the portfolio.",
};

export default function CatAssistant({ cvUrl }: { cvUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState<CatAnswer | null>(null);
  const [phase, setPhase] = useState<CatPhase>("excited");
  const [direction, setDirection] = useState<Direction>("right");
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const beginIdleCountdown = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      setPhase(current => current === "sleeping" ? "walking" : current);
      idleTimer.current = setTimeout(() => setPhase("sleeping"), 15000);
    };

    const events: Array<keyof WindowEventMap> = ["mousemove", "scroll", "keydown", "touchstart"];
    events.forEach(event => window.addEventListener(event, beginIdleCountdown, { passive: true }));
    beginIdleCountdown();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      events.forEach(event => window.removeEventListener(event, beginIdleCountdown));
    };
  }, []);

  useEffect(() => {
    if (phase !== "excited" && phase !== "resting") return;
    const timer = setTimeout(() => {
      if (phase === "resting") setDirection(current => current === "right" ? "left" : "right");
      setPhase("walking");
    }, phase === "excited" ? 3000 : 4000);
    return () => clearTimeout(timer);
  }, [phase]);

  const chooseAnswer = (kind: CatAnswer) => {
    setAnswer(kind);
    if (kind === "resume") window.open(cvUrl, "_blank", "noopener,noreferrer");
  };

  const startRest = (event: AnimationEvent<HTMLButtonElement>) => {
    if (event.currentTarget === event.target && event.animationName.startsWith("cat-cross") && phase === "walking") setPhase("resting");
  };

  return (
    <aside className="cat-assistant" aria-label="Rebecca's portfolio helper">
      {isOpen && (
        <section className="cat-dialog" aria-live="polite">
          <button className="cat-close" onClick={() => setIsOpen(false)} aria-label="Close helper"><X size={14} /></button>
          <p className="cat-dialog-kicker">A small guide, when you need it</p>
          <p className="cat-answer">{answer ? responses[answer] : "Choose a topic to discover more about Rebecca’s journey and strengths."}</p>
          <div className="cat-options"><button onClick={() => chooseAnswer("about")}>About Rebecca</button><button onClick={() => chooseAnswer("skills")}>Core skills</button><button onClick={() => chooseAnswer("resume")}><Download size={13} /> Download résumé</button></div>
        </section>
      )}
      <button className={`cat-walker cat-${phase} facing-${direction}`} onClick={() => { setIsOpen(open => !open); setAnswer(null); }} onAnimationEnd={startRest} aria-expanded={isOpen} aria-label={isOpen ? "Close Rebecca's portfolio helper" : "Open Rebecca's portfolio helper"}>
        <span className="cat-sprite" style={{ backgroundImage: `url(${CAT_SPRITE_URL})` }} aria-hidden="true" />
        <span className="sr-only">Open Rebecca's portfolio helper</span>
      </button>
    </aside>
  );
}
