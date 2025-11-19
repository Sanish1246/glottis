import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";

const LessonsList = () => {
  const { languagePath } = useLanguage();
  const [lessonArray, setLessonArray] = useState([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/lessons/${languagePath}`
        );
        const data = await response.json();
        setLessonArray(data);
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
    <div>
      {lessonArray.map((lesson: any) => {
        const showLevelHeader = lesson.lessonNumber == 1;

        return (
          <div key={lesson._id}>
            {showLevelHeader && <h2>{lesson.level}</h2>}
            <Link to={`/lessons/${lesson._id}`} state={{ lesson }}>
              Lesson {lesson.lessonNumber} - {lesson.title}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default LessonsList;
