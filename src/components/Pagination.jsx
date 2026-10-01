"use client";

export default function Pagination({ page, totalPages, onPage }) {
  const pages = Math.max(totalPages || 1, 1);
  const current = Math.min(Math.max(page, 1), pages);

  return (
    <div className="mt-3 flex items-center justify-between text-sm text-neutral-600">
      <span>
        Page {current} of {pages}
      </span>
      <div className="flex gap-1.5">
        <button
          type="button"
          disabled={current <= 1}
          onClick={() => onPage(current - 1)}
          className="rounded-md border border-neutral-300 bg-white px-2.5 py-1 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={current >= pages}
          onClick={() => onPage(current + 1)}
          className="rounded-md border border-neutral-300 bg-white px-2.5 py-1 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
