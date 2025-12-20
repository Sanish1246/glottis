import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import Combobox from "../ui/Combobox";

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
      <div className="flex flex-row items-center gap-1">
        <p>Language path:</p>
        <Combobox
          choices={languagePaths}
          filter={languagePath}
          setFilter={setLanguagePath}
        ></Combobox>
      </div>
      {lessonArray.map((lesson: any) => {
        const showLevelHeader = lesson.lessonNumber_level == 1;

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
