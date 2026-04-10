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

const languages: Options[] = [
  {
    value: "italian",
    label: "Italian",
  },
  {
    value: "french",
    label: "French",
  },
];

const BasicInfoForm = ({ data, onChange, setCurrentStep }: any) => {
  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };
  const [level, setLevel] = useState("Beginner");

  const [newObjective, setNewObjective] = useState("");
  const [language, setLanguage] = useState("italian");

  const addObjective = () => {
    if (newObjective.trim()) {
      // Also validate non-empty
      const newObjectives = [...data.objectives, newObjective];
      onChange({ ...data, objectives: newObjectives });
      setNewObjective("");
    }
  };

  useEffect(() => {
    onChange({ ...data, level, language });
  }, [level, language]);

  const checkExisting = async () => {
    const fields = {
      title: data.title,
      language: language,
    };

    try {
      const res = await fetch(
        `http://localhost:8000/lessons/existing/${fields.title}/${fields.language}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await res.json();
      console.log(data);
      if (data.length == 0) {
        setCurrentStep((prevCurrent: number) => prevCurrent + 1);
      } else {
        toast.error(
          "A custom lesson with this title and language already exists!",
          {
            action: {
              label: "Close",
              onClick: () => {
                toast.dismiss();
              },
            },
          },
        );
      }
    } catch (error) {
      toast.error(String(error), {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  };

  return (
    <div className="w-full min-w-0 space-y-4">
      <Card className="p-3 sm:p-4 space-y-4 min-w-0 overflow-hidden">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
          <div className="grid grid-cols-1 gap-3 w-full min-w-0 lg:grid-cols-2 lg:gap-2 lg:flex-1">
            <Input
              placeholder="Lesson Title"
              value={data.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="min-w-0"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center min-w-0 [&_button]:w-full lg:[&_button]:w-[200px]">
              <label className="text-sm font-medium shrink-0">Language</label>
              <Combobox
                choices={languages}
                filter={language}
                setFilter={setLanguage}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center min-w-0 [&_button]:w-full lg:[&_button]:w-[200px]">
              <label className="text-sm font-medium shrink-0">Level</label>
              <Combobox choices={levels} filter={level} setFilter={setLevel} />
            </div>

            <div className="flex flex-col gap-2 min-w-0 lg:flex-row lg:items-center lg:gap-3 lg:col-span-2">
              <Input
                id="objective"
                placeholder="Enter an objective"
                value={newObjective}
                className="w-full min-w-0 lg:w-[80%]"
                onChange={(e) => {
                  setNewObjective(e.target.value);
                }}
              />
              <Button
                type="button"
                className="w-full shrink-0 lg:w-auto"
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
      <div className="min-w-0">
        <h2 className="font-semibold text-lg">Objectives</h2>
        <ul className="list-disc pl-5 space-y-1 mt-2 break-words">
          {data.objectives.map((obj: string, index: number) => {
            return (
              <li key={index} className="break-words">
                {obj}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col gap-2 w-full lg:flex-row lg:justify-end">
        <Button
          type="button"
          className="w-full lg:w-auto"
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
              checkExisting();
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
