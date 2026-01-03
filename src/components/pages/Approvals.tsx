import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";

interface FlashCardProps {
  word: string;
  english: string;
  audio?: string;
}

interface DeckProp {
  _id?: string;
  level?: string;
  category: string;
  language: string;
  number?: string;
  noOfCards?: string;
  author?: string;
  likes?: string;
  items: FlashCardProps[];
}

interface MediaProps {
  _id?: string;
  title: string;
  description: string;
  language: string;
  likes: number;
  genres: [];
  level: string;
  img_path: string;
  uploader: string;
  author: string;
  link: string;
  type: string;
}

const Approvals = () => {
  const [medias, setMedias] = useState([]);
  const [decksArray, setDecksArray] = useState([]);
  const [action, setAction] = useState("");
  const [comment, setComment] = useState("");
  const fetchDecks = async () => {
    try {
      const response = await fetch(`http://localhost:8000/flashcards/pending`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setDecksArray(data);
    } catch (error) {
      toast.error(String(error), {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  };

  const fetchMedias = async () => {
    try {
      const response = await fetch(`http://localhost:8000/immersion/pending`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setMedias(data);
    } catch (error) {
      toast.error(String(error), {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  };

  const sendComment = async () => {};

  useEffect(() => {
    fetchDecks();
  }, []);

  return (
    <>
      <Tabs defaultValue="decks">
        <TabsList>
          <TabsTrigger
            value="decks"
            onClick={() => {
              fetchDecks();
            }}
          >
            Decks
          </TabsTrigger>
          <TabsTrigger
            value="medias"
            onClick={() => {
              fetchMedias();
            }}
          >
            Medias
          </TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
        </TabsList>
        <TabsContent value="decks">
          {decksArray.map((deck: DeckProp) => {
            return (
              <div
                key={deck._id}
                className="items-center border-2 rounded-lg p-3 mb-4 mt-2 shadow-sm hover:cursor-pointer deck hover:translate-1 flex flex-row justify-between"
              >
                <Link
                  to={`/deck/${deck._id}`}
                  state={{ deck }}
                  className="block hover:translate-1"
                >
                  <p>
                    <b>{deck.category}</b> -
                    {deck.noOfCards && <span>{deck.noOfCards} cards</span>}
                  </p>

                  <span className="text-sm">
                    Created by <b>{deck.author}</b>
                  </span>
                </Link>
                <span className="flex gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-green-600 hover:bg-green-400"
                        onClick={() => {
                          setAction("Approve Deck");
                        }}
                      >
                        Approve
                      </Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setAction("Reject Deck");
                        }}
                      >
                        Reject
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add comment</DialogTitle>
                        <DialogDescription>
                          Add a comment (optional)
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center gap-2">
                        <div className="grid flex-1 gap-2">
                          <Label htmlFor="link" className="sr-only">
                            Comment
                          </Label>
                          <Input id="link" placeholder="Enter a comment..." />
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button type="button">Done</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </span>
              </div>
            );
          })}
        </TabsContent>
        <TabsContent value="medias">
          {medias.map((media: MediaProps) => {
            return (
              <div
                key={media._id}
                className="items-center border-2 rounded-lg p-3 mb-4 mt-2 shadow-sm hover:cursor-pointer deck hover:translate-1 flex justify-between"
              >
                <Link
                  to="/media"
                  state={{
                    media,
                  }}
                  className="block hover:translate-1"
                >
                  <div className="flex flex-row items-center">
                    <img
                      src={media.img_path}
                      alt="Img"
                      className="rounded-tl-xl rounded-tr-xl w-12 h-12"
                    />
                    <p>
                      <b>{media.title}</b>
                    </p>
                  </div>

                  <span className="text-sm">
                    Uploaded by <b>{media.uploader}</b>
                  </span>
                </Link>
                <span className="flex gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-green-600 hover:bg-green-400"
                        onClick={() => {
                          setAction("Approve Media");
                        }}
                      >
                        Approve
                      </Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setAction("Reject Media");
                        }}
                      >
                        Reject
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add comment</DialogTitle>
                        <DialogDescription>
                          Add a comment (optional)
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center gap-2">
                        <div className="grid flex-1 gap-2">
                          <Label htmlFor="link" className="sr-only">
                            Comment
                          </Label>
                          <Input id="link" placeholder="Enter a comment..." />
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button
                            type="button"
                            onClick={() => {
                              sendComment();
                            }}
                          >
                            Done
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </span>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Approvals;
