import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "../ui/label";
import { toast } from "sonner";

const AddFibForm = ({ data, onChange }) => {
  const [ques, setQues] = useState({ text: "", options: [], answer: "" });
  const [newOpt, setNewOpt] = useState(["", "", ""]);

  const addQues = () => {
    if (newOpt.length === 3 && ques.text.trim() && ques.answer.trim()) {
      if (newOpt.includes(ques.answer)) {
        const updatedQuestion = { ...ques, options: newOpt };
        const updatedFibs = [...data, updatedQuestion];
        onChange(updatedFibs);
        setQues({ text: "", options: [], answer: "" });
        setNewOpt(["", "", ""]);
      } else {
        toast.error("The answer should match one of the options!", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <Label htmlFor="question" className="mx-auto">
            Question:
          </Label>
          <Input
            id="question"
            placeholder="Question"
            value={ques.text}
            onChange={(e) => setQues({ ...ques, text: e.target.value })}
          />
          <Input
            placeholder="Add the answer"
            value={ques.answer}
            onChange={(e) => setQues({ ...ques, answer: e.target.value })}
          />
          <Input
            placeholder="Option 1"
            value={newOpt[0]}
            onChange={(e) =>
              setNewOpt((prev) => {
                const updated = [...prev];
                updated[0] = e.target.value;
                return updated;
              })
            }
          />
          <Input
            placeholder="Option 2"
            value={newOpt[1]}
            onChange={(e) =>
              setNewOpt((prev) => {
                const updated = [...prev];
                updated[1] = e.target.value;
                return updated;
              })
            }
          />
          <Input
            placeholder="Option 3"
            value={newOpt[2]}
            onChange={(e) =>
              setNewOpt((prev) => {
                const updated = [...prev];
                updated[2] = e.target.value;
                return updated;
              })
            }
          />
          <Button size="icon" onClick={addQues}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CreateFIB = ({ data, onChange, setCurrentStep }) => {
  const removeFib = (index) => {
    const newFibs = data.filter((_, i) => i !== index);
    onChange(newFibs);
  };

  return (
    <div className="space-y-6">
      <div>
        <AddFibForm data={data} onChange={onChange} />

        <h2>Questions:</h2>

        <ul className="list-disc">
          {data.map((ques, idx) => (
            <li key={idx}>
              {ques.text}:
              {ques.options.map((opt, index) => (
                <span key={index}>{opt}, </span>
              ))}
              <span> → {ques.answer}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeFib(idx)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>

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
            setCurrentStep((prevCurrent: number) => prevCurrent + 1);
          }}
        >
          Next Section
        </Button>
      </div>
    </div>
  );
};

export default CreateFIB;
