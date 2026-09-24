import React from 'react'

function ReceivablesCard({ totalUnpaid = 4589, overdue = 4589, current = 0 }) {

  const overduePct = totalUnpaid > 0 ? (overdue / totalUnpaid) * 100 : 0

  const fmt = (val) =>
    `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800 tracking-tight">Total Receivables</h2>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold leading-none shadow-sm">
            +
          </span>
          New
        </button>
      </div>

      {/* Body */}
      <div className="px-5 pt-4 pb-5 space-y-3">

        {/* Label + Amount */}
        <div>
          <p className="text-xs font-medium text-blue-500 mb-1">Total Unpaid Invoices</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{fmt(totalUnpaid)}</p>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          {/* Current (blue) */}
          <div
            className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${totalUnpaid > 0 ? (current / totalUnpaid) * 100 : 0}%` }}
          />
          {/* Overdue (green) stacked after current */}
          <div
            className="absolute top-0 h-full bg-green-500 transition-all duration-300"
            style={{
              left:  `${totalUnpaid > 0 ? (current / totalUnpaid) * 100 : 0}%`,
              width: `${overduePct}%`,
            }}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 pt-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-500 shrink-0" />
            <span>Current :</span>
            <span className="font-semibold text-gray-800">{fmt(current)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2.5 w-2.5 rounded-sm bg-green-500 shrink-0" />
            <span>Overdue :</span>
            <span className="font-semibold text-gray-800">{fmt(overdue)}</span>
            <button className="text-gray-400 hover:text-gray-600 transition text-[10px]">▼</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ReceivablesCard
