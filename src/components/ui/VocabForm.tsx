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
    <Card className="p-3 sm:p-4 space-y-4 min-w-0 overflow-hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
        <div className="grid grid-cols-1 gap-3 w-full min-w-0 lg:grid-cols-2 lg:gap-2 lg:flex-1">
          <Label htmlFor="title" className="lg:mx-auto text-sm font-medium">
            Deck title:
          </Label>
          <Input
            id="title"
            placeholder="Deck title"
            value={deck.category}
            onChange={(e) => onChange({ ...deck, category: e.target.value })}
            className="min-w-0"
          />
          <Input
            placeholder="Card word"
            value={newCard.word}
            onChange={(e) => setNewCard({ ...newCard, word: e.target.value })}
            className="min-w-0"
          />

          <Input
            placeholder="English translation"
            value={newCard.english}
            onChange={(e) =>
              setNewCard({ ...newCard, english: e.target.value })
            }
            className="min-w-0"
          />
        </div>
        <Button
          type="button"
          size="icon"
          onClick={addCard}
          className="h-10 w-full shrink-0 lg:size-10 lg:w-10 lg:mt-10 lg:ml-2"
        >
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
    <div className="space-y-6 w-full min-w-0">
      {data.map((deck, idx) => (
        <div key={idx} className="min-w-0">
          {idx + 1 == currentPage ? (
            <>
              <AddCardForm
                deck={deck}
                onChange={(updated) => updateDeck(idx, updated)}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeDeck(idx);
                }}
                className="mt-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <h2 className="font-semibold text-lg mt-4">Cards in the deck:</h2>
              <div className="w-full overflow-x-auto mt-2 -mx-1 px-1">
                <Table className="w-full min-w-[280px] text-center lg:w-[50%] lg:mx-auto">
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
              </div>
            </>
          ) : null}
        </div>
      ))}
      <div className="flex flex-col gap-2 w-full lg:flex-row lg:flex-wrap lg:justify-between lg:gap-2">
        <Button
          type="button"
          className="w-full lg:w-auto"
          onClick={() => {
            setCurrentStep((prevCurrent: number) => prevCurrent - 1);
          }}
        >
          Previous Section
        </Button>

        <Button
          type="button"
          className="w-full lg:w-auto"
          onClick={() => {
            setCurrentPage((prevPage: number) => prevPage - 1);
          }}
          disabled={data.length <= 1 || currentPage == 1}
        >
          Previous Deck
        </Button>
        <Button
          type="button"
          className="w-full lg:w-auto"
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
          type="button"
          className="w-full lg:w-auto"
          onClick={() => {
            setCurrentPage((prevPage: number) => prevPage + 1);
          }}
          disabled={data.length <= 1 || currentPage + 1 == data.length}
        >
          Next Deck
        </Button>

        <Button
          type="button"
          className="w-full lg:w-auto"
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
