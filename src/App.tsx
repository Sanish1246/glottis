import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LoginForm from "@/components/pages/LoginForm";
import RegisterForm from "@/components/pages/RegisterForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUser } from "@/components/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import "./App.css";

function App() {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useUser();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // const navigate = useNavigate();
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <a className="hover:cursor-pointer hover:underline">User</a>
              </DropdownMenuTrigger>
              <span className="sr-only">User</span>

              <DropdownMenuContent align="end">
                {isLoggedIn ? (
                  <>
                    <Link to="/">
                      <DropdownMenuItem>Favourites</DropdownMenuItem>
                    </Link>
                    <Link to="/">
                      <DropdownMenuItem>Invoices</DropdownMenuItem>
                    </Link>
                    <hr></hr>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => {
                        setIsLoggedIn(false);
                        setUser(null);
                        console.log(user.username);
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => setIsRegisterOpen(true)}>
                      Register
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsLoginOpen(true)}>
                      Login
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/lessons" className="hover:underline">
              Lessons
            </Link>
            <Link to="/" className="hover:underline">
              Flashcards
            </Link>
            <Link to="/" className="hover:underline">
              Deck
            </Link>
            <Link to="athena" className="hover:underline">
              Athena
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent>
            <LoginForm
              setIsLoggedIn={setIsLoggedIn}
              setIsRegisterOpen={setIsRegisterOpen}
              onClose={() => setIsLoginOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogContent>
            <RegisterForm
              setIsLoggedIn={setIsLoggedIn}
              setIsLoginOpen={setIsLoginOpen}
              onClose={() => setIsRegisterOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <Outlet />
        <Toaster richColors />
      </main>
    </div>
  );
}

export default App;
