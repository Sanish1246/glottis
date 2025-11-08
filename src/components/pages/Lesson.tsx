import React, { useEffect, useState } from "react";
import lesson from "./lessons";
import SpeechButton from "../ui/SpeechButton";
import FlashcardList from "../ui/FlashcardList";
import GrammarTable from "../ui/GrammarTable";
import FillInTheBlanks from "../ui/FillInTheBlanks";

interface FlashCardProps {
  front: string;
  back: string;
  lang: string;
}

const addToDeck = (card: FlashCardProps) => {
  console.log(card, " Added");
};

const Lesson = () => {
  const [correctFib, setCorrectFib] = useState(0);
  return (
    <div>
      <h1>
        Lesson {lesson.lessonNumber} - {lesson.title}
      </h1>
      <ul className="list-disc">
        {lesson.objectives.map((objective, index) => (
          <li key={index}>{objective}</li>
        ))}
      </ul>

      <div className="mt-5">
        <h2>{lesson.introduction.scene}</h2>
        <ul className="mt-5 list-disc">
          {lesson.introduction.dialogue.map((d, index) => (
            <li key={index}>
              <span className="font-semibold">{d.speaker}:</span> {d.text}
              <SpeechButton text={d.text} lang="it-IT" voiceName={d.audio} />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Vocabulary</h2>

        {lesson.vocabulary.map((l, index) => (
          <div key={index} className="mx-auto">
            <h3>{l.category}</h3>
            <FlashcardList
              cardList={l.items}
              addToDeck={addToDeck}
            ></FlashcardList>
          </div>
        ))}
      </div>

      <div>
        <h2>Grammar</h2>
        {lesson.grammar.map((g, index) => (
          <div key={index} className="mx-auto">
            <h3>{g.title}</h3>
            <GrammarTable grammarPoint={g.content}></GrammarTable>
            <h3>Notes</h3>
            <ul>
              {g.notes.map((n, index) => (
                <li key={index}>{n}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div>
        <h2>Exercises - Test your knowledge</h2>
        <h3>Fill in the blanks</h3>
        {lesson.exercises[0].questions.map((q, index) => (
          <div
            key={index}
            className={`mx-auto ${index == correctFib ? "block" : "hidden"}`}
          >
            <h3>Question {index + 1}</h3>
            <FillInTheBlanks
              question={q}
              correctFib={correctFib}
              setCorrectFib={setCorrectFib}
            ></FillInTheBlanks>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lesson;
