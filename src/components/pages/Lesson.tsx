import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import SpeechButton from "../ui/SpeechButton";
import FlashcardList from "../ui/FlashcardList";
import GrammarTable from "../ui/GrammarTable";
import FillInTheBlanks from "../ui/FillInTheBlanks";
import Mcq from "../ui/Mcq";

type LessonData = any;

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
  const [correctMcq, setCorrectMcq] = useState(0);

  const { lessonId } = useParams<{ lessonId: string }>();
  const location = useLocation();
  const initialLesson =
    (location.state as { lesson?: LessonData } | null)?.lesson || null;

  const [lesson, setLesson] = useState<LessonData | null>(initialLesson);

  useEffect(() => {
    if (lesson || !lessonId) return;
    const fetchLesson = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/lessons/content/${lessonId}`
        );
        const data = await res.json();
        setLesson(data);
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
    fetchLesson();
  }, [lessonId, lesson]);

  const totalFib = lesson.fib.length;
  const totalMcq = lesson.mcq.length;

  const allExercisesCompleted =
    correctFib >= totalFib && correctMcq >= totalMcq;

  return (
    <div>
      <h1>
        Lesson {lesson.lessonNumber} - {lesson.title}
      </h1>

      <ul className="list-disc">
        {lesson.objectives.map((objective: string, index: number) => (
          <li key={index}>{objective}</li>
        ))}
      </ul>

      <div className="mt-5">
        <h2>{lesson.introduction.scene}</h2>
        <ul className="mt-5 list-disc">
          {lesson.introduction.dialogue.map((d, index: number) => (
            <li key={index}>
              <span className="font-semibold">{d.speaker}:</span> {d.text}
              <SpeechButton text={d.text} lang="it-IT" voiceName={d.audio} />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Vocabulary</h2>
        {lesson.vocabulary.map((l, index: number) => (
          <div key={index} className="mx-auto">
            <h3>{l.category}</h3>
            <FlashcardList cardList={l.items} addToDeck={addToDeck} />
          </div>
        ))}
      </div>

      <div>
        <h2>Grammar</h2>
        {lesson.grammar.map((g, index: number) => (
          <div key={index} className="mx-auto">
            <h3>{g.title}</h3>
            <GrammarTable grammarPoint={g.content} />
            <h3>Notes</h3>
            <ul>
              {g.notes.map((n, idx) => (
                <li key={idx}>{n}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/*  Exercises  */}
      <div>
        <h2>Exercises - Test your knowledge</h2>
        {correctFib < totalFib && (
          <>
            <h3>Fill in the blanks</h3>
            {lesson.fib.map((q, index: number) => (
              <div
                key={index}
                className={`mx-auto ${
                  index === correctFib ? "block" : "hidden"
                }`}
              >
                <h3>Question {index + 1}</h3>
                <FillInTheBlanks question={q} setCorrectFib={setCorrectFib} />
              </div>
            ))}
          </>
        )}

        {/*  Transition message before MCQs  */}
        {correctFib === totalFib && correctMcq === 0 && (
          <div className="mt-5 text-center p-4 bg-green-100 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-green-800">
              🎉 Congratulations!
            </h3>
            <p className="text-green-700">
              You've completed all the Fill in the Blanks questions. <br />
              Let's move on to the Multiple Choice questions!
            </p>
          </div>
        )}

        {/*  Multiple Choice Questions */}
        {correctFib >= totalFib && correctMcq < totalMcq && (
          <>
            <h3 className="mt-5">Multiple Choice Questions</h3>
            {lesson.mcq.map((q, index: number) => (
              <div
                key={index}
                className={`mx-auto ${
                  index === correctMcq ? "block" : "hidden"
                }`}
              >
                <h3>Question {index + 1}</h3>
                <Mcq question={q} setCorrectMcq={setCorrectMcq} />
              </div>
            ))}
          </>
        )}

        {allExercisesCompleted && (
          <div className="mt-5 text-center p-5 bg-blue-100 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-blue-800">
              🎉 Excellent work!
            </h3>
            <p className="text-blue-700 mt-2">
              You've successfully completed all exercises in this lesson.
              <br />
              Let's move on to the cultural note and final summary.
            </p>
          </div>
        )}
      </div>

      {allExercisesCompleted && (
        <div className="mt-8">
          <h2>Cultural note</h2>
          <h3>{lesson.cultural_note.title}</h3>
          <ul className="list-disc">
            {lesson.cultural_note.content.map((note: string, index: number) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {allExercisesCompleted && (
        <div className="mt-8">
          <h2>Wrapping up</h2>
          <h3>Grammar points learned in this lesson:</h3>
          <ul className="list-disc">
            {lesson.summary.grammarPoints.map(
              (point: string, index: number) => (
                <li key={index}>{point}</li>
              )
            )}
          </ul>

          <h3>Skills learned in this lesson:</h3>
          <ul className="list-disc">
            {lesson.summary.skills.map((skill: string, index: number) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Lesson;
