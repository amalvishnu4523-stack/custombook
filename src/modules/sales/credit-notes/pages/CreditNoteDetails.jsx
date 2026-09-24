import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, Mail, Printer, RefreshCw, MoreHorizontal, ChevronDown, Settings, FileText } from 'lucide-react'

/* ── Sample data ── */
const SAMPLE = [
  {
    id: 1,
    number: 'CN-00001',
    status: 'Draft',
    customer: 'abc',
    companyName: 'amaltest',
    companyAddress: 'Kerala',
    companyCountry: 'India',
    companyEmail: 'amalvishnukvk2@gmail.com', 
    creditDate: '18/09/2026',
    subTotal: 777,
    total: 777,
    creditsRemaining: 777,
    totalInWords: 'Indian Rupee Seven Hundred Seventy-Seven Only',
    items: [
      { id: 1, name: 'bike', description: 'nbb', unit: 'box', qty: 1.0, rate: 777, amount: 777 },
    ],
  },
  {
    id: 2,
    number: 'CN-00002',
    status: 'Open',
    customer: 'Kiran Kumar',
    companyName: 'amaltest',
    companyAddress: 'Kerala',
    companyCountry: 'India',
    companyEmail: 'amalvishnukvk2@gmail.com',
    creditDate: '14/08/2026',
    subTotal: 5000,
    total: 5000,
    creditsRemaining: 0,
    totalInWords: 'Indian Rupee Five Thousand Only',
    items: [
      { id: 1, name: 'Laptop Stand', description: '', unit: 'pcs', qty: 1.0, rate: 5000, amount: 5000 },
    ],
  },
  {
    id: 3,
    number: 'CN-00003',
    status: 'Open',
    customer: 'Sneha Thomas',
    companyName: 'amaltest',
    companyAddress: 'Kerala',
    companyCountry: 'India',
    companyEmail: 'amalvishnukvk2@gmail.com',
    creditDate: '19/08/2026',
    subTotal: 1500,
    total: 1500,
    creditsRemaining: 1500,
    totalInWords: 'Indian Rupee One Thousand Five Hundred Only',
    items: [
      { id: 1, name: 'Office Chair', description: '', unit: 'pcs', qty: 1.0, rate: 1500, amount: 1500 },
    ],
  },
]

const STATUS_STYLES = {
  Draft:  'bg-gray-100 text-gray-600',
  Open:   'bg-yellow-100 text-yellow-700',
  Closed: 'bg-green-100 text-green-700',
  Void:   'bg-red-100 text-red-700',
}

const TABS  = ['Credit Note Details', 'Activity']
const VIEWS = ['Details', 'PDF']

function fmt(val) {
  return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

/* ── Draft ribbon ── */
function DraftRibbon() {
  return (
    <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
      <div
        className="absolute -left-6 top-6 w-32 bg-gray-500 text-white text-xs font-bold text-center py-1 shadow"
        style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
      >
        Draft
      </div>
    </div>
  )
}

function CreditNoteDetails() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [activeTab,  setActiveTab]  = useState('Credit Note Details')
  const [activeView, setActiveView] = useState('PDF')
  const [converted, setConverted]   = useState(false)

  const note = SAMPLE.find(n => String(n.id) === String(id))

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <FileText className="mb-4 h-12 w-12" />
        <p className="text-lg font-medium">Credit Note not found</p>
        <button
          onClick={() => navigate('/sales/credit-notes')}
          className="mt-4 text-sm text-blue-500 hover:underline"
        >
          Back to Credit Notes
        </button>
      </div>
    )
  }

  const isDraft = note.status === 'Draft' && !converted

  return (
    <div className="flex min-h-full flex-col bg-white">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-4 py-2">
        <button
          onClick={() => navigate(`/sales/credit-notes/${id}/edit`)}
          className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition"
        >
          <Pencil className="h-4 w-4" /> Edit
        </button>

        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <Mail className="h-4 w-4" /> Email
        </button>

        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <Printer className="h-4 w-4" /> PDF/Print
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <RefreshCw className="h-4 w-4" /> Refund
        </button>

        <button className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* ── Tabs + toggle ── */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6">
        <div className="flex">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`mr-6 border-b-2 pb-3 pt-3 text-sm font-medium transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex overflow-hidden rounded-lg border border-gray-200 text-sm">
          {VIEWS.map(v => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-4 py-1.5 transition ${
                activeView === v
                  ? 'bg-gray-100 font-medium text-gray-800'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* ───── Details tab ───── */}
        {activeTab === 'Credit Note Details' && activeView === 'Details' && (
          <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

            <div className="mb-6 flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{note.number}</h1>
              <span className={`rounded px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[note.status] ?? ''}`}>
                {note.status}
              </span>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
              <InfoRow label="Credit Note #" value={note.number} />
              <InfoRow label="Credit Date"   value={note.creditDate} />
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <h2 className="mb-3 text-base font-semibold text-gray-900">Bill To</h2>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-400 text-xs font-bold text-white">
                  {note.customer.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-blue-600">{note.customer}</span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">Items</h2>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                  {note.items.length}
                </span>
              </div>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-10">#</th>
                    <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Item &amp; Description</th>
                    <th className="py-2 pr-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400 w-20">Qty</th>
                    <th className="py-2 pr-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400 w-28">Rate</th>
                    <th className="py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-400 w-28">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {note.items.map((item, i) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-blue-600">{item.name}</p>
                        {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-700">{item.qty.toFixed(2)}</td>
                      <td className="py-3 pr-4 text-right text-gray-700">{item.rate.toFixed(2)}</td>
                      <td className="py-3 text-right font-medium text-gray-800">{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-4 flex justify-end">
                <div className="w-72 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sub Total</span>
                    <span>{note.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
                    <span>Total</span>
                    <span>{fmt(note.total)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Credits Remaining</span>
                    <span>{fmt(note.creditsRemaining)}</span>
                  </div>
                  <div className="pt-1 text-xs text-gray-500">
                    <span className="font-medium">Total In Words: </span>
                    <span className="italic">{note.totalInWords}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───── PDF view ───── */}
        {activeTab === 'Credit Note Details' && activeView === 'PDF' && (
          <div className="mx-auto max-w-3xl space-y-4">

            {/* What's Next banner — Draft only */}
            {isDraft && (
              <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center">
                <span className="text-purple-500 text-lg shrink-0">✦</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">WHAT'S NEXT?</p>
                  <p className="text-sm text-gray-600">
                    Go ahead and email this credit note to your customer or simply convert it to open.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition">
                    Send Credit Note
                  </button>
                  <button
                    onClick={() => setConverted(true)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Convert to Open
                  </button>
                </div>
              </div>
            )}

            {/* Credit note document */}
            <div className="relative overflow-hidden rounded border border-gray-300 bg-white shadow">
              {isDraft && <DraftRibbon />}

              {/* Customize button */}
              <div className="absolute top-4 right-4 z-10">
                <button className="flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition">
                  <Settings className="h-3.5 w-3.5" />
                  Customize
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>

              {/* Inner bordered document */}
              <div className="mx-6 my-6 border border-gray-300">

                {/* Company + Title */}
                <div className="flex items-start justify-between border-b border-gray-300 p-4">
                  <div>
                    <p className="font-bold text-gray-900">{note.companyName}</p>
                    <p className="text-xs text-gray-500">{note.companyAddress}</p>
                    <p className="text-xs text-gray-500">{note.companyCountry}</p>
                    <p className="text-xs text-gray-500">{note.companyEmail}</p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-wide pr-4">CREDIT NOTE</h1>
                </div>

                {/* Meta rows */}
                <div className="border-b border-gray-300">
                  <div className="flex border-b border-gray-200">
                    <div className="w-1/2 border-r border-gray-300 px-4 py-2 flex gap-4 text-xs">
                      <span className="text-gray-500 w-20">#</span>
                      <span className="font-semibold text-gray-800">: {note.number}</span>
                    </div>
                    <div className="w-1/2 px-4 py-2" />
                  </div>
                  <div className="flex">
                    <div className="w-1/2 border-r border-gray-300 px-4 py-2 flex gap-4 text-xs">
                      <span className="text-gray-500 w-20">Credit Date</span>
                      <span className="font-semibold text-gray-800">: {note.creditDate}</span>
                    </div>
                    <div className="w-1/2 px-4 py-2" />
                  </div>
                </div>

                {/* Bill To */}
                <div className="border-b border-gray-300 bg-gray-50 px-4 py-2">
                  <span className="text-xs font-semibold text-gray-600">Bill To</span>
                </div>
                <div className="border-b border-gray-300 px-4 py-3">
                  <span className="text-sm font-medium text-blue-600">{note.customer}</span>
                </div>

                {/* Items table */}
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-300 bg-gray-50">
                      <th className="border-r border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-8">#</th>
                      <th className="border-r border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Item &amp; Description</th>
                      <th className="border-r border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-20">Qty</th>
                      <th className="border-r border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-24">Rate</th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-700 w-24">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {note.items.map((item, i) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="border-r border-gray-300 px-3 py-3 text-gray-600">{i + 1}</td>
                        <td className="border-r border-gray-300 px-3 py-3">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          {item.description && <p className="text-gray-400">{item.description}</p>}
                          {item.unit && <p className="text-gray-400">{item.unit}</p>}
                        </td>
                        <td className="border-r border-gray-300 px-3 py-3 text-right text-gray-700">
                          {item.qty.toFixed(2)}
                          {item.unit && <div className="text-gray-400">{item.unit}</div>}
                        </td>
                        <td className="border-r border-gray-300 px-3 py-3 text-right text-gray-700">{item.rate.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right font-medium text-gray-800">{item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals + Total In Words split */}
                <div className="flex border-t border-gray-300">
                  {/* Left: total in words */}
                  <div className="w-1/2 border-r border-gray-300 p-4">
                    <p className="text-xs text-gray-500 mb-1">Total In Words</p>
                    <p className="text-xs font-bold italic text-gray-800">{note.totalInWords}</p>
                  </div>

                  {/* Right: subtotal / total / credits */}
                  <div className="w-1/2 p-4 text-xs space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Sub Total</span>
                      <span>{note.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span>{fmt(note.total)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Credits Remaining</span>
                      <span>{fmt(note.creditsRemaining)}</span>
                    </div>
                  </div>
                </div>

                {/* Authorized Signature row */}
                <div className="flex border-t border-gray-300">
                  <div className="w-1/2 border-r border-gray-300 p-4 min-h-16" />
                  <div className="w-1/2 p-4 flex items-end justify-end min-h-16">
                    <p className="text-xs text-gray-400">Authorized Signature</p>
                  </div>
                </div>

              </div>

              {/* Page number */}
              <div className="pb-3 pr-8 text-right text-xs text-gray-400">1</div>

            </div>
          </div>
        )}

        {/* ───── Activity tab ───── */}
        {activeTab === 'Activity' && (
          <div className="mx-auto max-w-2xl">
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 h-full w-0.5 bg-blue-200" />
              {[
                { date: note.creditDate, time: '09:00 AM', title: 'Credit Note created', desc: `Credit Note ${note.number} created`, by: note.companyName },
              ].map((ev, i) => (
                <div key={i} className="relative mb-5 flex gap-4">
                  <div className="absolute -left-4 flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue-400 bg-white">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                  </div>
                  <div className="w-40 shrink-0 text-xs text-gray-400 pt-0.5">
                    <p>{ev.date}</p>
                    <p>{ev.time}</p>
                  </div>
                  <div className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <p className="text-sm font-semibold text-gray-900">{ev.title}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {ev.desc} <span className="text-gray-400">by</span>{' '}
                      <span className="font-medium text-gray-700">{ev.by}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start">
      <span className="w-44 shrink-0 text-gray-400">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  )
}

export default CreditNoteDetails
