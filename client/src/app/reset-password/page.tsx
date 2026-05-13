"use client";

import { Suspense } from "react";
import ResetPassword from "@/src/views/ResetPassword/ResetPassword";
import LoadingScreen from "@/src/components/LoadingScreen";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ResetPassword />
    </Suspense>
  );
}

