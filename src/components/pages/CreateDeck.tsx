"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createDeckSchema, type CreateDeckSchema } from "@/lib/schemas";
import { isValidDeckEntry } from "@/lib/deckUtils";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Combobox from "../ui/Combobox";

interface FlashCardProps {
  word: string;
  english: string;
}

type Options = {
  value: string;
  label: string;
};

const languages: Options[] = [
  {
    value: "italian",
    label: "Italian",
  },
  {
    value: "french",
    label: "French",
  },
];

const levels: Options[] = [
  {
    value: "Beginner",
    label: "Beginner",
  },
  {
    value: "Lower intermediate",
    label: "Lower intermediate",
  },
  {
    value: "Intermediate",
    label: "Intermediate",
  },
  {
    value: "Upper intermediate",
    label: "Upper Intermediate",
  },
  {
    value: "Advanced",
    label: "Advanced",
  },
  {
    value: "none",
    label: "None",
  },
];

const CreateDeck = () => {
  const [level, setLevel] = useState("Beginner");
  const [language, setLanguage] = useState("italian");
  const [newDeck, setNewDeck] = useState([]);

  const form = useForm<CreateDeckSchema>({
    resolver: zodResolver(createDeckSchema),
    defaultValues: {
      category: "",
      word: "",
      english: "",
    },
  });

  const addToDeck = (values: CreateDeckSchema) => {
    if (!isValidDeckEntry(values)) {
      toast.error("Both a word and english translation must be included", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } else {
      const newCard: FlashCardProps = {
        word: values.word,
        english: values.english,
      };
      setNewDeck((prev) => [...prev, newCard]);
      form.reset({
        word: "",
        english: "",
        category: values.category,
      });
    }
  };

  async function onSubmit(values: CreateDeckSchema) {
    if (newDeck.length == 0) {
      toast.error("Cannot submit empty deck!", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } else {
      const submitDeck = {
        category: values.category,
        language: language.toLowerCase(),
        level: level,
        items: newDeck,
        noOfCards: newDeck.length,
        likes: 0,
      };
      try {
        const res = await fetch("http://localhost:8000/flashcards/submit", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitDeck),
        });

        const data = await res.json();
        if (data.message) {
          toast.success(data.message, {
            action: {
              label: "Close",
              onClick: () => {
                toast.dismiss();
              },
            },
          });
        }
      } catch (error: any) {
        toast.error(error, {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }
    }
  }
  return (
    <div className="w-full min-w-0 max-w-5xl mx-auto px-3 py-4 sm:px-4 lg:py-6">
      <h1 className="text-xl font-bold break-words">Create a deck</h1>
      <p className="text-muted-foreground text-sm sm:text-base mt-1 text-pretty max-w-prose">
        Add cards to your custom deck and click on &quot;Submit&quot; to submit
        for approval
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="justify-center text-center space-y-5 sm:space-y-6 border-2 rounded-lg mx-auto w-full max-w-full min-w-0 p-3 sm:p-4 mt-4 lg:w-[75%] lg:p-2"
        >
          <div className="flex flex-col gap-4 mx-auto justify-center p-2 min-w-0 lg:flex-row lg:gap-1 lg:items-start">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full min-w-0 lg:flex-1">
                  <FormLabel className="mx-auto mt-2 lg:mt-5 block">
                    Deck Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type the title here..."
                      {...field}
                      className="w-full min-w-0 mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-1 mx-auto items-center justify-center w-full min-w-0 lg:w-auto [&_button]:w-full lg:[&_button]:w-[200px]">
              <p className="text-sm font-medium">Language:</p>
              <Combobox
                choices={languages}
                filter={language}
                setFilter={setLanguage}
              />
            </div>

            <div className="flex flex-col items-center gap-1 w-full min-w-0 lg:w-auto [&_button]:w-full lg:[&_button]:w-[200px]">
              <p className="text-sm font-medium">Level:</p>
              <Combobox
                choices={levels}
                filter={level}
                setFilter={setLevel}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 mx-auto justify-center px-2 min-w-0 lg:flex-row lg:gap-6">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem className="w-full min-w-0 lg:flex-1">
                  <FormLabel className="mx-auto mt-2 lg:mt-5 block">
                    Word
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type the word here..."
                      {...field}
                      className="w-full min-w-0 mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="english"
              render={({ field }) => (
                <FormItem className="w-full min-w-0 lg:flex-1">
                  <FormLabel className="mx-auto mt-2 lg:mt-5 block">
                    English translation
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type the English translation here..."
                      {...field}
                      className="w-full min-w-0 mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-2 mx-auto justify-center mb-5 px-2 w-full max-w-md lg:max-w-none lg:flex-row lg:gap-3 lg:w-auto">
            <Button type="submit" className="w-full lg:w-auto">
              Submit
            </Button>
            <Button
              type="button"
              className="w-full lg:w-auto"
              onClick={(e) => {
                e.preventDefault();
                addToDeck(form.getValues());
              }}
            >
              Add card
            </Button>
          </div>
        </form>
      </Form>
      <h2 className="font-semibold text-lg mt-6">Cards in the deck:</h2>
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
          {newDeck.map((w: FlashCardProps, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-semibold break-words max-w-[40vw] lg:max-w-none">
                {w.word}
              </TableCell>

              <TableCell className="break-words max-w-[40vw] lg:max-w-none">
                {w.english}
              </TableCell>
              <TableCell className="align-middle">
                <Button
                  type="button"
                  variant="destructive"
                  className="whitespace-nowrap"
                  onClick={() => {
                    setNewDeck(
                      newDeck.filter(
                        (item: FlashCardProps) =>
                          item.word !== w.word && item.english !== w.english,
                      ),
                    );
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
};

export default CreateDeck;
