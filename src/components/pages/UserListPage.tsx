import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { MessageSquareMore, Search, GraduationCap, School } from "lucide-react";
import { useUser } from "../context/UserContext";
import Combobox from "../ui/Combobox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Options = {
  value: string;
  label: string;
};

const userFilters: Options[] = [
  {
    value: "student",
    label: "Student",
  },
  {
    value: "teacher",
    label: "Teacher",
  },
  {
    value: "none",
    label: "None",
  },
];

const UserListPage = () => {
  const { user } = useUser();
  const [usersArray, setUsersArray] = useState([]);
  const [filter, setFilter] = useState("none");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searching, setSearching] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`http://localhost:8000/users`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setUsersArray(data);
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

  const searchUsers = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/userSearch?u=${searchTerm}`,
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
  };

  useEffect(() => {
    const filterUsers = async () => {
      try {
        if (filter === "none") {
          // Fetch all users
          fetchUsers();
        } else {
          // Fetch filtered users
          const res = await fetch(`http://localhost:8000/users/${filter}`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          setUsersArray(data);
        }
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

    filterUsers();
  }, [filter]);

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

      <div>
        {!searching ? (
          <>
            <div className="flex flex-row items-center gap-1 my-3">
              <p>Filter by:</p>
              <Combobox
                choices={userFilters}
                filter={filter}
                setFilter={setFilter}
              ></Combobox>
            </div>
            <h1 className="font-bold text-xl text-center">List of users</h1>
            {usersArray.map((nextUser: any, index: number) => {
              return (
                <div
                  key={index}
                  className="border-2 rounded-lg p-3 mb-5 mt-1 shadow-sm  hover:translate-1 flex flex-row w-[50%] mx-auto justify-between"
                >
                  <div className="flex flex-row gap-4">
                    {nextUser.username}
                    {nextUser.role == "student" ? (
                      <GraduationCap />
                    ) : (
                      <School />
                    )}
                  </div>

                  <Link
                    to={`/chat`}
                    state={{
                      username: nextUser.username,
                      currentUser: user.username,
                    }}
                  >
                    <MessageSquareMore />
                  </Link>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <h1>Search results</h1>
            {searchResult.length == 0 ? <p>No result found!</p> : null}
            {searchResult.map((nextUser: any, index: number) => {
              return (
                <div key={index} className="flex flex-row">
                  {nextUser.username}
                  <Link
                    to={`/chat`}
                    state={{
                      username: nextUser.username,
                      currentUser: user.username,
                    }}
                  >
                    <MessageSquareMore />
                  </Link>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default UserListPage;
