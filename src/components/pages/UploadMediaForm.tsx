"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";
import { useUser } from "@/components/context/UserContext";
import { Textarea } from "../ui/textarea";
import Combobox from "../ui/Combobox";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title cannot be empty!.",
  }),
  description: z.string().min(8, {
    message: "Description must be at least 8 characters long.",
  }),
  author: z.string().min(1, {
    message: "Author cannot be empty!.",
  }),
  language: z.string().min(1, {
    message: "Language cannot be empty!.",
  }),
  genres: z.array(z.string()).optional(),
});

type UploadProps = {
  onClose?: () => void;
};

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
];

const mediaTypes: Options[] = [
  {
    value: "Book",
    label: "Book",
  },
  {
    value: "Movie",
    label: "Movie",
  },
  {
    value: "TV Series",
    label: "TV Series",
  },
];

const genresOptions: Options[] = [
  { value: "Action", label: "Action" },
  { value: "Romance", label: "Romance" },
  { value: "Horror", label: "Horror" },
  { value: "Comedy", label: "Comedy" },
  { value: "Drama", label: "Drama" },
  { value: "Mystery", label: "Mystery" },
  { value: "Psychological", label: "Psychological" },
  { value: "Historical", label: "Historical" },
  { value: "Graded Reader", label: "Graded Reader" },
  { value: "Short Stories", label: "Short Stories" },
];

const UploadMediaForm = ({ onClose }: UploadProps) => {
  const [level, setLevel] = useState("Beginner");
  const [mediaType, setMediaType] = useState("Book");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      language: "",
      genres: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const media = {
      ...values,
      likes: 0,
    };
    console.log(values.genres);
    if (onClose) onClose();
    toast.success("Media uploaded!", {
      action: {
        label: "Close",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="justify-center text-center space-y-6 "
      >
        <h1 className="text-xl font-bold">Enter Details</h1>
        <hr />
        <div className="flex flex-row">
          <div className="flex flex-col w-[50%] gap-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" mx-auto mt-5">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your title..."
                      {...field}
                      className="w-[80%] mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" mx-auto mt-5">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your description..."
                      {...field}
                      className="w-[80%] mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" mx-auto mt-5">Author</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the author name..."
                      {...field}
                      className="w-[80%] mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col w-[50%] gap-2">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" mx-auto mt-5">Language</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your language..."
                      {...field}
                      className="w-[80%] mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row gap-1 mx-auto items-center justify-center mt-5">
              <p>Level:</p>
              <Combobox
                choices={levels}
                filter={level}
                setFilter={setLevel}
              ></Combobox>
            </div>

            <div className="flex flex-row gap-1 mx-auto items-center justify-center">
              <p>Type:</p>
              <Combobox
                choices={mediaTypes}
                filter={mediaType}
                setFilter={setMediaType}
              ></Combobox>
            </div>

            <div className="grid w-full max-w-sm items-center gap-3 mx-auto">
              <Label htmlFor="picture">Cover</Label>
              <Input id="picture" type="file" />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="genres"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mx-auto mt-5">Genres</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2 justify-center">
                  {genresOptions.map((g) => (
                    <label
                      key={g.value}
                      className="inline-flex items-center gap-2 px-2 py-1 border rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={g.value}
                        checked={field.value?.includes(g.value)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const next = checked
                            ? [...(field.value || []), g.value]
                            : (field.value || []).filter(
                                (v: string) => v !== g.value
                              );
                          field.onChange(next);
                        }}
                      />
                      <span className="text-sm">{g.label}</span>
                    </label>
                  ))}
                </div>
              </FormControl>{" "}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3">
          <Button type="submit" className="w-[50%] mx-auto">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UploadMediaForm;
