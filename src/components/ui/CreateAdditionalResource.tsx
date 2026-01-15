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
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-3 gap-2 flex-1 items-center">
          <div>
            <Label htmlFor="type" className="mx-auto">
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
          />
          <Input
            placeholder="Add a link"
            value={newResource.url}
            onChange={(e) =>
              setNewResource({ ...newResource, url: e.target.value })
            }
          />
        </div>
        <Button onClick={addResource} className="ml-2">
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
    <div className="space-y-6">
      <div>
        <AddResourceForm data={data} onChange={onChange} />
        <h3>Resources:</h3>
        <ul className="list-disc">
          {data.map((r, index: number) => (
            <li key={index}>
              <a href={r.url} target="_blank" className="underline">
                [{r.type}] - {r.title}
              </a>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeNote(index);
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
