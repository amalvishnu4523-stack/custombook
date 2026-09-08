import { useState } from 'react'
import { Calendar, ChevronDown, Printer, Download, Mail, Settings } from 'lucide-react'

const PERIODS = ['This Month', 'Last Month', 'This Quarter', 'This Year', 'Custom']
const FILTERS = ['All', 'Invoices', 'Payments', 'Credit Notes']

function fmt(val) {
  return `₹ ${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

function Statement({ customer }) {
  const [period, setPeriod]   = useState('This Month')
  const [filter, setFilter]   = useState('All')
  const [showPeriod, setShowPeriod] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  const companyName  = customer?.companyName  || customer?.displayName || 'Customer'
  const orgName      = JSON.parse(localStorage.getItem('currentUser') || '{}').username || 'amaltest'
  const orgEmail     = JSON.parse(localStorage.getItem('currentUser') || '{}').username
    ? `${JSON.parse(localStorage.getItem('currentUser') || '{}').username}@gmail.com`
    : 'info@example.com'

  const fromDate = '01/09/2026'
  const toDate   = '30/09/2026'

  const summary = {
    openingBalance:  0,
    invoicedAmount:  0,
    amountReceived:  0,
    balanceDue:      0,
  }

  const transactions = [
    { date: '01/09/2026', transaction: '***Opening Balance***', details: '', amount: 0, payments: null, balance: 0 },
  ]

  return (
    <div className="p-6">

      {/* ── Toolbar ── */}
      <div className="mb-6 flex items-center justify-between">

        {/* Left — period + filter */}
        <div className="flex items-center gap-3">

          {/* Period dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowPeriod(p => !p); setShowFilter(false) }}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <Calendar className="h-4 w-4 text-gray-400" />
              {period}
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
            {showPeriod && (
              <div className="absolute left-0 top-full z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white shadow-lg">
                {PERIODS.map(p => (
                  <button
                    key={p} onClick={() => { setPeriod(p); setShowPeriod(false) }}
                    className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-gray-50 ${period === p ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >{p}</button>
                ))}
              </div>
            )}
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowFilter(p => !p); setShowPeriod(false) }}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Filter By: <span className="font-medium">{filter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
            {showFilter && (
              <div className="absolute left-0 top-full z-20 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg">
                {FILTERS.map(f => (
                  <button
                    key={f} onClick={() => { setFilter(f); setShowFilter(false) }}
                    className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-gray-50 ${filter === f ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >{f}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition" title="Print">
            <Printer className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition" title="Download PDF">
            <Download className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition" title="More">
            <Settings className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
            <Mail className="h-4 w-4" />
            Send Email
          </button>
        </div>
      </div>

      {/* ── Title ── */}
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold text-gray-800">Customer Statement for {companyName}</h2>
        <p className="text-sm text-gray-400">From {fromDate} To {toDate}</p>
      </div>

      {/* ── Statement document ── */}
      <div className="relative rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

        {/* Customize button */}
        <div className="absolute right-6 top-5">
          <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition">
            <Settings className="h-3.5 w-3.5" />
            Customize
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Org address — top right */}
        <div className="mb-8 text-right text-sm text-gray-600 leading-relaxed">
          <p className="font-semibold">{orgName}</p>
          <p>Kerala</p>
          <p>India</p>
          <p>{orgEmail}</p>
        </div>

        {/* To + Statement heading — two columns */}
        <div className="flex items-start justify-between mb-6">

          {/* To */}
          <div className="text-sm">
            <p className="mb-1 text-gray-500">To</p>
            <p className="font-semibold text-blue-600">{companyName}</p>
          </div>

          {/* Statement of Accounts */}
          <div className="text-right">
            <h3 className="text-2xl font-bold text-gray-900">Statement of Accounts</h3>
            <div className="my-1 border-t border-gray-300" />
            <p className="text-sm text-gray-500">{fromDate} To {toDate}</p>
            <div className="my-1 border-t border-gray-300" />

            {/* Account Summary */}
            <div className="mt-3 w-72 text-sm">
              <div className="rounded-t bg-gray-100 px-3 py-2 text-left font-semibold text-gray-700">
                Account Summary
              </div>
              {[
                { label: 'Opening Balance',  value: summary.openingBalance },
                { label: 'Invoiced Amount',  value: summary.invoicedAmount },
                { label: 'Amount Received',  value: summary.amountReceived },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-gray-100 px-3 py-1.5">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-700">{fmt(value)}</span>
                </div>
              ))}
              <div className="flex justify-between px-3 py-2">
                <span className="font-medium text-gray-700">Balance Due</span>
                <span className="font-medium text-gray-800">{fmt(summary.balanceDue)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Transactions table */}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              {['Date', 'Transactions', 'Details', 'Amount', 'Payments', 'Balance'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-600">{tx.date}</td>
                <td className="px-4 py-3 text-gray-700">{tx.transaction}</td>
                <td className="px-4 py-3 text-gray-500">{tx.details || ''}</td>
                <td className="px-4 py-3 text-right text-gray-700">{tx.amount.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-gray-500">{tx.payments != null ? tx.payments.toFixed(2) : ''}</td>
                <td className="px-4 py-3 text-right text-gray-700">{tx.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200">
              <td colSpan={4} />
              <td className="px-4 py-3 text-right font-semibold text-gray-800">Balance Due</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-800">{fmt(summary.balanceDue)}</td>
            </tr>
          </tfoot>
        </table>

      </div>
    </div>
  )
}

export default Statement
