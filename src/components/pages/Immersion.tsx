import { useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const Immersion = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searching, setSearching] = useState(false);

  const searchUsers = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/userSearch?u=${searchTerm}`,
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
      </div>
    </div>
  );
};

export default Immersion;
