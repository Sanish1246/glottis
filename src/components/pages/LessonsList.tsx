import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import Combobox from "../ui/Combobox";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

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
  const [loaded, setLoaded] = useState(false);
  useGSAP(() => {
    gsap.fromTo(
      ".lesson",
      { x: -50000 },
      { x: 0, stagger: 0.09, ease: "power1.inOut" }
    );
  }, [loaded, languagePath]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/lessons/${languagePath}`
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
            {showLevelHeader && (
              <h2 className="font-semibold text-lg">{lesson.level}</h2>
            )}
            <Link
              to={`/lessons/${lesson._id}`}
              state={{ lesson }}
              className="hover:translate-1"
            >
              <div className="border-2 rounded-lg p-3 mb-5 mt-1 shadow-sm hover:cursor-pointer hover:translate-1  lesson">
                <b>Lesson {lesson.lessonNumber}</b>: {lesson.title}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default LessonsList;
