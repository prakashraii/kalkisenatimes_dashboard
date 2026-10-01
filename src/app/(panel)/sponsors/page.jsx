"use client";

import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import SearchFilterBar from "@/components/SearchFilterBar";
import SponsorModalForm from "@/components/SponsorModalForm";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";
import { AD_POSITIONS, PAGE_SIZE, labelFor } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { Badge, ghostButtonClass, primaryButtonClass } from "@/lib/ui";
import { Icon } from "@iconify/react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function SponsorsPage() {
  const showToast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("");
  const [editor, setEditor] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api(`/ads?row=${PAGE_SIZE}&page=${page}`);
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
      const matchesQuery = !needle || (item.title || "").toLowerCase().includes(needle);
      const matchesPosition = !position || item.adPosition === position;
      return matchesQuery && matchesPosition;
    });
  }, [rows, query, position]);

  const saveSponsor = async (payload) => {
    setSubmitting(true);
    try {
      if (editor?.mode === "edit") {
        await api(`/ads/${editor.item._id}`, { method: "PATCH", body: payload });
        showToast("Sponsor updated");
      } else {
        await api("/ads", { method: "POST", body: payload });
        showToast("Sponsor created");
      }
      setEditor(null);
      await load();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSponsor = async () => {
    if (!pendingDelete) return;
    setSubmitting(true);
    try {
      await api(`/ads/${pendingDelete._id}`, { method: "DELETE" });
      showToast("Sponsor deleted");
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
        title="Sponsors"
        description="Each position can hold one active ad. Search applies to this page."
        action={
          <button type="button" className={primaryButtonClass} onClick={() => setEditor({ mode: "add" })}>
            <Icon icon="lucide:plus" />
            Add sponsor
          </button>
        }
      />

      <SearchFilterBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search titles on this page"
        filterValue={position}
        onFilterChange={setPosition}
        filterLabel="Position"
        filterOptions={[{ value: "", label: "All positions" }, ...AD_POSITIONS]}
      />

      <DataTable
        loading={loading}
        rows={visible}
        empty="No sponsors on this page match the filter."
        columns={[
          {
            key: "adImage",
            label: "",
            className: "w-16",
            render: (row) =>
              row.adImage ? (
                <img src={row.adImage} alt="" className="h-10 w-14 rounded object-cover" />
              ) : (
                "—"
              ),
          },
          {
            key: "title",
            label: "Title",
            render: (row) => <span className="font-medium">{row.title || "Untitled"}</span>,
          },
          {
            key: "adPosition",
            label: "Position",
            render: (row) => <Badge>{labelFor(AD_POSITIONS, row.adPosition)}</Badge>,
          },
          {
            key: "date",
            label: "Date",
            render: (row) => <span className="whitespace-nowrap">{formatDate(row.date || row.createdAt)}</span>,
          },
          {
            key: "isActive",
            label: "Status",
            render: (row) => (
              <span
                className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                  row.isActive ? "bg-primary/10 text-primary" : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {row.isActive ? "Active" : "Inactive"}
              </span>
            ),
          },
          {
            key: "actions",
            label: "",
            className: "w-24 text-right",
            render: (row) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label="Edit sponsor"
                  className="grid h-7 w-7 place-items-center rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-primary"
                  onClick={() => setEditor({ mode: "edit", item: row })}
                >
                  <Icon icon="lucide:pencil" />
                </button>
                <button
                  type="button"
                  aria-label="Delete sponsor"
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
        open={Boolean(editor)}
        title={editor?.mode === "edit" ? "Edit sponsor" : "Add sponsor"}
        onClose={() => setEditor(null)}
      >
        {editor && (
          <SponsorModalForm
            mode={editor.mode}
            initialData={editor.item}
            submitting={submitting}
            onClose={() => setEditor(null)}
            onSubmit={saveSponsor}
          />
        )}
      </Modal>

      <Modal open={Boolean(pendingDelete)} title="Delete sponsor" onClose={() => setPendingDelete(null)}>
        <p className="text-sm text-neutral-700">
          Delete “{pendingDelete?.title || "this sponsor"}”?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className={ghostButtonClass} onClick={() => setPendingDelete(null)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            className="rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
            onClick={deleteSponsor}
          >
            {submitting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
