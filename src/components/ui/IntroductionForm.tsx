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

  const updateField = (field, value) => {
    onChange({ ...dialogue, [field]: value });
  };

  useEffect(() => {
    updateField("type", dialogueType);
  }, [dialogueType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFileName(uploadedFile.name);
      setFile(uploadedFile);
      // Update both file and media in one call
      const updated = {
        ...dialogue,
        file: uploadedFile,
        media: uploadedFile.name,
      };
      onChange(updated);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-4 gap-2 flex-1">
          <Input
            placeholder="Dialogue Title"
            value={dialogue.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
          <Input
            placeholder="Scene Description"
            value={dialogue.scene}
            onChange={(e) => updateField("scene", e.target.value)}
          />
          <Combobox
            choices={dialogueTypes}
            filter={dialogueType}
            setFilter={setDialogueType}
          />
          <div className="flex flex-row gap-2">
            <Label htmlFor="picture">Image</Label>
            <Input
              id="picture"
              accept="image/*"
              type="file"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onRemove}>
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

  const addLine = () => {
    if (
      newLine.speaker.trim() &&
      newLine.text.trim() &&
      newLine.english.trim()
    ) {
      const updatedLines = [...dialogue.lines, newLine];
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
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-3 gap-2 flex-1">
          <Input
            placeholder="Speaker"
            value={newLine.speaker}
            onChange={(e) =>
              setNewLine({ ...newLine, speaker: e.target.value })
            }
          />
          <Input
            placeholder="Text"
            value={newLine.text}
            onChange={(e) => setNewLine({ ...newLine, text: e.target.value })}
          />
          <Input
            placeholder="English translation"
            value={newLine.english}
            onChange={(e) =>
              setNewLine({ ...newLine, english: e.target.value })
            }
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
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

  const addDialogue = () => {
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
  const updateDialogue = (index, updatedDialogue) => {
    const newDialogues = dialogues.map((dialogue, i) =>
      i === index ? updatedDialogue : dialogue
    );
    onChange({ ...data, dialogues: newDialogues }); // FIX: Pass full data object
  };

  const removeDialogue = (index) => {
    const newDialogues = dialogues.filter((_, i) => i !== index);
    onChange({ ...data, dialogues: newDialogues });
    // Reset to first page if we deleted the current page
    if (currentPage > newDialogues.length) {
      setCurrentPage(Math.max(1, newDialogues.length));
    }
  };

  return (
    <div className="space-y-6">
      {dialogues.map((dialogue, idx) => (
        <>
          {idx + 1 == currentPage ? (
            <>
              <DialogueBlockEditor
                key={idx}
                dialogue={dialogue}
                onChange={(updated) => updateDialogue(idx, updated)}
                onRemove={() => removeDialogue(idx)}
              />
              <DialogLinesEditor
                data={data}
                dialogue={dialogue}
                onChange={onChange}
              />
              <h2>Lines:</h2>
              <ul className=" list-disc">
                {dialogue.lines.map((l, index: number) => {
                  return (
                    <li key={index}>
                      <span className="font-semibold">{l.speaker}:</span>{" "}
                      {l.text}
                      {l.english && <p>({l.english})</p>}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </>
      ))}
      <div className="flex justify-between">
        <Button
          onClick={() => {
            setCurrentStep((prevCurrent: number) => prevCurrent - 1);
          }}
        >
          Previous Section
        </Button>

        <Button
          onClick={() => {
            setCurrentPage((prevPage: number) => prevPage - 1);
          }}
          disabled={data.dialogues.length <= 1 || currentPage == 1}
        >
          Previous Dialogue
        </Button>
        <Button
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
