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
    <div className="grid min-h-screen bg-neutral-100 md:grid-cols-2">
      <div className="flex items-center gap-4 bg-neutral-950 px-5 py-6 text-white md:flex-col md:items-start md:justify-center md:px-12">
        <img src="/logo.png" alt="Kalki Sena Times" className="h-14 w-auto max-w-[14rem] object-contain md:h-20 md:max-w-[18rem]" />
        <p className="text-sm text-neutral-400">Admin sign in</p>
      </div>

      <div className="grid place-items-center px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-base font-semibold text-neutral-900">Sign in</h2>

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
    </div>
  );
}
