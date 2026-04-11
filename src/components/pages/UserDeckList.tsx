import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

const UserDeckList = () => {
  const [userDecks, setUserDecks] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await fetch("http://localhost:8000/user_decks", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setUserDecks(data);
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
    fetchDecks();
  }, []);

  // Displaying list of decks
  return (
    <div>
        <h1 className="text-2xl font-bold tracking-tight text-center">
          Review
        </h1>
      {userDecks.length == 0 ? <p>No decks present yet</p> : null}
      {userDecks.map((deck: any) => (
        <div className="border-2 rounded-lg p-3 mb-5 mt-1 shadow-sm hover:cursor-pointer hover:translate-1">
          <Link
            to={`/review/${deck.language}`}
            state={{ deck }}
            className="block"
          >
            {user.username}'s {deck.language} deck
          </Link>
        </div>
      ))}
    </div>
  );
};

export default UserDeckList;
