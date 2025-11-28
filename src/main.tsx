import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./components/context/UserContext";
import { LanguageProvider } from "./components/context/LanguageContext";

import Landing from "./components/pages/Landing.tsx";
import Lesson from "./components/pages/Lesson.tsx";
import LessonsList from "./components/pages/LessonsList.tsx";
import Athena from "./components/pages/Athena.tsx";
import PathToggle from "./components/pages/PathToggle.tsx";
import FlashCardDeckList from "./components/pages/FlashcardDeckList.tsx";
import Deck from "./components/pages/Deck.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: "lessons", element: <LessonsList /> },
      { path: "lessons/:lessonId", element: <Lesson /> },
      { path: "athena", element: <Athena /> },
      { path: "path", element: <PathToggle /> },
      { path: "decks", element: <FlashCardDeckList /> },
      { path: "deck/:deckId", element: <Deck /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </UserProvider>
  </StrictMode>
);
