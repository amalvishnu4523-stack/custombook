import { Search, SlidersHorizontal } from 'lucide-react'
import Button from '../ui/Button'
import EllipsisButton from '../ui/EllipsisButton'

function DataTable({
  title = '',
  columns = [],
  data = [],
  groups = [],

  // Toolbar
  showSearch = true,
  showFilter = true,
  showMore = true,
  showNewButton = true,
  newButtonText = 'New',
  onNew,
  onSearch,
  searchValue = '',

  // Selection
  selectable = true,
  selectedRows = [],
  onSelectAll,
  onSelectRow,

  // Table
  rowKey = 'id',
  maxHeight = 'calc(100vh - 160px)',

  // Footer
  footer = null,

  // States
  loading = false,
  emptyMessage = 'No data found',

  // Custom row
  onRowClick,
}) {
  const allSelected =
    data.length > 0 && selectedRows.length === data.length

  const getRowKey = (row, index) => {
    return row[rowKey] ?? index
  }

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">

      {/* =========================
          TABLE HEADER / TOOLBAR
      ========================== */}

      <div className="flex min-h-[58px] items-center justify-between border-b border-gray-200 px-4">

        {/* Title */}
        <div className="flex items-center gap-2">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          {showSearch && (
            <div className="relative hidden md:block">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearch?.(e.target.value)}
                placeholder="Search"
                className="h-9 w-52 rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-primary"
              />
            </div>
          )}

          {showFilter && (
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-50"
            >
              <SlidersHorizontal size={17} />
            </button>
          )}

          {showNewButton && (
            <Button onClick={onNew}>
              + {newButtonText}
            </Button>
          )}

          {showMore && (
            <EllipsisButton />
          )}

        </div>
      </div>


      {/* =========================
          SCROLL CONTAINER
      ========================== */}

      <div
        className="w-full overflow-auto"
        style={{ maxHeight }}
      >

        <table className="w-full min-w-max border-collapse">

          {/* =========================
              COLUMN GROUPS
          ========================== */}

          {groups.length > 0 && (
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">

                {selectable && (
                  <th
                    rowSpan={2}
                    className="sticky left-0 z-30 w-12 border-r border-gray-200 bg-gray-50 px-3"
                  />
                )}

                {groups.map((group) => (
                  <th
                    key={group.id ?? group.name}
                    colSpan={group.colSpan}
                    className="border-r border-gray-200 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {group.name}
                  </th>
                ))}

              </tr>

              {/* Actual column headers */}
              <HeaderRow
                columns={columns}
                selectable={selectable}
                allSelected={allSelected}
                onSelectAll={onSelectAll}
              />
            </thead>
          )}

          {/* =========================
              NORMAL HEADER
          ========================== */}

          {groups.length === 0 && (
            <thead>
              <HeaderRow
                columns={columns}
                selectable={selectable}
                allSelected={allSelected}
                onSelectAll={onSelectAll}
              />
            </thead>
          )}

          {/* =========================
              TABLE BODY
          ========================== */}

          <tbody>

            {loading && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row, rowIndex) => {
                const key = getRowKey(row, rowIndex)

                const isSelected = selectedRows.includes(key)

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-gray-200 transition ${
                      isSelected
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'
                    } ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >

                    {/* Checkbox */}
                    {selectable && (
                      <td
                        className="sticky left-0 z-10 w-12 border-r border-gray-200 bg-inherit px-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            onSelectRow?.(key, row)
                          }
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                    )}

                    {/* Cells */}
                    {columns.map((column) => {

                      const value = row[column.key]

                      return (
                        <td
                          key={column.key}
                          className={`px-4 py-3 text-sm ${
                            column.className ?? ''
                          }`}
                          style={{
                            minWidth: column.minWidth,
                            width: column.width,
                            textAlign: column.align ?? 'left',
                          }}
                        >
                          {column.render
                            ? column.render(value, row, rowIndex)
                            : value ?? '-'}
                        </td>
                      )
                    })}

                  </tr>
                )
              })}

          </tbody>

        </table>
      </div>


      {/* =========================
          FOOTER
      ========================== */}

      {footer && (
        <div className="border-t border-gray-200 bg-white px-4 py-3">
          {footer}
        </div>
      )}

    </div>
  )
}


/* =================================
   HEADER ROW
================================= */

function HeaderRow({
  columns,
  selectable,
  allSelected,
  onSelectAll,
}) {
  return (
    <tr className="sticky top-0 z-20 border-b border-gray-200 bg-gray-50">

      {selectable && (
        <th className="sticky left-0 z-30 w-12 border-r border-gray-200 bg-gray-50 px-3">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            className="h-4 w-4 rounded border-gray-300"
          />
        </th>
      )}

      {columns.map((column) => (
        <th
          key={column.key}
          className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ${
            column.headerClassName ?? ''
          }`}
          style={{
            minWidth: column.minWidth,
            width: column.width,
            textAlign: column.align ?? 'left',
          }}
        >
          {column.header}
        </th>
      ))}

    </tr>
  )
}

export default DataTable