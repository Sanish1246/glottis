import React, { useState } from "react";
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
    <div className="space-y-3">
      <p className="font-medium">{question.question}</p>
      {question.options.map((opt, i) => (
        <label key={i} className="block">
          <input
            type="radio"
            name="quiz"
            value={opt}
            checked={newAnswer === opt}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="mr-2"
          />
          {opt}
        </label>
      ))}
      <Button onClick={checkAnswer}>Confirm</Button>
    </div>
  );
};

export default Mcq;
