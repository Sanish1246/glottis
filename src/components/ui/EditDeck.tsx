import React from "react";
import { Button } from "./button";
import { toast } from "sonner";
import { useUser } from "@/components/context/UserContext";
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
}

interface DeckProp {
  language: string;
  items: FlashCardProps[];
}

const EditDeck = ({ deck }: { deck: DeckProp }) => {
  const { setUser, user } = useUser();
  const removeFromDeck = async (card: FlashCardProps) => {
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
        }
      );
      const data = await res.json();
      setUser({
        username: data.user.username,
        email: data.user.email,
        decks: data.user.decks,
      });
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
