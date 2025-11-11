import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

import Landing from "./components/pages/Landing.tsx";
import Lesson from "./components/pages/Lesson.tsx";
import LessonsList from "./components/pages/LessonsList.tsx";
import Athena from "./components/pages/Athena.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: "lessons", element: <LessonsList /> },
      { path: "lessons/lesson", element: <Lesson /> },
      { path: "athena", element: <Athena /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
