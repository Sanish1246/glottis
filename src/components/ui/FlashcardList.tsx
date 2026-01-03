import Flashcard from "./Flashcard";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

interface CardProp {
  word: string;
  english: string;
  audio?: string;
}

interface FlashcardListProps {
  cardList: CardProp[];
  lang: string;
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
}

const FlashcardList = ({
  cardList,
  lang,
  addToDeck,
  removeFromDeck,
}: FlashcardListProps) => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    gsap.from(cardRefs.current, {
      y: 100,
      x: 100,
      opacity: 0,
      duration: 0.5,
      stagger: 0.2,
    });
  }, []);
  return (
    <div className="grid grid-cols-4 gap-4 mt-6 mb-10">
      {cardList.map((card, i) => (
        <div
          ref={(card) => {
            cardRefs.current[i] = card;
          }}
        >
          <Flashcard
            key={i}
            word={card.word}
            english={card.english}
            audio={card.audio}
            addToDeck={addToDeck}
            removeFromDeck={removeFromDeck}
            lang={lang}
            onClick={() => {
              gsap.to(".card", {
                rotateY: 180,
              });
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FlashcardList;
