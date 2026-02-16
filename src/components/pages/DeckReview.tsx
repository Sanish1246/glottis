"use client";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Button } from "../ui/button";
import { toast } from "sonner";
import EditDeck from "../ui/EditDeck";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReviewCard from "../ui/ReviewCard";
import { supermemo, type SuperMemoGrade } from "supermemo";

dayjs.extend(customParseFormat);

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
  const [nextCards, setNextCards] = useState([0, 0, 0, 0, 0, 0, 0]);
  const chartData = [
    { day: "1 day", cards: nextCards[0] },
    { day: "2 days", cards: nextCards[1] },
    { day: "3 days", cards: nextCards[2] },
    { day: "4 days", cards: nextCards[3] },
    { day: "5 days", cards: nextCards[4] },
    { day: "6 days", cards: nextCards[5] },
    { day: "7 days", cards: nextCards[6] },
  ];

  const chartConfig = {
    cards: {
      label: "Cards",
      color: "#2563eb",
    },
  } satisfies ChartConfig;
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
  const [late, setLate] = useState(0);
  useEffect(() => {
    const fetchDeck = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/user_decks/${language}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error("Deck not found");
        const data: DeckProp = await res.json();

        const today = dayjs(Date.now()).startOf("day");

        const reviewDeck = data.items.filter(
          (c) => dayjs(c.dueDate, "DD-MM-YYYY").startOf("day") <= today,
        );
        const lateDeck = data.items.filter(
          (c) => dayjs(c.dueDate, "DD-MM-YYYY").startOf("day") < today,
        );

        setLate(lateDeck.length);
        setRemaining(reviewDeck.length);
        setDeck({ language: data.language, items: reviewDeck });
        setFullDeck(data);

        const forecast = Array.from(
          { length: 7 },
          (_, i) =>
            data.items.filter(
              (c) => c.dueDate === today.add(i + 1, "day").format("DD-MM-YYYY"),
            ).length,
        );
        setNextCards(forecast);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeck();
  }, [language]);

  const nextCard = async () => {
    setRemaining(remaining - 1);
    if (index < deck.items.length - 1) {
      setIndex(index + 1);
    } else {
      setReviewing(false);
      toast.success("Deck finished!");
      try {
        const res = await fetch(
          `http://localhost:8000/user_decks/${language}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error("Deck not found");
        const data: DeckProp = await res.json();
        setFullDeck(data);
        const today = dayjs().startOf("day");
        const forecast = Array.from(
          { length: 7 },
          (_, i) =>
            data.items.filter(
              (c) => c.dueDate === today.add(i + 1, "day").format("DD-MM-YYYY"),
            ).length,
        );
        setNextCards(forecast);
      } catch (err) {
        console.error(err);
      }
    }
  };
  if (loading) return <div>Loading deck...</div>;
  if (!deck) return <div>Deck not found</div>;
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

      const revisionData = {
        updatedCard,
        grade: grade,
      };

      await fetch(`http://localhost:8000/user_decks/${language}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(revisionData),
      });
      await nextCard();
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
              ? `Cards to review today: ${remaining}`
              : `No cards to review today`}
            {late > 0 ? (
              <span className="text-red-500 font-semibold">(Late: {late})</span>
            ) : null}
          </h3>
          <Button
            onClick={() => {
              setReviewing(true);
            }}
            disabled={deck.items.length == 0 || remaining == 0}
            className="mr-5"
          >
            Start now
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button disabled={fullDeck?.items.length == 0}>Edit Deck</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your deck</DialogTitle>
              </DialogHeader>
              <EditDeck
                deck={fullDeck}
                setFullDeck={setFullDeck}
                setDeck={setDeck}
                setRemaining={setRemaining}
              />
            </DialogContent>
          </Dialog>

          <h3 className="text-center">Next reviews</h3>
          <ChartContainer
            config={chartConfig}
            className="md:h-[300px] md:w-[60%] mx-auto"
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="cards" fill="var(--color-cards)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      ) : (
        <>
          <p>Cards left: {remaining}</p>
          <ReviewCard
            key={index}
            word={currentCard.word}
            english={currentCard.english}
            audio={currentCard.audio}
            lang={language}
            onReviewed={reviewCard}
          />
        </>
      )}
    </div>
  );
};

export default DeckReview;
