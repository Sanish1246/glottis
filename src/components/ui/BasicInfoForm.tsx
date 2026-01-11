import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "./card";
import { Input } from "./input";
import Combobox from "./Combobox";
import { Label } from "../ui/label";

type BasicInfoProps = {
  setCurrentStep: any;
};

type Options = {
  value: string;
  label: string;
};

const levels: Options[] = [
  {
    value: "Beginner",
    label: "Beginner",
  },
  {
    value: "Lower intermediate",
    label: "Lower intermediate",
  },
  {
    value: "Intermediate",
    label: "Intermediate",
  },
  {
    value: "Upper intermediate",
    label: "Upper Intermediate",
  },
  {
    value: "Advanced",
    label: "Advanced",
  },
];

const BasicInfoForm = ({ data, onChange, setCurrentStep }: any) => {
  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };
  const [level, setLevel] = useState("Beginner");

  return (
    <div>
      <Card className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="grid grid-cols-2 gap-2 flex-1">
            <Input
              placeholder="Lesson Title"
              value={data.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
            <Input
              placeholder="Lesson Language"
              value={data.language}
              onChange={(e) => updateField("language", e.target.value)}
            />
            <Combobox choices={levels} filter={level} setFilter={setLevel} />
          </div>
        </div>
      </Card>
      <Button
        onClick={() => {
          setCurrentStep((prevCurrent: number) => prevCurrent + 1);
        }}
      >
        Next section
      </Button>
    </div>
  );
};

export default BasicInfoForm;
