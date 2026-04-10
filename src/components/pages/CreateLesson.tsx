import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import BasicInfoForm from "../ui/BasicInfoForm";
import IntroductionForm from "../ui/IntroductionForm";
import VocabForm from "../ui/VocabForm";
import GrammarForm from "../ui/GrammarForm";
import CreateFIB from "../ui/CreateFIB";
import CreateMcq from "../ui/CreateMcq";
import CreateCulturalNote from "../ui/CreateCulturalNote";
import CreateAdditionalResource from "../ui/CreateAdditionalResource";
import CreateSummaryGrammar from "../ui/CreateSummaryGrammar";
import CreateSummarySkills from "../ui/CreateSummarySkills";
import { useNavigate } from "react-router-dom";

const steps = [
  "Basic Info", // language, level, title, objectives
  "Introduction", // dialogues
  "Vocabulary", // vocabulary categories
  "Grammar", // grammar sections
  "Excercises - Fill in the blanks", // fill-in-blank & MCQ
  "Excercises - MCQs",
  "Cultural Notes",
  "Additional resoruces",
  "Summary - Grammar points", // additional resources, summary
  "Summary - Skills learned",
];

const CreateLesson = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
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
    // merge into previous state to avoid overwriting fields set by other updates
    setLessonData((prev) => ({ ...prev, ...updatedLessonData }));
  };

  return (
    <>
      <div className="w-full min-w-0 max-w-5xl mx-auto px-3 py-4 sm:px-4 lg:p-6">
        <Button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </Button>
        <Progress
          className="mt-4 lg:mt-6"
          value={(currentStep + 1) * (100 / steps.length)}
        />

        <Card className="mt-4 lg:mt-6 min-w-0 overflow-hidden">
          <CardHeader className="min-w-0 space-y-1">
            <CardTitle className="break-words">{steps[currentStep]}</CardTitle>
          </CardHeader>
          <CardContent className="min-w-0">
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
                    setLessonData({ ...lessonData, fib: updatedFIB })
                  }
                  setCurrentStep={setCurrentStep}
                />
              </>
            )}
            {currentStep === 5 && (
              <>
                <CreateMcq
                  data={lessonData.mcq}
                  onChange={(updatedMcq) =>
                    setLessonData({ ...lessonData, mcq: updatedMcq })
                  }
                  setCurrentStep={setCurrentStep}
                />
              </>
            )}
            {currentStep === 6 && (
              <>
                <CreateCulturalNote
                  data={lessonData.cultural_note}
                  onChange={(updatedNote) =>
                    setLessonData({ ...lessonData, cultural_note: updatedNote })
                  }
                  setCurrentStep={setCurrentStep}
                />
              </>
            )}
            {currentStep === 7 && (
              <>
                <CreateAdditionalResource
                  data={lessonData.additional_resources}
                  onChange={(updatedResource) =>
                    setLessonData({
                      ...lessonData,
                      additional_resources: updatedResource,
                    })
                  }
                  setCurrentStep={setCurrentStep}
                />
              </>
            )}
            {currentStep === 8 && (
              <>
                <CreateSummaryGrammar
                  data={lessonData.summary}
                  onChange={(updatedSummary) =>
                    setLessonData({
                      ...lessonData,
                      summary: updatedSummary,
                    })
                  }
                  setCurrentStep={setCurrentStep}
                />
              </>
            )}
            {currentStep === 9 && (
              <>
                <CreateSummarySkills
                  fullLesson={lessonData}
                  data={lessonData.summary}
                  onChange={(updatedSummary) =>
                    setLessonData({
                      ...lessonData,
                      summary: updatedSummary,
                    })
                  }
                  setCurrentStep={setCurrentStep}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateLesson;
