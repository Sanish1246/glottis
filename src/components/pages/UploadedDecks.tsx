import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import Combobox from "../ui/Combobox";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Options = {
  value: string;
  label: string;
};

const languagePaths: Options[] = [
  {
    value: "italian",
    label: "Italian",
  },
  {
    value: "french",
    label: "French",
  },
];

const levels: Options[] = [
  {
    value: "Beginner",
    label: "Beginner",
  },
  {
    value: "Lower intermediate",
    label: "Lower intermediate",
  },
  {
    value: "Intermediate",
    label: "Intermediate",
  },
  {
    value: "Upper intermediate",
    label: "Upper Intermediate",
  },
  {
    value: "Advanced",
    label: "Advanced",
  },
  {
    value: "none",
    label: "None",
  },
];

interface FlashCardProps {
  word: string;
  english: string;
  audio?: string;
}

interface DeckProp {
  _id?: string;
  level?: string;
  category: string;
  language: string;
  number?: string;
  noOfCards?: string;
  author?: string;
  likes?: string;
  items: FlashCardProps[];
}

const UploadedDecks = () => {
  const [level, setLevel] = useState("Beginner");
  const [language, setLanguage] = useState("italian");
  const [decksArray, setDecksArray] = useState([]);

  useGSAP(() => {
    gsap.fromTo(
      ".deck",
      { x: -50000, duration: 0.2 },
      { x: 0, stagger: 0.09, ease: "power1.inOut" }
    );
  }, [decksArray]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/flashcards/customDecks/${language}/${level}`
        );
        const data = await response.json();
        setDecksArray(data);
      } catch (error) {
        toast.error(String(error), {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }
    };
    fetchLessons();
  }, [language, level]);

  return (
    <div>
      <div className="flex flex-row items-center gap-1">
        <p>Language path:</p>
        <Combobox
          choices={languagePaths}
          filter={language}
          setFilter={setLanguage}
        ></Combobox>

        <p>Level:</p>
        <Combobox
          choices={levels}
          filter={level}
          setFilter={setLevel}
        ></Combobox>
      </div>
      {decksArray.map((deck: DeckProp) => {
        return (
          <Link
            to={`/deck/${deck._id}`}
            state={{ deck }}
            className="block hover:translate-1"
          >
            <div
              key={deck._id}
              className="border-2 rounded-lg p-3 mb-4 mt-2 shadow-sm hover:cursor-pointer deck hover:translate-1 flex justify-between"
            >
              <p>
                <b>{deck.category}</b> -
                {deck.noOfCards && <span>{deck.noOfCards} cards</span>}
              </p>

              <span className="text-sm">Created by {deck.author}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default UploadedDecks;
