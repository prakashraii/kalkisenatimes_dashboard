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
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-neutral-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-neutral-500">
                  {empty || "Nothing to show."}
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={row[rowKey]} className="border-b border-neutral-100 last:border-0">
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
