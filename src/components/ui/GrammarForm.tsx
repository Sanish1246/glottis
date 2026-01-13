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
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <Label htmlFor="title" className="mx-auto">
            Grammar point title:
          </Label>
          <Input
            id="title"
            placeholder="Grammar point title"
            value={grammarPoint.title}
            onChange={(e) =>
              onChange({ ...grammarPoint, title: e.target.value })
            }
          />
          <Input
            placeholder="Add a note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button onClick={addNote} className="w-[50%]">
            Add Note
          </Button>
          <Input
            placeholder="Grammar point"
            value={newPoint.point}
            onChange={(e) =>
              setNewPoint({ ...newPoint, point: e.target.value })
            }
          />

          <Input
            placeholder="English translation"
            value={newPoint.english}
            onChange={(e) =>
              setNewPoint({ ...newPoint, english: e.target.value })
            }
          />
          <Input
            placeholder="Example"
            value={newPoint.example}
            onChange={(e) =>
              setNewPoint({ ...newPoint, example: e.target.value })
            }
          />
          <Button size="icon" onClick={addPoint}>
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
    <div className="space-y-6">
      {data.map((point, idx) => (
        <div key={idx}>
          {idx + 1 == currentPage ? (
            <>
              <AddCardForm
                grammarPoint={point}
                onChange={(updated) => updateGrammar(idx, updated)}
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeGrammar(idx);
                }}
                className="mt-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <h2>List of grammar points</h2>
              <Table className="w-[50%] mx-auto text-center">
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
              <h2>Notes:</h2>

              <ul className="list-disc">
                {point.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ))}
      <div>
        <Button
          onClick={() => {
            setCurrentStep((prevCurrent: number) => prevCurrent - 1);
          }}
        >
          Previous Section
        </Button>
        <Button
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
          onClick={() => {
            setCurrentPage((prevPage: number) => prevPage - 1);
          }}
          disabled={data.length <= 1 || currentPage == 1}
        >
          Previous Table
        </Button>
        <Button
          onClick={() => {
            setCurrentPage((prevPage: number) => prevPage + 1);
          }}
          disabled={data.length <= 1 || currentPage + 1 == data.length}
        >
          Next Table
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

export default GrammarForm;
