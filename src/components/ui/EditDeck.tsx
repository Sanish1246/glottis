import React from "react";
import { Button } from "./button";
import { toast } from "sonner";
import { useUser } from "@/components/context/UserContext";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface EditProps {
  deck: DeckProp;
  setFullDeck: React.Dispatch<React.SetStateAction<DeckProp>>;
  setDeck: React.Dispatch<React.SetStateAction<DeckProp>>;
  setRemaining: React.Dispatch<React.SetStateAction<number>>;
}

const EditDeck = ({ deck, setFullDeck, setDeck, setRemaining }: EditProps) => {
  const { setUser, user } = useUser();
  // Function to remove a card from the deck
  const removeFromDeck = async (card: FlashCardProps) => {
    // Removing the card from the deck
    try {
      const res = await fetch(
        `http://localhost:8000/remove_card/${deck.language}`,
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
      setFullDeck(data.newDeck);
      const reviewDeck = data.newDeck.items.filter(
        (c: FlashCardProps) =>
          c.dueDate <= dayjs(Date.now()).format("DD-MM-YYYY"),
      );
      setRemaining(reviewDeck.length);
      setDeck({ language: data.newDeck.language, items: reviewDeck });
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Word</TableHead>
          <TableHead>English</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deck.items.map((w, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{w.word}</TableCell>

            <TableCell>{w.english}</TableCell>
            <Button
              variant="destructive"
              onClick={() => {
                removeFromDeck(w);
              }}
            >
              Delete
            </Button>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EditDeck;
