import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "./Loading";

type ProtectedRouteProps = {
  children: React.ReactNode;
};
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log("session -> ", session);

  // comment away this for easier development
  if (status === "loading") {
    return <Loading />;
  }

  // comment away this for easier development
  if (status === "unauthenticated") {
    router.replace("/login");
    return <p className="p-4">Access Denied.</p>;
  }

  // If session exists, display content
  return <>{children}</>;
};

export default ProtectedRoute;
