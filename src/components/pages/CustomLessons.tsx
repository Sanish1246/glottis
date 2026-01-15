import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Combobox from "../ui/Combobox";
import { Badge } from "../ui/badge";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Options = {
  value: string;
  label: string;
};

const levels: Options[] = [
  {
    value: "Beginner",
    label: "Beginner",
  },
  {
    value: "Lower intermediate",
    label: "Lower intermediate",
  },
  {
    value: "Intermediate",
    label: "Intermediate",
  },
  {
    value: "Upper intermediate",
    label: "Upper Intermediate",
  },
  {
    value: "Advanced",
    label: "Advanced",
  },
];

const CustomLessons = () => {
  const [level, setLevel] = useState("Beginner");
  const [lessonArray, setLessonArray] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useGSAP(() => {
    gsap.fromTo(
      ".lesson",
      { x: -50000 },
      { x: 0, stagger: 0.09, ease: "power1.inOut" }
    );
  }, [loaded]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/lessons/customLessons/${level}`
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
  }, [level]);
  return (
    <div>
      <div className="flex flex-row items-center gap-1">
        <p>Level:</p>
        <Combobox
          choices={levels}
          filter={level}
          setFilter={setLevel}
        ></Combobox>
      </div>
      <h2 className="font-semibold text-center mt-2">
        {lessonArray.length > 0 ? "List of lessons" : "No lessons found!"}
      </h2>

      {lessonArray.map((lesson: any) => {
        return (
          <div key={lesson._id}>
            <Link
              to={`/lessons/${lesson._id}`}
              state={{ lesson }}
              className="hover:translate-1"
            >
              <div
                key={lesson._id}
                className="items-center border-2 rounded-lg p-3 mb-4 mt-2 shadow-sm hover:cursor-pointer deck hover:translate-1 flex flex-row justify-between"
              >
                <p>
                  <b>{lesson.title}</b>
                </p>

                <Badge>{lesson.language}</Badge>
                <Badge>{lesson.level}</Badge>

                <span className="text-sm">
                  Created by <b>{lesson.author}</b>
                </span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default CustomLessons;
