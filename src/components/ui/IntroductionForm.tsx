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
      {/* ... rest of the component */}
    </Card>
  );
};

const IntroductionForm = ({ data, onChange, setCurrentStep }) => {
  const dialogues = data.dialogues || [];

  const addDialogue = () => {
    const newDialogues = [
      ...dialogues,
      {
        title: "",
        scene: "",
        type: "",
        media: "",
        lines: [{ speaker: "", text: "", english: "" }],
      },
    ];
    // Update parent component
    onChange({ dialogues: newDialogues });
  };

  const updateDialogue = (index, updatedDialogue) => {
    const newDialogues = dialogues.map((dialogue, i) =>
      i === index ? updatedDialogue : dialogue
    );
    onChange({ dialogues: newDialogues });
  };

  const removeDialogue = (index) => {
    const newDialogues = dialogues.filter((_, i) => i !== index);
    onChange({ dialogues: newDialogues });
  };

  return (
    <div className="space-y-6">
      {dialogues.map((dialogue, idx) => (
        <>
          <DialogueBlockEditor
            key={idx}
            dialogue={dialogue}
            onChange={(updated) => updateDialogue(idx, updated)}
            onRemove={() => removeDialogue(idx)}
          />
          <p>{dialogue.type}</p>
        </>
      ))}
      <div>
        <Button
          onClick={() => {
            setCurrentStep((prevCurrent: number) => prevCurrent - 1);
          }}
        >
          Previous Section
        </Button>
        <Button onClick={addDialogue} variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Add Dialogue Block
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
