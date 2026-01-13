import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "../ui/label";

const AddFibForm = ({ data, ques, onChange }) => {
  const [newOpt, setNewOpt] = useState([]);

  const addQues = () => {
    if (ques.english.length === 3 && ques.text.trim() && ques.answer.trim()) {
      const updatedFibs = {
        ...data,
        ques,
      };
      onChange(updatedFibs);
      setNewOpt([]);
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
            onChange={(e) => onChange({ ...ques, text: e.target.value })}
          />
          <Input
            placeholder="Add the answer"
            value={ques.answer}
            onChange={(e) => onChange({ ...ques, answer: e.target.value })}
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
  const updateFib = (index, updatedFib) => {
    const newFibs = data.map((fib, i) => (i === index ? updatedFib : fib));
    onChange(newFibs);
  };

  const removeFib = (index) => {
    const newFibs = data.filter((_, i) => i !== index);
    onChange(newFibs);
  };

  return (
    <div className="space-y-6">
      {data.map((ques, idx) => (
        <div key={idx}>
          {idx + 1 == currentPage ? (
            <>
              <AddFibForm
                data={data}
                ques={ques}
                onChange={(updated) => updateFib(idx, updated)}
              />

              <h2>Questions:</h2>

              <ul className="list-disc">
                <li>
                  {ques}
                  {ques.options.map((opt, index) => (
                    <span key={index}>{opt}, </span>
                  ))}
                  <span> → {ques.answer}</span>
                </li>
              </ul>
            </>
          ) : null}
        </div>
      ))}
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
