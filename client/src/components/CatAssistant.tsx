/* Camel Editorial Atelier: Rebecca's black-cat guide is a tactile, quietly playful interruption in the parchment-and-boho editorial system. */
import { Download, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

type CatMood = "excited" | "normal" | "sleeping";

const CAT_IMAGES: Record<CatMood, string> = {
  excited: "/manus-storage/rebecca-cat-excited_1a4a1ef1.png",
  normal: "/manus-storage/rebecca-cat-normal_b1705901.png",
  sleeping: "/manus-storage/rebecca-cat-sleeping_a76e0b0c.png",
};

const welcomeCopy: Record<CatMood, string> = {
  excited: "Welcome in — I saved the best details for you.",
  normal: "Curious? I can point you to the good stuff.",
  sleeping: "I’m recharging. Give the page a nudge when you’re ready.",
};

export default function CatAssistant({ cvUrl }: { cvUrl: string }) {
  const [mood, setMood] = useState<CatMood>("excited");
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState(welcomeCopy.excited);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let sleepTimer: ReturnType<typeof setTimeout>;
    const setActive = () => {
      setMood("normal");
      setMessage(welcomeCopy.normal);
      clearTimeout(sleepTimer);
      sleepTimer = setTimeout(() => {
        setMood("sleeping");
        setMessage(welcomeCopy.sleeping);
      }, 11500);
    };

    const handlePointer = (event: MouseEvent) => {
      const x = Math.max(-2, Math.min(2, (event.clientX / window.innerWidth - 0.5) * 5));
      const y = Math.max(-2, Math.min(2, (event.clientY / window.innerHeight - 0.5) * 5));
      setPupil({ x, y });
      setActive();
    };

    const initialTimer = setTimeout(setActive, 3800);
    window.addEventListener("mousemove", handlePointer, { passive: true });
    window.addEventListener("scroll", setActive, { passive: true });
    window.addEventListener("keydown", setActive);
    window.addEventListener("touchstart", setActive, { passive: true });

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(sleepTimer);
      window.removeEventListener("mousemove", handlePointer);
      window.removeEventListener("scroll", setActive);
      window.removeEventListener("keydown", setActive);
      window.removeEventListener("touchstart", setActive);
    };
  }, []);

  const answer = (kind: "about" | "skills" | "resume") => {
    if (kind === "about") {
      setMood("normal");
      setMessage("Rebecca is a people-centred builder, translating customer insight into practical digital experiences.");
    }
    if (kind === "skills") {
      setMood("normal");
      setMessage("Her strengths include React, TypeScript, data analysis, UI thinking, problem-solving, and calm communication.");
    }
    if (kind === "resume") {
      setMood("excited");
      setMessage("On it — the CV is opening in a new tab.");
      window.open(cvUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (!open) {
    return (
      <button className="cat-reopen" onClick={() => setOpen(true)} aria-label="Open Rebecca's portfolio assistant">
        <img src={CAT_IMAGES.normal} alt="Rebecca's cat portfolio guide" />
      </button>
    );
  }

  return (
    <aside className={`cat-assistant cat-${mood}`} aria-label="Rebecca's portfolio guide">
      <button className="cat-close" onClick={() => setOpen(false)} aria-label="Close portfolio guide"><X size={14} /></button>
      <div className="cat-bubble"><span className="cat-status"><MessageCircle size={13} /> Portfolio guide</span><p>{message}</p></div>
      <div className="cat-portrait" aria-hidden="true">
        <img src={CAT_IMAGES[mood]} alt="" />
        {mood === "normal" && (
          <div className="cat-pupils">
            <i style={{ transform: `translate(${pupil.x}px, ${pupil.y}px)` }} />
            <i style={{ transform: `translate(${pupil.x}px, ${pupil.y}px)` }} />
          </div>
        )}
      </div>
      <div className="cat-prompts">
        <button onClick={() => answer("about")}>Tell me about Rebecca</button>
        <button onClick={() => answer("skills")}>What are her core skills?</button>
        <button className="cat-download" onClick={() => answer("resume")}><Download size={13} /> Download résumé</button>
      </div>
    </aside>
  );
}
