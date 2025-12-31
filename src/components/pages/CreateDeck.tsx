"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const formSchema = z.object({
  word: z.string(),
  english: z.string(),
  category: z.string().min(1, {
    message: "This field cannot be empty!",
  }),
  language: z.string().min(1, {
    message: "This field cannot be empty!",
  }),
});

interface FlashCardProps {
  word: string;
  english: string;
}

type Options = {
  value: string;
  label: string;
};

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
  const [newDeck, setNewDeck] = useState([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      language: "",
      word: "",
      english: "",
    },
  });

  const addToDeck = (values: z.infer<typeof formSchema>) => {
    if (values.word == "" || values.english == "") {
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
        language: values.language,
      });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
        language: values.language.toLowerCase(),
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
    <div>
      <h1 className="text-xl font-bold">Create a deck</h1>
      <p>
        Add cards to your custom deck and click on "Submit" to submit for
        approval
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="justify-center text-center space-y-6 border-2 rounded-lg mx-auto w-[75%]"
        >
          <div className="flex flex-row mx-auto justify-center gap-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" mx-auto mt-5">Deck Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type the title here..."
                      {...field}
                      className="w-full mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" mx-auto mt-5">Language</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type the language here..."
                      {...field}
                      className="w-full mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row items-center gap-1">
              <p>Level:</p>
              <Combobox
                choices={levels}
                filter={level}
                setFilter={setLevel}
              ></Combobox>
            </div>
          </div>
          <div className="flex flex-row mx-auto justify-center">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" mx-auto mt-5">Word</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type the word here..."
                      {...field}
                      className="w-full mx-auto"
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
                <FormItem>
                  <FormLabel className=" mx-auto mt-5">
                    English translation
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type the English translation here..."
                      {...field}
                      className="w-full mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-row gap-3 mx-auto justify-center mb-5">
            <Button type="submit">Submit</Button>
            <Button
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
          {newDeck.map((w: FlashCardProps, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-">{w.word}</TableCell>

              <TableCell>{w.english}</TableCell>
              <Button variant="destructive" onClick={() => {}}>
                Delete
              </Button>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CreateDeck;
