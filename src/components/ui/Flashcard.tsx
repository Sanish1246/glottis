import { useState, useRef } from "react";
import SpeechButton from "./SpeechButton";
import gsap from "gsap";

interface FlashCardProps {
  front: string;
  back: string;
  onAdd: ({
    front,
    back,
    lang,
  }: {
    front: string;
    back: string;
    lang: string;
  }) => void;
  lang: string;
  onClick?: () => void;
}

const Flashcard = ({ front, back, onAdd, lang }: FlashCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef(null);

  // Flip animation
  const handleFlip = () => {
    setFlipped(!flipped);
    gsap.to(cardRef.current, {
      rotateY: flipped ? 0 : 180,
      duration: 0.7,
      ease: "power2.inOut",
    });
  };

  return (
    <div className="perspective-1000 w-64 h-40">
      <div
        ref={cardRef}
        className="relative w-full h-full cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
        }}
        onClick={handleFlip}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center border rounded-xl shadow-lg bg-white dark:bg-gray-800"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-center mt-8 text-lg font-semibold px-4">{front}</p>
          <div className="flex flex-row justify-between w-[80%] mt-5">
            <button
              title="Add to Deck"
              onClick={(e) => {
                e.stopPropagation();
                onAdd({ front, back, lang });
              }}
              className=" bg-blue-500 text-white px-2  rounded-md text-sm hover:bg-blue-600 transition-colors hover:cursor-pointer"
            >
              ➕
            </button>
            <SpeechButton
              text={front}
              lang={lang}
              voiceName="Microsoft Elsa - Italian (Italy)"
            />
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center border rounded-xl shadow-lg bg-gray-50 dark:bg-gray-700"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-center mt-8 text-lg font-semibold px-4">{back}</p>
          <div className="flex flex-row justify-between w-[80%] mt-5">
            <button
              title="Add to Deck"
              onClick={(e) => {
                e.stopPropagation();
                onAdd({ front, back, lang });
              }}
              className=" bg-blue-500 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors hover:cursor-pointer"
            >
              ➕
            </button>
            <SpeechButton
              text={back}
              lang="en-EN"
              voiceName="Google US English"
            />
          </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default Flashcard;
