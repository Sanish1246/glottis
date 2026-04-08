import { Link, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/components/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Route layout: renders child routes only when logged in.
 * Public routes (e.g. home, Athena) stay outside this wrapper in the router.
 */
export function RequireAuth() {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>
              You need to log in to open this page. Use the User menu to sign in, or return home.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-wrap gap-2">
            <Button asChild variant="default">
              <Link to="/" replace>
                Go to home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <Outlet />;
}
