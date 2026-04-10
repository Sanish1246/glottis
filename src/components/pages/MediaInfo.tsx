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
  const navigate = useNavigate();
  const { media } = (location.state as { media?: MediaProps } | null) ?? {};

  if (!media) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-8">
        <Button type="button" onClick={() => navigate(-1)}>
          Back
        </Button>
        <p className="mt-4 text-muted-foreground">No media selected.</p>
      </div>
    );
  }

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
    <div className="w-full min-w-0 max-w-6xl mx-auto px-3 sm:px-4 pb-10">
      <div className="mt-4 sm:mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <Button type="button" onClick={() => navigate(-1)}>
          Back
        </Button>
        <h1 className="font-bold text-2xl sm:text-3xl text-center sm:text-left flex-1 min-w-0">
          Media information
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full mt-6 sm:mt-10 items-start">
        <img
          src={media.img_path}
          alt=""
          className="w-full max-w-md mx-auto lg:mx-0 shrink-0 rounded-lg shadow-md border border-black dark:border-white dark:shadow-white dark:shadow-sm max-h-[min(55vh,28rem)] max-lg:object-cover lg:max-h-none lg:w-100 lg:h-100"
        />
        <div className="w-full min-w-0 flex-1 lg:pl-2">
          <h2 className="text-lg sm:text-xl font-bold text-center lg:text-left">
            {media.title}
          </h2>
          <hr className="my-4 sm:my-5 border-border" />
          <p className="text-center lg:text-left text-sm sm:text-base text-pretty">
            {media.description}
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mt-6 sm:mt-8 items-stretch sm:items-center">
            <p className="text-center sm:text-left">
              <b>Level: </b>
              {media.level}
            </p>
            <p className="text-center sm:text-left">
              <b>Language: </b>
              {media.language}
            </p>
            <div className="flex flex-row items-center justify-center gap-2">
              <Button
                type="button"
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
            <a
              href={media.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border rounded-lg bg-black text-white flex flex-row gap-2 items-center justify-center hover:cursor-pointer hover:bg-transparent hover:text-foreground transition-colors w-full sm:w-auto min-h-10"
            >
              Buy/Access Now
              <ExternalLink className="size-4 shrink-0" aria-hidden />
            </a>
          </div>
          <div className="flex flex-row flex-wrap gap-2 mt-5 items-center justify-center lg:justify-start">
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
