"use client";

import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";
import { primaryButtonClass, inputClass } from "@/lib/ui";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      showToast("Email is required", "error");
      return;
    }
    if (!password) {
      showToast("Password is required", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await api("/user/login", {
        method: "POST",
        auth: false,
        body: { email: email.trim(), password },
      });
      if (!data.token) {
        throw new Error("Login failed. Token not received.");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.result?._id || "");
      showToast("Login successful");
      router.replace("/");
    } catch (error) {
      showToast(error.message || "Invalid login credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-neutral-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            KS
          </span>
          <div>
            <h1 className="text-base font-semibold text-neutral-900">Kalki Sena</h1>
            <p className="text-xs text-neutral-500">Admin sign in</p>
          </div>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            required
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">Password</span>
          <span className="relative block">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${inputClass} pr-9`}
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500"
              onClick={() => setShowPassword((value) => !value)}
            >
              <Icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} />
            </button>
          </span>
        </label>

        <button type="submit" disabled={loading} className={`${primaryButtonClass} w-full justify-center`}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
