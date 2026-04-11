import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { toast } from "sonner";
import { Badge } from "./badge";

interface Question {
  text: string;
  options: string[];
  answer: string;
}

interface QuestionProp {
  question: Question;
  setCorrectFib: React.Dispatch<React.SetStateAction<number>>;
}

const FillInTheBlanks = ({ question, setCorrectFib }: QuestionProp) => {
  const [newAnswer, setNewAnswer] = useState("");

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
      setCorrectFib((prevCount) => prevCount + 1);
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
      <div className="space-y-2">
        <p className="text-sm font-medium leading-relaxed">{question.text}</p>
        {question.options?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {question.options.map((opt, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {opt}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <form
        className="flex w-full flex-col gap-2 sm:flex-row sm:items-center"
        onSubmit={(e) => {
          e.preventDefault();
          checkAnswer();
        }}
      >
        <label htmlFor="answer" className="sr-only">
          Answer
        </label>
        <Input
          id="answer"
          placeholder="Type your answer…"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="sm:max-w-sm"
        />
        <Button type="submit" disabled={!newAnswer.trim()}>
          Check
        </Button>
      </form>
    </div>
  );
};

export default FillInTheBlanks;
