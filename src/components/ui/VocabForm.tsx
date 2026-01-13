import React from "react";
import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "./card";
import { Input } from "./input";
import Combobox from "./Combobox";
import { Label } from "../ui/label";

const AddCardForm = ({ deck, onChange }) => {
  const [newDeck, setNewDeck] = useState({ category: "", items: [] });
  const [newCard, setNewCard] = useState({ word: "", english: "" });

  const addCard = () => {
    if (newCard.word.trim() && newCard.english.trim()) {
      const updatedCardList = [...newDeck.items, newCard];
      const updatedDeck = { ...newDeck, items: updatedCardList };

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
            value={newDeck.category}
            onChange={(e) =>
              setNewDeck({ ...newDeck, category: e.target.value })
            }
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            addCard();
          }}
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
    <div className="space-y-6">
      {data.map((deck, idx) => (
        <div key={idx}>
          {idx + 1 == currentPage ? (
            <>
              <AddCardForm
                deck={deck}
                onChange={(updated) => updateDeck(idx, updated)}
              />
              <h2>Cards in {deck.category}:</h2>
              <ul className="list-disc"></ul>
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
          <Plus className="mr-2 h-4 w-4" /> Add Dialogue Block
        </Button>
        <Button
          onClick={() => {
            setCurrentPage((prevPage: number) => prevPage - 1);
          }}
          disabled={data.length <= 1 || currentPage == 1}
        >
          Previous Dialogue
        </Button>
        <Button
          onClick={() => {
            setCurrentPage((prevPage: number) => prevPage + 1);
          }}
          disabled={data.length <= 1 || currentPage + 1 == data.length}
        >
          Next Dialogue
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
