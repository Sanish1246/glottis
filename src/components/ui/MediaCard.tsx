import React from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useUser } from "@/components/context/UserContext";
import { Badge } from "./badge";

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

  return (
    <Link
      to="/media"
      state={{ title, description, language, likes, genres, level, img_path }}
    >
      <div className="text-center border rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-md border-black dark:border-white dark:shadow-white dark:shadow-sm w-75 h-75">
        <div>
          <img
            src={img_path}
            alt="Media image"
            className="rounded-tl-xl rounded-tr-xl border"
          />
        </div>
        <div className="flex flex-row justify-around border-b border-t border p-3 border-black dark:border-white">
          <p className="text-xl"> {title}</p>
          <p className="text-md">❤️{likes}</p>
        </div>
        <div className="flex flex-row justify-around border-b border-t border p-3 border-black dark:border-white">
          <Badge variant="default">{language}</Badge>
          <Badge variant="default">{level}</Badge>
        </div>
        <div className="w-full">
          <div className="rounded-br-xl border border-black rounded-bl-xl justify-center items-center flex hover:cursor-pointer p-1">
            <Heart />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
