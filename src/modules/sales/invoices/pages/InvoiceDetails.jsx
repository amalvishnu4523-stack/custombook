import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, Send, Share2, Printer, CreditCard, MoreHorizontal, ChevronDown, Paperclip, MessageSquare, Settings } from 'lucide-react'

/* ── Sample data ── */
export const SAMPLE_INVOICES = [
  {
    id: 1, number: 'INV-000001', status: 'Draft',
    customer: 'Amal Vishnu', billingAddress: '', poNumber: '',
    invoiceDate: '01/08/2026', terms: 'Due on Receipt', dueDate: '01/08/2026',
    customerNotes: 'Thanks for your business.',
    subTotal: 18000, total: 18000, balanceDue: 18000, adjustment: 0,
    items: [{ id: 1, name: 'Wireless Mouse', description: '', unit: 'pcs', qty: 1, rate: 18000, amount: 18000 }],
  },
  {
    id: 2, number: 'INV-000002', status: 'Draft',
    customer: 'ddcompany', billingAddress: '', poNumber: 'hbj',
    invoiceDate: '02/09/2026', terms: 'Due on Receipt', dueDate: '02/09/2026',
    customerNotes: 'Thanks for your business.',
    subTotal: 777, total: 777, balanceDue: 777, adjustment: 0,
    items: [{ id: 1, name: 'bike', description: 'nbb', unit: 'box', qty: 1, rate: 777, amount: 777 }],
  },
  {
    id: 3, number: 'INV-000003', status: 'Unpaid',
    customer: 'Kiran Kumar', billingAddress: '', poNumber: '',
    invoiceDate: '08/08/2026', terms: 'Net 15', dueDate: '23/08/2026',
    customerNotes: 'Thanks for your business.',
    subTotal: 27000, total: 27000, balanceDue: 12000, adjustment: 0,
    items: [{ id: 1, name: 'Web Development', description: '', unit: 'hrs', qty: 18, rate: 1500, amount: 27000 }],
  },
  {
    id: 4, number: 'INV-000004', status: 'Overdue',
    customer: 'Rahul Menon', billingAddress: '', poNumber: '',
    invoiceDate: '20/07/2026', terms: 'Net 15', dueDate: '04/08/2026',
    customerNotes: 'Thanks for your business.',
    subTotal: 4400, total: 4400, balanceDue: 4400, adjustment: 0,
    items: [{ id: 1, name: 'SEO Audit', description: '', unit: 'hrs', qty: 2, rate: 2200, amount: 4400 }],
  },
  {
    id: 5, number: 'INV-000005', status: 'Unpaid',
    customer: 'Sneha Thomas', billingAddress: '', poNumber: '',
    invoiceDate: '15/08/2026', terms: 'Net 15', dueDate: '30/08/2026',
    customerNotes: 'Thanks for your business.',
    subTotal: 33000, total: 33000, balanceDue: 33000, adjustment: 0,
    items: [{ id: 1, name: 'Monitor Stand', description: '', unit: 'pcs', qty: 33, rate: 1000, amount: 33000 }],
  },
]

/* ── number to words (INR) ── */
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function numToWords(n) {
  if (n === 0) return 'Zero'
  if (n < 0) return 'Minus ' + numToWords(-n)
  if (n < 20) return ONES[n]
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '')
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '')
  if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '')
  if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '')
  return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '')
}

function toInrWords(amount) {
  const rupees = Math.floor(amount)
  const paise  = Math.round((amount - rupees) * 100)
  let words = 'Indian Rupee ' + numToWords(rupees)
  if (paise > 0) words += ' and ' + numToWords(paise) + ' Paise'
  return words + ' Only'
}

const STATUS_RIBBON = {
  Draft:   'bg-gray-500',
  Unpaid:  'bg-yellow-500',
  Paid:    'bg-green-600',
  Partial: 'bg-blue-500',
  Overdue: 'bg-red-500',
}

function fmt(val) {
  return Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })
}

function InvoiceDetails() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [sendOpen, setSendOpen] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)

  const invoice = SAMPLE_INVOICES.find(i => String(i.id) === String(id))

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-lg font-medium">Invoice not found</p>
        <button onClick={() => navigate('/sales/invoices')} className="mt-4 text-sm text-blue-500 hover:underline">
          Back to Invoices
        </button>
      </div>
    )
  }

  const orgUser  = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const orgName  = orgUser.name || orgUser.username || 'amaltest'
  const orgEmail = orgUser.username ? `${orgUser.username}@gmail.com` : 'info@example.com'

  const ribbonColor = STATUS_RIBBON[invoice.status] ?? 'bg-gray-500'

  return (
    <div className="flex min-h-full flex-col bg-gray-100">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <h1 className="text-lg font-bold text-gray-900">{invoice.number}</h1>
        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
            <Paperclip className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Action toolbar ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 bg-white px-4 py-2">
        <button onClick={() => navigate(`/sales/invoices/${id}/edit`)}
          className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <Pencil className="h-4 w-4" /> Edit
        </button>        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
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
          <CreditCard className="h-4 w-4" /> Record Payment
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* ── Invoice document ── */}
      <div className="mx-auto mb-10 mt-4 w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-md">

        {/* Customize button */}
        <div className="flex justify-end px-6 pt-4">
          <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition">
            <Settings className="h-3.5 w-3.5" />
            Customize
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        <div className="relative px-8 pb-10 pt-2">

          {/* Corner ribbon */}
          <div className="absolute left-0 top-0 h-24 w-24 overflow-hidden">
            <div className={`${ribbonColor} absolute -left-6 top-6 w-28 -rotate-45 py-1 text-center text-xs font-bold text-white shadow`}>
              {invoice.status}
            </div>
          </div>

          {/* Org info + TAX INVOICE */}
          <div className="mb-4 flex items-start justify-between">
            <div className="mt-6 text-sm leading-relaxed text-gray-600">
              <p className="font-semibold text-gray-800">{orgName}</p>
              <p>Kerala</p>
              <p>India</p>
              <p>{orgEmail}</p>
            </div>
            <h2 className="text-4xl font-black tracking-wide text-gray-800 mt-4">TAX INVOICE</h2>
          </div>

          {/* Invoice meta table */}
          <div className="mb-0 grid grid-cols-2 border border-gray-200">
            <div className="border-r border-gray-200 p-4 text-sm space-y-1">
              {[
                { label: '#',             value: invoice.number },
                { label: 'Invoice Date',  value: invoice.invoiceDate },
                { label: 'Terms',         value: invoice.terms },
                { label: 'Due Date',      value: invoice.dueDate },
                { label: 'P.O.#',        value: invoice.poNumber || '' },
              ].map(({ label, value }) => (
                <div key={label} className="flex">
                  <span className="w-28 shrink-0 text-gray-400">{label}</span>
                  <span className="font-medium text-gray-800">: {value || ''}</span>
                </div>
              ))}
            </div>
            <div className="p-4" />
          </div>

          {/* Bill To */}
          <div className="border border-t-0 border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">
              Bill To
            </div>
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-blue-600">{invoice.customer}</p>
              {invoice.billingAddress && <p className="text-sm text-gray-500">{invoice.billingAddress}</p>}
            </div>
          </div>

          {/* Items table */}
          <table className="w-full border-collapse border border-t-0 border-gray-200 text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-10 border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-600">#</th>
                <th className="border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-600">Item &amp; Description</th>
                <th className="w-20 border-r border-gray-200 px-4 py-3 text-right font-semibold text-gray-600">Qty</th>
                <th className="w-28 border-r border-gray-200 px-4 py-3 text-right font-semibold text-gray-600">Rate</th>
                <th className="w-28 px-4 py-3 text-right font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="border-r border-gray-200 px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="border-r border-gray-200 px-4 py-3">
                    <p className="text-gray-800">{item.name}</p>
                    {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                    {item.unit && <p className="text-xs text-gray-400">{item.unit}</p>}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-right text-gray-700">{Number(item.qty).toFixed(2)}</td>
                  <td className="border-r border-gray-200 px-4 py-3 text-right text-gray-700">{fmt(item.rate)}</td>
                  <td className="px-4 py-3 text-right text-gray-800">{fmt(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total in words + Totals */}
          <div className="grid grid-cols-2 border border-t-0 border-gray-200">

            {/* Left — total in words + notes */}
            <div className="border-r border-gray-200 p-4 text-sm">
              <p className="text-gray-500">Total In Words</p>
              <p className="mt-1 font-semibold text-gray-800 italic">{toInrWords(invoice.total)}</p>
              {invoice.customerNotes && (
                <div className="mt-4">
                  <p className="text-gray-500">Notes</p>
                  <p className="mt-1 text-gray-700">{invoice.customerNotes}</p>
                </div>
              )}
            </div>

            {/* Right — totals */}
            <div className="p-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>Sub Total</span>
                  <span>{fmt(invoice.subTotal)}</span>
                </div>
                {invoice.adjustment !== 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Adjustment</span>
                    <span>{fmt(invoice.adjustment)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{fmt(invoice.total)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Balance Due</span>
                  <span>₹{fmt(invoice.balanceDue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Authorized Signature */}
          <div className="flex justify-end border border-t-0 border-gray-200 px-6 py-8">
            <div className="text-right text-sm text-gray-500">
              <div className="mb-2 h-px w-48 border-t border-gray-400 ml-auto" />
              Authorized Signature
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default InvoiceDetails
