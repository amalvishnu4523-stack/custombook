import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, Package, ChevronDown } from 'lucide-react'

const SAMPLE_ITEMS = [
  {
    id: 1, name: 'Wireless Mouse', sku: 'WM-001', type: 'Goods', unit: 'pcs',
    itemType: 'Sales and Purchase Items',
    createdSource: 'User',
    salesPrice: 799, salesAccount: 'Sales', description: 'Ergonomic wireless mouse with USB receiver.',
    purchasePrice: 500, purchaseAccount: 'Cost of Goods Sold',
    stock: 120,
    createdAt: '2026-08-01 10:00 AM', createdBy: 'Amal Vishnu',
    transactions: [
      { date: '2026-08-05', type: 'Quotes',   number: 'QT-000001', customer: 'Priya Nair',   qty: 2, price: 799,  total: 1598,  status: 'Accepted' },
      { date: '2026-08-12', type: 'Invoices', number: 'INV-000001', customer: 'Kiran Kumar', qty: 1, price: 799,  total: 799,   status: 'Paid' },
    ],
  },
  {
    id: 2, name: 'Mechanical Keyboard', sku: 'MK-002', type: 'Goods', unit: 'pcs',
    itemType: 'Sales and Purchase Items',
    createdSource: 'User',
    salesPrice: 2499, salesAccount: 'Sales', description: 'Mechanical keyboard with Cherry MX switches.',
    purchasePrice: 1800, purchaseAccount: 'Cost of Goods Sold',
    stock: 45,
    createdAt: '2026-08-02 11:30 AM', createdBy: 'Amal Vishnu',
    transactions: [
      { date: '2026-08-10', type: 'Quotes', number: 'QT-000002', customer: 'Sneha Thomas', qty: 1, price: 2499, total: 2499, status: 'Sent' },
    ],
  },
  {
    id: 3, name: 'Web Development', sku: 'SV-001', type: 'Service', unit: 'hrs',
    itemType: 'Sales and Purchase Items',
    createdSource: 'User',
    salesPrice: 1500, salesAccount: 'Sales', description: 'Custom web development services per hour.',
    purchasePrice: null, purchaseAccount: null,
    stock: null,
    createdAt: '2026-08-03 09:15 AM', createdBy: 'Amal Vishnu',
    transactions: [],
  },
  {
    id: 4, name: 'USB-C Hub', sku: 'UH-003', type: 'Goods', unit: 'pcs',
    itemType: 'Sales and Purchase Items',
    createdSource: 'User',
    salesPrice: 1299, salesAccount: 'Sales', description: '7-in-1 USB-C hub with HDMI and PD charging.',
    purchasePrice: 900, purchaseAccount: 'Cost of Goods Sold',
    stock: 30,
    createdAt: '2026-08-04 02:00 PM', createdBy: 'Amal Vishnu',
    transactions: [],
  },
  {
    id: 5, name: 'SEO Audit', sku: 'SV-002', type: 'Service', unit: 'hrs',
    itemType: 'Sales and Purchase Items',
    createdSource: 'User',
    salesPrice: 2000, salesAccount: 'Sales', description: 'Comprehensive SEO audit and recommendations.',
    purchasePrice: null, purchaseAccount: null,
    stock: null,
    createdAt: '2026-08-05 03:45 PM', createdBy: 'Amal Vishnu',
    transactions: [],
  },
  {
    id: 6, name: 'Monitor Stand', sku: 'MS-004', type: 'Goods', unit: 'pcs',
    itemType: 'Sales and Purchase Items',
    createdSource: 'User',
    salesPrice: 999, salesAccount: 'Sales', description: 'Adjustable aluminium monitor stand.',
    purchasePrice: 650, purchaseAccount: 'Cost of Goods Sold',
    stock: 60,
    createdAt: '2026-08-06 04:00 PM', createdBy: 'Amal Vishnu',
    transactions: [],
  },
]

const FILTER_TYPES = ['Quotes', 'Invoices', 'Sales Orders', 'Credit Notes']
const STATUS_OPTIONS = ['All', 'Draft', 'Sent', 'Accepted', 'Paid', 'Overdue']

const STATUS_STYLES = {
  Draft:    'bg-gray-100 text-gray-600',
  Sent:     'bg-blue-100 text-blue-700',
  Accepted: 'bg-green-100 text-green-700',
  Paid:     'bg-green-100 text-green-700',
  Overdue:  'bg-red-100 text-red-600',
}

/* ── small helpers ── */
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

/* ── tabs ── */
const TABS = ['Overview', 'Transactions', 'History']

function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')
  const [filterType, setFilterType] = useState('Quotes')
  const [filterStatus, setFilterStatus] = useState('All')
  const [itemData, setItemData] = useState(() =>
    SAMPLE_ITEMS.find(i => String(i.id) === String(id)) ?? null
  )

  const item = itemData

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Package className="mb-4 h-12 w-12" />
        <p className="text-lg font-medium">Item not found</p>
        <button onClick={() => navigate('/items')} className="mt-4 text-sm text-blue-500 hover:underline">
          Back to Items
        </button>
      </div>
    )
  }

  const fmt = (val) => val != null ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'

  const filteredTx = item.transactions.filter(tx => {
    const typeMatch = tx.type === filterType
    const statusMatch = filterStatus === 'All' || tx.status === filterStatus
    return typeMatch && statusMatch
  })

  return (
    <>
      <div className="min-h-full bg-white">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-0">
        <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
        <button
          onClick={() => navigate(`/items/${id}/edit`)}
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

        {/* ══════════════ OVERVIEW ══════════════ */}
        {activeTab === 'Overview' && (
          <div>
            {/* Basic info */}
            <div className="mt-2">
              <Row label="Item Type"      value={item.itemType} />
              <Row label="Unit"           value={item.unit} />
              <Row label="Created Source" value={item.createdSource} />
            </div>

            {/* Purchase Information */}
            {item.purchasePrice != null && (
              <Section title="Purchase Information">
                <Row label="Cost Price"        value={fmt(item.purchasePrice)} />
                <Row label="Purchase Account"  value={item.purchaseAccount} />
              </Section>
            )}

            {/* Sales Information */}
            <Section title="Sales Information">
              <Row label="Selling Price"  value={fmt(item.salesPrice)} />
              <Row label="Sales Account"  value={item.salesAccount} />
              <Row label="Description"    value={item.description} />
            </Section>

            {/* Reporting Tags */}
            <Section title="Reporting Tags">
              <p className="text-sm text-gray-400">No reporting tag has been associated with this item.</p>
            </Section>
          </div>
        )}

        {/* ══════════════ TRANSACTIONS ══════════════ */}
        {activeTab === 'Transactions' && (
          <div>
            {/* Filters */}
            <div className="mb-5 flex items-center gap-3">
              <Dropdown label="Filter By" options={FILTER_TYPES} value={filterType} onChange={setFilterType} />
              <Dropdown label="Status"    options={STATUS_OPTIONS} value={filterStatus} onChange={setFilterStatus} />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-max border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['Date', 'Quote Number', 'Customer Name', 'Quantity Sold', 'Price', 'Total', 'Status'].map(h => (
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
                  ) : (
                    filteredTx.map((tx, i) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════ HISTORY ══════════════ */}
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
                  <td className="px-4 py-3 text-gray-500">{item.createdAt}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">created by</span>
                    <span className="text-gray-400"> - </span>
                    <span className="italic text-gray-600">{item.createdBy}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
    </>
  )
}

export default ItemDetail
