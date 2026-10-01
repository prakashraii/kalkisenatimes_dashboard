"use client";

import { Icon } from "@iconify/react";

export default function SearchFilterBar({
  query,
  onQueryChange,
  placeholder = "Search",
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = "Filter",
}) {
  return (
    <div className="mb-3 flex flex-col gap-2 sm:flex-row">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">{placeholder}</span>
        <Icon
          icon="lucide:search"
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-neutral-300 bg-white py-1.5 pl-8 pr-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </label>
      {filterOptions && (
        <label className="sm:w-56">
          <span className="sr-only">{filterLabel}</span>
          <select
            value={filterValue}
            onChange={(event) => onFilterChange(event.target.value)}
            className="w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {filterOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
