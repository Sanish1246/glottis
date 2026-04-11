// IntroductionForm.tsx - handles dialogue creation
import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "./card";
import { Input } from "./input";
import Combobox from "./Combobox";
import { Label } from "../ui/label";

type Options = {
  value: string;
  label: string;
};

const dialogueTypes: Options[] = [
  {
    value: "formal",
    label: "Formal",
  },
  {
    value: "informal",
    label: "Informal",
  },
];

const DialogueBlockEditor = ({ dialogue, onChange, onRemove }) => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dialogueType, setDialogueType] = useState("formal");

  // Function to update the fields of the dialogue
  const updateField = (field, value) => {
    onChange({ ...dialogue, [field]: value });
  };

  // Function to update the type of the dialogue
  useEffect(() => {
    updateField("type", dialogueType);
  }, [dialogueType]);

  // Function to handle the file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFileName(uploadedFile.name);
      setFile(uploadedFile);
      // Updating both file and media in one call
      const updated = {
        ...dialogue,
        file: uploadedFile,
        media: uploadedFile.name,
      };
      onChange(updated);
    }
  };

  return (
    <Card className="p-3 sm:p-4 space-y-4 min-w-0 overflow-hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
        <div className="grid grid-cols-1 gap-3 w-full min-w-0 lg:grid-cols-4 lg:gap-2 lg:flex-1">
          <Input
            placeholder="Dialogue Title"
            value={dialogue.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="min-w-0"
          />
          <Input
            placeholder="Scene Description"
            value={dialogue.scene}
            onChange={(e) => updateField("scene", e.target.value)}
            className="min-w-0"
          />
          <div className="min-w-0 [&_button]:w-full lg:[&_button]:w-[200px]">
            <Combobox
              choices={dialogueTypes}
              filter={dialogueType}
              setFilter={setDialogueType}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center min-w-0">
            <Label htmlFor="picture" className="text-sm font-medium shrink-0">
              Image
            </Label>
            <Input
              id="picture"
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              className="min-w-0"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 self-end lg:self-start"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const DialogLinesEditor = ({ data, dialogue, onChange }) => {
  const [newLine, setNewLine] = useState({
    speaker: "",
    text: "",
    english: "",
  });

  // Function to add a new line
  const addLine = () => {
    // Validation for empty fields
    if (
      newLine.speaker.trim() &&
      newLine.text.trim() &&
      newLine.english.trim()
    ) {
      // Updating the lines array
      const updatedLines = [...dialogue.lines, newLine];
      // Updating the dialogue
      const updatedDialogue = { ...dialogue, lines: updatedLines };

      const newDialogues = data.dialogues.map((d, i) =>
        d === dialogue ? updatedDialogue : d
      );

      onChange({ ...data, dialogues: newDialogues });

      setNewLine({
        speaker: "",
        text: "",
        english: "",
      });
    }
  };

  return (
    <Card className="p-3 sm:p-4 space-y-4 min-w-0 overflow-hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="grid grid-cols-1 gap-3 w-full min-w-0 lg:grid-cols-3 lg:gap-2 lg:flex-1">
          <Input
            placeholder="Speaker"
            value={newLine.speaker}
            onChange={(e) =>
              setNewLine({ ...newLine, speaker: e.target.value })
            }
            className="min-w-0"
          />
          <Input
            placeholder="Text"
            value={newLine.text}
            onChange={(e) => setNewLine({ ...newLine, text: e.target.value })}
            className="min-w-0"
          />
          <Input
            placeholder="English translation"
            value={newLine.english}
            onChange={(e) =>
              setNewLine({ ...newLine, english: e.target.value })
            }
            className="min-w-0"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-full shrink-0 lg:h-10 lg:w-10"
          onClick={() => {
            addLine();
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const IntroductionForm = ({ data, onChange, setCurrentStep }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const dialogues = data.dialogues || [];

  // Function to add a new dialogue
  const addDialogue = () => {
    // Updating the dialogues array
    const newDialogues = [
      ...dialogues,
      {
        title: "",
        scene: "",
        type: "Formal",
        media: "",
        file: null,
        lines: [],
      },
    ];
    onChange({ ...data, dialogues: newDialogues });
    setCurrentPage(newDialogues.length);
  };

  // Function to update a dialogue
  const updateDialogue = (index, updatedDialogue) => {
    // Updating the dialogues array
    const newDialogues = dialogues.map((dialogue, i) =>
      i === index ? updatedDialogue : dialogue
    );
    onChange({ ...data, dialogues: newDialogues }); //Pass full data object
  };

  // Function to remove a dialogue
  const removeDialogue = (index) => {
    // Filtering the dialogues array to remove the dialogue at the specified index
    const newDialogues = dialogues.filter((_, i) => i !== index);
    onChange({ ...data, dialogues: newDialogues });
    // Reset to first page if we deleted the current page
    if (currentPage > newDialogues.length) {
      setCurrentPage(Math.max(1, newDialogues.length));
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {dialogues.map((dialogue, idx) => (
        <div key={idx} className="min-w-0">
          {idx + 1 == currentPage ? (
            <>
              <DialogueBlockEditor
                dialogue={dialogue}
                onChange={(updated) => updateDialogue(idx, updated)}
                onRemove={() => removeDialogue(idx)}
              />
              <DialogLinesEditor
                data={data}
                dialogue={dialogue}
                onChange={onChange}
              />
              <h2 className="font-semibold text-lg mt-4">Lines:</h2>
              <ul className="list-disc pl-5 space-y-2 mt-2 break-words">
                {dialogue.lines.map((l, index: number) => {
                  return (
                    <li key={index} className="break-words">
                      <span className="font-semibold">{l.speaker}:</span>{" "}
                      {l.text}
                      {l.english && (
                        <p className="text-muted-foreground text-sm mt-1">
                          ({l.english})
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
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
          disabled={data.dialogues.length <= 1 || currentPage == 1}
        >
          Previous Dialogue
        </Button>
        <Button
          type="button"
          className="w-full lg:w-auto"
          onClick={() => {
            addDialogue();
            if (data.dialogues.length > 1) {
              setCurrentPage((prevPage: number) => prevPage + 1);
            }
          }}
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Dialogue Block
        </Button>
        <Button
          type="button"
          className="w-full lg:w-auto"
          onClick={() => {
            setCurrentPage((prevPage: number) => prevPage + 1);
          }}
          disabled={
            data.dialogues.length <= 1 ||
            currentPage + 1 == data.dialogues.length
          }
        >
          Next Dialogue
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

export default IntroductionForm;
