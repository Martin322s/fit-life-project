"use client";

import type { JSX, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }: { children: ReactNode }): JSX.Element {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, isLoading, isAuthenticated, router]);

  if (isLoading) return <></>;
  if (!isAuthenticated || user?.role !== "admin") return <></>;

  return <>{children}</>;
}
