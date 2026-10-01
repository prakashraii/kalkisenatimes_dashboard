"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-neutral-100">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 animate-pulse place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            KS
          </span>
          <span className="text-sm font-medium text-neutral-600">Kalki Sena</span>
        </div>
      </div>
    );
  }

  return children;
}
