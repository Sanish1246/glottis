import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
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
  const fetchLessons = async () => {
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

  useEffect(() => {
    fetchLessons();
  }, []);

  return (
    <>
      <Tabs defaultValue="decks">
        <TabsList>
          <TabsTrigger
            value="decks"
            onClick={() => {
              fetchLessons();
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
              <Link
                to={`/deck/${deck._id}`}
                state={{ deck }}
                className="block hover:translate-1"
              >
                <div
                  key={deck._id}
                  className="items-center border-2 rounded-lg p-3 mb-4 mt-2 shadow-sm hover:cursor-pointer deck hover:translate-1 flex justify-between"
                >
                  <p>
                    <b>{deck.category}</b> -
                    {deck.noOfCards && <span>{deck.noOfCards} cards</span>}
                  </p>

                  <span className="text-sm">
                    Created by <b>{deck.author}</b>
                  </span>
                  <span className="flex gap-1">
                    <Button className="bg-green-600 hover:bg-green-400">
                      Approve
                    </Button>
                    <Button variant="destructive">Reject</Button>
                  </span>
                </div>
              </Link>
            );
          })}
        </TabsContent>
        <TabsContent value="medias">
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
                    Uploaded by <b>{deck.author}</b>
                  </span>
                  <span className="flex gap-1">
                    <Button className="bg-green-600 hover:bg-green-400">
                      Approve
                    </Button>
                    <Button variant="destructive" className="hover:">
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
