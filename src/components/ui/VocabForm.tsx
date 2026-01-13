import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const AddCardForm = ({ deck, onChange }) => {
  const [newCard, setNewCard] = useState({ word: "", english: "" });

  const addCard = () => {
    if (newCard.word.trim() && newCard.english.trim()) {
      const updatedDeck = {
        ...deck,
        items: [...deck.items, newCard],
      };
      onChange(updatedDeck);
      setNewCard({ word: "", english: "" });
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <Label htmlFor="title">Deck title:</Label>
          <Input
            id="title"
            placeholder="Deck title"
            value={deck.category}
            onChange={(e) => onChange({ ...deck, category: e.target.value })}
          />
          <Input
            placeholder="Card word"
            value={newCard.word}
            onChange={(e) => setNewCard({ ...newCard, word: e.target.value })}
          />

          <Input
            placeholder="English translation"
            value={newCard.english}
            onChange={(e) =>
              setNewCard({ ...newCard, english: e.target.value })
            }
          />
        </div>
        <Button size="icon" onClick={addCard} className="mt-10 ml-2">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const VocabForm = ({ data, onChange, setCurrentStep }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const addDeck = () => {
    const newDecks = [...data, { category: "", items: [] }];
    onChange(newDecks);
  };

  const updateDeck = (index, updatedDeck) => {
    const newDecks = data.map((deck, i) => (i === index ? updatedDeck : deck));
    onChange(newDecks);
  };

  const removeDeck = (index) => {
    const newDecks = data.filter((_, i) => i !== index);
    onChange(newDecks);
  };

  return (
    <div className="space-y-6">
      {data.map((deck, idx) => (
        <div key={idx}>
          {idx + 1 == currentPage ? (
            <>
              <AddCardForm
                deck={deck}
                onChange={(updated) => updateDeck(idx, updated)}
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeDeck(idx);
                }}
                className="mt-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <h2>Cards in the deck:</h2>
              <Table className="w-[50%] mx-auto text-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Word</TableHead>
                    <TableHead className="text-center">English</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deck.items.map((w, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold">{w.word}</TableCell>

                      <TableCell>{w.english}</TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          const updatedItems = deck.items.filter(
                            (item) =>
                              item.word !== w.word && item.english !== w.english
                          );
                          updateDeck(idx, { ...deck, items: updatedItems });
                        }}
                      >
                        Delete
                      </Button>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : null}
        </div>
      ))}
      <div>
        <Button
          onClick={() => {
            setCurrentStep((prevCurrent: number) => prevCurrent - 1);
          }}
        >
          Previous Section
        </Button>
        <Button
          onClick={() => {
            addDeck();
            if (data.length > 1) {
              setCurrentPage((prevPage: number) => prevPage + 1);
            }
          }}
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Deck
        </Button>
        <Button
          onClick={() => {
            setCurrentPage((prevPage: number) => prevPage - 1);
          }}
          disabled={data.length <= 1 || currentPage == 1}
        >
          Previous Deck
        </Button>
        <Button
          onClick={() => {
            setCurrentPage((prevPage: number) => prevPage + 1);
          }}
          disabled={data.length <= 1 || currentPage + 1 == data.length}
        >
          Next Deck
        </Button>

        <Button
          onClick={() => {
            setCurrentStep((prevCurrent: number) => prevCurrent + 1);
          }}
        >
          Next Section
        </Button>
      </div>
    </div>
  );
};

export default VocabForm;
