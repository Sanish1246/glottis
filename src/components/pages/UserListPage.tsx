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

type UserSummary = {
  username: string;
  role?: string;
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

// Function to handle the response from the server
function userListFromResponse(
  res: Response,
  data: unknown,
): { users: unknown[]; errorMessage: string | null } {
  if (!res.ok) {
    const msg =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `Request failed (${res.status})`;
    return { users: [], errorMessage: msg };
  }
  if (Array.isArray(data)) {
    return { users: data, errorMessage: null };
  }
  return { users: [], errorMessage: "Invalid response from server" };
}

const UserListPage = () => {
  const { user } = useUser();
  const [usersArray, setUsersArray] = useState<UserSummary[]>([]);
  const [filter, setFilter] = useState("none");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<UserSummary[]>([]);
  const [searching, setSearching] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`http://localhost:8000/users`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      const { users, errorMessage } = userListFromResponse(res, data);
      // Setting the users array
      setUsersArray(users as UserSummary[]);
      if (errorMessage) {
        toast.error(errorMessage, {
          action: {
            label: "Close",
            onClick: () => toast.dismiss(),
          },
        });
      }
    } catch (error) {
      setUsersArray([]);
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
        `http://localhost:8000/userSearch?u=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await res.json();
      const { users, errorMessage } = userListFromResponse(res, data);
      if (errorMessage) {
        setSearchResult([]);
        toast.error(errorMessage, {
          action: {
            label: "Close",
            onClick: () => toast.dismiss(),
          },
        });
        return;
      }
      setSearching(true);
      setSearchResult(users as UserSummary[]);
    } catch (error) {
      setSearchResult([]);
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
          const res = await fetch(`http://localhost:8000/users/${filter}`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          const { users, errorMessage } = userListFromResponse(res, data);
          setUsersArray(users as UserSummary[]);
          if (errorMessage) {
            toast.error(errorMessage, {
              action: {
                label: "Close",
                onClick: () => toast.dismiss(),
              },
            });
          }
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
      <div className="flex flex-row gap-2 lg:max-w-[50%] w-full mx-auto mt-2">
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
            {usersArray.map((nextUser, index) => {
              return (
                <div
                  key={nextUser.username ?? index}
                  className="border-2 rounded-lg p-3 mb-5 mt-1 shadow-sm  hover:translate-1 flex flex-row lg:w-[50%] w-full mx-auto justify-between"
                >
                  <div className="flex flex-row gap-4">
                    {/* Displaying the username */}
                    {nextUser.username}
                    {/* Displaying the role */}
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
            <h1 className="font-bold text-xl text-center">Search results</h1>
            {searchResult.length == 0 ? <p className="text-center">No result found!</p> : null}
            {searchResult.map((nextUser, index) => {
              return (
                <div
                  key={nextUser.username ?? index}
                  className="border-2 rounded-lg p-3 mb-5 mt-1 shadow-sm  hover:translate-1 flex flex-row lg:w-[50%] w-full mx-auto justify-between"
                >
                  {/* Displaying the username */}
                  {nextUser.username}
                  {/* Displaying the role */}
                  {nextUser.role == "student" ? (
                    <GraduationCap />
                  ) : (
                    <School />
                  )}
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
