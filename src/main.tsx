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
import FlashCardDeckList from "./components/pages/FlashcardDeckList.tsx";
import Deck from "./components/pages/Deck.tsx";
import UserDeckList from "./components/pages/UserDeckList.tsx";
import DeckReview from "./components/pages/DeckReview.tsx";
import UserListPage from "./components/pages/UserListPage.tsx";
import ChatPage from "./components/pages/ChatPage.tsx";
import Immersion from "./components/pages/Immersion.tsx";
import MediaInfo from "./components/pages/MediaInfo.tsx";
import CreateDeck from "./components/pages/CreateDeck.tsx";
import CustomDecks from "./components/pages/CustomDecks.tsx";
import CustomLessons from "./components/pages/CustomLessons.tsx";
import Approvals from "./components/pages/Approvals.tsx";
import CreateLesson from "./components/pages/CreateLesson.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: "lessons", element: <LessonsList /> },
      { path: "lessons/:lessonId", element: <Lesson /> },
      { path: "athena", element: <Athena /> },
      { path: "decks", element: <FlashCardDeckList /> },
      { path: "deck/:deckId", element: <Deck /> },
      { path: "review", element: <UserDeckList /> },
      { path: "review/:language", element: <DeckReview /> },
      { path: "users", element: <UserListPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "immersion", element: <Immersion /> },
      { path: "media", element: <MediaInfo /> },
      { path: "createDeck", element: <CreateDeck /> },
      { path: "customDecks", element: <CustomDecks /> },
      { path: "customLessons", element: <CustomLessons /> },
      { path: "approvals", element: <Approvals /> },
      { path: "create_lesson", element: <CreateLesson /> },
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
