import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { toast } from "sonner";

interface Question {
  text: string;
  options: string[];
  answer: string;
}

interface QuestionProp {
  question: Question;
}

const FillInTheBlanks = ({ question }: QuestionProp) => {
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
    <div>
      <div className="flex flex-row">
        <p>
          {question.text} [
          {question.options.map((a, index) => (
            <span key={index}>{a}, </span>
          ))}
          ]
        </p>
      </div>
      <div className="flex flex-row max-w-[20%]">
        <label htmlFor="answer"></label>
        <Input
          id="answer"
          placeholder="answer"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        ></Input>
        <Button
          onClick={() => {
            checkAnswer();
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default FillInTheBlanks;
