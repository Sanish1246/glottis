import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import FlashcardList from "../ui/FlashcardList";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

const addToDeck = (card: FlashCardProps) => {
  toast.success("Card added to your deck!", {
    action: {
      label: "Close",
      onClick: () => {
        toast.dismiss();
      },
    },
  });
};

const Deck = () => {
  const navigate = useNavigate();
  const { deckId } = useParams<{ deckId: string }>();
  const location = useLocation();
  const initialDeck =
    (location.state as { deck?: DeckProp } | null)?.deck || null;

  const [deck, setDeck] = useState<DeckProp | null>(initialDeck);
  const [loading, setLoading] = useState(!initialDeck);

  useEffect(() => {
    if (initialDeck) return;
    if (!deckId) return;
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
            navigate("/decks");
          }}
        >
          Back
        </Button>
        <h1>{deck.category}</h1>
      </div>

      <FlashcardList
        cardList={deck.items}
        lang={deck.language}
        addToDeck={addToDeck}
      />
    </>
  );
};

export default Deck;
