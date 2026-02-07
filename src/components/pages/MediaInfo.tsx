import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@/components/context/UserContext";
import { Badge } from "../ui/badge";
import { Heart, HeartMinus, ExternalLink } from "lucide-react";

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

const MediaInfo = () => {
  const location = useLocation();
  const { user, setUser } = useUser();
  const { media } = location.state || null;

  const liked = (user?.likes ?? []).some(
    (userMedia: MediaProps) => userMedia.title === media.title,
  );
  const navigate = useNavigate();

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
    <div>
      <div className="mt-5 ml-5">
        <Button onClick={() => navigate(-1)}>Back</Button>
        <h1 className="font-bold text-3xl text-center">Media information</h1>
      </div>

      <div className="flex flex-row w-[80%] mx-auto mt-10">
        <img
          src={media.img_path}
          alt="Media image"
          className="w-100 h-100 rounded-lg shadow-md border-black dark:border-white dark:shadow-white dark:shadow-sm"
        />
        <div className="w-full p-1 ml-2">
          <h1 className="text-xl font-bold text-center">{media.title}</h1>
          <hr className="h-2 mt-5 justify-center"></hr>
          <p className="text-center text-md">{media.description}</p>
          <div className="flex flex-row justify-center mt-10 gap-5 items-center">
            <p>
              <b>Level: </b>
              {media.level}
            </p>
            <p>
              <b>Language: </b>
              {media.language}
            </p>
            <div className="flex flex-row items-center gap-1">
              <Button
                className="bg-red-500"
                onClick={() => {
                  if (liked) {
                    removeLike();
                    media.likes--;
                  } else {
                    likeMedia();
                    media.likes++;
                  }
                }}
              >
                {liked ? <HeartMinus /> : <Heart />}
              </Button>

              <p>{media.likes}</p>
            </div>
            <div className="p-2 border rounded-lg bg-black text-white flex flex-row gap-1 hover:cursor-pointer hover:bg-transparent">
              <a href={media.link} target="_blank">
                Buy/Access Now
              </a>
              <ExternalLink />
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-5 items-center justify-center">
            {media.genres.map((g: string, index: number) => {
              return <Badge key={index}>{g}</Badge>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaInfo;
