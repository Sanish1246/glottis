import { Heart, HeartMinus } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useUser } from "@/components/context/UserContext";
import { Badge } from "./badge";

interface MediaProps {
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

interface MediaCardProps {
  media: MediaProps;
  onLikeChange?: () => void;
}

const MediaCard = ({ media, onLikeChange }: MediaCardProps) => {
  const { user, setUser } = useUser();

  const liked = (user?.likes ?? []).some(
    (userMedia: MediaProps) => userMedia.title === media.title
  );

  const likeMedia = async () => {
    try {
      const res = await fetch(`http://localhost:8000/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(media),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to like media");
        return;
      }
      if (!data?.newUser) {
        toast.error("Server did not return updated user");
        return;
      }

      setUser(data.newUser);

      onLikeChange?.();
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

  const removeLike = async () => {
    try {
      const res = await fetch(`http://localhost:8000/removeLike`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(media),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to remove like");
        return;
      }
      if (!data?.newUser) {
        toast.error("Server did not return updated user");
        return;
      }
      setUser(data.newUser);
      onLikeChange?.();
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
      state={{
        media,
      }}
    >
      <div className="text-center mb-50 rounded-xl  shadow-md border-black dark:border-white dark:shadow-white dark:shadow-sm w-95 h-75">
        <div>
          <img
            src={media.img_path}
            alt="Media image"
            className="rounded-tl-xl rounded-tr-xl w-100 h-[300px]"
          />
        </div>
        <div className="flex flex-row justify-around border-b border-t border p-3 border-black dark:border-white">
          <p className="font-bold"> {media.title}</p>
          <p className="text-md">❤️{media.likes}</p>
        </div>
        <div className="flex flex-row justify-around border-b border-t border p-3 border-black dark:border-white">
          <Badge variant="default">{media.language}</Badge>
          <Badge variant="default">{media.level}</Badge>
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
                removeLike();
              } else {
                likeMedia();
              }
            }}
          >
            {liked ? <HeartMinus /> : <Heart />}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
