"use client";

import DataTable from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";
import { labelFor, CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { Badge } from "@/lib/ui";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OverviewPage() {
  const showToast = useToast();
  const [loading, setLoading] = useState(true);
  const [newsTotal, setNewsTotal] = useState(0);
  const [adsTotal, setAdsTotal] = useState(0);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [news, ads] = await Promise.all([
          api("/news?row=8&page=1"),
          api("/ads?row=1&page=1"),
        ]);
        if (!active) return;
        const list = Array.isArray(news.result) ? news.result : [];
        setRecent(
          [...list].sort(
            (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
          )
        );
        setNewsTotal(news.total || 0);
        setAdsTotal(ads.total || 0);
      } catch (error) {
        if (active) showToast(error.message, "error");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [showToast]);

  const cards = [
    { label: "Articles", value: newsTotal, icon: "lucide:newspaper", href: "/news" },
    { label: "Sponsors", value: adsTotal, icon: "lucide:megaphone", href: "/sponsors" },
  ];

  return (
    <div>
      <PageHeader title="Overview" description="Recent Kalki Sena articles and sponsor slots." />

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 hover:border-primary/40"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{card.label}</p>
              {loading ? (
                <span className="mt-2 block h-7 w-12 animate-pulse rounded bg-neutral-200" />
              ) : (
                <p className="mt-1 text-2xl font-semibold text-neutral-900">{card.value}</p>
              )}
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
              <Icon icon={card.icon} className="text-lg" />
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mb-2 text-sm font-semibold text-neutral-800">Recent news</h2>
      <DataTable
        loading={loading}
        rows={recent}
        empty="No articles yet."
        columns={[
          {
            key: "headline",
            label: "Headline",
            render: (row) => (
              <span className="line-clamp-2 max-w-md font-medium">{row.headline || "Untitled"}</span>
            ),
          },
          {
            key: "category",
            label: "Category",
            render: (row) => <Badge>{labelFor(CATEGORIES, row.category)}</Badge>,
          },
          {
            key: "date",
            label: "Date",
            render: (row) => formatDate(row.date || row.createdAt),
          },
        ]}
      />
    </div>
  );
}
