import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import Combobox from "../ui/Combobox";

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

const FlashCardDeckList = () => {
  const [level, setLevel] = useState("A1");
  const { languagePath, setLanguagePath } = useLanguage();
  const [decksArray, setDecksArray] = useState([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/flashcards/${languagePath}/${level}`
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
  }, [languagePath, level]);

  return (
    <div>
      <div className="flex flex-row items-center gap-1">
        <p>Language path:</p>
        <Combobox
          choices={languagePaths}
          filter={languagePath}
          setFilter={setLanguagePath}
        ></Combobox>
      </div>
      {decksArray.map((deck: DeckProp) => {
        return (
          <div key={deck._id}>
            <Link to={`/deck/${deck._id}`} state={{ deck }} className="block">
              {deck.category} -{" "}
              {deck.noOfCards && <span>{deck.noOfCards} cards</span>}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default FlashCardDeckList;
