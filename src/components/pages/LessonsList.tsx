import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const LessonsList = () => {
  const lang = "italian";
  const [lessonArray, setLessonArray] = useState([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`http://localhost:8000/lessons/${lang}`);
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
  }, []);

  return (
    <div>
      {lessonArray.map((lesson: any, index) => (
        <Link to={`/lessons/${lesson._id}`} state={{ lesson }} key={lesson._id}>
          Lesson {lesson.lessonNumber} - {lesson.title}
        </Link>
      ))}
    </div>
  );
};

export default LessonsList;
