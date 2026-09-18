import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, Printer, CheckCircle, MoreHorizontal, ChevronDown, CreditCard } from 'lucide-react'

/* ── Sample data ── */
const SAMPLE = [
  {
    id: 1,
    number: 'PR-001',
    status: 'Draft',
    customer: 'abc',
    companyName: 'amaltest',
    companyAddress: 'Kerala',
    companyCountry: 'India',
    companyEmail: 'amalvishnukvk2@gmail.com',
    paymentDate: '16/09/2026',
    referenceNumber: '',
    paymentMode: 'Cash',
    amountReceived: 45,
    amountInWords: 'Indian Rupee Forty-Five Only',
    invoices: [
      { id: 1, invoiceNumber: 'Customer opening balance', invoiceDate: '01/09/2026', invoiceAmount: 4589, paymentAmount: 45 },
    ],
  },
  {
    id: 2,
    number: 'PR-002',
    status: 'Paid',
    customer: 'Kiran Kumar',
    companyName: 'amaltest',
    companyAddress: 'Kerala',
    companyCountry: 'India',
    companyEmail: 'amalvishnukvk2@gmail.com',
    paymentDate: '12/08/2026',
    referenceNumber: 'REF-005',
    paymentMode: 'UPI',
    amountReceived: 15000,
    amountInWords: 'Indian Rupee Fifteen Thousand Only',
    invoices: [
      { id: 1, invoiceNumber: 'INV-003', invoiceDate: '10/08/2026', invoiceAmount: 15000, paymentAmount: 15000 },
    ],
  },
  {
    id: 3,
    number: 'PR-003',
    status: 'Paid',
    customer: 'Amal Vishnu',
    companyName: 'amaltest',
    companyAddress: 'Kerala',
    companyCountry: 'India',
    companyEmail: 'amalvishnukvk2@gmail.com',
    paymentDate: '20/08/2026',
    referenceNumber: 'CHQ-112',
    paymentMode: 'Cheque',
    amountReceived: 5000,
    amountInWords: 'Indian Rupee Five Thousand Only',
    invoices: [
      { id: 1, invoiceNumber: 'INV-001', invoiceDate: '01/08/2026', invoiceAmount: 5000, paymentAmount: 5000 },
    ],
  },
]

const STATUS_STYLES = {
  Draft: 'bg-gray-100 text-gray-600',
  Paid:  'bg-green-100 text-green-700',
  Void:  'bg-red-100  text-red-700',
}

const TABS  = ['Payment Receipt Details', 'Activity']
const VIEWS = ['Details', 'PDF']

function fmt(val) {
  return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

/* ── Draft ribbon ── */
function DraftRibbon() {
  return (
    <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none">
      <div
        className="absolute -left-6 top-6 w-32 bg-gray-500 text-white text-xs font-bold text-center py-1 shadow"
        style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
      >
        Draft
      </div>
    </div>
  )
}

function PaymentReceivedDetails() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [activeTab,  setActiveTab]  = useState('Payment Receipt Details')
  const [activeView, setActiveView] = useState('PDF')       // default: PDF view (matches screenshot)
  const [markedPaid, setMarkedPaid] = useState(false)

  const payment = SAMPLE.find(p => String(p.id) === String(id))

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <CreditCard className="mb-4 h-12 w-12" />
        <p className="text-lg font-medium">Payment not found</p>
        <button
          onClick={() => navigate('/sales/payments-received')}
          className="mt-4 text-sm text-blue-500 hover:underline"
        >
          Back to Payments Received
        </button>
      </div>
    )
  }

  const isDraft  = payment.status === 'Draft' && !markedPaid
  const isPaid   = payment.status === 'Paid'  || markedPaid

  return (
    <div className="flex min-h-full flex-col bg-white">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-4 py-2">
        <button
          onClick={() => navigate(`/sales/payments-received/${id}/edit`)}
          className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition"
        >
          <Pencil className="h-4 w-4" /> Edit
        </button>

        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <Printer className="h-4 w-4" /> PDF/Print
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => setMarkedPaid(true)}
          className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition"
        >
          <CheckCircle className="h-4 w-4" /> Mark as Paid
        </button>

        <button className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* ── Tabs + View toggle ── */}
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
        {activeTab === 'Payment Receipt Details' && activeView === 'Details' && (
          <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

            {/* Title + status */}
            <div className="mb-6 flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{payment.number}</h1>
              <span className={`rounded px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[isPaid ? 'Paid' : payment.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {isPaid ? 'Paid' : payment.status}
              </span>
            </div>

            {/* Payment info grid */}
            <div className="mb-8 grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
              <InfoRow label="Payment Date"        value={payment.paymentDate} />
              <InfoRow label="Reference Number"    value={payment.referenceNumber || '—'} />
              <InfoRow label="Payment Mode"        value={payment.paymentMode} />
              <InfoRow label="Amount Received"     value={fmt(payment.amountReceived)} />
              <InfoRow label="Amount In Words"     value={payment.amountInWords} />
            </div>

            {/* Received From */}
            <div className="mb-8">
              <h2 className="mb-3 text-base font-semibold text-gray-900">Received From</h2>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-400 text-xs font-bold text-white">
                  {payment.customer.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-blue-600">{payment.customer}</span>
              </div>
            </div>

            {/* Payment for */}
            <div>
              <h2 className="mb-3 text-base font-semibold text-gray-900">Payment for</h2>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="py-2 px-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Invoice Number</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Invoice Date</th>
                    <th className="py-2 px-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Invoice Amount</th>
                    <th className="py-2 px-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Payment Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payment.invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-gray-100">
                      <td className="py-3 px-3 text-blue-600">{inv.invoiceNumber}</td>
                      <td className="py-3 px-3 text-gray-700">{inv.invoiceDate}</td>
                      <td className="py-3 px-3 text-right text-gray-700">{fmt(inv.invoiceAmount)}</td>
                      <td className="py-3 px-3 text-right font-medium text-gray-800">{fmt(inv.paymentAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ───── PDF view ───── */}
        {activeTab === 'Payment Receipt Details' && activeView === 'PDF' && (
          <div className="mx-auto max-w-3xl space-y-0">

            {/* "What's next" banner — only when Draft */}
            {isDraft && (
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <span className="text-purple-500 text-lg">✦</span>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">WHAT'S NEXT?</span>{' '}
                  Mark the payment as Paid to confirm that it has been received.
                </p>
                <button
                  onClick={() => setMarkedPaid(true)}
                  className="ml-auto shrink-0 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
                >
                  Mark as Paid
                </button>
              </div>
            )}

            {/* Receipt document */}
            <div className="relative overflow-hidden rounded border border-gray-200 bg-white px-10 pb-10 pt-10 shadow-md">
              {isDraft && <DraftRibbon />}

              {/* Company block */}
              <div className="mb-8">
                <p className="font-bold text-gray-900">{payment.companyName}</p>
                <p className="text-sm text-gray-500">{payment.companyAddress}</p>
                <p className="text-sm text-gray-500">{payment.companyCountry}</p>
                <p className="text-sm text-gray-500">{payment.companyEmail}</p>
              </div>

              <hr className="mb-8 border-gray-200" />

              {/* Title */}
              <h1 className="mb-10 text-center text-2xl font-semibold tracking-widest text-gray-800 uppercase">
                Payment Receipt
              </h1>

              {/* Receipt body: left details + right amount card */}
              <div className="flex gap-8">

                {/* Left — payment fields */}
                <div className="flex-1 space-y-5">
                  <ReceiptRow label="Payment Date"     value={<span className="font-bold">{payment.paymentDate}</span>} />
                  <hr className="border-gray-100" />
                  <ReceiptRow label="Reference Number" value={payment.referenceNumber || ''} />
                  <hr className="border-gray-100" />
                  <ReceiptRow label="Payment Mode"     value={<span className="font-bold">{payment.paymentMode}</span>} />
                  <hr className="border-gray-100" />
                  <ReceiptRow
                    label={<span className="leading-tight">Amount Received In<br />Words</span>}
                    value={<span className="font-bold">{payment.amountInWords}</span>}
                  />
                </div>

                {/* Right — green amount card */}
                <div className="flex shrink-0 flex-col items-center justify-center rounded-lg bg-green-600 px-8 py-6 text-white shadow">
                  <p className="text-sm font-medium opacity-90">Amount Received</p>
                  <p className="mt-2 text-2xl font-bold">{fmt(payment.amountReceived)}</p>
                </div>

              </div>

              {/* Received From + Authorized Signature */}
              <div className="mt-12 flex justify-between items-start">
                <div>
                  <p className="mb-2 text-sm font-semibold text-gray-600">Received From</p>
                  <p className="text-sm font-medium text-blue-600">{payment.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-4">Authorized Signature</p>
                  <div className="w-40 border-b border-gray-400" />
                </div>
              </div>
            </div>

            {/* Payment for table (below the receipt) */}
            <div className="rounded border border-t-0 border-gray-200 bg-white px-10 pb-8 pt-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-gray-900">Payment for</h2>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2.5 px-3 text-left text-sm font-medium text-gray-500 border-b border-gray-200">Invoice Number</th>
                    <th className="py-2.5 px-3 text-left text-sm font-medium text-gray-500 border-b border-gray-200">Invoice Date</th>
                    <th className="py-2.5 px-3 text-right text-sm font-medium text-gray-500 border-b border-gray-200">Invoice Amount</th>
                    <th className="py-2.5 px-3 text-right text-sm font-medium text-gray-500 border-b border-gray-200">Payment Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payment.invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-gray-100">
                      <td className="py-3 px-3 text-gray-700">{inv.invoiceNumber}</td>
                      <td className="py-3 px-3 text-gray-700">{inv.invoiceDate}</td>
                      <td className="py-3 px-3 text-right text-gray-700">{fmt(inv.invoiceAmount)}</td>
                      <td className="py-3 px-3 text-right text-gray-700">{fmt(inv.paymentAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ───── Activity tab ───── */}
        {activeTab === 'Activity' && (
          <div className="mx-auto max-w-2xl">
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 h-full w-0.5 bg-blue-200" />
              {[
                {
                  date: payment.paymentDate,
                  time: '10:00 AM',
                  title: 'Payment received',
                  desc: `Payment ${payment.number} recorded`,
                  by: payment.companyName,
                },
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

/* ── Small helpers ── */
function InfoRow({ label, value }) {
  return (
    <div className="flex items-start">
      <span className="w-48 shrink-0 text-gray-400">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  )
}

function ReceiptRow({ label, value }) {
  return (
    <div className="flex items-start gap-6">
      <span className="w-44 shrink-0 text-sm text-gray-400">{label}</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  )
}

export default PaymentReceivedDetails
