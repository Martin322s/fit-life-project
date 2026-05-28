"use client";

import type { JSX, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

type Props = { children: ReactNode };

function GuestRoute({ children }: Props): JSX.Element {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) return <LoadingScreen />;

  return <>{children}</>;
}

export default GuestRoute;
