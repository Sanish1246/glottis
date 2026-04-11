import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useParams, useLocation } from "react-router-dom";
import FlashcardList from "../ui/FlashcardList";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/components/context/UserContext";
import { useLanguage } from "../context/LanguageContext";

interface FlashCardProps {
  word: string;
  english: string;
  audio?: string;
  interval?: number;
  repetition?: number;
  efactor?: number;
  dueDate?: string;
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

const Deck = () => {
  const { languagePath } = useLanguage();
  const { setUser } = useUser();
  const navigate = useNavigate();
  const { deckId } = useParams<{ deckId: string }>();
  const location = useLocation();
  const initialDeck =
    (location.state as { deck?: DeckProp } | null)?.deck || null;

  const [deck, setDeck] = useState<DeckProp | null>(initialDeck);
  const [loading, setLoading] = useState(!initialDeck);

  const addToDeck = async (card: FlashCardProps) => {
    try {
      card = {
        ...card,
        interval: 0,
        repetition: 0,
        efactor: 2.5,
        dueDate: dayjs(Date.now()).format("YYYY-MM-DD"),
      };
      const res = await fetch(
        `http://localhost:8000/add_card/${languagePath}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(card),
        },
      );
      const data = await res.json();
      setUser(data.user);
      toast.success(data.message, {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
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

  const removeFromDeck = async (card: FlashCardProps) => {
    try {
      const res = await fetch(
        `http://localhost:8000/remove_card/${languagePath}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(card),
        },
      );
      const data = await res.json();
      setUser(data.user);
      toast.success(data.message, {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
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

  useEffect(() => {
    if (initialDeck) return;
    if (!deckId) return;
    // Fetching the deck upon page load
    const fetchDeck = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/flashcards/${deckId}`);
        if (!res.ok) throw new Error("Deck not found");
        const data: DeckProp = await res.json();
        setDeck(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeck();
  }, [deckId, initialDeck]);

  if (loading) return <div>Loading deck...</div>;
  if (!deck) return <div>Deck not found</div>;

  return (
    <>
      <div className="flex flex-row">
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </Button>
        <h1 className="font-bold text-xl ml-5">{deck.category}</h1>
      </div>

      <FlashcardList
        cardList={deck.items}
        lang={deck.language}
        addToDeck={addToDeck}
        removeFromDeck={removeFromDeck}
      />
    </>
  );
};

export default Deck;
