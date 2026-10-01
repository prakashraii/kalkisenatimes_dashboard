import { Icon } from "@iconify/react";

export default function DataTable({ columns, rows, rowKey = "_id", loading, empty }) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`px-3 py-2 font-medium ${column.className || ""}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }, (_, index) => (
                <tr key={`skeleton-${index}`} className="border-b border-neutral-100 last:border-0">
                  {columns.map((column, columnIndex) => (
                    <td key={column.key} className="px-3 py-2.5">
                      <span
                        className={`block h-3 animate-pulse rounded bg-neutral-200 ${
                          columnIndex === 0 ? "w-3/4" : "w-16"
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-neutral-500">
                  <Icon icon="lucide:inbox" className="mx-auto mb-1.5 text-xl text-neutral-400" />
                  <p className="text-sm">{empty || "Nothing to show."}</p>
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={row[rowKey]} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  {columns.map((column) => (
                    <td key={column.key} className={`px-3 py-2 align-middle text-neutral-800 ${column.className || ""}`}>
                      {column.render ? column.render(row) : row[column.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
