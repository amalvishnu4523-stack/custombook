import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, MoreHorizontal, ArrowLeft, ClipboardList } from 'lucide-react'
import { getAdjustmentById } from '../api/inventoryApi'

function Row({ label, value }) {
  return (
    <div className="flex items-start border-b border-gray-100 py-3 last:border-0">
      <span className="w-52 shrink-0 text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value || '—'}</span>
    </div>
  )
}

function fmtDate(val) {
  if (!val) return '—'
  try { return new Date(val).toLocaleDateString('en-IN') } catch { return val }
}

function fmtDateTime(val) {
  if (!val) return '—'
  try {
    return new Date(val).toLocaleString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    })
  } catch { return val }
}

function InventoryDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [adjustment, setAdjustment] = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    getAdjustmentById(id)
      .then(res => {
        if (res.success && res.data) setAdjustment(res.data)
        else setError('Adjustment not found or you do not have access to it.')
      })
      .catch(err => {
        const msg = err?.response?.data?.detail || err?.message || 'Failed to load adjustment.'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <svg className="mr-2 h-5 w-5 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
        </svg>
        Loading adjustment…
      </div>
    )
  }

  if (!adjustment) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <ClipboardList className="mb-4 h-12 w-12" />
        <p className="text-lg font-medium">Adjustment not found</p>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <button onClick={() => navigate('/inventory')} className="mt-4 text-sm text-blue-500 hover:underline">
          Back to Inventory
        </button>
      </div>
    )
  }

  const adjId = adjustment.adjustment_id ?? id
  const items = adjustment.items ?? adjustment.line_items ?? []

  return (
    <div className="flex min-h-full flex-col bg-white">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-4 py-2">
        <button
          onClick={() => navigate('/inventory')}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => navigate(`/inventory/${adjId}/edit`)}
          className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition"
        >
          <Pencil className="h-4 w-4" /> Edit
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto w-full max-w-3xl px-6 py-6">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">Inventory Adjustment</h1>
          {adjustment.status && (
            <span className={`rounded-full px-3 py-0.5 text-xs font-semibold uppercase ${
              adjustment.status.toLowerCase() === 'adjusted'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {adjustment.status}
            </span>
          )}
        </div>

        {/* Details card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <Row label="Date"             value={fmtDate(adjustment.date ?? adjustment.adjustment_date)} />
          <Row label="Reason"           value={adjustment.reason} />
          <Row label="Type"             value={adjustment.adjustment_type ?? adjustment.type} />
          <Row label="Reference Number" value={adjustment.reference_number} />
          <Row label="Account"          value={adjustment.account ?? adjustment.inventory_account} />
          <Row label="Location"         value={adjustment.location} />
          <Row label="Description"      value={adjustment.description} />
          <Row label="Created By"       value={adjustment.created_by} />
          <Row label="Created Time"     value={fmtDateTime(adjustment.created_time ?? adjustment.created_at)} />
          <Row label="Last Modified By" value={adjustment.last_modified_by} />
          <Row label="Last Modified"    value={fmtDateTime(adjustment.last_modified ?? adjustment.updated_at)} />
        </div>

        {/* Items table */}
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">
            Items
            {items.length > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{items.length}</span>
            )}
          </h2>
          {items.length === 0 ? (
            <p className="text-sm text-gray-400">No items recorded for this adjustment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">#</th>
                    <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Item</th>
                    <th className="pb-2 pr-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Quantity</th>
                    <th className="pb-2 pr-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Rate</th>
                    <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Account</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 pr-3 text-gray-400">{i + 1}</td>
                      <td className="py-2 pr-3 text-blue-600 font-medium">
                        {item.item_name ?? item.name ?? item.item ?? '—'}
                      </td>
                      <td className="py-2 pr-3 text-right text-gray-700">
                        {item.quantity_adjusted ?? item.quantity ?? item.qty ?? '—'}
                      </td>
                      <td className="py-2 pr-3 text-right text-gray-700">
                        {item.rate ?? item.purchase_rate ?? '—'}
                      </td>
                      <td className="py-2 text-gray-600">
                        {item.account ?? item.inventory_account ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Notes */}
        {adjustment.notes && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Notes</h2>
            <p className="text-sm text-gray-600">{adjustment.notes}</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default InventoryDetails
