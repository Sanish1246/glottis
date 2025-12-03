import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import FlashcardList from "../ui/FlashcardList";
import { Button } from "../ui/button";
import { toast } from "sonner";
import EditDeck from "../ui/EditDeck";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface FlashCardProps {
  word: string;
  english: string;
  audio?: string;
}

interface DeckProp {
  language: string;
  items: FlashCardProps[];
}

const DeckReview = () => {
  const { deckLang } = useParams<{ deckLang: string }>();
  const location = useLocation();
  const initialDeck =
    (location.state as { deck?: DeckProp } | null)?.deck || null;

  const [deck, setDeck] = useState<DeckProp | null>(initialDeck);
  const [loading, setLoading] = useState(!initialDeck);
  useEffect(() => {
    const fetchDeck = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/user_decks/${deckLang}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
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
  }, [deckLang]);

  if (loading) return <div>Loading deck...</div>;
  if (!deck) return <div>Deck not found</div>;

  return (
    <div>
      <h3>Cards to review today: {deck.items.length}</h3>
      <Button>Start now</Button>
      <Dialog>
        <DialogTrigger>
          <Button>Edit Deck</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your deck</DialogTitle>
          </DialogHeader>
          <EditDeck deck={deck} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeckReview;
