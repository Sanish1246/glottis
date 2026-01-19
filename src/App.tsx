import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LoginForm from "@/components/pages/LoginForm";
import RegisterForm from "@/components/pages/RegisterForm";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useUser } from "@/components/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./components/ui/button";
import { toast } from "sonner";

import "./App.css";

function App() {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useUser();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const navigate = useNavigate();
  return (
    <div>
      <header>
        <nav className="flex flex-row justify-between mb-1">
          <div className="flex flex-row items-center">
            <img src="/glottis.svg" alt="Glottis" className="w-6 h-6" />
            <h1 className="self-center text-md md:text-2xl font-extrabold">
              Glottis
            </h1>
          </div>

          <div className="flex flex-row gap-4 items-center">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <a className="hover:cursor-pointer hover:underline">User</a>
                </DropdownMenuTrigger>
                <span className="sr-only">User</span>

                <DropdownMenuContent align="end">
                  {isLoggedIn ? (
                    <>
                      <Link to="dashboard">
                        <DropdownMenuItem>Dashboard</DropdownMenuItem>
                      </Link>
                      {user.role == "admin" ? (
                        <Link to="approvals">
                          <DropdownMenuItem>Pending approvals</DropdownMenuItem>
                        </Link>
                      ) : null}
                      <hr></hr>
                      <DialogTrigger asChild>
                        <DropdownMenuItem variant="destructive">
                          Logout
                        </DropdownMenuItem>
                      </DialogTrigger>
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Logout</DialogTitle>
                  <DialogDescription>Do you want to logout?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        navigate("/");
                        setIsLoggedIn(false);
                        setUser(null);
                        toast.success("User Logged out!", {
                          action: {
                            label: "Close",
                            onClick: () => {
                              toast.dismiss();
                            },
                          },
                        });
                      }}
                    >
                      Confirm
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <a className="hover:cursor-pointer hover:underline">
                    Lessons
                  </a>
                </DropdownMenuTrigger>
                <span className="sr-only">Lessons</span>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/lessons" className="hover:underline">
                      Lessons
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/customLessons" className="hover:underline">
                      Custom Lessons
                    </Link>
                  </DropdownMenuItem>
                  {user.role != "student" ? (
                    <Link to="/create_lesson">
                      <DropdownMenuItem>Create Lesson</DropdownMenuItem>
                    </Link>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a
                className="hover:cursor-pointer hover:underline"
                onClick={() => setIsLoginOpen(true)}
              >
                Lessons
              </a>
            )}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <a className="hover:cursor-pointer hover:underline">
                    Biblíon
                  </a>
                </DropdownMenuTrigger>
                <span className="sr-only">Biblíon</span>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="decks" className="hover:underline">
                      Decks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="review" className="hover:underline">
                      Review
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="createDeck" className="hover:underline">
                      Create Deck
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="customDecks" className="hover:underline">
                      Custom decks
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a
                className="hover:cursor-pointer hover:underline"
                onClick={() => setIsLoginOpen(true)}
              >
                Biblíon
              </a>
            )}

            <Link to="athena" className="hover:underline">
              Athena
            </Link>
            {isLoggedIn ? (
              <Link to="users" className="hover:underline">
                Agorà
              </Link>
            ) : (
              <a
                className="hover:cursor-pointer hover:underline"
                onClick={() => setIsLoginOpen(true)}
              >
                Agorà
              </a>
            )}

            {isLoggedIn ? (
              <Link to="/immersion" className="hover:underline">
                Immersion
              </Link>
            ) : (
              <a
                className="hover:cursor-pointer hover:underline"
                onClick={() => setIsLoginOpen(true)}
              >
                Immersion
              </a>
            )}
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
