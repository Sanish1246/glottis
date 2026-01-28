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
          <TableHead className="min-w-[12rem]">Phrase</TableHead>
          <TableHead className="min-w-[12rem]">Meaning</TableHead>
          <TableHead className="min-w-[14rem]">Example</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {grammarPoint.map((g, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium whitespace-normal">
              <div className="flex items-start justify-between gap-2">
                <span>{g.point}</span>
                {g.audio && (
                  <span className="shrink-0">
                    <SpeechButton text={g.point} lang={lang} voiceName={g.audio} />
                  </span>
                )}
              </div>
            </TableCell>

            <TableCell className="whitespace-normal">{g.english}</TableCell>
            <TableCell className="whitespace-normal">{g.example}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GrammarTable;
