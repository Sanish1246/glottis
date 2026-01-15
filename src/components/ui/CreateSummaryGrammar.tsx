import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "../ui/label";
import { toast } from "sonner";

const AddGrammarForm = ({ data, onChange }) => {
  const [newGrammar, setNewGrammar] = useState("");

  const addGrammar = () => {
    if (newGrammar.trim()) {
      const updatedSummary = {
        ...data,
        grammarPoints: [...data.grammarPoints, newGrammar],
      };
      onChange(updatedSummary);
      setNewGrammar("");
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <Label htmlFor="title" className="mx-auto">
            Grammar Point:
          </Label>
          <Input
            id="title"
            placeholder="Grammar point"
            value={newGrammar}
            onChange={(e) => setNewGrammar(e.target.value)}
          />
        </div>
        <Button onClick={addGrammar}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const CreateSummaryGrammar = ({ data, onChange, setCurrentStep }) => {
  const removeGrammar = (index) => {
    const newGrammar = data.filter((_, i) => i !== index);
    onChange(newGrammar);
  };
  return (
    <div className="space-y-6">
      <div>
        <AddGrammarForm data={data} onChange={onChange} />
        <h3>Grammar points:</h3>
        <ul className="list-disc">
          {data.grammarPoints.map((p: string, index: number) => (
            <li key={index}>
              {p}
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeGrammar(index);
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
            setCurrentStep((prevCurrent: number) => prevCurrent - 1);
          }}
        >
          Previous Section
        </Button>

        <Button
          onClick={() => {
            setCurrentStep((prevCurrent: number) => prevCurrent - 1);
          }}
        >
          Next Section
        </Button>
      </div>
    </div>
  );
};

export default CreateSummaryGrammar;
