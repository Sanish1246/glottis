import React, { createContext, useContext, useState } from "react";

interface LanguageContextType {
  languagePath: string;
  setLanguagePath: React.Dispatch<React.SetStateAction<string>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: any }) => {
  const [languagePath, setLanguagePath] = useState("italian");

  return (
    <LanguageContext.Provider value={{ languagePath, setLanguagePath }}>
      {children}
    </LanguageContext.Provider>
  );
};
