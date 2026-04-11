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
      { opacity: 1, ease: "power1.inOut", duration: 0.8, stagger:0.2 },
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
    // Clearing the search results and resetting the search term and page number
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
    <div className="w-full min-w-0 max-w-7xl mx-auto px-3 sm:px-4 pb-10">
      <div className="flex flex-col gap-3 mt-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-2">
        <Input
          id="search"
          placeholder="Search for a media title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="min-w-0 sm:flex-1 sm:min-w-[12rem]"
        />
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button
            className="flex-1 sm:flex-initial min-w-[6rem]"
            onClick={() => {
              searchMedia();
            }}
          >
            <Search />
            Search
          </Button>
          <Button
            variant="destructive"
            className="flex-1 sm:flex-initial min-w-[6rem]"
            onClick={() => {
              clearSearch();
            }}
          >
            Clear
          </Button>
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="flex-1 sm:flex-initial min-w-[6rem]">
                <Upload />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[calc(100vw-1.5rem)] sm:w-full max-h-[90dvh] overflow-y-auto">
              <UploadMediaForm onClose={() => setUploadOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {searching ? (
        <div className="mt-5 w-full min-w-0">
          <h3 className="text-center text-lg sm:text-xl font-bold px-2">
            {searchResult.length == 0 ? "No media found!" : "Search Results"}
          </h3>
          {/* Displaying list of search results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mx-auto mt-5 w-full justify-items-stretch media">
            {searchResult.map((m, index) => (
              <div key={index} className="min-w-0 w-full flex justify-center">
                <MediaCard media={m} onLikeChange={filterMedia} />
              </div>
            ))}
          </div>
          {searchResult.length == 0 ? null : (
            <div className="mt-6 w-full overflow-x-auto">
              <Pagination>
                <PaginationContent className="flex-wrap justify-center gap-2">
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
          <div className="flex flex-col gap-3 mt-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-4 sm:gap-y-2 w-full">
            <div className="flex flex-col gap-1.5 min-w-0 w-full sm:w-auto sm:min-w-[10rem] [&_button]:w-full sm:[&_button]:w-[200px]">
              <p className="text-sm font-medium">Language</p>
              <Combobox
                choices={languages}
                filter={languagePath}
                setFilter={setLanguagePath}
              />
            </div>
            <div className="flex flex-col gap-1.5 min-w-0 w-full sm:w-auto sm:min-w-[12rem] [&_button]:w-full sm:[&_button]:w-[200px]">
              <p className="text-sm font-medium">Level</p>
              <Combobox
                choices={levels}
                filter={levelFilter}
                setFilter={setLevelFilter}
              />
            </div>
          </div>
          {/* Displaying list of recommendations */}
          {recs.length > 0 ? (
            <div className="mt-6 w-full min-w-0">
              <h2 className="font-bold text-lg sm:text-xl text-center mb-3 px-2">
                Recommendations
              </h2>
              <Carousel className="relative w-full max-w-full mx-auto px-10 sm:px-12 md:px-14 lg:max-w-5xl">
                <CarouselContent className="-ml-2 sm:-ml-4">
                  {recs.map((r, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-2 sm:pl-4 basis-full min-w-0"
                    >
                      <div className="flex justify-center min-w-0">
                        <MediaCard media={r} onLikeChange={filterMedia} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 sm:left-1 md:-left-2 lg:-left-12" />
                <CarouselNext className="right-0 sm:right-1 md:-right-2 lg:-right-12" />
              </Carousel>
            </div>
          ) : null}

          <h2 className="font-bold text-lg sm:text-xl text-center mt-6 sm:mt-8 px-2">
            List of medias
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mx-auto mt-5 w-full justify-items-stretch media">
            {/* Displaying list of medias */}
            {medias.map((m, index) => (
              <div key={index} className="min-w-0 w-full flex justify-center">
                <MediaCard media={m} onLikeChange={filterMedia} />
              </div>
            ))}
          </div>
          {/* Pagination for the medias */}
          <div className="mt-6 w-full overflow-x-auto">
            <Pagination>
              <PaginationContent className="flex-wrap justify-center gap-2">
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
