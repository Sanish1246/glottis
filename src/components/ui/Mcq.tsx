import React, { useId, useState } from "react";
import { Button } from "./button";
import { toast } from "sonner";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuestionProp {
  question: Question;
  setCorrectMcq: React.Dispatch<React.SetStateAction<number>>;
}

const Mcq = ({ question, setCorrectMcq }: QuestionProp) => {
  const [newAnswer, setNewAnswer] = useState("");
  const groupName = useId();

  function checkAnswer() {
    if (newAnswer.toLowerCase() == question.answer.toLowerCase()) {
      toast.success("Correct Answer!", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      setNewAnswer("");
      setCorrectMcq((prevCount) => prevCount + 1);
    } else {
      toast.error("Wrong answer!", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium leading-relaxed">{question.question}</p>

      <div className="grid gap-2">
        {question.options.map((opt, i) => {
          const id = `${groupName}-${i}`;
          const selected = newAnswer === opt;
          return (
            <label
              key={id}
              htmlFor={id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/40"
              }`}
            >
              <input
                id={id}
                type="radio"
                name={groupName}
                value={opt}
                checked={selected}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="mt-0.5"
              />
              <span className="leading-relaxed">{opt}</span>
            </label>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={checkAnswer} disabled={!newAnswer}>
          Confirm
        </Button>
        <span className="text-xs text-muted-foreground">
          Select an option to continue
        </span>
      </div>
    </div>
  );
};

export default Mcq;
