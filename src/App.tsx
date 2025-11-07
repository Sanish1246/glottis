import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  // const { isLoggedIn, setIsLoggedIn, user, setUser } = useUser();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const navigate = useNavigate();
  return (
    <div>
      <header>
        <nav className="flex flex-row justify-between mt-1 rounded-lg">
          <h1 className="self-center text-md md:text-2xl font-extrabold">
            Glottis
          </h1>

          <div className="flex flex-row gap-4 items-center">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/" className="hover:underline">
              User
            </Link>
            <Link to="/lesson" className="hover:underline">
              Lessons
            </Link>
            <Link to="/" className="hover:underline">
              Flashcards
            </Link>
            <Link to="/" className="hover:underline">
              Deck
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
