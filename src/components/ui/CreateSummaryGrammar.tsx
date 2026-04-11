import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "../ui/label";

const AddGrammarForm = ({ data, onChange }) => {
  const [newGrammar, setNewGrammar] = useState("");

  const addGrammar = () => {
    // Validation for empty fields
    if (newGrammar.trim()) {
      const updatedSummary = {
        ...data,
        grammarPoints: [...data.grammarPoints, newGrammar],
      };
      // Updating the grammar points array
      onChange(updatedSummary);
      setNewGrammar("");
    }
  };

  return (
    <Card className="p-3 sm:p-4 space-y-4 min-w-0 overflow-hidden">
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
        <div className="grid grid-cols-1 gap-3 w-full min-w-0 lg:grid-cols-2 lg:gap-2 lg:flex-1">
          <Label htmlFor="title" className="lg:mx-auto text-sm font-medium">
            Grammar Point:
          </Label>
          <Input
            id="title"
            placeholder="Grammar point"
            value={newGrammar}
            onChange={(e) => setNewGrammar(e.target.value)}
            className="min-w-0"
          />
        </div>
        <Button
          type="button"
          onClick={addGrammar}
          className="w-full shrink-0 lg:w-auto lg:ml-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const CreateSummaryGrammar = ({ data, onChange, setCurrentStep }) => {
  // Function to remove a grammar point from the summary
  const removeGrammar = (index) => {
    // Filtering the grammar points array to remove the grammar point at the specified index
    const updatedGrammarPoints = data.grammarPoints.filter(
      (_, i) => i !== index
    );
    // Updating the grammar points array
    onChange({
      ...data,
      grammarPoints: updatedGrammarPoints,
    });
  };
  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="min-w-0">
        <AddGrammarForm data={data} onChange={onChange} />
        <h3 className="font-medium mt-4">Grammar points:</h3>
        <ul className="list-disc pl-5 space-y-3 min-w-0">
          {data.grammarPoints.map((p: string, index: number) => (
            <li key={index} className="break-words">
              {p}{" "}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeGrammar(index);
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
            setCurrentStep((prevCurrent: number) => prevCurrent - 1);
          }}
        >
          Previous Section
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

export default CreateSummaryGrammar;
