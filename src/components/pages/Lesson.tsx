import { useMemo, useState, useEffect } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { MonitorPlay, PanelTop } from "lucide-react";

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

  const addToDeck = async (card: FlashCardProps) => {
    try {
      card = {
        ...card,
        interval: 0,
        repetition: 0,
        efactor: 2.5,
        dueDate: dayjs(Date.now()).format("YYYY-MM-DD"),
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

  const totalFib = lesson?.fib?.length ?? 0;
  const totalMcq = lesson?.mcq?.length ?? 0;

  const allExercisesCompleted = useMemo(() => {
    if (!lesson) return false;
    return correctFib >= totalFib && correctMcq >= totalMcq;
  }, [correctFib, correctMcq, lesson, totalFib, totalMcq]);

  const exerciseProgress = useMemo(() => {
    const total = totalFib + totalMcq;
    const completed =
      Math.min(correctFib, totalFib) + Math.min(correctMcq, totalMcq);
    return {
      completed,
      total,
      percent: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [correctFib, correctMcq, totalFib, totalMcq]);

  useEffect(() => {
    const completeLesson = async () => {
      if (!lesson) return;

      // Determining the language of the lesson
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
      if (!lang) return;
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
    if (allExercisesCompleted) {
      completeLesson();
    }
  }, [
    allExercisesCompleted,
    lesson,
    setUser,
    user.lessonsCompleted.french,
    user.lessonsCompleted.italian,
  ]);

  if (loading)
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        Loading lesson…
      </div>
    );
  if (!lesson)
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        Lesson not found
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 -mx-4 border-b bg-background/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                navigate(-1);
              }}
            >
              Back
            </Button>
            <div>
              <h1 className="text-lg font-bold leading-tight sm:text-xl">
                {lesson.author
                  ? `${lesson.title}`
                  : `Lesson ${lesson.lessonNumber} · ${lesson.title}`}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {lesson.level && (
                  <Badge variant="outline">{lesson.level}</Badge>
                )}
                {lesson.language && (
                  <Badge variant="secondary">{lesson.language}</Badge>
                )}
                {lesson.author && <Badge>Custom</Badge>}
              </div>
            </div>
          </div>

          {exerciseProgress.total > 0 && (
            <div className="w-full max-w-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Exercise progress</span>
                <span>
                  {exerciseProgress.completed}/{exerciseProgress.total}
                </span>
              </div>
              <Progress value={exerciseProgress.percent} className="h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Objectives */}
      {(lesson.objectives ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Objectives</CardTitle>
            <CardDescription>
              What you’ll be able to do after this lesson.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {(lesson.objectives ?? []).map(
                (objective: string, index: number) => (
                  <li key={index}>{objective}</li>
                ),
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Introduction / dialogues */}
      {(lesson.introduction?.dialogues ?? []).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Introduction</h2>
          </div>

          <div className="space-y-4">
            {(lesson.introduction?.dialogues ?? []).map((d: any, i: number) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{d.title}</CardTitle>
                  {d.scene && <CardDescription>{d.scene}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-4">
                  {d.media && (
                    <img
                      src={d.media}
                      className="h-auto w-full max-h-[28rem] rounded-xl object-cover"
                    />
                  )}

                  <div className="space-y-3">
                    {(d.lines ?? []).map((l: any, j: number) => (
                      <div
                        key={j}
                        className="rounded-lg border bg-muted/30 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-semibold">
                                {l.speaker}:
                              </span>{" "}
                              <span className="leading-relaxed">{l.text}</span>
                            </p>
                            {l.english && (
                              <p className="text-xs text-muted-foreground">
                                {l.english}
                              </p>
                            )}
                          </div>
                          <div className="shrink-0">
                            <SpeechButton
                              text={l.text}
                              lang={lesson.voice_language ?? languagePath}
                              voiceName={l.audio}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Vocabulary */}
      {(lesson.vocabulary ?? []).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Vocabulary</h2>
          {(lesson.vocabulary ?? []).map((l: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{l.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <FlashcardList
                  cardList={l.items}
                  lang={lesson.language ?? languagePath}
                  addToDeck={addToDeck}
                  removeFromDeck={removeFromDeck}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Grammar */}
      {(lesson.grammar ?? []).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Grammar</h2>
          {(lesson.grammar ?? []).map((g: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{g.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <GrammarTable
                  grammarPoint={g.content}
                  lang={lesson.voice_language ?? languagePath}
                />
                {(g.notes ?? []).length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Notes</h3>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {(g.notes ?? []).map((n: string, idx: number) => (
                        <li key={idx}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Exercises */}
      {(lesson.fib?.length ?? 0) > 0 || (lesson.mcq?.length ?? 0) > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Exercises</CardTitle>
            <CardDescription>Test your knowledge as you go.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* FIB */}
            {correctFib < totalFib && totalFib > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Fill in the blanks</h3>
                  <span className="text-xs text-muted-foreground">
                    {Math.min(correctFib + 1, totalFib)}/{totalFib}
                  </span>
                </div>

                {(lesson.fib ?? []).map((q: any, index: number) => (
                  <div
                    key={index}
                    className={index === correctFib ? "block" : "hidden"}
                  >
                    <div className="mb-3 text-xs text-muted-foreground">
                      Question {index + 1}
                    </div>
                    <FillInTheBlanks
                      question={q}
                      setCorrectFib={setCorrectFib}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Transition */}
            {totalFib > 0 &&
              correctFib === totalFib &&
              correctMcq === 0 &&
              totalMcq > 0 && (
                <div className="rounded-xl border bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-800">
                    Nice work — fill-in-the-blanks completed.
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    Next up: multiple choice questions.
                  </p>
                </div>
              )}

            {/* MCQ */}
            {correctFib >= totalFib &&
              correctMcq < totalMcq &&
              totalMcq > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Multiple choice</h3>
                    <span className="text-xs text-muted-foreground">
                      {Math.min(correctMcq + 1, totalMcq)}/{totalMcq}
                    </span>
                  </div>

                  {(lesson.mcq ?? []).map((q: any, index: number) => (
                    <div
                      key={index}
                      className={index === correctMcq ? "block" : "hidden"}
                    >
                      <div className="mb-3 text-xs text-muted-foreground">
                        Question {index + 1}
                      </div>
                      <Mcq question={q} setCorrectMcq={setCorrectMcq} />
                    </div>
                  ))}
                </div>
              )}

            {allExercisesCompleted && exerciseProgress.total > 0 && (
              <div className="rounded-xl border bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-800">
                  Exercises complete.
                </p>
                <p className="mt-1 text-sm text-blue-700">
                  Continue to the cultural note and summary.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* Cultural note / resources / wrap-up */}
      {allExercisesCompleted && lesson.cultural_note && (
        <Card>
          <CardHeader>
            <CardTitle>Cultural note</CardTitle>
            <CardDescription>{lesson.cultural_note.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {(lesson.cultural_note?.content ?? []).map(
                (note: string, index: number) => (
                  <li key={index}>{note}</li>
                ),
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      {allExercisesCompleted &&
        (lesson.additional_resources ?? []).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Additional resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {(lesson.additional_resources ?? []).map(
                  (r: any, index: number) => (
                    <li key={index} className="rounded-lg border p-3">
                      <a
                        href={r.url}
                        target="_blank"
                        className="font-medium underline underline-offset-4 flex flex-row"
                      >
                        <span className="mr-2 text-muted-foreground">
                          {r.type.toLowerCase() == "video" ? (
                            <MonitorPlay />
                          ) : (
                            <PanelTop />
                          )}
                        </span>
                        {r.title}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </CardContent>
          </Card>
        )}

      {allExercisesCompleted && lesson.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Wrapping up</CardTitle>
            <CardDescription>Quick recap of what you covered.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(lesson.summary?.grammarPoints ?? []).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Grammar points</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {(lesson.summary?.grammarPoints ?? []).map(
                    (point: string, index: number) => (
                      <li key={index}>{point}</li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {(lesson.summary?.skills ?? []).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Skills</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {(lesson.summary?.skills ?? []).map(
                    (skill: string, index: number) => (
                      <li key={index}>{skill}</li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Lesson;
