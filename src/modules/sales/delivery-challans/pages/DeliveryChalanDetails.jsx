import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, Printer, FileText, MoreHorizontal, ChevronDown, RefreshCw } from 'lucide-react'

/* ── shared sample data ── */
const SAMPLE_CHALLANS = [
  {
    id: 1,
    number: 'DC-00001',
    status: 'Draft',
    customer: 'abc',
    companyName: 'amaltest',
    companyAddress: 'Kerala',
    companyCountry: 'India',
    companyEmail: 'amalvishnukvk2@gmail.com',
    challanDate: '15/09/2026',
    challanType: 'Supply of Liquid Gas',
    subTotal: 777,
    total: 777,
    totalInWords: 'Indian Rupee Seven Hundred Seventy-Seven Only',
    items: [
      { id: 1, name: 'bike', description: 'nbb', unit: 'box', qty: 1.0, rate: 777, amount: 777 },
    ],
  },
  {
    id: 2,
    number: 'DC-00002',
    status: 'Open',
    customer: 'Rahul Menon',
    companyName: 'amaltest',
    companyAddress: 'Kerala',
    companyCountry: 'India',
    companyEmail: 'amalvishnukvk2@gmail.com',
    challanDate: '16/09/2026',
    challanType: 'Job Work',
    subTotal: 5500,
    total: 5500,
    totalInWords: 'Indian Rupee Five Thousand Five Hundred Only',
    items: [
      { id: 1, name: 'Monitor Stand', description: '', unit: 'pcs', qty: 1.0, rate: 5500, amount: 5500 },
    ],
  },
]

const STATUS_STYLES = {
  Draft:  'bg-gray-100 text-gray-600',
  Open:   'bg-blue-100 text-blue-700',
  Closed: 'bg-green-100 text-green-700',
}

const TABS = ['Delivery Challan Details', 'Activity']
const VIEWS = ['Details', 'PDF']

function fmt(val) {
  return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start">
      <span className="w-44 shrink-0 text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value || '-'}</span>
    </div>
  )
}

/* ── Draft watermark ribbon (top-left corner) ── */
function DraftRibbon() {
  return (
    <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none">
      <div
        className="absolute -left-6 top-6 w-32 bg-gray-500 text-white text-xs font-bold text-center py-1 rotate-[-45deg] shadow"
        style={{ transformOrigin: 'center' }}
      >
        Draft
      </div>
    </div>
  )
}

function DeliveryChalanDetails() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const [activeTab,  setActiveTab]  = useState('Delivery Challan Details')
  const [activeView, setActiveView] = useState('Details')

  const challan = SAMPLE_CHALLANS.find(c => String(c.id) === String(id))

  if (!challan) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <FileText className="mb-4 h-12 w-12" />
        <p className="text-lg font-medium">Delivery Challan not found</p>
        <button
          onClick={() => navigate('/sales/delivery-challans')}
          className="mt-4 text-sm text-blue-500 hover:underline"
        >
          Back to Delivery Challans
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-white">

      {/* ── Action toolbar ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-4 py-2">

        <button
          onClick={() => navigate(`/sales/delivery-challans/${id}/edit`)}
          className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition"
        >
          <Pencil className="h-4 w-4" /> Edit
        </button>

        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <Printer className="h-4 w-4" /> PDF/Print
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition">
          <RefreshCw className="h-4 w-4" /> Convert to Open
        </button>

        <button className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* ── Tabs + Details / PDF toggle ── */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6">
        <div className="flex">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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

        {/* ── Details tab ── */}
        {activeTab === 'Delivery Challan Details' && activeView === 'Details' && (
          <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{challan.number}</h1>
              <span className={`rounded px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[challan.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {challan.status}
              </span>
            </div>

            {/* Meta grid */}
            <div className="mb-8 grid grid-cols-2 gap-x-12 gap-y-3">
              <InfoRow label="Challan Number" value={challan.number} />
              <InfoRow label="Challan Date"   value={challan.challanDate} />
              <InfoRow label="Challan Type"   value={challan.challanType} />
            </div>

            {/* Customer Details */}
            <div className="mb-8">
              <h2 className="mb-3 text-base font-semibold text-gray-900">Customer Details</h2>
              <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-44 shrink-0 text-sm text-gray-400">Deliver To</span>
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-400 text-xs font-bold text-white">
                      {challan.customer.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-blue-600">{challan.customer}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">Items</h2>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                  {challan.items.length}
                </span>
              </div>

              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-12">#</th>
                    <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Item &amp; Description</th>
                    <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-24">Qty</th>
                    <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-28">Rate</th>
                    <th className="py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-400 w-28">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {challan.items.map((item, i) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-blue-600">{item.name}</p>
                        {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                        {item.unit && <p className="text-xs text-gray-400">{item.unit}</p>}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">{item.qty.toFixed(2)}</td>
                      <td className="py-3 pr-4 text-gray-700">{item.rate.toFixed(2)}</td>
                      <td className="py-3 text-right font-medium text-gray-800">{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-4 flex justify-end">
                <div className="w-72 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Sub Total</span>
                    <span>{challan.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>{fmt(challan.total)}</span>
                  </div>
                  <div className="pt-1 text-xs text-gray-500">
                    <span className="font-medium text-gray-600">Total In Words: </span>
                    <span className="italic">{challan.totalInWords}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Authorized Signature */}
            <div className="mt-10 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">
                Authorized Signature{' '}
                <span className="inline-block w-40 border-b border-gray-400 ml-2" />
              </p>
            </div>

          </div>
        )}

        {/* ── PDF preview ── */}
        {activeTab === 'Delivery Challan Details' && activeView === 'PDF' && (
          <div className="mx-auto max-w-3xl">
            {/* PDF-style document */}
            <div className="relative rounded border border-gray-200 bg-white p-10 shadow-md overflow-hidden">
              {challan.status === 'Draft' && <DraftRibbon />}

              {/* Company + Title */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="font-bold text-gray-900">{challan.companyName}</p>
                  <p className="text-sm text-gray-500">{challan.companyAddress}</p>
                  <p className="text-sm text-gray-500">{challan.companyCountry}</p>
                  <p className="text-sm text-gray-500">{challan.companyEmail}</p>
                </div>
                <div className="text-right">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-wide">DELIVERY CHALLAN</h1>
                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    Delivery Challan# {challan.number}
                  </p>
                </div>
              </div>

              {/* Deliver To + Meta */}
              <div className="flex justify-between mb-8">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400 mb-1">Deliver To</p>
                  <p className="text-sm font-medium text-blue-600">{challan.customer}</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex justify-end gap-8 text-sm">
                    <span className="text-gray-500">Challan Date :</span>
                    <span className="text-gray-800 w-32 text-right">{challan.challanDate}</span>
                  </div>
                  <div className="flex justify-end gap-8 text-sm">
                    <span className="text-gray-500">Challan Type :</span>
                    <span className="text-gray-800 w-32 text-right">{challan.challanType}</span>
                  </div>
                </div>
              </div>

              {/* Items table */}
              <table className="w-full border-collapse text-sm mb-6">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="py-2 px-3 text-left w-10">#</th>
                    <th className="py-2 px-3 text-left">Item &amp; Description</th>
                    <th className="py-2 px-3 text-right w-20">Qty</th>
                    <th className="py-2 px-3 text-right w-24">Rate</th>
                    <th className="py-2 px-3 text-right w-24">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {challan.items.map((item, i) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3 px-3 text-gray-600">{i + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                        {item.unit && <p className="text-xs text-gray-400">{item.unit}</p>}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-700">
                        {item.qty.toFixed(2)}
                        {item.unit && <div className="text-xs text-gray-400">{item.unit}</div>}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-700">{item.rate.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-medium text-gray-800">{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-6">
                <div className="w-64 text-sm space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Sub Total</span>
                    <span>{challan.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between bg-gray-100 rounded px-2 py-1.5 font-bold text-gray-900">
                    <span>Total</span>
                    <span>{fmt(challan.total)}</span>
                  </div>
                  <div className="pt-1 text-xs text-gray-500 text-right">
                    <span className="font-medium">Total In Words: </span>
                    <span className="italic">{challan.totalInWords}</span>
                  </div>
                </div>
              </div>

              {/* Authorized Signature */}
              <div className="mt-10">
                <p className="text-sm text-gray-500">
                  Authorized Signature{' '}
                  <span className="inline-block w-40 border-b border-gray-500 ml-2" />
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Activity tab ── */}
        {activeTab === 'Activity' && (
          <div className="mx-auto max-w-2xl">
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 h-full w-0.5 bg-blue-200" />
              {[
                {
                  date: `${challan.challanDate} 10:00 AM`,
                  title: 'Delivery Challan created',
                  desc: `Delivery Challan ${challan.number} created`,
                  by: challan.companyName,
                },
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

export default DeliveryChalanDetails
