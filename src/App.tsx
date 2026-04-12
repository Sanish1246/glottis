import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import LoginForm from "@/components/pages/LoginForm";
import RegisterForm from "@/components/pages/RegisterForm";
import {
  Dialog,
  DialogContent,
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

import "./App.css";

type SidebarNavProps = {
  isLoggedIn: boolean;
  user: { role?: string };
  onClose: () => void;
  setIsLoginOpen: (v: boolean) => void;
  setIsRegisterOpen: (v: boolean) => void;
  setLogoutOpen: (v: boolean) => void;
};

function SidebarNav({
  isLoggedIn,
  user,
  onClose,
  setIsLoginOpen,
  setIsRegisterOpen,
  setLogoutOpen,
}: SidebarNavProps) {
  const linkClass =
    "block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors";
  const sectionClass =
    "px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground first:pt-0";

  return (
    <nav className="flex flex-col gap-0.5 p-4 pb-8" aria-label="Main">
      <Link to="/" className={linkClass} onClick={onClose}>
        Home
      </Link>

      <div className={sectionClass}>User</div>
      {isLoggedIn ? (
        <>
          <Link to="dashboard" className={linkClass} onClick={onClose}>
            Dashboard
          </Link>
          {user.role === "admin" ? (
            <>
              <Link to="approvals" className={linkClass} onClick={onClose}>
                Pending approvals
              </Link>
              <Link to="aiDashboard" className={linkClass} onClick={onClose}>
                AI Dashboard
              </Link>
            </>
          ) : null}
          <button
            type="button"
            className={cn(linkClass, "w-full text-left text-destructive")}
            onClick={() => {
              onClose();
              setLogoutOpen(true);
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className={cn(linkClass, "w-full text-left")}
            onClick={() => {
              setIsRegisterOpen(true);
              onClose();
            }}
          >
            Register
          </button>
          <button
            type="button"
            className={cn(linkClass, "w-full text-left")}
            onClick={() => {
              setIsLoginOpen(true);
              onClose();
            }}
          >
            Login
          </button>
        </>
      )}

      <div className={sectionClass}>Lessons</div>
      {isLoggedIn ? (
        <>
          <Link to="lessons" className={linkClass} onClick={onClose}>
            Lessons
          </Link>
          <Link to="customLessons" className={linkClass} onClick={onClose}>
            Custom Lessons
          </Link>
          {user.role !== "student" ? (
            <Link to="create_lesson" className={linkClass} onClick={onClose}>
              Create Lesson
            </Link>
          ) : null}
        </>
      ) : (
        <button
          type="button"
          className={cn(linkClass, "w-full text-left")}
          onClick={() => {
            setIsLoginOpen(true);
            onClose();
          }}
        >
          Lessons
        </button>
      )}

      <div className={sectionClass}>Flashcards</div>
      {isLoggedIn ? (
        <>
          <Link to="decks" className={linkClass} onClick={onClose}>
            Decks
          </Link>
          <Link to="review" className={linkClass} onClick={onClose}>
            Review
          </Link>
          <Link to="createDeck" className={linkClass} onClick={onClose}>
            Create Deck
          </Link>
          <Link to="customDecks" className={linkClass} onClick={onClose}>
            Custom decks
          </Link>
        </>
      ) : (
        <button
          type="button"
          className={cn(linkClass, "w-full text-left")}
          onClick={() => {
            setIsLoginOpen(true);
            onClose();
          }}
        >
          Flashcards
        </button>
      )}

      <div className={sectionClass}>Explore</div>
      <Link to="athena" className={linkClass} onClick={onClose}>
        Athena
      </Link>
      {isLoggedIn ? (
        <Link to="users" className={linkClass} onClick={onClose}>
          People
        </Link>
      ) : (
        <button
          type="button"
          className={cn(linkClass, "w-full text-left")}
          onClick={() => {
            setIsLoginOpen(true);
            onClose();
          }}
        >
          People
        </button>
      )}
      {isLoggedIn ? (
        <Link to="immersion" className={linkClass} onClick={onClose}>
          Immersion
        </Link>
      ) : (
        <button
          type="button"
          className={cn(linkClass, "w-full text-left")}
          onClick={() => {
            setIsLoginOpen(true);
            onClose();
          }}
        >
          Immersion
        </button>
      )}

      <div className="mt-6 flex items-center justify-between border-t pt-4 px-3">
        <span className="text-xs font-medium text-muted-foreground">Theme</span>
        <ModeToggle />
      </div>
    </nav>
  );
}

function App() {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  useGSAP(() => {
    gsap.fromTo(
      ".navbar-shell",
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

  const confirmLogout = () => {
    navigate("/");
    setIsLoggedIn(false);
    setUser(null);
    setLogoutOpen(false);
    toast.success("User Logged out!", {
      action: {
        label: "Close",
        onClick: () => toast.dismiss(),
      },
    });
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div>
        <header>
          {/* Desktop / large tablet: horizontal navbar */}
          <nav className="navbar-shell mb-1 hidden lg:flex flex-row justify-between items-center w-full gap-4">
            <div className="flex flex-row items-center gap-2 min-w-0">
              <img
                src="/glottis.svg"
                alt="Glottis"
                className="w-6 h-6 shrink-0"
              />
              <h1 className="self-center text-md md:text-2xl font-extrabold truncate">
                Glottis
              </h1>
            </div>

            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 items-center justify-end">
              <Link to="/" className="hover:underline shrink-0">
                Home
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="hover:underline cursor-pointer bg-transparent border-0 p-0 font-inherit"
                  >
                    User
                  </button>
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
                      <hr className="my-1" />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setLogoutOpen(true)}
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

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="hover:underline cursor-pointer bg-transparent border-0 p-0 font-inherit"
                    >
                      Lessons
                    </button>
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
                <button
                  type="button"
                  className="hover:underline cursor-pointer bg-transparent border-0 p-0 font-inherit shrink-0"
                  onClick={() => setIsLoginOpen(true)}
                >
                  Lessons
                </button>
              )}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="hover:underline cursor-pointer bg-transparent border-0 p-0 font-inherit"
                    >
                      Flashcards
                    </button>
                  </DropdownMenuTrigger>
                  <span className="sr-only">Flashcards</span>
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
                <button
                  type="button"
                  className="hover:underline cursor-pointer bg-transparent border-0 p-0 font-inherit shrink-0"
                  onClick={() => setIsLoginOpen(true)}
                >
                  Flashcards
                </button>
              )}

              <Link to="athena" className="hover:underline shrink-0">
                Athena
              </Link>
              {isLoggedIn ? (
                <Link to="users" className="hover:underline shrink-0">
                  People
                </Link>
              ) : (
                <button
                  type="button"
                  className="hover:underline cursor-pointer bg-transparent border-0 p-0 font-inherit shrink-0"
                  onClick={() => setIsLoginOpen(true)}
                >
                  People
                </button>
              )}

              {isLoggedIn ? (
                <Link to="immersion" className="hover:underline shrink-0">
                  Immersion
                </Link>
              ) : (
                <button
                  type="button"
                  className="hover:underline cursor-pointer bg-transparent border-0 p-0 font-inherit shrink-0"
                  onClick={() => setIsLoginOpen(true)}
                >
                  Immersion
                </button>
              )}
              <ModeToggle />
            </div>
          </nav>

          {/* Phone / small tablet: compact bar + menu */}
          <div className="navbar-shell mb-1 flex lg:hidden flex-row items-center justify-between w-full gap-2">
            <Link
              to="/"
              className="flex flex-row items-center gap-2 min-w-0"
              onClick={() => setMobileNavOpen(false)}
            >
              <img src="/glottis.svg" alt="" className="w-6 h-6 shrink-0" />
              <span className="text-base font-extrabold truncate">Glottis</span>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-sidebar"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              {mobileNavOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </Button>
          </div>

          {/* Slide-out sidebar: below lg */}
          <div
            className={cn(
              "fixed inset-0 z-40 lg:hidden transition-opacity duration-200",
              mobileNavOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            )}
            aria-hidden={!mobileNavOpen}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              aria-label="Close menu"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside
              id="mobile-sidebar"
              aria-hidden={!mobileNavOpen}
              className={cn(
                "absolute left-0 top-0 z-50 flex h-full max-h-[100dvh] w-[min(100vw-2.5rem,18rem)] flex-col border-r bg-background shadow-lg transition-transform duration-200 ease-out",
                mobileNavOpen ? "translate-x-0" : "-translate-x-full",
              )}
            >
              <div className="flex items-center justify-between border-b px-3 py-3">
                <span className="text-sm font-semibold">Menu</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <SidebarNav
                  isLoggedIn={isLoggedIn}
                  user={user}
                  onClose={() => setMobileNavOpen(false)}
                  setIsLoginOpen={setIsLoginOpen}
                  setIsRegisterOpen={setIsRegisterOpen}
                  setLogoutOpen={setLogoutOpen}
                />
              </div>
            </aside>
          </div>
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

          <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Logout</DialogTitle>
                <DialogDescription>Do you want to logout?</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="destructive" onClick={confirmLogout}>
                    Confirm
                  </Button>
                </DialogClose>
              </DialogFooter>
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
