import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MediaInfo = () => {
  const location = useLocation();
  const { title, level, likes, description, img_path } = location.state || {};
  const navigate = useNavigate();
  return (
    <div>
      <div className="mt-5 ml-5">
        <Button onClick={() => navigate(-1)}>Back</Button>
        <h1 className="font-bold text-3xl text-center">Media information</h1>
      </div>

      <div className="flex flex-row w-[70%] mx-auto mt-10">
        <img
          src={img_path}
          alt="Media image"
          className="w-100 h-100 rounded-lg shadow-md border-black dark:border-white dark:shadow-white dark:shadow-sm"
        />
        <div className="w-full p-1 ml-2">
          <h1 className="text-xl font-bold text-center">{title}</h1>
          <hr className="h-2 mt-5 justify-center"></hr>
          <p className="text-center text-lg">{description}</p>
          <div className="flex flex-row justify-center mt-10 gap-5 items-center">
            <p>Level: {level}</p>
            <p>❤️{likes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaInfo;
