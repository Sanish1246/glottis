import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { MessageSquareMore } from "lucide-react";
import { useUser } from "../context/UserContext";
import Combobox from "../ui/Combobox";

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
  useEffect(() => {
    fetchUsers();
  }, []);

  // useEffect(() => {
  //   return () => {
  //     if (filter == "none") {
  //       fetchUsers();
  //     } else {
  //       const filterUsers = async () => {
  //         try {
  //           const res = await fetch(`http://localhost:8000/users/${filter}`, {
  //             method: "GET",
  //             credentials: "include",
  //           });
  //           const data = await res.json();
  //           setUsersArray(data);
  //         } catch (error) {
  //           toast.error(String(error), {
  //             action: {
  //               label: "Close",
  //               onClick: () => {
  //                 toast.dismiss();
  //               },
  //             },
  //           });
  //         }
  //       };
  //       filterUsers();
  //     }
  //   };
  // }, [filter]);

  useEffect(() => {
    const filterUsers = async () => {
      try {
        if (filter === "none") {
          // Fetch all users
          const res = await fetch(`http://localhost:8000/users`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          setUsersArray(data);
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
      <h1>Users</h1>
      <div className="flex flex-row items-center gap-1">
        <p>Filter by:</p>
        <Combobox
          choices={userFilters}
          filter={filter}
          setFilter={setFilter}
        ></Combobox>
      </div>

      <div>
        {usersArray.map((nextUser: any, index: number) => {
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
      </div>
    </div>
  );
};

export default UserListPage;
