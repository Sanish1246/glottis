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
    (userMedia: MediaProps) => userMedia.title === media.title,
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
      <div className="text-center mb-50 rounded-xl shadow-md border border-black dark:border-white dark:shadow-white dark:shadow-sm w-full max-w-md min-w-0 mx-auto lg:w-95 lg:h-75 lg:max-w-none lg:mx-0">
        <div>
          <img
            src={media.img_path}
            alt="Media image"
            className="rounded-tl-xl rounded-tr-xl w-full h-[200px] sm:h-[240px] md:h-[260px] max-lg:object-cover lg:w-100 lg:h-[300px]"
          />
        </div>
        <div className="flex flex-col gap-2 border-b border-t border p-3 border-black dark:border-white sm:flex-row sm:items-center sm:justify-between lg:flex-row lg:justify-around">
          <p className="font-bold break-words px-1 lg:px-0"> {media.title}</p>
          <p className="text-md shrink-0">❤️{media.likes}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 border-b border-t border p-3 border-black dark:border-white lg:flex-nowrap lg:justify-around lg:gap-0">
          <Badge variant="default">{media.language}</Badge>
          <Badge variant="default">{media.level}</Badge>
        </div>
        <div className="w-full">
          <div
            className={`rounded-br-xl border border-black rounded-bl-xl justify-center items-center flex hover:cursor-pointer dark:border-white hover:bg-red-500 p-1 ${
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