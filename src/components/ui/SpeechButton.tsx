import React, { useEffect, useState } from "react";

interface SpeechButtonProps {
  text: string;
  lang?: string;
  voiceName?: string;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({
  text,
  lang,
  voiceName,
}) => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log(voices);

      // Cerca prima un match esatto con la prop voiceName
      let selected: SpeechSynthesisVoice | undefined;
      if (voiceName) {
        selected = voices.find((v) => v.name === voiceName);
      }

      // Se non trovato, fallback su prima voce con lingua corrispondente
      if (!selected) {
        selected = voices.find((v) => v.lang === lang);
      }

      setVoice(selected || null);

      if (selected) {
        console.log("Selected voice:", selected.name);
      } else {
        console.warn("No suitable voice found, fallback failed");
      }
    };

    // Carica subito le voci
    loadVoices();

    // Ricarica quando le voci cambiano
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [lang, voiceName]);

  const handleSpeak = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!text) return;

    speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    if (voice) utter.voice = voice;
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;

    speechSynthesis.speak(utter);
  };

  return (
    <button
      onClick={handleSpeak}
      className="mx-2 p-2 text-gray-600 hover:text-gray-800 rounded transition-colors hover:cursor-pointer"
      title="Listen"
    >
      🔊
    </button>
  );
};

export default SpeechButton;
