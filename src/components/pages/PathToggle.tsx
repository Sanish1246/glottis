import { useLanguage } from "../context/LanguageContext";
import { Button } from "../ui/button";
import { toast } from "sonner";

const PathToggle = () => {
  const { setLanguagePath } = useLanguage();
  return (
    <div>
      <h1>Select a language</h1>
      <Button
        onClick={() => {
          setLanguagePath("italian");
          toast.success("Language path switched to italian!", {
            action: {
              label: "Close",
              onClick: () => {
                toast.dismiss();
              },
            },
          });
        }}
      >
        Italian
      </Button>
      <Button
        onClick={() => {
          setLanguagePath("french");
          toast.success("Language path switched to french!", {
            action: {
              label: "Close",
              onClick: () => {
                toast.dismiss();
              },
            },
          });
        }}
      >
        French
      </Button>
    </div>
  );
};

export default PathToggle;
