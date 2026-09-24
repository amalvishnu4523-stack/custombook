import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, Send, Share2, Printer, FileText, MoreHorizontal, ChevronDown, Settings } from 'lucide-react'

/* ── shared sample data ── */
const SAMPLE_QUOTES = [
  {
    id: 1,
    number: 'QT-000001', status: 'Sent',
    customer: 'Amal Vishnu', billingAddress: '-', shippingAddress: '-',
    quoteDate: '01/08/2026', creationDate: '01/08/2026', salesperson: '-',
    referenceNumber: '', pdfTemplate: 'Spreadsheet Template',
    total: 799, subTotal: 799, adjustment: 0,
    items: [{ id:1, name:'Wireless Mouse', description:'', unit:'pcs', qty:1, price:799, amount:799 }],
  },
  {
    id: 2,
    number: 'QT-000002', status: 'Invoiced',
    customer: 'ddcompany', billingAddress: '-', shippingAddress: '-',
    quoteDate: '02/09/2026', creationDate: '02/09/2026', salesperson: '-',
    referenceNumber: 'hbj', pdfTemplate: 'Spreadsheet Template',
    total: 777, subTotal: 777, adjustment: 0,
    items: [{ id:1, name:'bike', description:'nbb', unit:'box', qty:1, price:777, amount:777 }],
  },
  {
    id: 3,
    number: 'QT-000003', status: 'Draft',
    customer: 'Rahul Menon', billingAddress: '-', shippingAddress: '-',
    quoteDate: '10/08/2026', creationDate: '10/08/2026', salesperson: '-',
    referenceNumber: '', pdfTemplate: 'Spreadsheet Template',
    total: 32000, subTotal: 32000, adjustment: 0,
    items: [{ id:1, name:'SEO Audit', description:'', unit:'hrs', qty:2, price:16000, amount:32000 }],
  },
  {
    id: 4,
    number: 'QT-000004', status: 'Expired',
    customer: 'Sneha Thomas', billingAddress: '-', shippingAddress: '-',
    quoteDate: '12/08/2026', creationDate: '12/08/2026', salesperson: '-',
    referenceNumber: '', pdfTemplate: 'Spreadsheet Template',
    total: 5500, subTotal: 5500, adjustment: 0,
    items: [{ id:1, name:'Monitor Stand', description:'', unit:'pcs', qty:1, price:5500, amount:5500 }],
  },
]

const STATUS_STYLES = {
  Draft:    'bg-gray-100 text-gray-600',
  Sent:     'bg-blue-100 text-blue-700',
  Invoiced: 'bg-green-500 text-white',
  Accepted: 'bg-green-100 text-green-700',
  Expired:  'bg-red-100 text-red-600',
}

const TABS = ['Quote Details', 'Invoices', 'Activity']
const VIEWS = ['Details', 'PDF']

function fmt(val) {
  return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start">
      <span className="w-40 shrink-0 text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value || '-'}</span>
    </div>
  )
}

function QuotesDetails() {
  const { id }        = useParams()
  const navigate      = useNavigate()
  const [activeTab, setActiveTab]   = useState('Quote Details')
  const [activeView, setActiveView] = useState('Details')

  const quote = SAMPLE_QUOTES.find(q => String(q.id) === String(id))

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <FileText className="mb-4 h-12 w-12" />
        <p className="text-lg font-medium">Quote not found</p>
        <button onClick={() => navigate('/sales/quotes')} className="mt-4 text-sm text-blue-500 hover:underline">
          Back to Quotes
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-white">

      {/* ── Action toolbar ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-4 py-2">

        <button onClick={() => navigate(`/sales/quotes/${id}/edit`)}
          className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <Pencil className="h-4 w-4" /> Edit
        </button>

        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <Send className="h-4 w-4" /> Send
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <Share2 className="h-4 w-4" /> Share
        </button>

        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <Printer className="h-4 w-4" /> PDF/Print
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <FileText className="h-4 w-4" /> Convert to Invoice
        </button>

        <button className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* ── Tabs + Details/PDF toggle ── */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6">
        <div className="flex">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`mr-6 pb-3 pt-3 text-sm font-medium transition border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Details / PDF toggle */}
        <div className="flex overflow-hidden rounded-lg border border-gray-200 text-sm">
          {VIEWS.map(v => (
            <button key={v} onClick={() => setActiveView(v)}
              className={`px-4 py-1.5 transition ${
                activeView === v
                  ? 'bg-gray-100 font-medium text-gray-800'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >{v}</button>    
            
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-6">

        {activeTab === 'Quote Details' && activeView === 'Details' && (
          <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{quote.number}</h1>
                <span className={`rounded px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[quote.status]}`}>
                  {quote.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">Total : {fmt(quote.total)}</p>
            </div>

            {/* Meta grid */}
            <div className="mb-8 grid grid-cols-2 gap-x-12 gap-y-3">
              <InfoRow label="Quote Number"     value={quote.number} />
              <InfoRow label="Quote Date"        value={quote.quoteDate} />
              <InfoRow label="Creation Date"     value={quote.creationDate} />
              <InfoRow label="Salesperson"       value={quote.salesperson} />
              <InfoRow label="Reference Number"  value={quote.referenceNumber} />
              <InfoRow label="PDF Template"
                value={
                  <span className="flex items-center gap-1 font-semibold text-gray-800">
                    {quote.pdfTemplate}
                    <Settings className="h-4 w-4 text-blue-400" />
                  </span>
                }
              />
            </div>

            {/* Customer Details */}
            <div className="mb-8">
              <h2 className="mb-3 text-base font-semibold text-gray-900">Customer Details</h2>
              <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-40 shrink-0 text-sm text-gray-400">Name</span>
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-400 text-xs font-bold text-white">
                      {quote.customer.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-800">{quote.customer}</span>
                  </div>
                </div>
                <InfoRow label="Shipping Address" value={quote.shippingAddress} />
                <InfoRow label="Billing Address"  value={quote.billingAddress} />
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">Items</h2>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                  {quote.items.length}
                </span>
              </div>

              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-12">S.NO</th>
                    <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">ITEM</th>
                    <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-20">QTY</th>
                    <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-28">PRICE</th>
                    <th className="py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-400 w-28">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item, i) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-blue-600">{item.name}</p>
                        {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                        {item.unit && <p className="text-xs text-gray-400">{item.unit}</p>}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">{item.qty}</td>
                      <td className="py-3 pr-4 text-gray-700">{fmt(item.price)}</td>
                      <td className="py-3 text-right font-medium text-gray-800">{fmt(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-4 flex justify-end">
                <div className="w-72 space-y-2 text-sm">
                  <div className="flex justify-between font-semibold text-gray-800">
                    <span>Sub Total</span>
                    <span>{fmt(quote.subTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Adjustment</span>
                    <span>{quote.adjustment ?? 0}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>{fmt(quote.total)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'Quote Details' && activeView === 'PDF' && (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <p className="text-sm">PDF preview not available in this environment.</p>
          </div>
        )}

        {activeTab === 'Invoices' && (
          <p className="py-12 text-center text-sm text-gray-400">No invoices linked to this quote.</p>
        )}

        {activeTab === 'Activity' && (
          <div className="mx-auto max-w-2xl">
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 h-full w-0.5 bg-blue-200" />
              {[
                { date: '02/09/2026 11:46 AM', title: 'Quote created', desc: `Quote ${quote.number} created`, by: 'Amal Vishnu' },
              ].map((ev, i) => (
                <div key={i} className="relative mb-5 flex gap-4">
                  <div className="absolute -left-4 flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue-400 bg-white">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                  </div>
                  <div className="w-40 shrink-0 text-xs text-gray-400 pt-0.5">
                    <p>{ev.date.split(' ')[0]}</p>
                    <p>{ev.date.split(' ')[1]} {ev.date.split(' ')[2]}</p>
                  </div>
                  <div className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <p className="text-sm font-semibold text-gray-900">{ev.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{ev.desc} <span className="text-gray-400">by</span> <span className="font-medium text-gray-700">{ev.by}</span></p>
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

export default QuotesDetails
