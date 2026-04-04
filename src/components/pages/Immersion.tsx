import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Upload } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Combobox from "../ui/Combobox";
import { useLanguage } from "../context/LanguageContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MediaCard from "../ui/MediaCard";
import UploadMediaForm from "./UploadMediaForm";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
    value: "Beginner",
    label: "Beginner",
  },
  {
    value: "Lower intermediate",
    label: "Lower intermediate",
  },
  {
    value: "Intermediate",
    label: "Intermediate",
  },
  {
    value: "Upper intermediate",
    label: "Upper Intermediate",
  },
  {
    value: "Advanced",
    label: "Advanced",
  },
  {
    value: "none",
    label: "None",
  },
];

const Immersion = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const { languagePath, setLanguagePath } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("none");
  const [medias, setMedias] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [recs, setRecs] = useState([]);
  const [searching, setSearching] = useState(false);

  useGSAP(() => {
    gsap.fromTo(
      ".media",
      { opacity: 0 },
      { opacity: 1, ease: "power1.inOut", duration: 0.8 },
    );
  }, [currentPage, searchPage, searchResult]);

  const searchMedia = async () => {
    try {
      setSearchPage(1);
      const res = await fetch(
        `http://localhost:8000/immersion/searchMedia/${searchPage}?m=${searchTerm}`,
        {
          method: "GET",
          credentials: "include",
        },
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
    setCurrentPage(1);
  };

  const filterMedia = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/immersion/${languagePath}/${levelFilter}/${currentPage}`,
        {
          method: "GET",
          credentials: "include",
        },
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
          `http://localhost:8000/immersion/${languagePath}/${levelFilter}/${currentPage}`,
          {
            method: "GET",
            credentials: "include",
          },
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
  }, [languagePath, levelFilter, currentPage]);

  useEffect(() => {
    const getRecommendation = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/immersion/recommendations`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await response.json();
        setRecs(data);
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
    getRecommendation();
  }, []);

  return (
    <div>
      <div className="flex flex-row gap-2 max-w-[50%] mx-auto mt-3">
        <Input
          id="search"
          placeholder="Search for a media title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          onClick={() => {
            searchMedia();
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
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" onClick={() => {}}>
              <Upload />
              Upload
            </Button>
          </DialogTrigger>
          <DialogContent className=" max-w-4xl">
            <UploadMediaForm onClose={() => setUploadOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {searching ? (
        <div className="mt-5">
          <h3 className="text-center text-xl font-bold">
            {searchResult.length == 0 ? "No media found!" : "Search Results"}
          </h3>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-3 mx-auto mt-5 items-center justify-items-center media">
            {searchResult.map((m, index) => (
              <MediaCard key={index} media={m} onLikeChange={filterMedia} />
            ))}
          </div>
          {searchResult.length == 0 ? null : (
            <div className="mt-6 ">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => setSearchPage(searchPage - 1)}
                      className={searchPage === 1 ? "invisible" : ""}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      {searchPage}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => setSearchPage(searchPage + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-row items-center gap-1 mt-5">
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
          {recs.length > 0 ? (
            <div>
              <h2 className="font-bold text-xl text-center mb-3">
                Recommendations
              </h2>
              <Carousel className="max-w-95 mx-auto">
                <CarouselContent>
                  {recs.map((r, index) => (
                    <CarouselItem key={index} className="rounded-xl">
                      <MediaCard media={r} onLikeChange={filterMedia} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          ) : null}

          <h2 className="font-bold text-xl text-center">List of medias</h2>
          <div className="grid md:grid-cols-3 grid-cols-1 mx-auto mt-5 items-center justify-items-center media">
            {medias.map((m, index) => (
              <MediaCard key={index} media={m} onLikeChange={filterMedia} />
            ))}
          </div>
          <div className="mt-6 ">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={currentPage === 1 ? "invisible" : ""}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive
                    className="text-black dark:text-white"
                  >
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default Immersion;
