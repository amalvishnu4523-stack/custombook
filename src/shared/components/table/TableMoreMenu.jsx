import { useState, useRef, useEffect } from 'react'
import {
  ArrowUpDown,
  Download,
  Upload,
  Settings,
  RotateCw,
  RotateCcw,
  ChevronRight,
  MoreHorizontal,
  ArrowDown,
  ArrowUp,
} from 'lucide-react'

const SORT_OPTIONS = [
  { label: 'Name', key: 'name' },
  { label: 'Company Name', key: 'companyName' },
  { label: 'Receivables (BCY)', key: 'receivables' },
  { label: 'Unused Credits (BCY)', key: 'unusedCredits' },
  { label: 'Created Time', key: 'created_time' },
  { label: 'Last Modified Time', key: 'last_modified_time' },
]

export default function TableMoreMenu({
  onRefresh,
  onSort,
  onExport,
  onImport,
  onPreferences,
  onResetColumnWidth,
  currentSort = { key: 'created_time', order: 'desc' },
  entityName = 'Customers',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const menuRef = useRef(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
        setActiveSubmenu(null)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setActiveSubmenu(null)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleAction = (callback) => {
    setIsOpen(false)
    setActiveSubmenu(null)
    if (typeof callback === 'function') {
      callback()
    }
  }

  const handleSortClick = (key) => {
    let nextOrder = 'desc'
    if (currentSort?.key === key) {
      nextOrder = currentSort.order === 'desc' ? 'asc' : 'desc'
    }
    handleAction(() => onSort?.(key, nextOrder))
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* ── Trigger Button (Ellipsis ...) ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="More options"
        aria-expanded={isOpen}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          isOpen ? 'bg-gray-100 ring-2 ring-blue-500/20' : ''
        }`}
      >
        <MoreHorizontal size={18} strokeWidth={2.2} />
      </button>

      {/* ── Main Dropdown ── */}
      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-2xl ring-1 ring-black/5"
          role="menu"
        >
          {/* 1. Sort by */}
          <div
            className="relative"
            onMouseEnter={() => setActiveSubmenu('sort')}
          >
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === 'sort' ? null : 'sort')}
              className={`group mx-1.5 flex w-[calc(100%-12px)] items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition cursor-pointer ${
                activeSubmenu === 'sort'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ArrowUpDown
                  size={16}
                  className={`transition-colors ${
                    activeSubmenu === 'sort'
                      ? 'text-white'
                      : 'text-blue-500 group-hover:text-white'
                  }`}
                />
                <span className="font-normal">Sort by</span>
              </div>
              <ChevronRight
                size={15}
                className={`transition-colors ${
                  activeSubmenu === 'sort'
                    ? 'text-white'
                    : 'text-blue-500 group-hover:text-white'
                }`}
              />
            </button>

            {/* Sort Submenu */}
            {activeSubmenu === 'sort' && (
              <div
                className="absolute right-full top-0 mr-1.5 w-52 rounded-xl border border-gray-100 bg-white py-2 shadow-2xl ring-1 ring-black/5"
                onMouseEnter={() => setActiveSubmenu('sort')}
              >
                {/* Bridge to prevent mouse gap flicker */}
                <div className="absolute -right-2 top-0 bottom-0 w-3" />

                {SORT_OPTIONS.map((opt) => {
                  const isSelected = currentSort?.key === opt.key
                  const order = currentSort?.order || 'desc'
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSortClick(opt.key)}
                      className={`group mx-1.5 flex w-[calc(100%-12px)] items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition cursor-pointer ${
                        isSelected
                          ? 'bg-blue-500 text-white font-normal'
                          : 'text-gray-700 hover:bg-blue-500 hover:text-white font-normal'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        order === 'asc' ? (
                          <ArrowUp size={15} className="text-white shrink-0" />
                        ) : (
                          <ArrowDown size={15} className="text-white shrink-0" />
                        )
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* 2. Import */}
          <div
            className="relative"
            onMouseEnter={() => setActiveSubmenu('import')}
          >
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === 'import' ? null : 'import')}
              className={`group mx-1.5 flex w-[calc(100%-12px)] items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition cursor-pointer ${
                activeSubmenu === 'import'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Download
                  size={16}
                  className={`transition-colors ${
                    activeSubmenu === 'import'
                      ? 'text-white'
                      : 'text-blue-500 group-hover:text-white'
                  }`}
                />
                <span className="font-normal">Import</span>
              </div>
              <ChevronRight
                size={15}
                className={`transition-colors ${
                  activeSubmenu === 'import'
                    ? 'text-white'
                    : 'text-blue-500 group-hover:text-white'
                }`}
              />
            </button>

            {/* Import Submenu */}
            {activeSubmenu === 'import' && (
              <div
                className="absolute right-full top-0 mr-1.5 w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-2xl ring-1 ring-black/5"
                onMouseEnter={() => setActiveSubmenu('import')}
              >
                {/* Bridge to prevent mouse gap flicker */}
                <div className="absolute -right-2 top-0 bottom-0 w-3" />

                <button
                  type="button"
                  onClick={() => handleAction(() => onImport?.('customers'))}
                  className="mx-1.5 flex w-[calc(100%-12px)] items-center rounded-lg px-3 py-2 text-left text-sm transition cursor-pointer text-gray-700 hover:bg-blue-500 hover:text-white font-normal"
                >
                  Import {entityName}
                </button>
              </div>
            )}
          </div>

          {/* 3. Export */}
          <div
            className="relative"
            onMouseEnter={() => setActiveSubmenu('export')}
          >
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === 'export' ? null : 'export')}
              className={`group mx-1.5 flex w-[calc(100%-12px)] items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition cursor-pointer ${
                activeSubmenu === 'export'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Upload
                  size={16}
                  className={`transition-colors ${
                    activeSubmenu === 'export'
                      ? 'text-white'
                      : 'text-blue-500 group-hover:text-white'
                  }`}
                />
                <span className="font-normal">Export</span>
              </div>
              <ChevronRight
                size={15}
                className={`transition-colors ${
                  activeSubmenu === 'export'
                    ? 'text-white'
                    : 'text-blue-500 group-hover:text-white'
                }`}
              />
            </button>

            {/* Export Submenu */}
            {activeSubmenu === 'export' && (
              <div
                className="absolute right-full top-0 mr-1.5 w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-2xl ring-1 ring-black/5"
                onMouseEnter={() => setActiveSubmenu('export')}
              >
                {/* Bridge to prevent mouse gap flicker */}
                <div className="absolute -right-2 top-0 bottom-0 w-3" />

                <button
                  type="button"
                  onClick={() => handleAction(() => onExport?.('csv'))}
                  className="mx-1.5 flex w-[calc(100%-12px)] items-center rounded-lg px-3 py-2 text-left text-sm transition cursor-pointer text-gray-700 hover:bg-blue-500 hover:text-white font-normal"
                >
                  Export {entityName} (CSV)
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(() => onExport?.('json'))}
                  className="mx-1.5 flex w-[calc(100%-12px)] items-center rounded-lg px-3 py-2 text-left text-sm transition cursor-pointer text-gray-700 hover:bg-blue-500 hover:text-white font-normal"
                >
                  Export {entityName} (JSON)
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(() => onExport?.('current_view'))}
                  className="mx-1.5 flex w-[calc(100%-12px)] items-center rounded-lg px-3 py-2 text-left text-sm transition cursor-pointer text-gray-700 hover:bg-blue-500 hover:text-white font-normal"
                >
                  Export Current View
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-1.5 border-t border-gray-100" />

          {/* 4. Preferences */}
          <button
            type="button"
            onMouseEnter={() => setActiveSubmenu(null)}
            onClick={() => handleAction(onPreferences)}
            className="group mx-1.5 flex w-[calc(100%-12px)] items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition cursor-pointer hover:bg-blue-500 hover:text-white"
          >
            <Settings size={16} className="text-blue-500 transition-colors group-hover:text-white" />
            <span className="font-normal">Preferences</span>
          </button>

          {/* Divider */}
          <div className="my-1.5 border-t border-gray-100" />

          {/* 5. Refresh List */}
          <button
            type="button"
            onMouseEnter={() => setActiveSubmenu(null)}
            onClick={() => handleAction(onRefresh)}
            className="group mx-1.5 flex w-[calc(100%-12px)] items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition cursor-pointer hover:bg-blue-500 hover:text-white"
          >
            <RotateCw size={16} className="text-blue-500 transition-colors group-hover:text-white" />
            <span className="font-normal">Refresh List</span>
          </button>

          {/* 6. Reset Column Width */}
          <button
            type="button"
            onMouseEnter={() => setActiveSubmenu(null)}
            onClick={() => handleAction(onResetColumnWidth)}
            className="group mx-1.5 flex w-[calc(100%-12px)] items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition cursor-pointer hover:bg-blue-500 hover:text-white"
          >
            <RotateCcw size={16} className="text-blue-500 transition-colors group-hover:text-white" />
            <span className="font-normal">Reset Column Width</span>
          </button>
        </div>
      )}
    </div>
  )
}
