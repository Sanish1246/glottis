import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddSkillsForm = ({ data, onChange }) => {
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
    <Card className="p-3 sm:p-4 space-y-4 min-w-0 overflow-hidden">
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
        <div className="grid grid-cols-1 gap-3 w-full min-w-0 lg:grid-cols-2 lg:gap-2 lg:flex-1">
          <Label htmlFor="title" className="lg:mx-auto text-sm font-medium">
            Skill:
          </Label>
          <Input
            id="title"
            placeholder="Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="min-w-0"
          />
        </div>
        <Button
          type="button"
          onClick={addSkill}
          className="w-full shrink-0 lg:w-auto lg:ml-2"
        >
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
  const navigate = useNavigate();

  // const submitLesson = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("lesson", JSON.stringify(fullLesson));

  //     // Collect all dialogue images
  //     fullLesson.introduction?.dialogues?.forEach((dialogue, idx) => {
  //       if (dialogue.file instanceof File) {
  //         formData.append("dialogueImages", dialogue.file);
  //       }
  //     });

  //     const res = await fetch("http://localhost:8000/lessons/submit", {
  //       method: "POST",
  //       credentials: "include",
  //       body: formData,
  //     });

  //     const data = await res.json();
  //     if (data.message) {
  //       toast.success(data.message);
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message || "Submission failed");
  //   }
  // };
  const submitLesson = async () => {
    try {
      const formData = new FormData();
      formData.append("lesson", JSON.stringify(fullLesson));

      // Collect all dialogue images
      let fileCount = 0;
      fullLesson.introduction?.dialogues?.forEach((dialogue, idx) => {
        if (dialogue.file instanceof File) {
          console.log(`Adding file ${idx}: ${dialogue.file.name}`);
          formData.append("dialogueImages", dialogue.file);
          fileCount++;
        }
      });

      console.log(`Submitting with ${fileCount} files`);

      const res = await fetch("http://localhost:8000/lessons/submit", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.message) {
        toast.success(data.message);
        navigate("/");
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Submission failed");
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="min-w-0">
        <AddSkillsForm data={data} onChange={onChange} />
        <h3 className="font-medium mt-4">Skills:</h3>
        <ul className="list-disc pl-5 space-y-3 min-w-0">
          {data.skills.map((s: string, index: number) => (
            <li key={index} className="break-words">
              {s}{" "}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeSkill(index);
                }}
                className="mt-2 align-middle shrink-0"
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
