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
    <div className="grid grid-cols-1 gap-4 mt-6 mb-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cardList.map((card, i) => (
        <div
          key={`${card.word}-${card.english}-${i}`}
          ref={(card) => {
            cardRefs.current[i] = card;
          }}
          className="mx-auto"
        >
          <Flashcard
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
