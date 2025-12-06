import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { Button } from "../ui/button";
import { toast } from "sonner";
import EditDeck from "../ui/EditDeck";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import ReviewCard from "../ui/ReviewCard";
import { supermemo, type SuperMemoItem, type SuperMemoGrade } from "supermemo";

interface FlashCardProps {
  word: string;
  english: string;
  audio?: string;
  interval: number;
  repetition: number;
  efactor: number;
  dueDate: string;
}

interface DeckProp {
  language: string;
  items: FlashCardProps[];
}

const DeckReview = () => {
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(999);
  const { language } = useParams<{ language: string }>();
  const [reviewing, setReviewing] = useState(false);
  const location = useLocation();
  const initialDeck =
    (location.state as { deck?: DeckProp } | null)?.deck || null;

  const [deck, setDeck] = useState<DeckProp | null>(initialDeck);
  const [fullDeck, setFullDeck] = useState<DeckProp | null>(initialDeck);
  const [loading, setLoading] = useState(!initialDeck);
  useEffect(() => {
    const fetchDeck = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/user_decks/${language}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Deck not found");
        const data: DeckProp = await res.json();
        const reviewDeck = data.items.filter(
          (c) => c.dueDate === dayjs(Date.now()).format("DD-MM-YYYY")
        );
        setRemaining(reviewDeck.length);
        setDeck({ language: data.language, items: reviewDeck });
        setFullDeck(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeck();
  }, [language]);

  const nextCard = () => {
    setRemaining(remaining - 1);
    if (index < deck.items.length - 1) {
      setIndex(index + 1);
    } else {
      setReviewing(false);
      toast.success("Deck finished!");
    }
  };

  const currentCard = deck.items[index];

  const reviewCard = async (grade: SuperMemoGrade) => {
    try {
      const { interval, repetition, efactor } = supermemo(currentCard, grade);

      const dueDate = dayjs(Date.now())
        .add(interval, "day")
        .format("DD-MM-YYYY");

      const updatedCard = {
        ...currentCard,
        interval,
        repetition,
        efactor,
        dueDate,
      };

      console.log(updatedCard);
      const res = await fetch(`http://localhost:8000/user_decks/${language}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedCard),
      });
      nextCard();
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

  if (loading) return <div>Loading deck...</div>;
  if (!deck) return <div>Deck not found</div>;

  return (
    <div>
      {!reviewing ? (
        <div>
          <h3>
            {remaining != 0
              ? `Cards to review today: ${deck.items.length}`
              : `No cards to review today`}
          </h3>
          <Button
            onClick={() => {
              setReviewing(true);
            }}
            disabled={deck.items.length == 0 || remaining == 0}
          >
            Start now
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button disabled={fullDeck.items.length == 0}>Edit Deck</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your deck</DialogTitle>
              </DialogHeader>
              <EditDeck deck={fullDeck} />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <ReviewCard
          key={index}
          word={currentCard.word}
          english={currentCard.english}
          audio={currentCard.audio}
          lang={language}
          onReviewed={reviewCard}
        />
      )}
    </div>
  );
};

export default DeckReview;
