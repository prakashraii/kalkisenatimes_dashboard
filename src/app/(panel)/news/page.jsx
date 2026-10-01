"use client";

import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import NewsModalForm from "@/components/NewsModalForm";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import SearchFilterBar from "@/components/SearchFilterBar";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";
import { CATEGORIES, PAGE_SIZE, labelFor } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { ghostButtonClass, primaryButtonClass } from "@/lib/ui";
import { Icon } from "@iconify/react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function NewsPage() {
  const showToast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [editor, setEditor] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api(`/news?row=${PAGE_SIZE}&page=${page}`);
      const list = Array.isArray(data.result) ? data.result : [];
      setRows(
        [...list].sort(
          (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        )
      );
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((item) => {
      const matchesQuery = !needle || (item.headline || "").toLowerCase().includes(needle);
      const matchesCategory = !category || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [rows, query, category]);

  const saveNews = async (payload) => {
    setSubmitting(true);
    try {
      if (editor?.mode === "edit") {
        await api(`/news/${editor.item._id}`, { method: "PATCH", body: payload });
        showToast("Article updated");
      } else {
        await api("/news", { method: "POST", body: payload });
        showToast("Article created");
      }
      setEditor(null);
      await load();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteNews = async () => {
    if (!pendingDelete) return;
    setSubmitting(true);
    try {
      await api(`/news/${pendingDelete._id}`, { method: "DELETE" });
      showToast("Article deleted");
      setPendingDelete(null);
      await load();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="News"
        description="Kalki Sena categories only. Search and category filters apply to this page of results."
        action={
          <button type="button" className={primaryButtonClass} onClick={() => setEditor({ mode: "add" })}>
            <Icon icon="lucide:plus" />
            Add news
          </button>
        }
      />

      <SearchFilterBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search headlines on this page"
        filterValue={category}
        onFilterChange={setCategory}
        filterLabel="Category"
        filterOptions={[{ value: "", label: "All categories" }, ...CATEGORIES]}
      />

      <DataTable
        loading={loading}
        rows={visible}
        empty="No articles on this page match the filter."
        columns={[
          {
            key: "headline",
            label: "Headline",
            render: (row) => (
              <span className="line-clamp-2 max-w-sm font-medium">{row.headline || "Untitled"}</span>
            ),
          },
          {
            key: "category",
            label: "Category",
            render: (row) => (
              <span className="whitespace-nowrap text-xs">{labelFor(CATEGORIES, row.category)}</span>
            ),
          },
          {
            key: "authorName",
            label: "Author",
            render: (row) => row.authorName || "—",
          },
          {
            key: "date",
            label: "Date",
            render: (row) => <span className="whitespace-nowrap">{formatDate(row.date || row.createdAt)}</span>,
          },
          {
            key: "actions",
            label: "",
            className: "w-24 text-right",
            render: (row) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label="Edit article"
                  className="grid h-7 w-7 place-items-center rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-primary"
                  onClick={() => setEditor({ mode: "edit", item: row })}
                >
                  <Icon icon="lucide:pencil" />
                </button>
                <button
                  type="button"
                  aria-label="Delete article"
                  className="grid h-7 w-7 place-items-center rounded-md text-neutral-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setPendingDelete(row)}
                >
                  <Icon icon="lucide:trash-2" />
                </button>
              </div>
            ),
          },
        ]}
      />

      <Pagination page={page} totalPages={totalPages} onPage={setPage} />

      <Modal
        wide
        open={Boolean(editor)}
        title={editor?.mode === "edit" ? "Edit news" : "Add news"}
        onClose={() => setEditor(null)}
      >
        {editor && (
          <NewsModalForm
            mode={editor.mode}
            initialData={editor.item}
            submitting={submitting}
            onClose={() => setEditor(null)}
            onSubmit={saveNews}
          />
        )}
      </Modal>

      <Modal open={Boolean(pendingDelete)} title="Delete article" onClose={() => setPendingDelete(null)}>
        <p className="text-sm text-neutral-700">
          Delete “{pendingDelete?.headline || "this article"}”? This removes it from the shared news list.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className={ghostButtonClass} onClick={() => setPendingDelete(null)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            className="rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
            onClick={deleteNews}
          >
            {submitting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
