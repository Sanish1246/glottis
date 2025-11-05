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
        <nav className="flex flex-row justify-between mt-1 border-2 rounded-lg">
          <h1 className="self-center text-md md:text-2xl font-extrabold">
            Glottis
          </h1>

          <div className="flex flex-row gap-4 items-center">
            <Link to="/">
              <a className="hover:underline">Home</a>
            </Link>
            <Link to="/">
              <a className="hover:underline">User</a>
            </Link>
            <Link to="/">
              <a className="hover:underline">Lessons</a>
            </Link>
            <Link to="/">
              <a className="hover:underline">Flashcards</a>
            </Link>
            <Link to="/">
              <a className="hover:underline">Deck</a>
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
