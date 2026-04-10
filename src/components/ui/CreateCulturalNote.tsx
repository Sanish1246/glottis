import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "../ui/label";
import { toast } from "sonner";

const AddNotesForm = ({ note, onChange }) => {
  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (newNote.trim()) {
      if (note.title == "") {
        toast.error("Add a title first!", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      } else {
        const updatedNotes = {
          ...note,
          content: [...note.content, newNote],
        };
        onChange(updatedNotes);
        setNewNote("");
      }
    }
  };

  return (
    <Card className="p-3 sm:p-4 space-y-4 min-w-0 overflow-hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="grid grid-cols-1 gap-3 w-full min-w-0 lg:grid-cols-2 lg:gap-2 lg:flex-1">
          <Label htmlFor="title" className="lg:mx-auto text-sm font-medium">
            Cultural note title:
          </Label>
          <Input
            id="title"
            placeholder="Cultural note title"
            value={note.title}
            onChange={(e) => onChange({ ...note, title: e.target.value })}
            className="min-w-0"
          />
          <Input
            placeholder="Add a note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-w-0"
          />
          <Button
            onClick={addNote}
            type="button"
            className="w-full lg:w-[30%] lg:justify-self-start"
          >
            Add Note
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CreateCulturalNote = ({ data, onChange, setCurrentStep }) => {
  const removeNote = (index) => {
    const newNotes = data.filter((_, i) => i !== index);
    onChange(newNotes);
  };
  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="min-w-0">
        <AddNotesForm note={data} onChange={onChange} />

        <h2 className="text-lg font-semibold mt-4 break-words">
          Title: {data.title}
        </h2>
        <h3 className="font-medium mt-2">Notes:</h3>
        <ul className="list-disc pl-5 space-y-3 min-w-0">
          {data.content.map((note: string, index: number) => (
            <li key={index} className="break-words">
              <span className="align-middle">{note}</span>{" "}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeNote(index);
                }}
                className="mt-2 align-middle shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col-reverse gap-2 w-full lg:flex-row lg:justify-between lg:gap-0">
        <Button
          type="button"
          className="w-full lg:w-auto"
          onClick={() => {
            if (
              data.title != "" ||
              (data.title == "" && data.content.length == 0)
            ) {
              setCurrentStep((prevCurrent: number) => prevCurrent - 1);
            } else {
              toast.error("Add a title first!", {
                action: {
                  label: "Close",
                  onClick: () => {
                    toast.dismiss();
                  },
                },
              });
            }
          }}
        >
          Previous Section
        </Button>

        <Button
          type="button"
          className="w-full lg:w-auto"
          onClick={() => {
            if (
              data.title != "" ||
              (data.title == "" && data.content.length == 0)
            ) {
              setCurrentStep((prevCurrent: number) => prevCurrent + 1);
            } else {
              toast.error("Add a title first!", {
                action: {
                  label: "Close",
                  onClick: () => {
                    toast.dismiss();
                  },
                },
              });
            }
          }}
        >
          Next Section
        </Button>
      </div>
    </div>
  );
};

export default CreateCulturalNote;
