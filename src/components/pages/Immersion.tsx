import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Combobox from "../ui/Combobox";
import { useLanguage } from "../context/LanguageContext";
import MediaCard from "../ui/MediaCard";

type Options = {
  value: string;
  label: string;
};

const languages: Options[] = [
  {
    value: "italian",
    label: "Italian",
  },
  {
    value: "french",
    label: "French",
  },
];

const levels: Options[] = [
  {
    value: "beginner",
    label: "Beginner",
  },
  {
    value: "lower intermediate",
    label: "Lower intermediate",
  },
  {
    value: "intermediate",
    label: "Intermediate",
  },
  {
    value: "upper intermediate",
    label: "Upper Intermediate",
  },
  {
    value: "advanced",
    label: "Advanced",
  },
  {
    value: "none",
    label: "None",
  },
];

const Immersion = () => {
  const { languagePath, setLanguagePath } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("none");
  const [medias, setMedias] = useState([
    {
      title: "",
      description: "",
      language: "",
      likes: 0,
      uploader: "",
      genres: ["1", "2"],
      level: "",
      img_path: "",
    },
  ]);
  const [searchResult, setSearchResult] = useState([]);
  const [searching, setSearching] = useState(false);

  const searchUsers = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/searchMedia?m=${searchTerm}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      setSearching(true);
      setSearchResult(data);
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

  const clearSearch = () => {
    setSearchResult([]);
    setSearchTerm("");
    setSearching(false);
  };

  const filterMedia = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/immersion/${languagePath}/${levelFilter}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
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
    const filterMedia = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/immersion/${languagePath}/${levelFilter}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
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

    filterMedia();
  }, [languagePath, levelFilter]);

  return (
    <div>
      <div className="flex flex-row gap-2 max-w-[50%] mx-auto">
        <Input
          id="search"
          placeholder="Search for a user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          onClick={() => {
            searchUsers();
          }}
        >
          <Search />
          Search
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            clearSearch();
          }}
        >
          Clear
        </Button>
        {medias.length}
      </div>
      <div className="flex flex-row items-center gap-1 mt-3">
        <p>Language:</p>
        <Combobox
          choices={languages}
          filter={languagePath}
          setFilter={setLanguagePath}
        ></Combobox>
        <p>Level:</p>
        <Combobox
          choices={levels}
          filter={levelFilter}
          setFilter={setLevelFilter}
        ></Combobox>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-3 mx-auto mt-5 items-center justify-items-center">
        {medias.map((m, index) => (
          <MediaCard key={index} media={m} onLikeChange={filterMedia} />
        ))}
      </div>
    </div>
  );
};

export default Immersion;
