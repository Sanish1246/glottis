import { Button } from "./button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const AddCardForm = ({ grammarPoint, onChange }) => {
  const [newPoint, setNewPoint] = useState({
    point: "",
    english: "",
    example: "",
  });
  const [newNote, setNewNote] = useState("");

  const addPoint = () => {
    if (
      newPoint.point.trim() &&
      newPoint.english.trim() &&
      newPoint.example.trim()
    ) {
      const updatedGrammarPoint = {
        ...grammarPoint,
        content: [...grammarPoint.content, newPoint],
      };
      onChange(updatedGrammarPoint);
      setNewPoint({ point: "", english: "", example: "" });
    }
  };

  const addNote = () => {
    if (newNote.trim()) {
      const updatedGrammarPoint = {
        ...grammarPoint,
        notes: [...grammarPoint.notes, newNote],
      };
      onChange(updatedGrammarPoint);
      setNewNote("");
    }
  };

  return (
    <Card className="p-3 sm:p-4 space-y-4 min-w-0 overflow-hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
        <div className="grid grid-cols-1 gap-3 w-full min-w-0 lg:grid-cols-2 lg:gap-2 lg:flex-1">
          <Label htmlFor="title" className="lg:mx-auto text-sm font-medium">
            Grammar point title:
          </Label>
          <Input
            id="title"
            placeholder="Grammar point title"
            value={grammarPoint.title}
            onChange={(e) =>
              onChange({ ...grammarPoint, title: e.target.value })
            }
            className="min-w-0"
          />
          <Input
            placeholder="Add a note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-w-0"
          />
          <Button
            type="button"
            onClick={addNote}
            className="w-full lg:w-[50%] lg:justify-self-start"
          >
            Add Note
          </Button>
          <Input
            placeholder="Grammar point"
            value={newPoint.point}
            onChange={(e) =>
              setNewPoint({ ...newPoint, point: e.target.value })
            }
            className="min-w-0"
          />

          <Input
            placeholder="English translation"
            value={newPoint.english}
            onChange={(e) =>
              setNewPoint({ ...newPoint, english: e.target.value })
            }
            className="min-w-0"
          />
          <Input
            placeholder="Example"
            value={newPoint.example}
            onChange={(e) =>
              setNewPoint({ ...newPoint, example: e.target.value })
            }
            className="min-w-0"
          />
          <Button
            type="button"
            size="icon"
            onClick={addPoint}
            className="h-10 w-full lg:size-10 lg:w-10 lg:justify-self-start"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const GrammarForm = ({ data, onChange, setCurrentStep }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const addGrammar = () => {
    const newGrammarPoints = [...data, { title: "", content: [], notes: [] }];
    onChange(newGrammarPoints);
  };

  const updateGrammar = (index, updatedGrammar) => {
    const newGrammarPoints = data.map((grammar, i) =>
      i === index ? updatedGrammar : grammar
    );
    onChange(newGrammarPoints);
  };

  const removeGrammar = (index) => {
    const newGrammarPoints = data.filter((_, i) => i !== index);
    onChange(newGrammarPoints);
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {data.map((point, idx) => (
        <div key={idx} className="min-w-0">
          {idx + 1 == currentPage ? (
            <>
              <AddCardForm
                grammarPoint={point}
                onChange={(updated) => updateGrammar(idx, updated)}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeGrammar(idx);
                }}
                className="mt-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <h2 className="font-semibold text-lg mt-4">
                List of grammar points
              </h2>
              <div className="w-full overflow-x-auto mt-2 -mx-1 px-1">
                <Table className="w-full min-w-[320px] text-center lg:w-[50%] lg:mx-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Word</TableHead>
                    <TableHead className="text-center">English</TableHead>
                    <TableHead className="text-center">Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {point.content.map((p, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold">{p.point}</TableCell>

                      <TableCell>{p.english}</TableCell>
                      <TableCell>{p.example}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
              <h2 className="font-semibold text-lg mt-4">Notes:</h2>

              <ul className="list-disc pl-5 space-y-2 mt-2 break-words">
                {point.notes.map((note, index) => (
                  <li key={index} className="break-words">
                    {note}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ))}
      <div className="flex flex-col gap-2 w-full lg:flex-row lg:flex-wrap lg:justify-between lg:gap-2">
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
            setCurrentPage((prevPage: number) => prevPage - 1);
          }}
          disabled={data.length <= 1 || currentPage == 1}
        >
          Previous Table
        </Button>
        <Button
          type="button"
          className="w-full lg:w-auto"
          onClick={() => {
            addGrammar();
            if (data.length > 1) {
              setCurrentPage((prevPage: number) => prevPage + 1);
            }
          }}
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Grammar table
        </Button>
        <Button
          type="button"
          className="w-full lg:w-auto"
          onClick={() => {
            setCurrentPage((prevPage: number) => prevPage + 1);
          }}
          disabled={data.length <= 1 || currentPage + 1 == data.length}
        >
          Next Table
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

export default GrammarForm;
