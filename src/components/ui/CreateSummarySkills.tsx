import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "../ui/label";
import { toast } from "sonner";

const AddGrammarForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim()) {
      const updatedSummary = {
        ...data,
        skills: [...data.skills, newSkill],
      };
      onChange(updatedSummary);
      setNewSkill("");
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <Label htmlFor="title" className="mx-auto">
            Skill:
          </Label>
          <Input
            id="title"
            placeholder="Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
        </div>
        <Button onClick={addSkill} className="ml-2">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const CreateSummarySkills = ({
  fullLesson,
  data,
  onChange,
  setCurrentStep,
}) => {
  const removeSkill = (index) => {
    const updatedSkills = data.skills.filter((_, i) => i !== index);
    onChange({
      ...data,
      skills: updatedSkills,
    });
  };

  const submitLesson = async () => {
    try {
      const res = await fetch("http://localhost:8000/lessons/submit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullLesson),
      });

      const data = await res.json();
      if (data.message) {
        toast.success(data.message, {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }
    } catch (error: any) {
      toast.error(error, {
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
    <div className="space-y-6">
      <div>
        <AddGrammarForm data={data} onChange={onChange} />
        <h3>Skills:</h3>
        <ul className="list-disc">
          {data.skills.map((s: string, index: number) => (
            <li key={index}>
              {s}
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeSkill(index);
                }}
                className="mt-2"
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
            submitLesson();
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CreateSummarySkills;
