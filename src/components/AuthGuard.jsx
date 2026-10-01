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
      <div className="grid min-h-screen place-items-center text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  return children;
}
