import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import Combobox from "./Combobox";

type Options = {
  value: string;
  label: string;
};

const sources: Options[] = [
  {
    value: "Blog",
    label: "Blog",
  },
  {
    value: "Video",
    label: "Video",
  },
];

const AddResourceForm = ({ data, onChange }) => {
  const [newResource, setNewResource] = useState({
    title: "",
    url: "",
  });
  const [resourceType, setResourceType] = useState("Blog");

  const addResource = () => {
    if (newResource.title.trim() && newResource.url.trim()) {
      const resource = {
        ...newResource,
        type: resourceType,
      };
      const updatedResources = [...data, resource];
      onChange(updatedResources);
      setNewResource({ title: "", url: "" });
      setResourceType("Blog");
    } else {
      toast.error("Fill in all the fields!", {
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
    <Card className="p-3 sm:p-4 space-y-4 min-w-0 overflow-hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-end">
        <div className="grid grid-cols-1 gap-4 w-full min-w-0 lg:grid-cols-3 lg:gap-2 lg:flex-1 lg:items-end">
          <div className="w-full min-w-0 [&_button]:w-full lg:[&_button]:w-[200px]">
            <Label htmlFor="type" className="text-sm font-medium">
              Resource type:
            </Label>
            <Combobox
              choices={sources}
              filter={resourceType}
              setFilter={setResourceType}
            />
          </div>

          <Input
            placeholder="Resource title"
            value={newResource.title}
            onChange={(e) =>
              setNewResource({ ...newResource, title: e.target.value })
            }
            className="min-w-0"
          />
          <Input
            placeholder="Add a link"
            value={newResource.url}
            onChange={(e) =>
              setNewResource({ ...newResource, url: e.target.value })
            }
            className="min-w-0"
          />
        </div>
        <Button
          type="button"
          onClick={addResource}
          className="w-full shrink-0 lg:w-auto lg:ml-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const CreateAdditionalResource = ({ data, onChange, setCurrentStep }) => {
  const removeNote = (index) => {
    const newResources = data.filter((_, i) => i !== index);
    onChange(newResources);
  };
  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="min-w-0">
        <AddResourceForm data={data} onChange={onChange} />
        <h3 className="font-medium mt-4">Resources:</h3>
        <ul className="list-disc pl-5 space-y-3 min-w-0">
          {data.map((r, index: number) => (
            <li key={index} className="break-words">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline break-all"
              >
                [{r.type}] - {r.title}
              </a>{" "}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeNote(index);
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
            setCurrentStep((prevCurrent: number) => prevCurrent + 1);
          }}
        >
          Next Section
        </Button>
      </div>
    </div>
  );
};

export default CreateAdditionalResource;
