/* Camel Editorial Atelier: a small, transparent walking cat adds quiet character at the page edge; its help panel is deliberately hidden until activated. */
import { Download, X } from "lucide-react";
import { useState } from "react";

type CatAnswer = "about" | "skills" | "resume";

const WALKING_CAT_IMAGE = "/manus-storage/rebecca-cat-walking_1fd9aa2a.png";

const responses: Record<CatAnswer, string> = {
  about: "Rebecca is an emerging junior web developer with a resilient, people-centred foundation. After matriculating in 2024, she entered the workforce to support her family, building composure and accountability in customer-facing and operations roles. That experience sparked a fascination with creative technology: she now uses CAPACITI’s intensive programme to turn practical insight into thoughtful, user-aware digital work.",
  skills: "Rebecca combines the reliability of a customer-service professional with a growing digital toolkit. She brings precise data handling, Google Workspace and Microsoft 365 fluency, UX-minded problem-solving, and a strong instinct for clear communication. Just as importantly, her teamwork, time management, adaptability, and rapid-learning mindset help her contribute steadily in fast-moving environments while she continues to build technical depth.",
  resume: "Rebecca’s CV has opened in a new tab. It offers a focused view of her operations experience, data and digital-skills training, customer-service strengths, and current direction as a junior web developer. Thank you for taking the time to learn more about the person behind the portfolio.",
};

export default function CatAssistant({ cvUrl }: { cvUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState<CatAnswer | null>(null);

  const chooseAnswer = (kind: CatAnswer) => {
    setAnswer(kind);
    if (kind === "resume") window.open(cvUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <aside className="cat-assistant" aria-label="Rebecca's portfolio helper">
      {isOpen && (
        <section className="cat-dialog" aria-live="polite">
          <button className="cat-close" onClick={() => setIsOpen(false)} aria-label="Close helper"><X size={14} /></button>
          <p className="cat-dialog-kicker">A small guide, when you need it</p>
          <p className="cat-answer">{answer ? responses[answer] : "Choose a topic to discover more about Rebecca’s journey and strengths."}</p>
          <div className="cat-options">
            <button onClick={() => chooseAnswer("about")}>About Rebecca</button>
            <button onClick={() => chooseAnswer("skills")}>Core skills</button>
            <button onClick={() => chooseAnswer("resume")}><Download size={13} /> Download résumé</button>
          </div>
        </section>
      )}
      <button className="cat-walker" onClick={() => { setIsOpen(open => !open); setAnswer(null); }} aria-expanded={isOpen} aria-label={isOpen ? "Close Rebecca's portfolio helper" : "Open Rebecca's portfolio helper"}>
        <img src={WALKING_CAT_IMAGE} alt="" />
        <span className="sr-only">Open Rebecca's portfolio helper</span>
      </button>
    </aside>
  );
}
