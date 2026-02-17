"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { uploadMediaSchema, type UploadMediaSchema } from "@/lib/schemas";
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

type UploadProps = {
  onClose?: () => void;
};

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
    value: "News Articles",
    label: "News Articles",
  },
  {
    value: "Podcast",
    label: "Podcast",
  },
  {
    value: "TV Show",
    label: "TV Show",
  },
  {
    value: "Video/Channel",
    label: "Video/Channel",
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
  const [language, setLanguage] = useState("italian");
  const [level, setLevel] = useState("Beginner");
  const [mediaType, setMediaType] = useState("Book");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<UploadMediaSchema>({
    resolver: zodResolver(uploadMediaSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      genres: [],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFileName(uploadedFile.name);
      setFile(uploadedFile);
    }
  };

  async function onSubmit(values: UploadMediaSchema) {
    try {
      const formData = new FormData();
      const metadata = {
        ...values,
        likes: 0,
        language: language,
        level: level,
        type: mediaType,
      };
      formData.append("media", JSON.stringify(metadata));
      if (file) formData.append("coverImage", file, file.name);

      const res = await fetch("http://localhost:8000/immersion/submitMedia", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        toast.error("Upload failed");
        return;
      }

      if (onClose) onClose();
      toast.success("Media uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onSubmitCapture={() => console.log("form submit captured")}
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
                      placeholder="Enter your description (Min. 8 characters)..."
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
          <div className="flex flex-col w-[50%] gap-3">
            <div className="flex flex-row gap-1 mx-auto items-center justify-center">
              <p>Language:</p>
              <Combobox
                choices={languages}
                filter={language}
                setFilter={setLanguage}
              ></Combobox>
            </div>

            <div className="flex flex-row gap-1 mx-auto items-center justify-center">
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

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" mx-auto mt-5">Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Copy and paste the link to access the media..."
                      {...field}
                      className="w-[80%] mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid w-full max-w-sm items-center gap-3 mx-auto">
              <Label htmlFor="picture">Cover</Label>
              <Input
                id="picture"
                accept="image/*"
                type="file"
                onChange={handleFileChange}
              />
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
                                (v: string) => v !== g.value,
                              );
                          field.onChange(next);
                        }}
                      />
                      <span className="text-sm">{g.label}</span>
                    </label>
                  ))}
                </div>
              </FormControl>
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
