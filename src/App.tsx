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
        <nav className="flex flex-row justify-between mt-1 rounded-lg">
          <h1 className="self-center text-md md:text-2xl font-extrabold">
            Glottis
          </h1>

          <div className="flex flex-row gap-4 items-center">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <a className="hover:cursor-pointer hover:underline">
                    {isLoggedIn ? user.username : "User"}
                  </a>
                </DropdownMenuTrigger>
                <span className="sr-only">User</span>

                <DropdownMenuContent align="end">
                  {isLoggedIn ? (
                    <>
                      <Link to="/path">
                        <DropdownMenuItem>Language path</DropdownMenuItem>
                      </Link>
                      <Link to="/">
                        <DropdownMenuItem>Dashboard</DropdownMenuItem>
                      </Link>
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
            <Link to="/lessons" className="hover:underline">
              Lessons
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <a className="hover:cursor-pointer hover:underline">Biblíon</a>
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
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="athena" className="hover:underline">
              Athena
            </Link>
            <Link to="chat" className="hover:underline">
              Agorà
            </Link>
            <Link to="/" className="hover:underline">
              Immersion
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
