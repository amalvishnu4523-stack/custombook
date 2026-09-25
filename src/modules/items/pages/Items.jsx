import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Filter,
  Layers,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  ShoppingCart,
  Wrench,
  Boxes,
  PackageX,
  Database,
} from 'lucide-react'
import DataTable from '../../../shared/components/table/DataTable'
import { getItems } from '../api/itemsApi'

const fmtPrice = (val) =>
  val != null && val !== '' ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : ''

const FILTER_GROUPS = [
  {
    category: 'Default Views',
    items: [
      { key: 'all_items', label: 'All Items', icon: Layers, desc: 'All items across the organization' },
      { key: 'active_items', label: 'Active Items', icon: CheckCircle2, desc: 'Currently active and usable items' },
      { key: 'inactive_items', label: 'Inactive Items', icon: XCircle, desc: 'Archived or disabled items' },
    ],
  },
  {
    category: 'Sales & Purchases',
    items: [
      { key: 'sales', label: 'Sales Items', icon: ShoppingBag, desc: 'Items enabled for sales' },
      { key: 'purchases', label: 'Purchases', icon: ShoppingCart, desc: 'Items enabled for purchasing' },
      { key: 'services', label: 'Services', icon: Wrench, desc: 'Service-type items' },
      { key: 'zoho_crm', label: 'Zoho CRM', icon: Database, desc: 'Items synchronized with Zoho CRM' },
    ],
  },
  {
    category: 'Inventory',
    items: [
      { key: 'inventory_items', label: 'Inventory Items', icon: Boxes, desc: 'Tracked stock inventory' },
      { key: 'non_inventory_items', label: 'Non-Inventory Items', icon: PackageX, desc: 'Items without stock tracking' },
    ],
  },
]

const ALL_FILTER_OPTIONS = FILTER_GROUPS.flatMap((g) => g.items)

const SORT_OPTIONS = [
  { key: '', label: 'Default Sort' },
  { key: 'name', label: 'Name' },
  { key: 'sales_price', label: 'Selling Price / Rate' },
  { key: 'purchase_price', label: 'Purchase Rate' },
]

function Items() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [selectedRows, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter & Sort State
  const [activeFilter, setActiveFilter] = useState('all_items')
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filterRef = useRef(null)
  const sortRef = useRef(null)
  const drawerRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterMenuOpen(false)
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortMenuOpen(false)
      }
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setFilterDrawerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch Items from Backend
  useEffect(() => {
    setLoading(true)
    setError('')

    const token = localStorage.getItem('token')
    if (!token) {
      setError('Not authenticated. Please log in again.')
      setLoading(false)
      return
    }

    const params = {}
    if (activeFilter) {
      params.filter = activeFilter
    }
    if (sortBy) {
      params.sort_by = sortBy
      params.sort_order = sortOrder
    }

    getItems(params)
      .then((res) => {
        if (res.success && Array.isArray(res.data?.results)) {
          setItems(res.data.results)
        } else if (Array.isArray(res.data)) {
          setItems(res.data)
        } else if (Array.isArray(res.results)) {
          setItems(res.results)
        } else {
          setError(`Unexpected response: ${JSON.stringify(res)}`)
        }
      })
      .catch((err) => {
        const status = err?.response?.status
        const msg =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          'Could not connect to the server.'
        setError(`${status ? `[${status}] ` : ''}${msg}`)
      })
      .finally(() => setLoading(false))
  }, [activeFilter, sortBy, sortOrder])

  // Column sort click handler
  const handleColumnSort = useCallback((field) => {
    setSortBy((prevSort) => {
      if (prevSort === field) {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'))
        return prevSort
      } else {
        setSortOrder('asc')
        return field
      }
    })
  }, [])

  // Filter display label
  const currentFilterObj = ALL_FILTER_OPTIONS.find((f) => f.key === activeFilter) || ALL_FILTER_OPTIONS[0]
  const currentSortObj = SORT_OPTIONS.find((s) => s.key === sortBy) || SORT_OPTIONS[0]

  // Optional client-side search filtering
  const displayedItems = useMemo(() => {
    return items.filter((item) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        item.name?.toLowerCase().includes(q) ||
        item.sku?.toLowerCase().includes(q) ||
        item.sales_description?.toLowerCase().includes(q) ||
        item.purchase_description?.toLowerCase().includes(q)
      )
    })
  }, [items, searchQuery])

  // Interactive Table Columns with Sorting
  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: (
          <button
            type="button"
            onClick={() => handleColumnSort('name')}
            className="group flex items-center gap-1 font-semibold uppercase tracking-wider text-gray-600 hover:text-blue-600 transition"
            title="Click to sort by Name"
          >
            <span>Name</span>
            {sortBy === 'name' ? (
              sortOrder === 'asc' ? (
                <ArrowUp className="h-3.5 w-3.5 text-blue-600" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
              )
            ) : (
              <ArrowUpDown className="h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100 transition" />
            )}
          </button>
        ),
        minWidth: 160,
        render: (val) => <span className="font-medium text-blue-600">{val}</span>,
      },
      {
        key: 'purchase_description',
        header: 'Purchase Description',
        minWidth: 200,
        render: (val) => <span className="text-gray-600">{val || ''}</span>,
      },
      {
        key: 'cost_price',
        header: (
          <button
            type="button"
            onClick={() => handleColumnSort('purchase_price')}
            className="group flex items-center justify-end w-full gap-1 font-semibold uppercase tracking-wider text-gray-600 hover:text-blue-600 transition"
            title="Click to sort by Purchase Rate"
          >
            <span>Purchase Rate</span>
            {sortBy === 'purchase_price' ? (
              sortOrder === 'asc' ? (
                <ArrowUp className="h-3.5 w-3.5 text-blue-600" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
              )
            ) : (
              <ArrowUpDown className="h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100 transition" />
            )}
          </button>
        ),
        minWidth: 140,
        align: 'right',
        render: (val) => <span className="text-gray-800">{fmtPrice(val)}</span>,
      },
      {
        key: 'sales_description',
        header: 'Description',
        minWidth: 200,
        render: (val) => <span className="text-gray-600">{val || ''}</span>,
      },
      {
        key: 'selling_price',
        header: (
          <button
            type="button"
            onClick={() => handleColumnSort('sales_price')}
            className="group flex items-center justify-end w-full gap-1 font-semibold uppercase tracking-wider text-gray-600 hover:text-blue-600 transition"
            title="Click to sort by Selling Rate"
          >
            <span>Rate</span>
            {sortBy === 'sales_price' ? (
              sortOrder === 'asc' ? (
                <ArrowUp className="h-3.5 w-3.5 text-blue-600" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
              )
            ) : (
              <ArrowUpDown className="h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100 transition" />
            )}
          </button>
        ),
        minWidth: 120,
        align: 'right',
        render: (val) => <span className="text-gray-800">{fmtPrice(val)}</span>,
      },
      {
        key: 'unit',
        header: 'Usage Unit',
        minWidth: 100,
        render: (val) => <span className="text-gray-600">{val || ''}</span>,
      },
    ],
    [sortBy, sortOrder, handleColumnSort]
  )

  // Zoho-style Main View Dropdown in Header
  const titleComponent = (
    <div className="relative inline-block text-left" ref={filterRef}>
      <button
        type="button"
        onClick={() => setFilterMenuOpen((prev) => !prev)}
        className="group flex items-center gap-2 rounded-lg px-2 py-1 text-lg font-bold text-gray-900 transition hover:bg-gray-100 hover:text-blue-600"
      >
        <span>{currentFilterObj.label}</span>
        <ChevronDown className="h-4 w-4 text-gray-400 transition group-hover:text-blue-600" />
      </button>

      {filterMenuOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-72 rounded-xl border border-gray-200 bg-white py-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <span>Filter By View</span>
            <span className="text-[10px] text-gray-400">{items.length} items</span>
          </div>

          <div className="max-h-96 overflow-y-auto py-1">
            {FILTER_GROUPS.map((group, gIdx) => (
              <div key={group.category} className={gIdx > 0 ? 'mt-2 border-t border-gray-100 pt-2' : ''}>
                <div className="px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {group.category}
                </div>
                {group.items.map((f) => {
                  const isSelected = f.key === activeFilter
                  const Icon = f.icon
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => {
                        setActiveFilter(f.key)
                        setFilterMenuOpen(false)
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition ${
                        isSelected
                          ? 'bg-blue-50 font-semibold text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                        <div>
                          <div>{f.label}</div>
                          <div className="text-[11px] font-normal text-gray-400">{f.desc}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Right Toolbar: Sort Dropdown, Sort Order Toggle, and Filter Popover Button
  const toolbarRight = (
    <div className="flex items-center gap-2">
      {/* Sort Menu */}
      <div className="relative inline-block text-left" ref={sortRef}>
        <button
          type="button"
          onClick={() => setSortMenuOpen((prev) => !prev)}
          className={`flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition ${
            sortBy
              ? 'border-blue-200 bg-blue-50/70 text-blue-700'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
          title="Sort items"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
          <span>{currentSortObj.label}</span>
          <ChevronDown className="h-3 w-3 text-gray-400" />
        </button>

        {sortMenuOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="border-b border-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Sort By
            </div>
            {SORT_OPTIONS.map((s) => {
              const isSelected = s.key === sortBy
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => {
                    setSortBy(s.key)
                    setSortMenuOpen(false)
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition hover:bg-blue-50 hover:text-blue-600 ${
                    isSelected ? 'font-semibold text-blue-600 bg-blue-50/60' : 'text-gray-700'
                  }`}
                >
                  <span>{s.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Sort Order Toggle */}
      {sortBy && (
        <button
          type="button"
          onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-blue-600 hover:bg-blue-50 transition"
          title={`Order: ${sortOrder === 'asc' ? 'Ascending (A-Z / Low to High)' : 'Descending (Z-A / High to Low)'}`}
        >
          {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </button>
      )}

      {/* Filter Modal / Popover Toggle Button */}
      <div className="relative inline-block text-left" ref={drawerRef}>
        <button
          type="button"
          onClick={() => setFilterDrawerOpen((prev) => !prev)}
          className={`flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition ${
            activeFilter !== 'all_items'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
          title="All Filters"
        >
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilter !== 'all_items' && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
              1
            </span>
          )}
        </button>

        {filterDrawerOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-xl ring-1 ring-black/5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-semibold text-gray-900">All Filters</h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('all_items')
                  setSortBy('')
                  setSortOrder('asc')
                }}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset All</span>
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Filter By View</label>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500"
                >
                  {FILTER_GROUPS.map((g) => (
                    <optgroup key={g.category} label={g.category}>
                      {g.items.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Sort By Field</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {sortBy && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Sort Direction</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSortOrder('asc')}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-md border py-1.5 text-xs font-medium transition ${
                        sortOrder === 'asc'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                      Ascending
                    </button>
                    <button
                      type="button"
                      onClick={() => setSortOrder('desc')}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-md border py-1.5 text-xs font-medium transition ${
                        sortOrder === 'desc'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                      Descending
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full rounded-md bg-blue-600 py-1.5 text-center text-xs font-medium text-white hover:bg-blue-700 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-full">
      {error && (
        <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Quick Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2">
        <span className="mr-1 text-xs font-medium text-gray-400">Filter:</span>
        {ALL_FILTER_OPTIONS.map((f) => {
          const isSelected = f.key === activeFilter
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <DataTable
        title={titleComponent}
        columns={columns}
        data={displayedItems}
        rowKey="item_id"
        showSearch={true}
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        showFilter={false}
        newButtonText="New Item"
        onNew={() => navigate('/items/new')}
        onRowClick={(row) => navigate(`/items/${row.item_id}`)}
        selectable
        selectedRows={selectedRows}
        onSelectAll={() =>
          setSelected(
            selectedRows.length === displayedItems.length ? [] : displayedItems.map((r) => r.item_id)
          )
        }
        onSelectRow={(key) =>
          setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
        }
        toolbarRight={toolbarRight}
        loading={loading}
        emptyMessage={loading ? 'Loading items…' : 'No items found for selected filter'}
      />
    </div>
  )
}

export default Items