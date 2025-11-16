import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../ui/button";

const PathToggle = () => {
  const { languagePath, setLanguagePath } = useLanguage();
  return (
    <div>
      <h1>Select a language</h1>
    </div>
  );
};

export default PathToggle;
