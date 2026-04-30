import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

type Props = { children: JSX.Element };

function PrivateRoute({ children }: Props): JSX.Element {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default PrivateRoute;
