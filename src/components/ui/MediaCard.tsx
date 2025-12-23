import React from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useUser } from "@/components/context/UserContext";
import { Badge } from "./badge";
import { nullable } from "zod/v3";

interface MediaCardProps {
  title: string;
  description: string;
  language: string;
  likes: number;
  genres: [];
  level: string;
  img_path: string;
}

const MediaCard = ({
  title,
  description,
  language,
  likes,
  genres,
  level,
  img_path,
}: MediaCardProps) => {
  const { user, setUser } = useUser();

  const liked = user.likes.some(
    (media: MediaCardProps) => media.title === title
  );

  const likeMedia = async () => {
    try {
      const media = {
        title,
        description,
        language,
        likes,
        genres,
        level,
        img_path,
      };
      const res = await fetch(`http://localhost:8000/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(media),
      });
      const data = await res.json();
      setUser(data.newUser);
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

  return (
    <Link
      to="/media"
      state={{ title, description, language, likes, genres, level, img_path }}
    >
      <div className="text-center  rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-md border-black dark:border-white dark:shadow-white dark:shadow-sm w-75 h-75">
        <div>
          <img
            src={img_path}
            alt="Media image"
            className="rounded-tl-xl rounded-tr-xl"
          />
        </div>
        <div className="flex flex-row justify-around border-b border-t border p-3 border-black dark:border-white">
          <p className="font-bold"> {title}</p>
          <p className="text-md">❤️{likes}</p>
        </div>
        <div className="flex flex-row justify-around border-b border-t border p-3 border-black dark:border-white">
          <Badge variant="default">{language}</Badge>
          <Badge variant="default">{level}</Badge>
        </div>
        <div className="w-full">
          <div
            className={`rounded-br-xl border border-black rounded-bl-xl justify-center items-center flex hover:cursor-pointer hover:bg-red-500 p-1 ${
              liked ? "bg-red-500" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (liked) {
                toast.info("Media already liked!");
                return;
              }
              likeMedia();
            }}
          >
            <Heart />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
