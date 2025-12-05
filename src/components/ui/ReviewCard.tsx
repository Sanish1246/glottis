import { useState, useRef } from "react";
import SpeechButton from "./SpeechButton";
import gsap from "gsap";
import { Button } from "./button";
import { useUser } from "@/components/context/UserContext";

interface FlashCardProps {
  word: string;
  english: string;
  audio?: string;
  lang: string | undefined;
  onReviewed: () => void;
}

const ReviewCard = ({
  word,
  english,
  lang,
  audio,
  onReviewed,
}: FlashCardProps) => {
  const { user } = useUser();
  const [reviewed, setReviewed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef(null);

  // Flip animation
  const handleFlip = () => {
    setFlipped(!flipped);
    gsap.to(cardRef.current, {
      rotateY: flipped ? 0 : 180,
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  const finish = () => {
    setReviewed(true);
    setTimeout(onReviewed, 300);
  };

  return (
    <div className="h-148">
      <div className="perspective-1000 w-64 h-40 mx-auto mb-5">
        <div
          ref={cardRef}
          className={`relative w-full h-full cursor-pointer ${
            reviewed ? "hidden" : "block"
          }`}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center border rounded-xl shadow-lg bg-white dark:bg-gray-800"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-center mt-8 text-lg font-semibold px-4">
              {word}
            </p>

            {audio && (
              <SpeechButton text={word} lang={lang} voiceName={audio} />
            )}
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center border rounded-xl shadow-lg bg-gray-50 dark:bg-gray-700"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-center mt-8 text-lg font-semibold px-4">
              {english}
            </p>
          </div>
        </div>

        <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
      </div>
      <div className="flex gap-2 bottom-1">
        {!flipped ? (
          <Button className="mx-auto" onClick={handleFlip}>
            Flip
          </Button>
        ) : (
          <div className="mx-auto flex gap-2">
            <Button onClick={finish}>Easy</Button>
            <Button onClick={finish}>Medium</Button>
            <Button onClick={finish}>Hard</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
