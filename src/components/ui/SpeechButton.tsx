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
  // State to store the voice
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  // State to store if the browser supports speech synthesis
  const [supported, setSupported] = useState(false);

  // Effect to check if the browser supports speech synthesis
  useEffect(() => {
    // Checking if the browser supports speech synthesis
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  // Effect to load the voices
  useEffect(() => {
    // Checking if the browser supports speech synthesis
    if (!supported) return;
    const synth = window.speechSynthesis;
    // Function to load the voices
    const loadVoices = () => {
      // Getting the voices
      const voices = speechSynthesis.getVoices();

      let selected: SpeechSynthesisVoice | undefined;
      if (voiceName) {
        selected = voices.find((v) => v.name === voiceName);
      }

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
    // Loading the voices
    loadVoices();
    // Setting the onvoiceschanged event
    synth.onvoiceschanged = loadVoices;
    // Returning a cleanup function
    return () => {
      synth.onvoiceschanged = null;
    };
  }, [lang, voiceName]);

  // Function to handle the speech
  const handleSpeak = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Stopping the event propagation
    event.stopPropagation();
    // Checking if the text is supported
    if (!text || !supported) return;
    // Getting the speech synthesis
    const synth = window.speechSynthesis;
    // Cancelling the speech
    synth.cancel();
    // Creating a new speech synthesis utterance
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    if (voice) utter.voice = voice;
    utter.rate = 0.75;
    utter.pitch = 1;
    utter.volume = 1;

    synth.speak(utter);
  };

  if (!supported) return null;
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
