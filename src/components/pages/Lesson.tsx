import React, { useEffect, useState } from "react";
import lesson from "./lessons";
import SpeechButton from "../ui/SpeechButton";

const Lesson = () => {
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
              <SpeechButton
                text={d.text} // 👈 qui scegli la voce
                lang="it-IT"
                voiceName={d.audio}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Lesson;
