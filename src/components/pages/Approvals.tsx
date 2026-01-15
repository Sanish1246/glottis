import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";

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
  const [lessons, setLessons] = useState([]);
  const [action, setAction] = useState("");
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

  const fetchLessons = async () => {
    try {
      const response = await fetch(`http://localhost:8000/lessons/pending`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setLessons(data);
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

  const deckActions = async (id: string, approve: boolean) => {
    let url = "";
    if (approve == true) {
      url = `http://localhost:8000/flashcards/approve/${id}`;
    } else {
      url = `http://localhost:8000/flashcards/reject/${id}`;
    }
    try {
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
      });
      const data = await response.json();
      setDecksArray(decksArray.filter((item: DeckProp) => item._id !== id));
      toast.success(data.message, {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
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

  const mediaActions = async (id: string, approve: boolean) => {
    let url = "";
    if (approve == true) {
      url = `http://localhost:8000/immersion/approve/${id}`;
    } else {
      url = `http://localhost:8000/immersion/reject/${id}`;
    }
    try {
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
      });
      const data = await response.json();
      setMedias(medias.filter((item: MediaProps) => item._id !== id));
      toast.success(data.message, {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
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

  const lessonActions = async (id: string, approve: boolean) => {
    let url = "";
    if (approve == true) {
      url = `http://localhost:8000/lessons/approve/${id}`;
    } else {
      url = `http://localhost:8000/lessons/reject/${id}`;
    }
    try {
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
      });
      const data = await response.json();
      setLessons(lessons.filter((item) => item._id !== id));
      toast.success(data.message, {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
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
          <TabsTrigger
            value="lessons"
            onClick={() => {
              fetchLessons();
            }}
          >
            Lessons
          </TabsTrigger>
        </TabsList>
        <TabsContent value="decks">
          <h2 className="font-bold text-center">
            {decksArray.length == 0
              ? "No decks pending for approval!"
              : "Decks pending for approval"}
          </h2>

          {decksArray.map((deck: DeckProp) => {
            return (
              <Link
                to={`/deck/${deck._id}`}
                state={{ deck }}
                className="block hover:translate-1"
              >
                <div
                  key={deck._id}
                  className="items-center border-2 rounded-lg p-3 mb-4 mt-2 shadow-sm hover:cursor-pointer deck hover:translate-1 flex flex-row justify-between"
                >
                  <p>
                    <b>{deck.category}</b> -
                    {deck.noOfCards && <span>{deck.noOfCards} cards</span>}
                  </p>

                  <span className="text-sm">
                    Created by <b>{deck.author}</b>
                  </span>

                  <span className="flex gap-1">
                    <Button
                      className="bg-green-600 hover:bg-green-400"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deckActions(deck._id, true);
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deckActions(deck._id, false);
                      }}
                    >
                      Reject
                    </Button>
                  </span>
                </div>
              </Link>
            );
          })}
        </TabsContent>
        <TabsContent value="medias">
          <h2 className="font-bold text-center">
            {medias.length == 0
              ? "No medias pending for approval!"
              : "Medias pending for approval"}
          </h2>
          {medias.map((media: MediaProps) => {
            return (
              <Link
                to="/media"
                state={{
                  media,
                }}
                className="block hover:translate-1"
              >
                <div
                  key={media._id}
                  className="items-center border-2 rounded-lg p-3 mb-4 mt-2 shadow-sm hover:cursor-pointer deck hover:translate-1 flex justify-between"
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

                  <span className="flex gap-1">
                    <Button
                      className="bg-green-600 hover:bg-green-400"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        mediaActions(media._id, true);
                      }}
                    >
                      Approve
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        mediaActions(media._id, false);
                      }}
                    >
                      Reject
                    </Button>
                  </span>
                </div>
              </Link>
            );
          })}
        </TabsContent>
        <TabsContent value="lessons">
          <h2 className="font-bold text-center">
            {lessons.length == 0
              ? "No lessons pending for approval!"
              : "Lessons pending for approval"}
          </h2>

          {lessons.map((lesson) => {
            return (
              <Link
                to={`/lessons/${lesson._id}`}
                state={{ lesson }}
                className="block hover:translate-1"
              >
                <div
                  key={lesson._id}
                  className="items-center border-2 rounded-lg p-3 mb-4 mt-2 shadow-sm hover:cursor-pointer deck hover:translate-1 flex flex-row justify-between"
                >
                  <p>
                    <b>{lesson.title}</b>
                  </p>

                  <Badge>{lesson.language}</Badge>
                  <Badge>{lesson.level}</Badge>

                  <span className="text-sm">
                    Created by <b>{lesson.author}</b>
                  </span>

                  <span className="flex gap-1">
                    <Button
                      className="bg-green-600 hover:bg-green-400"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        lessonActions(lesson._id, true);
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        lessonActions(lesson._id, false);
                      }}
                    >
                      Reject
                    </Button>
                  </span>
                </div>
              </Link>
            );
          })}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Approvals;
