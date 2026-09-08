import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react'

/* ── Sample data ── */
const SAMPLE_INVOICES = [
  { id: 1, date: '02/09/2026', number: 'INV-000002', orderNumber: 'hbj', amount: 777, balanceDue: 777, status: 'Draft' },
]

const SAMPLE_PAYMENTS = []

const SAMPLE_QUOTES = [
  { id: 1, date: '02/09/2026', number: 'QT-000002', referenceNumber: '', amount: 777, status: 'Invoiced' },
]

const SAMPLE_SALES_ORDERS   = []
const SAMPLE_CREDIT_NOTES   = []
const SAMPLE_DELIVERY_NOTES = []

/* ── Status badge ── */
const STATUS_STYLES = {
  Draft:     'text-gray-400',
  Paid:      'text-green-600',
  Unpaid:    'text-yellow-600',
  Overdue:   'text-red-500',
  Partial:   'text-blue-600',
  Invoiced:  'text-blue-600',
  Accepted:  'text-green-600',
  Sent:      'text-blue-500',
  Cancelled: 'text-red-400',
}

function fmt(val) {
  return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

/* ── Pagination row ── */
function Pagination({ total }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 text-sm text-gray-500">
      <span>Total Count: <button className="text-blue-600 hover:underline">View</button></span>
      <div className="flex items-center gap-1">
        <button className="rounded p-1 hover:bg-gray-100 transition"><ChevronLeft className="h-4 w-4" /></button>
        <span className="px-1">1 - {total}</span>
        <button className="rounded p-1 hover:bg-gray-100 transition"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  )
}

/* ── Collapsible section ── */
function TxSection({ title, statusFilter, onStatusChange, onNew, children, count }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white">
        <button
          type="button"
          onClick={() => setOpen(p => !p)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-800"
        >
          {open
            ? <ChevronDown className="h-4 w-4 text-blue-500" />
            : <ChevronRight className="h-4 w-4 text-blue-500" />
          }
          {title}
        </button>

        <div className="flex items-center gap-3">
          {statusFilter !== undefined && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Filter className="h-3.5 w-3.5" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={e => onStatusChange?.(e.target.value)}
                className="border-0 bg-transparent text-xs text-gray-600 outline-none cursor-pointer"
              >
                {['All', 'Draft', 'Sent', 'Paid', 'Unpaid', 'Overdue'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="button"
            onClick={onNew}
            className="flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 transition"
          >
            <Plus className="h-3 w-3" />
            New
          </button>
        </div>
      </div>

      {/* Body */}
      {open && <div>{children}</div>}
    </div>
  )
}

/* ── Table shell ── */
function TxTable({ headers, rows, emptyMessage }) {
  return (
    <div className="overflow-x-auto border-t border-gray-100">
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {headers.map(h => (
              <th key={h} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                {h}{h === 'DATE' && <span className="ml-1 text-gray-300">↕</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-6 text-center text-sm text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows
          )}
        </tbody>
      </table>
    </div>
  )
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
function Transactions() {
  const [invoiceStatus, setInvoiceStatus] = useState('All')
  const [quoteStatus,   setQuoteStatus]   = useState('All')

  const filteredInvoices = invoiceStatus === 'All'
    ? SAMPLE_INVOICES
    : SAMPLE_INVOICES.filter(i => i.status === invoiceStatus)

  const filteredQuotes = quoteStatus === 'All'
    ? SAMPLE_QUOTES
    : SAMPLE_QUOTES.filter(q => q.status === quoteStatus)

  return (
    <div className="p-6 space-y-5 max-w-5xl">

      {/* Go to transactions dropdown */}
      <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition">
        Go to transactions
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* ── Invoices ── */}
      <TxSection
        title="Invoices"
        statusFilter={invoiceStatus}
        onStatusChange={setInvoiceStatus}
        onNew={() => {}}
      >
        <TxTable
          headers={['DATE', 'INVOICE NUMBER', 'ORDER NUMBER', 'AMOUNT', 'BALANCE DUE', 'STATUS']}
          emptyMessage="No invoices found."
          rows={filteredInvoices.map(inv => (
            <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-600">{inv.date}</td>
              <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">{inv.number}</td>
              <td className="px-4 py-3 text-gray-600">{inv.orderNumber || '—'}</td>
              <td className="px-4 py-3 text-gray-800 font-medium">{fmt(inv.amount)}</td>
              <td className="px-4 py-3 text-gray-800 font-medium">{fmt(inv.balanceDue)}</td>
              <td className={`px-4 py-3 text-sm ${STATUS_STYLES[inv.status] ?? 'text-gray-500'}`}>{inv.status}</td>
            </tr>
          ))}
        />
        {filteredInvoices.length > 0 && <Pagination total={filteredInvoices.length} />}
      </TxSection>

      {/* ── Customer Payments ── */}
      <TxSection title="Customer Payments" onNew={() => {}}>
        <TxTable
          headers={['DATE', 'PAYMENT NU...', 'REFERENCE N...', 'PAYMENT MO...', 'AMOUNT', 'UNUSED AMO...', 'STATUS']}
          emptyMessage=""
          rows={SAMPLE_PAYMENTS.length === 0 ? [] : SAMPLE_PAYMENTS.map((p, i) => (
            <tr key={i}><td colSpan={7} className="px-4 py-3">{p.number}</td></tr>
          ))}
        />
        {SAMPLE_PAYMENTS.length === 0 && (
          <p className="px-4 py-5 text-center text-sm text-gray-400">
            No payments have been received or recorded yet.{' '}
            <button className="text-blue-600 hover:underline">- Add New</button>
          </p>
        )}
      </TxSection>

      {/* ── Quotes ── */}
      <TxSection
        title="Quotes"
        statusFilter={quoteStatus}
        onStatusChange={setQuoteStatus}
        onNew={() => {}}
      >
        <TxTable
          headers={['DATE', 'QUOTE#', 'REFERENCE NUMBER', 'AMOUNT', 'STATUS']}
          emptyMessage="No quotes found."
          rows={filteredQuotes.map(q => (
            <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-600">{q.date}</td>
              <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">{q.number}</td>
              <td className="px-4 py-3 text-gray-600">{q.referenceNumber || '—'}</td>
              <td className="px-4 py-3 text-gray-800 font-medium">{fmt(q.amount)}</td>
              <td className={`px-4 py-3 text-sm ${STATUS_STYLES[q.status] ?? 'text-gray-500'}`}>{q.status}</td>
            </tr>
          ))}
        />
        {filteredQuotes.length > 0 && <Pagination total={filteredQuotes.length} />}
      </TxSection>

      {/* ── Sales Orders ── */}
      <TxSection title="Sales Orders" onNew={() => {}}>
        <TxTable
          headers={['DATE', 'SALES ORDER#', 'REFERENCE NUMBER', 'AMOUNT', 'STATUS']}
          emptyMessage="No sales orders found."
          rows={SAMPLE_SALES_ORDERS.map((o, i) => <tr key={i}><td colSpan={5}>{o.number}</td></tr>)}
        />
      </TxSection>

      {/* ── Credit Notes ── */}
      <TxSection title="Credit Notes" onNew={() => {}}>
        <TxTable
          headers={['DATE', 'CREDIT NOTE#', 'INVOICE#', 'AMOUNT', 'BALANCE', 'STATUS']}
          emptyMessage="No credit notes found."
          rows={SAMPLE_CREDIT_NOTES.map((c, i) => <tr key={i}><td colSpan={6}>{c.number}</td></tr>)}
        />
      </TxSection>

      {/* ── Delivery Notes ── */}
      <TxSection title="Delivery Notes" onNew={() => {}}>
        <TxTable
          headers={['DATE', 'DELIVERY NOTE#', 'ORDER#', 'STATUS']}
          emptyMessage="No delivery notes found."
          rows={SAMPLE_DELIVERY_NOTES.map((d, i) => <tr key={i}><td colSpan={4}>{d.number}</td></tr>)}
        />
      </TxSection>

    </div>
  )
}

export default Transactions
