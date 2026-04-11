import { useState, useRef } from "react";
import SpeechButton from "./SpeechButton";

import { useUser } from "@/components/context/UserContext";

interface FlashCardProps {
  word: string;
  english: string;
  audio?: string;
  addToDeck: ({
    word,
    english,
    audio,
  }: {
    word: string;
    english: string;
    audio?: string;
  }) => void;
  removeFromDeck: ({
    word,
    english,
    audio,
  }: {
    word: string;
    english: string;
    audio?: string;
  }) => void;
  lang: string;
  onClick?: () => void;
}

const Flashcard = ({
  word,
  english,
  addToDeck,
  removeFromDeck,
  lang,
  audio,
}: FlashCardProps) => {
  const { user } = useUser();
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const decks = user?.decks ?? [];

  const currentDeck = decks.find((d) => d.language === lang);

  const alreadyExists =
    currentDeck?.items.some((i) => i.word === word && i.english === english) ??
    false;
  const handleFlip = () => setFlipped((v) => !v); // Function to flip the card

  return (
    <div
      className="w-64 h-40"
      style={{ perspective: "1000px", WebkitPerspective: "1000px" }} // perspective must be on the parent
    >
      <div
        ref={cardRef}
        className="relative w-full h-full cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          willChange: "transform",
          transition: "transform 0.7s cubic-bezier(.2,.8,.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          WebkitTransform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center border rounded-xl shadow-lg bg-white dark:bg-gray-800"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg) translateZ(1px)", // push into its own layer
            WebkitTransform: "rotateY(0deg) translateZ(1px)",
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            zIndex: flipped ? 1 : 2,
          }}
        >
          <p
            className="text-center mt-8 text-lg font-semibold px-4"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {word}
          </p>
          <div className="flex flex-row justify-between w-[80%] mt-5">
            <button
              title="Add to Deck"
              onClick={(e) => {
                if (alreadyExists) {
                  e.stopPropagation();
                  removeFromDeck({ word, english, audio });
                } else {
                  e.stopPropagation();
                  addToDeck({ word, english, audio });
                }
              }}
              className=" bg-blue-500 text-white px-2  rounded-md text-sm hover:bg-blue-600 transition-colors hover:cursor-pointer"
            >
              {alreadyExists ? "➖" : "➕"}
            </button>
            {audio && (
              <SpeechButton text={word} lang={lang} voiceName={audio} />
            )}
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center border rounded-xl shadow-lg bg-gray-50 dark:bg-gray-700"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(1px)",
            WebkitTransform: "rotateY(180deg) translateZ(1px)",
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            zIndex: flipped ? 2 : 1,
          }}
        >
          <p
            className="text-center mt-8 text-lg font-semibold px-4"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {english}
          </p>
          <div className="flex flex-row justify-between w-[80%] mt-5">
            <button
              title="Add to Deck"
              onClick={(e) => {
                if (alreadyExists) {
                  e.stopPropagation();
                  removeFromDeck({ word, english, audio });
                } else {
                  e.stopPropagation();
                  addToDeck({ word, english, audio });
                }
              }}
              className=" bg-blue-500 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors hover:cursor-pointer"
            >
              {alreadyExists ? "➖" : "➕"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
