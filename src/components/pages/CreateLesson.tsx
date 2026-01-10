import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import BasicInfoForm from "../ui/BasicInfoForm";
import IntroductionForm from "../ui/IntroductionForm";

const steps = [
  "Basic Info", // language, level, title, objectives
  "Introduction", // dialogues
  "Vocabulary", // vocabulary categories
  "Grammar", // grammar sections
  "Exercises", // fill-in-blank & MCQ
  "Cultural Notes", // optional
  "Resources & Summary", // additional resources, summary
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

  return (
    <div className=" mx-auto p-6">
      <Progress value={(currentStep + 1) * (100 / steps.length)} />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{steps[currentStep]}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <BasicInfoForm setCurrentStep={setCurrentStep} />
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
          {/* {currentStep === 1 && <VocabularyForm />} */}
          {/* ... other steps */}
          {currentStep}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateLesson;
