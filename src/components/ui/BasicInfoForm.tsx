import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "./card";
import { Input } from "./input";
import Combobox from "./Combobox";
import { toast } from "sonner";

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

  const [newObjective, setNewObjective] = useState("");

  const addObjective = () => {
    if (newObjective.trim()) {
      // Also validate non-empty
      const newObjectives = [...data.objectives, newObjective];
      onChange({ ...data, objectives: newObjectives });
      setNewObjective("");
    }
  };

  useEffect(() => {
    updateField("level", level);
  }, [level]);

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
            <div className="flex flex-row gap-3">
              <Input
                id="objective"
                placeholder="Enter an objective"
                value={newObjective}
                className="w-[80%]"
                onChange={(e) => {
                  setNewObjective(e.target.value);
                }}
              />
              <Button
                onClick={() => {
                  addObjective();
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <div>
        <h2>Objectives</h2>
        <ul className="list-disc">
          {data.objectives.map((obj: string, index: number) => {
            return <li key={index}>{obj}</li>;
          })}
        </ul>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            if (
              data.title == "" ||
              data.language == "" ||
              data.objectives.length == 0
            ) {
              toast.error("You should fill in all the fields first!", {
                action: {
                  label: "Close",
                  onClick: () => {
                    toast.dismiss();
                  },
                },
              });
            } else {
              setCurrentStep((prevCurrent: number) => prevCurrent + 1);
            }
          }}
        >
          Next section
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoForm;
