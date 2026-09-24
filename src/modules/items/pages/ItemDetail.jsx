import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, Package, ChevronDown } from 'lucide-react'
import { getItemById } from '../api/itemsApi'

const FILTER_TYPES   = ['Quotes', 'Invoices', 'Sales Orders', 'Credit Notes']
const STATUS_OPTIONS = ['All', 'Draft', 'Sent', 'Accepted', 'Paid', 'Overdue']

const STATUS_STYLES = {
  Draft:    'bg-gray-100 text-gray-600',
  Sent:     'bg-blue-100 text-blue-700',
  Accepted: 'bg-green-100 text-green-700',
  Paid:     'bg-green-100 text-green-700',
  Overdue:  'bg-red-100 text-red-600',
}

/* ── helpers ── */
function Row({ label, value }) {
  return (
    <div className="flex py-3 border-b border-gray-100 last:border-0">
      <span className="w-48 shrink-0 text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value ?? '—'}</span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-base font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  )
}

function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="relative inline-flex">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none cursor-pointer rounded-md border border-gray-200 bg-white pl-3 pr-8 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
      >
        {options.map(o => <option key={o} value={o}>{label ? `${label}: ${o}` : o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
    </div>
  )
}

const TABS = ['Overview', 'Transactions', 'History']

function ItemDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [activeTab,    setActiveTab]    = useState('Overview')
  const [filterType,   setFilterType]   = useState('Quotes')
  const [filterStatus, setFilterStatus] = useState('All')
  const [item,         setItem]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')

  useEffect(() => {
    setLoading(true)
    getItemById(id)
      .then(res => {
        if (res.success && res.data) {
          setItem(res.data)
        } else {
          // results empty — item belongs to different org or doesn't exist
          setItem(null)
          setError('Item not found or you do not have access to it.')
        }
      })
      .catch(err => {
        const status = err?.response?.status
        const msg = err?.response?.data?.detail || err?.message || 'Failed to load item.'
        setError(`[${status ?? 'ERR'}] ${msg}`)
        setItem(null)
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
        Loading item…
      </div>
    )
  }

  if (!loading && !item) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Package className="mb-4 h-12 w-12" />
        <p className="text-lg font-medium">Item not found</p>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <button onClick={() => navigate('/items')} className="mt-4 text-sm text-blue-500 hover:underline">
          Back to Items
        </button>
      </div>
    )
  }

  const fmt = (val) => val != null
    ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    : '—'

  const transactions  = item.transactions ?? []
  const filteredTx    = transactions.filter(tx => {
    const typeMatch   = tx.type === filterType
    const statusMatch = filterStatus === 'All' || tx.status === filterStatus
    return typeMatch && statusMatch
  })

  return (
    <div className="min-h-full bg-white">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-0">
        <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
        <button
          onClick={() => navigate(`/items/${item.item_id}/edit`)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="mt-4 flex border-b border-gray-200 px-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mr-6 pb-3 text-sm font-medium transition border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-6 py-6">

        {/* ══ OVERVIEW ══ */}
        {activeTab === 'Overview' && (
          <div>
            <div className="mt-2">
              <Row label="Item Type"    value={item.item_type ?? '—'} />
              <Row label="SKU"          value={item.sku ?? '—'} />
              <Row label="Unit"         value={item.unit ?? '—'} />
              <Row label="Status"       value={item.status ?? '—'} />
              <Row label="Created At"   value={item.created_at ? new Date(item.created_at).toLocaleString() : '—'} />
            </div>

            {item.purchase_enabled && (
              <Section title="Purchase Information">
                <Row label="Cost Price"          value={fmt(item.cost_price)} />
                <Row label="Purchase Account"    value={item.purchase_account ?? '—'} />
                <Row label="Purchase Description" value={item.purchase_description || '—'} />
              </Section>
            )}

            {item.sales_enabled && (
              <Section title="Sales Information">
                <Row label="Selling Price"      value={fmt(item.selling_price)} />
                <Row label="Sales Account"      value={item.sales_account ?? '—'} />
                <Row label="Sales Description"  value={item.sales_description || '—'} />
                <Row label="Tax"                value={item.tax || '—'} />
              </Section>
            )}

            {item.track_inventory && (
              <Section title="Inventory">
                <Row label="Inventory Account"  value={item.inventory_account ?? '—'} />
                <Row label="Opening Stock"      value={item.opening_stock ?? '—'} />
                <Row label="Rate Per Unit"      value={fmt(item.rate_per_unit)} />
                <Row label="Valuation Method"   value={item.valuation_method ?? '—'} />
              </Section>
            )}

            <Section title="Reporting Tags">
              <p className="text-sm text-gray-400">No reporting tag has been associated with this item.</p>
            </Section>
          </div>
        )}

        {/* ══ TRANSACTIONS ══ */}
        {activeTab === 'Transactions' && (
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Dropdown label="Filter By" options={FILTER_TYPES}   value={filterType}   onChange={setFilterType} />
              <Dropdown label="Status"    options={STATUS_OPTIONS} value={filterStatus} onChange={setFilterStatus} />
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-max border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['Date', 'Number', 'Customer Name', 'Quantity Sold', 'Price', 'Total', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTx.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                        No transactions found.
                      </td>
                    </tr>
                  ) : filteredTx.map((tx, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{tx.date}</td>
                      <td className="px-4 py-3 text-blue-600">{tx.number}</td>
                      <td className="px-4 py-3 text-gray-700">{tx.customer}</td>
                      <td className="px-4 py-3 text-gray-700">{Number(tx.qty).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-700">{fmt(tx.price)}</td>
                      <td className="px-4 py-3 font-medium text-green-600">{fmt(tx.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[tx.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ HISTORY ══ */}
        {activeTab === 'History' && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 w-56">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">created by</span>
                    <span className="text-gray-400"> — </span>
                    <span className="italic text-gray-600">{item.created_by ?? 'User'}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}

export default ItemDetail
