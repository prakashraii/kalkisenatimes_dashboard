"use client";

import { Icon } from "@iconify/react";

export default function Modal({ open, title, onClose, children, wide = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-lg bg-white shadow-xl ${
          wide ? "max-w-3xl" : "max-w-lg"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5">
          <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-7 w-7 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"
          >
            <Icon icon="lucide:x" />
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-3">{children}</div>
      </div>
    </div>
  );
}
