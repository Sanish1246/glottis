import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import BasicInfoForm from "../ui/BasicInfoForm";
import IntroductionForm from "../ui/IntroductionForm";
import VocabForm from "../ui/VocabForm";
import GrammarForm from "../ui/GrammarForm";
import CreateFIB from "../ui/createFIB";

const steps = [
  "Basic Info", // language, level, title, objectives
  "Introduction", // dialogues
  "Vocabulary", // vocabulary categories
  "Grammar", // grammar sections
  "Excercises - Fill in the blanks", // fill-in-blank & MCQ
  "Excercises - MCQs",
  "Cultural Notes", // optional
  "Additional resoruces",
  "Summary", // additional resources, summary
];

const CreateLesson = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [lessonData, setLessonData] = useState({
    language: "",
    level: "",
    title: "",
    objectives: [],
    introduction: {
      dialogues: [],
    },
    vocabulary: [],
    grammar: [],
    fib: [],
    mcq: [],
    cultural_note: {
      title: "",
      content: [],
    },

    additional_resources: [],
    summary: {
      grammarPoints: [],
      skills: [],
    },
  });

  const updateIntroduction = (introductionData) => {
    setLessonData((prev) => ({
      ...prev,
      introduction: introductionData,
    }));
  };

  const updateLesson = (updatedLessonData) => {
    setLessonData(updatedLessonData);
  };

  return (
    <div className=" mx-auto p-6">
      <Progress value={(currentStep + 1) * (100 / steps.length)} />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{steps[currentStep]}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <BasicInfoForm
              data={lessonData}
              onChange={updateLesson}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep === 1 && (
            <>
              <IntroductionForm
                data={lessonData.introduction}
                onChange={updateIntroduction}
                setCurrentStep={setCurrentStep}
              />
            </>
          )}
          {currentStep === 2 && (
            <>
              <VocabForm
                data={lessonData.vocabulary}
                onChange={(updatedVocab) =>
                  setLessonData({ ...lessonData, vocabulary: updatedVocab })
                }
                setCurrentStep={setCurrentStep}
              />
            </>
          )}
          {currentStep === 3 && (
            <>
              <GrammarForm
                data={lessonData.grammar}
                onChange={(updatedGrammar) =>
                  setLessonData({ ...lessonData, grammar: updatedGrammar })
                }
                setCurrentStep={setCurrentStep}
              />
            </>
          )}
          {currentStep === 4 && (
            <>
              <CreateFIB
                data={lessonData.fib}
                onChange={(updatedFIB) =>
                  setLessonData({ ...lessonData, grammar: updatedFIB })
                }
                setCurrentStep={setCurrentStep}
              />
            </>
          )}
          {currentStep}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateLesson;
