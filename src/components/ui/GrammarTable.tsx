import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SpeechButton from "./SpeechButton";

interface GrammarPoint {
  point: string;
  english: string;
  example: string;
  audio: string;
}

interface GrammarTableProps {
  lang: string;
  grammarPoint: GrammarPoint[];
}

const GrammarTable = ({ lang, grammarPoint }: GrammarTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Italian</TableHead>
          <TableHead>English</TableHead>
          <TableHead>Example</TableHead>
          <TableHead>Audio</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {grammarPoint.map((g, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{g.point}</TableCell>
            <TableCell>{g.english}</TableCell>
            <TableCell>{g.example}</TableCell>

            <TableCell>
              {g.audio && (
                <SpeechButton
                  text={g.example}
                  lang={lang}
                  voiceName={g.audio}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GrammarTable;
