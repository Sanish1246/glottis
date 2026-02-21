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
import { ThemeProvider } from "@/components/context/ThemeProvider";
import { ModeToggle } from "./components/ui/ModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./components/ui/button";
import { toast } from "sonner";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import "./App.css";

function App() {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useUser();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useGSAP(() => {
    gsap.fromTo(
      ".navbar",
      {
        y: -150,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4",
      },
    );
  }, []);

  const navigate = useNavigate();
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div>
        <header>
          <nav className="navbar flex flex-row justify-between mb-1">
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
                          <>
                            <Link to="approvals">
                              <DropdownMenuItem>
                                Pending approvals
                              </DropdownMenuItem>
                            </Link>
                            <Link to="aiDashboard">
                              <DropdownMenuItem>AI Dashboard</DropdownMenuItem>
                            </Link>
                          </>
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
                        <DropdownMenuItem
                          onClick={() => setIsRegisterOpen(true)}
                        >
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
                    <DialogDescription>
                      Do you want to logout?
                    </DialogDescription>
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
                    <Link to="lessons">
                      <DropdownMenuItem>Lessons</DropdownMenuItem>
                    </Link>
                    <Link to="customLessons">
                      <DropdownMenuItem>Custom Lessons</DropdownMenuItem>
                    </Link>
                    {user.role != "student" ? (
                      <Link to="create_lesson">
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
                    <Link to="decks">
                      <DropdownMenuItem>Decks</DropdownMenuItem>
                    </Link>
                    <Link to="review">
                      <DropdownMenuItem>Review</DropdownMenuItem>
                    </Link>
                    <Link to="createDeck">
                      <DropdownMenuItem>Create Deck</DropdownMenuItem>
                    </Link>
                    <Link to="customDecks">
                      <DropdownMenuItem>Custom decks</DropdownMenuItem>
                    </Link>
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
                <Link to="immersion" className="hover:underline">
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
              <ModeToggle />
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
    </ThemeProvider>
  );
}

export default App;
