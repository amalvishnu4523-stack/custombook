import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart2, Plus, MoreHorizontal, Search, ChevronDown, RefreshCw } from 'lucide-react'
import { getAdjustments } from '../api/inventoryApi'

const TYPE_OPTIONS   = ['All', 'Quantity', 'Value']
const PERIOD_OPTIONS = ['All', 'This Month', 'Last Month', 'This Quarter', 'This Year']

const COLUMNS = [
  { key: 'date',             label: 'Date' },
  { key: 'reason',           label: 'Reason' },
  { key: 'description',      label: 'Description' },
  { key: 'status',           label: 'Status' },
  { key: 'reference_number', label: 'Reference No...' },
  { key: 'type',             label: 'Type' },
  { key: 'created_by',       label: 'Created By' },
  { key: 'created_time',     label: 'Created Time' },
  { key: 'last_modified_by', label: 'Last Modified...' },
  { key: 'last_modified',    label: 'Last Modifi...' },
  { key: 'location',         label: 'Location' },
]

function FilterDropdown({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500">{label}:</span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="appearance-none rounded border border-gray-200 bg-white py-1 pl-2 pr-6 text-xs text-gray-700 outline-none focus:border-blue-400"
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  )
}

function fmtDate(val) {
  if (!val) return '—'
  // If already formatted string return as-is, else format ISO date
  if (val.includes('/')) return val
  try {
    return new Date(val).toLocaleDateString('en-IN')
  } catch {
    return val
  }
}

function fmtDateTime(val) {
  if (!val) return '—'
  try {
    return new Date(val).toLocaleString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    })
  } catch {
    return val
  }
}

function Inventory() {
  const navigate = useNavigate()
  const [adjustments,   setAdjustments]   = useState([])
  const [selected,      setSelected]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [typeFilter,    setTypeFilter]    = useState('All')
  const [periodFilter,  setPeriodFilter]  = useState('All')

  function fetchData() {
    setLoading(true)
    setError('')
    getAdjustments()
      .then(res => {
        if (res.success && Array.isArray(res.data?.results)) {
          setAdjustments(res.data.results)
        } else if (res.success && Array.isArray(res.data)) {
          setAdjustments(res.data)
        } else {
          setError('Failed to load adjustments.')
        }
      })
      .catch(err => {
        const msg = err?.response?.data?.detail || err?.message || 'Could not connect to server.'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const filtered = adjustments.filter(row => {
    if (typeFilter !== 'All') {
      const rowType = row.adjustment_type ?? row.type ?? ''
      if (!rowType.toLowerCase().includes(typeFilter.toLowerCase())) return false
    }
    return true
  })

  const allSelected = filtered.length > 0 && selected.length === filtered.length

  function toggleAll() {
    setSelected(allSelected ? [] : filtered.map(r => r.id ?? r.adjustment_id))
  }

  function toggleRow(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  function getRowId(row) {
    return row.adjustment_id ?? row.id
  }

  return (
    <div className="flex min-h-full flex-col bg-white">

      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-900">Inventory Adjustments</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/inventory/new')}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" /> New
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── FIFO button ── */}
      <div className="flex items-center justify-end border-b border-gray-100 px-6 py-2">
        <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline">
          <BarChart2 className="h-3.5 w-3.5" />
          FIFO Cost Lot Tracking Report
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-2">
        <span className="text-xs font-medium text-gray-500">Filter By :</span>
        <FilterDropdown label="Type"   options={TYPE_OPTIONS}   value={typeFilter}   onChange={setTypeFilter} />
        <FilterDropdown label="Period" options={PERIOD_OPTIONS} value={periodFilter} onChange={setPeriodFilter} />
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mx-6 mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ── Table ── */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-white">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded accent-blue-600" />
              </th>
              {COLUMNS.map(col => (
                <th key={col.key} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              <th className="w-10 px-3 py-3 text-right">
                <Search className="ml-auto h-4 w-4 text-gray-400" />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td colSpan={COLUMNS.length + 2} className="px-4 py-3">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 2} className="px-4 py-16 text-center text-sm text-gray-400">
                  No inventory adjustments found.
                </td>
              </tr>
            ) : filtered.map(row => {
              const rowId = getRowId(row)
              return (
                <tr
                  key={rowId}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => navigate(`/inventory/${rowId}`)}
                >
                  <td className="w-10 px-4 py-3" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.includes(rowId)} onChange={() => toggleRow(rowId)} className="h-4 w-4 rounded accent-blue-600" />
                  </td>
                  <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{fmtDate(row.date ?? row.adjustment_date)}</td>
                  <td className="px-3 py-3 text-gray-800 whitespace-nowrap">{row.reason ?? '—'}</td>
                  <td className="px-3 py-3 text-gray-500">{row.description ?? ''}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="font-semibold text-blue-600 uppercase text-xs tracking-wide">
                      {row.status ?? '—'}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {row.reference_number
                      ? <span className="font-medium text-blue-600">{row.reference_number}</span>
                      : <span className="text-gray-300">—</span>
                    }
                  </td>
                  <td className="px-3 py-3 text-gray-700">{row.adjustment_type ?? row.type ?? '—'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.created_by ?? '—'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{fmtDateTime(row.created_time ?? row.created_at)}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.last_modified_by ?? '—'}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{fmtDateTime(row.last_modified ?? row.updated_at)}</td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.location ?? '—'}</td>
                  <td className="w-10 px-3 py-3" />
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Inventory
