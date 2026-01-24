import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import SpeechButton from "../ui/SpeechButton";
import FlashcardList from "../ui/FlashcardList";
import GrammarTable from "../ui/GrammarTable";
import FillInTheBlanks from "../ui/FillInTheBlanks";
import Mcq from "../ui/Mcq";
import { useUser } from "@/components/context/UserContext";
import { useLanguage } from "../context/LanguageContext";

type LessonData = any;

interface FlashCardProps {
  word: string;
  english: string;
  audio?: string;
  interval?: number;
  repetition?: number;
  efactor?: number;
  dueDate?: string;
}

const Lesson = () => {
  const { languagePath } = useLanguage();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [correctFib, setCorrectFib] = useState(0);
  const [correctMcq, setCorrectMcq] = useState(0);
  const [loading, setLoading] = useState(true);

  const { lessonId } = useParams<{ lessonId: string }>();
  const location = useLocation();
  const initialLesson =
    (location.state as { lesson?: LessonData } | null)?.lesson || null;

  const [lesson, setLesson] = useState<LessonData | null>(initialLesson);

  console.log(user);

  const addToDeck = async (card: FlashCardProps) => {
    try {
      card = {
        ...card,
        interval: 0,
        repetition: 0,
        efactor: 2.5,
        dueDate: dayjs(Date.now()).format("DD-MM-YYYY"),
      };
      const res = await fetch(
        `http://localhost:8000/add_card/${languagePath}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(card),
        },
      );
      const data = await res.json();
      setUser(data.user);
      toast.success(data.message, {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
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

  const removeFromDeck = async (card: FlashCardProps) => {
    try {
      const res = await fetch(
        `http://localhost:8000/remove_card/${languagePath}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(card),
        },
      );
      const data = await res.json();
      console.log(data);
      setUser(data.user);
      toast.success(data.message, {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
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

  useEffect(() => {
    if (initialLesson) {
      setLoading(false);
      return;
    }
    if (!lessonId) return;
    const fetchLesson = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/lessons/content/${lessonId}`,
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
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId, initialLesson]);

  const totalFib = lesson.fib?.length ?? 0;
  const totalMcq = lesson.mcq?.length ?? 0;

  const allExercisesCompleted =
    correctFib >= totalFib && correctMcq >= totalMcq;

  useEffect(() => {
    const completeLesson = async () => {
      let lang;
      if (lesson.author) {
        lang = "custom";
      } else if (
        lesson.language == "italian" &&
        user.lessonsCompleted.italian < lesson.lessonNumber
      ) {
        lang = "italian";
      } else if (
        lesson.language == "french" &&
        user.lessonsCompleted.french < lesson.lessonNumber
      ) {
        lang = "french";
      }
      try {
        const res = await fetch(
          `http://localhost:8000/complete_lesson/${lang}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        const data = await res.json();
        setUser(data.newUser);
        console.log("lesson Complete");
        toast.success(data.message, {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
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

      // if (lesson.author) {
      //   setUser((prev) => ({
      //     ...prev,
      //     lessonsCompleted: {
      //       ...prev.lessonsCompleted,
      //       custom: prev.lessonsCompleted.custom + 1,
      //     },
      //   }));
      // } else if (lesson.language == "italian") {
      //   setUser((prev) => ({
      //     ...prev,
      //     lessonsCompleted: {
      //       ...prev.lessonsCompleted,
      //       italian: prev.lessonsCompleted.italian + 1,
      //     },
      //   }));
      // } else {
      //   setUser((prev) => ({
      //     ...prev,
      //     lessonsCompleted: {
      //       ...prev.lessonsCompleted,
      //       french: prev.lessonsCompleted.french + 1,
      //     },
      //   }));
      // }
    };
    if (allExercisesCompleted) {
      completeLesson();
    }
  }, [allExercisesCompleted]);

  if (loading) return <div>Loading lesson...</div>;
  if (!lesson) return <div>Lesson not found</div>;

  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </Button>
        <h1 className="font-black text-xl">
          {lesson.author
            ? `${lesson.title}`
            : ` Lesson ${lesson.lessonNumber} - ${lesson.title}`}
        </h1>
      </div>

      <h2 className="font-semibold">Objectives</h2>
      <ul className="list-disc">
        {(lesson.objectives ?? []).map((objective: string, index: number) => (
          <li key={index}>{objective}</li>
        ))}
      </ul>

      <div className="mt-5">
        {(lesson.introduction?.dialogues ?? []).map((d: any, i: number) => (
          <div key={i} className="mt-7">
            <h3 className="font-bold">{d.title}</h3>
            <h4 className="font-semibold">{d.scene}</h4>
            {d.media && (
              <img
                src={d.media}
                className="w-[80rem] max-h-[30rem] object-cover rounded-xl"
              />
            )}
            <ul className="mt-5 list-disc">
              {(d.lines ?? []).map((l: any, j: number) => (
                <li key={j}>
                  <span className="font-semibold">{l.speaker}:</span> {l.text}
                  <SpeechButton
                    text={l.text}
                    lang={lesson.voice_languagePath}
                    voiceName={l.audio}
                  />
                  {l.english && <p>({l.english})</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10">
        {lesson.vocabulary.length > 0 ? (
          <h2 className="font-bold">Vocabulary</h2>
        ) : null}

        {(lesson.vocabulary ?? []).map((l: any, index: number) => (
          <div key={index} className="mx-auto mt-10">
            <h3 className="font-semibold">{l.category}</h3>
            <FlashcardList
              cardList={l.items}
              lang={lesson.languagePath}
              addToDeck={addToDeck}
              removeFromDeck={removeFromDeck}
            />
          </div>
        ))}
      </div>

      <div>
        {lesson.grammar.length > 0 ? (
          <h2 className="font-bold">Grammar</h2>
        ) : null}
        {(lesson.grammar ?? []).map((g: any, index: number) => (
          <div key={index} className="mx-auto mb-10">
            <h3 className="font-semibold mt-5">{g.title}</h3>
            <GrammarTable
              grammarPoint={g.content}
              lang={lesson.voice_languagePath}
            />
            <h3 className="font-medium mt-5">Notes</h3>
            <ul className="list-disc">
              {(g.notes ?? []).map((n: string, idx: number) => (
                <li key={idx}>{n}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/*  Exercises  */}
      <div>
        {lesson.fib.length > 0 || lesson.mcq.length > 0 ? (
          <h2 className="font-bold">Exercises - Test your knowledge</h2>
        ) : null}

        {correctFib < totalFib && (
          <>
            {lesson.fib.length > 0 ? (
              <h3 className="font-semibold">Fill in the blanks</h3>
            ) : null}

            {(lesson.fib ?? []).map((q: any, index: number) => (
              <div
                key={index}
                className={`mx-auto ${
                  index === correctFib ? "block" : "hidden"
                }`}
              >
                <h3 className="font-medium">Question {index + 1}</h3>
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
            {lesson.mcq.length > 0 ? (
              <h3 className="mt-5 font-semibold">Multiple Choice Questions</h3>
            ) : null}

            {(lesson.mcq ?? []).map((q: any, index: number) => (
              <div
                key={index}
                className={`mx-auto ${
                  index === correctMcq ? "block" : "hidden"
                }`}
              >
                <h3 className="font-medium">Question {index + 1}</h3>
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

      {allExercisesCompleted && lesson.cultural_note && (
        <div className="mt-8">
          <h2 className="font-bold">Cultural note</h2>
          <h3 className="font-semibold">{lesson.cultural_note.title}</h3>
          <ul className="list-disc">
            {(lesson.cultural_note?.content ?? []).map(
              (note: string, index: number) => (
                <li key={index}>{note}</li>
              ),
            )}
          </ul>
        </div>
      )}

      {allExercisesCompleted && (
        <div className="mt-8">
          <h2 className="font-bold">Additional Resources</h2>
          <ul className="list-disc">
            {(lesson.additional_resources ?? []).map(
              (r: any, index: number) => (
                <li key={index}>
                  <a href={r.url} target="_blank" className="underline">
                    <span className="font-semibold"> [{r.type}] </span>
                    {r.title}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      {allExercisesCompleted && (
        <div className="mt-8">
          <h2 className="font-bold">Wrapping up</h2>
          <h3 className="font-semibold">
            Grammar points learned in this lesson:
          </h3>
          <ul className="list-disc">
            {(lesson.summary?.grammarPoints ?? []).map(
              (point: string, index: number) => (
                <li key={index}>{point}</li>
              ),
            )}
          </ul>

          <h3 className="font-semibold">Skills learned in this lesson:</h3>
          <ul className="list-disc">
            {(lesson.summary?.skills ?? []).map(
              (skill: string, index: number) => (
                <li key={index}>{skill}</li>
              ),
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Lesson;
