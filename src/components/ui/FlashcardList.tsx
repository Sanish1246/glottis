import Flashcard from "./Flashcard";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
const lang = "it-IT";

interface CardProp {
  word: string;
  english: string;
  audio: string;
}

interface FlashcardListProps {
  cardList: CardProp[];
  addToDeck: ({
    front,
    back,
    lang,
  }: {
    front: string;
    back: string;
    lang: string;
  }) => void;
}

const FlashcardList = ({ cardList, addToDeck }: FlashcardListProps) => {
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
    <div className="grid grid-cols-4 gap-4 mt-6">
      {cardList.map((card, i) => (
        <div
          ref={(card) => {
            cardRefs.current[i] = card;
          }}
        >
          <Flashcard
            key={i}
            front={card.word}
            back={card.english}
            onAdd={addToDeck}
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
