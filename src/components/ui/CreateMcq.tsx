import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "../ui/label";
import { toast } from "sonner";

const AddMcqForm = ({ data, onChange }) => {
  const [ques, setQues] = useState({ question: "", options: [], answer: "" });
  const [newOpt, setNewOpt] = useState(["", "", ""]);

  const addQues = () => {
    // Validation for empty fields
    if (newOpt.length === 3 && ques.question.trim() && ques.answer.trim()) {
      if (newOpt.includes(ques.answer)) {
        const updatedQuestion = { ...ques, options: newOpt };
        const updatedMcqs = [...data, updatedQuestion];
        onChange(updatedMcqs);
        setQues({ question: "", options: [], answer: "" });
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
    <Card className="p-3 sm:p-4 space-y-4 min-w-0 overflow-hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
        <div className="grid grid-cols-1 gap-3 w-full min-w-0 lg:grid-cols-2 lg:gap-2 lg:flex-1">
          <Label htmlFor="question" className="lg:mx-auto text-sm font-medium">
            Question:
          </Label>
          <Input
            id="question"
            placeholder="Question"
            value={ques.question}
            onChange={(e) => setQues({ ...ques, question: e.target.value })}
            className="min-w-0"
          />
          <Input
            placeholder="Add the answer"
            value={ques.answer}
            onChange={(e) => setQues({ ...ques, answer: e.target.value })}
            className="min-w-0"
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
            className="min-w-0"
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
            className="min-w-0"
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
            className="min-w-0"
          />
          <Button
            type="button"
            size="icon"
            onClick={addQues}
            className="h-10 w-full lg:size-10 lg:w-10 lg:justify-self-start"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CreateMcq = ({ data, onChange, setCurrentStep }) => {
  // Function to remove a question from the MCQ
  const removeMcq = (index) => {
    // Filtering the questions array to remove the question at the specified index
    const newMcqs = data.filter((_, i) => i !== index);
    onChange(newMcqs);
  };
  // Displaying the MCQ questions
  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="min-w-0">
        <AddMcqForm data={data} onChange={onChange} />

        <h2 className="text-lg font-semibold mt-4">Questions:</h2>

        <ul className="list-disc pl-5 space-y-4 min-w-0">
          {data.map((ques, idx) => (
            <li key={idx} className="break-words">
              <span className="font-medium">{ques.question}:</span>{" "}
              {/* Displaying the options */}
              {ques.options.map((opt, index) => (
                <span key={index}>{opt}, </span>
              ))}
              {/* Displaying the answer */}
              <span> → {ques.answer}</span>{" "}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="align-middle shrink-0 mt-1"
                onClick={() => {
                  removeMcq(idx);
                }}
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

export default CreateMcq;
