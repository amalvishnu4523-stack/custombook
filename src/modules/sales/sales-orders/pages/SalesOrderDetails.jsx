import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, Mail, Printer, CheckCircle, MoreHorizontal, ChevronDown, Paperclip, MessageSquare, X } from 'lucide-react'
import { SAMPLE_SALES_ORDERS } from './SalesOrderForm'

const STATUS_RIBBON = {
  Draft:     'bg-gray-500',
  Confirmed: 'bg-blue-600',
  Delivered: 'bg-green-600',
  Cancelled: 'bg-red-500',
}

function fmt(val) {
  return Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })
}

function SalesOrderDetails() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [showPDF, setShowPDF] = useState(true)

  const order = SAMPLE_SALES_ORDERS.find(o => String(o.id) === String(id))

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-lg font-medium">Sales Order not found</p>
        <button onClick={() => navigate('/sales/orders')} className="mt-4 text-sm text-blue-500 hover:underline">
          Back to Sales Orders
        </button>
      </div>
    )
  }

  const status   = order.status ?? 'Draft'
  const subTotal = order.items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0)
  const total    = subTotal + (Number(order.adjustment) || 0)

  const orgUser  = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const orgName  = orgUser.name || orgUser.username || 'amaltest'
  const orgEmail = orgUser.username ? `${orgUser.username}@gmail.com` : 'info@example.com'

  const ribbonColor = STATUS_RIBBON[status] ?? 'bg-gray-500'

  return (
    <div className="flex min-h-full flex-col bg-gray-100">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <h1 className="text-lg font-bold text-gray-900">{order.number}</h1>
        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
            <Paperclip className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
            <MessageSquare className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/sales/orders')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-red-400 hover:bg-gray-50 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Action toolbar ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 bg-white px-4 py-2">
        <button
          onClick={() => navigate(`/sales/orders/${id}/edit`)}
          className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition"
        >
          <Pencil className="h-4 w-4" /> Edit
        </button>
        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <Mail className="h-4 w-4" /> Send Email
        </button>
        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <Printer className="h-4 w-4" /> PDF/Print
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <CheckCircle className="h-4 w-4" /> Mark as Confirmed
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* ── Show PDF View toggle ── */}
      <div className="flex justify-end px-6 py-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm italic text-gray-600">
          Show PDF View
          <div
            onClick={() => setShowPDF(p => !p)}
            className={`relative h-6 w-11 rounded-full transition-colors ${showPDF ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${showPDF ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
        </label>
      </div>

      {/* ── Document ── */}
      {showPDF && (
        <div className="mx-auto mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-md">

          {/* Corner ribbon */}
          <div className="relative h-0">
            <div className="absolute left-0 top-0 h-20 w-20 overflow-hidden">
              <div className={`${ribbonColor} absolute -left-5 top-5 w-24 -rotate-45 py-1 text-center text-xs font-bold text-white shadow`}>
                {status}
              </div>
            </div>
          </div>

          <div className="px-10 py-10">

            {/* Org info + SALES ORDER heading */}
            <div className="mb-8 flex items-start justify-between">
              <div className="mt-6 text-sm leading-relaxed text-gray-600">
                <p className="font-semibold text-gray-800">{orgName}</p>
                <p>Kerala</p>
                <p>India</p>
                <p>{orgEmail}</p>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-black tracking-widest text-gray-800">SALES ORDER</h2>
                <p className="mt-1 text-sm font-semibold text-gray-700">
                  Sales Order# {order.number}
                </p>
              </div>
            </div>

            {/* Bill To + Order Date */}
            <div className="mb-6 flex items-end justify-between">
              <div className="text-sm">
                <p className="text-gray-500">Bill To</p>
                <p className="font-semibold text-blue-600">{order.customer}</p>
              </div>
              <div className="text-sm text-gray-500">
                Order Date :{' '}
                <span className="font-medium text-gray-800">
                  {new Date(order.orderDate).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>

            {/* Items table */}
            <table className="mb-4 w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="w-10 px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Item &amp; Description</th>
                  <th className="w-20 px-4 py-3 text-right font-semibold">Qty</th>
                  <th className="w-24 px-4 py-3 text-right font-semibold">Rate</th>
                  <th className="w-24 px-4 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{item.details || '—'}</p>
                      {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                      {item.unit && <p className="text-xs text-gray-400">{item.unit}</p>}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{Number(item.qty).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(item.rate)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      {fmt(Number(item.qty) * Number(item.rate))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 text-sm">
                <div className="flex justify-between py-2 text-gray-500">
                  <span>Sub Total</span>
                  <span>{fmt(subTotal)}</span>
                </div>
                <div className="flex justify-between rounded bg-gray-50 px-2 py-3 font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{fmt(total)}</span>
                </div>
              </div>
            </div>

            {/* Authorized Signature */}
            <div className="mt-12 text-sm text-gray-500">
              Authorized Signature{' '}
              <span className="ml-2 inline-block w-48 border-b border-gray-400" />
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default SalesOrderDetails
