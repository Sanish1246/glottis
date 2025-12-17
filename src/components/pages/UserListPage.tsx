import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { MessageSquareMore } from "lucide-react";
import { useUser } from "../context/UserContext";

const UserListPage = () => {
  const { user } = useUser();
  const [usersArray, setUsersArray] = useState([]);
  useEffect(() => {
    const fetchLessons = async () => {
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
    fetchLessons();
  }, []);
  return (
    <div>
      <h1>Users</h1>
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
