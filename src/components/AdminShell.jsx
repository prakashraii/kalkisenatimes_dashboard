"use client";

import { api } from "@/lib/api";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Overview", icon: "lucide:layout-dashboard" },
  { href: "/news", label: "News", icon: "lucide:newspaper" },
  { href: "/sponsors", label: "Sponsors", icon: "lucide:megaphone" },
  { href: "/profile", label: "Profile", icon: "lucide:user" },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const data = await api(`/user/${userId}`);
        if (active) setUser(data.result || null);
      } catch {
        if (active) setUser(null);
      }
    };
    loadUser();
    return () => {
      active = false;
    };
  }, []);

  const section = links.find((link) => isActive(pathname, link.href))?.label || "Overview";
  const displayName = user?.name || "Admin";
  const initial = displayName.slice(0, 1).toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-neutral-950 text-neutral-200 transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-3.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            KS
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Kalki Sena</p>
            <p className="text-[11px] text-neutral-400">Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 p-2" aria-label="Dashboard">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-neutral-300 hover:bg-white/10"
                }`}
              >
                <Icon icon={link.icon} className="text-base" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={logout}
          className="m-2 flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-neutral-300 hover:bg-white/10"
        >
          <Icon icon="lucide:log-out" className="text-base" />
          Log out
        </button>
      </aside>

      <div className="md:pl-56">
        <header className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b border-neutral-200 bg-white px-3 md:px-5">
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-md text-neutral-700 hover:bg-neutral-100 md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Icon icon="lucide:menu" className="text-lg" />
          </button>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-800">{section}</p>
          <div className="flex min-w-0 items-center gap-2">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initial}
              </span>
            )}
            <span className="min-w-0 leading-tight">
              <span className="block max-w-[9rem] truncate text-xs font-medium text-neutral-800">{displayName}</span>
              {user?.role && (
                <span className="block max-w-[9rem] truncate text-[11px] text-neutral-500">{user.role}</span>
              )}
            </span>
          </div>
        </header>
        <main className="p-3 md:p-5">{children}</main>
      </div>
    </div>
  );
}
