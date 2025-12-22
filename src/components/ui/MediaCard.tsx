import React from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useUser } from "@/components/context/UserContext";

interface MediaCardProps {
  title: string;
  level: string;
  likes: number;
  description: string;
  img_path: string;
}

const MediaCard = ({
  title,
  level,
  likes,
  description,
  img_path,
}: MediaCardProps) => {
  const { user, setUser } = useUser();

  return (
    <Link to="/media" state={{ title, level, likes, description, img_path }}>
      <div className="text-center border rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-md border-black dark:border-white dark:shadow-white dark:shadow-sm">
        <div>
          <img
            src={img_path}
            alt="Media image"
            className="rounded-tl-xl rounded-tr-xl"
          />
        </div>
        <div className="flex flex-row justify-around border-b border-t  p-3 border-black dark:border-white">
          <p className="text-xl"> {title}</p>
          <p className="text-md">❤️{likes}</p>
        </div>
        <div className="w-full">
          <div className="rounded-br-xl justify-center items-center flex hover:cursor-pointer p-1">
            <Heart />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
