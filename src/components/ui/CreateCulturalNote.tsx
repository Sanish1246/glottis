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
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <Label htmlFor="title" className="mx-auto">
            Cultural note title:
          </Label>
          <Input
            id="title"
            placeholder="Cultural note title"
            value={note.title}
            onChange={(e) => onChange({ ...note, title: e.target.value })}
          />
          <Input
            placeholder="Add a note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button onClick={addNote} className="w-[50%]">
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
    <div className="space-y-6">
      <div>
        <AddNotesForm note={data} onChange={onChange} />

        <h2>Title: {data.title}</h2>
        <h3>Notes:</h3>
        <ul className="list-disc">
          {data.content.map((note: string, index: number) => (
            <li key={index}>
              {note}
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeNote(index);
                }}
                className="mt-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Button
          onClick={() => {
            if (
              (data.title == "" && data.content.length > 0) ||
              data.title != ""
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
          onClick={() => {
            if (
              (data.title == "" && data.content.length > 0) ||
              data.title != ""
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
