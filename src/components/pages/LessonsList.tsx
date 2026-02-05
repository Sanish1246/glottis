import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import Combobox from "../ui/Combobox";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useUser } from "../context/UserContext";
import { CircleCheck } from "lucide-react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

type Options = {
  value: string;
  label: string;
};

const languagePaths: Options[] = [
  {
    value: "italian",
    label: "Italian",
  },
  {
    value: "french",
    label: "French",
  },
];

const LessonsList = () => {
  const { languagePath, setLanguagePath } = useLanguage();
  const [lessonArray, setLessonArray] = useState([]);
  const { user } = useUser();
  const [loaded, setLoaded] = useState(false);

  const { completedCount, totalCount, progress } = useMemo(() => {
    const filtered = lessonArray.filter((lesson: any) => !lesson.author);
    const total = filtered.length;

    const completed = filtered.filter((lesson: any) => {
      if (lesson.language === "french") {
        return user.lessonsCompleted.french >= lesson.lessonNumber;
      }
      if (lesson.language === "italian") {
        return user.lessonsCompleted.italian >= lesson.lessonNumber;
      }
      return false;
    }).length;

    return {
      completedCount: completed,
      totalCount: total,
      progress: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [
    lessonArray,
    user.lessonsCompleted.french,
    user.lessonsCompleted.italian,
  ]);

  useGSAP(() => {
    gsap.fromTo(
      ".lesson",
      { x: -50000 },
      { x: 0, stagger: 0.09, ease: "power1.inOut" },
    );
  }, [loaded]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/lessons/${languagePath}`,
        );
        const data = await response.json();
        setLessonArray(data);
        setLoaded(true);
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
    fetchLessons();
  }, [languagePath]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lessons</h1>
          <p className="text-sm text-muted-foreground">
            Work through the lessons in order. Completed lessons are highlighted
            in <span className="font-semibold text-green-700">green</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Language path</span>
          <Combobox
            choices={languagePaths}
            filter={languagePath}
            setFilter={setLanguagePath}
          />
        </div>
      </div>

      <div className="space-y-2 rounded-lg border bg-muted/40 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Overall progress</span>
          <span className="text-muted-foreground">
            {completedCount}/{totalCount || "?"} lessons completed
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {!loaded && (
        <div className="text-sm text-muted-foreground">Loading lessons…</div>
      )}

      {loaded && lessonArray.length === 0 && (
        <div className="rounded-lg border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
          No lessons available yet for this language.
        </div>
      )}

      <div className="space-y-4">
        {lessonArray.map((lesson: any) => {
          const showLevelHeader = lesson.lessonNumber_level == 1;
          const completed =
            (lesson.language == "french" &&
              !lesson.author &&
              user.lessonsCompleted.french >= lesson.lessonNumber) ||
            (lesson.language == "italian" &&
              !lesson.author &&
              user.lessonsCompleted.italian >= lesson.lessonNumber);

          const notCompleted =
            (lesson.language == "french" &&
              !lesson.author &&
              user.lessonsCompleted.french + 1 < lesson.lessonNumber) ||
            (lesson.language == "italian" &&
              !lesson.author &&
              user.lessonsCompleted.italian + 1 < lesson.lessonNumber);
          return (
            <div key={lesson._id} className="space-y-1">
              {showLevelHeader && (
                <h2 className="mt-4 text-lg font-semibold tracking-tight">
                  {lesson.level}
                </h2>
              )}
              <Link
                to={`/lessons/${lesson._id}`}
                state={{ lesson }}
                className={`block ${
                  notCompleted ? "pointer-events-none" : "hover:no-underline"
                }`}
              >
                <div
                  className={`lesson group relative flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    completed
                      ? "border-green-500 bg-green-50 dark:border-green-50 dark:bg-green-600"
                      : "border-border bg-background"
                  } ${notCompleted ? "opacity-60" : ""}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold dark:font-bold">
                        Lesson {lesson.lessonNumber}
                      </p>
                      {lesson.topic && (
                        <Badge variant="outline" className="text-xs">
                          {lesson.topic}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-white">
                      {lesson.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {notCompleted && (
                      <Badge variant="secondary" className="text-xs">
                        Locked
                      </Badge>
                    )}
                    {completed && (
                      <span className="flex items-center gap-1 text-sm font-medium text-green-700 dark:text-white">
                        <CircleCheck className="h-5 w-5" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LessonsList;
