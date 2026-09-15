import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} 


from "recharts";




const cashFlowData = [
  { month: "Apr", year: "2026", incoming: 0, outgoing: 0, cash: 0 },
  { month: "May", year: "2026", incoming: 0, outgoing: 0, cash: 0 },
  { month: "Jun", year: "2026", incoming: 0, outgoing: 0, cash: 0 },
  { month: "Jul", year: "2026", incoming: 0, outgoing: 0, cash: 0 },
  { month: "Aug", year: "2026", incoming: 0, outgoing: 0, cash: 0 },
  { month: "Sep", year: "2026", incoming: 0, outgoing: 0, cash: 0 },
  { month: "Oct", year: "2026", incoming: 0, outgoing: 0, cash: 0 },
  { month: "Nov", year: "2026", incoming: 0, outgoing: 0, cash: 0 },
  { month: "Dec", year: "2026", incoming: 0, outgoing: 0, cash: 0 },
  { month: "Jan", year: "2027", incoming: 0, outgoing: 0, cash: 0 },
  { month: "Feb", year: "2027", incoming: 0, outgoing: 0, cash: 0 },
  { month: "Mar", year: "2027", incoming: 0, outgoing: 0, cash: 0 },
];

function CashflowGraph() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-slate-50/70 px-6">
        <h2 className="text-[20px] font-semibold text-slate-800">
          Cash Flow
        </h2>

        <button className="flex items-center gap-2 text-sm font-medium text-slate-700">
          This Fiscal Year
          <svg
            className="h-4 w-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m6 9 6 6 6-6"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex min-h-[380px] w-full px-5 py-7">
        {/* Chart */}
        <div className="min-w-0 flex-1">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={cashFlowData}
              margin={{
                top: 5,
                right: 15,
                left: 5,
                bottom: 10,
              }}
            >
              <CartesianGrid
                stroke="#dbe2ea"
                strokeDasharray="1 4"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={{
                  stroke: "#e2e8f0",
                }}
                tickLine={false}
                tick={{
                  fill: "#475569",
                  fontSize: 12,
                }}
                tickFormatter={(value, index) => {
                  const item = cashFlowData[index];

                  return `${value}\n${item.year}`;
                }}
              />

              <YAxis
                domain={[0, 5000]}
                ticks={[0, 1000, 2000, 3000, 4000, 5000]}
                axisLine={{
                  stroke: "#e2e8f0",
                }}
                tickLine={false}
                tick={{
                  fill: "#475569",
                  fontSize: 12,
                }}
                tickFormatter={(value) => {
                  if (value === 0) return "0";
                  return `${value / 1000} K`;
                }}
                width={55}
              />

              <Tooltip
                formatter={(value) => `₹${Number(value).toLocaleString()}`}
              />

              {/* Cash */}
              <Line
                type="monotone"
                dataKey="cash"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />

              {/* Incoming */}
              <Line
                type="monotone"
                dataKey="incoming"
                stroke="#22b573"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />

              {/* Outgoing */}
              <Line
                type="monotone"
                dataKey="outgoing"
                stroke="#d94b5c"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Right Summary */}
        <div className="flex w-[220px] flex-col justify-start gap-7 pt-2">
          {/* Opening Cash */}
          <div>
            <div className="flex items-center gap-2 text-[16px] text-slate-600">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-[#b8bbd1]" />
              Cash as on 01/04/2026
            </div>

            <p className="mt-1 text-right text-[18px] font-medium text-slate-900">
              ₹0.00
            </p>
          </div>

          {/* Incoming */}
          <div>
            <div className="flex items-center gap-2 text-[16px] text-slate-600">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-[#22b573]" />
              Incoming
            </div>

            <p className="mt-1 text-right text-[18px] font-medium text-slate-900">
              ₹0.00 <span className="text-slate-700">( + )</span>
            </p>
          </div>

          {/* Outgoing */}
          <div>
            <div className="flex items-center gap-2 text-[16px] text-slate-600">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-[#d94b5c]" />
              Outgoing
            </div>

            <p className="mt-1 text-right text-[18px] font-medium text-slate-900">
              ₹0.00 <span className="text-slate-700">( - )</span>
            </p>
          </div>

          {/* Closing Cash */}
          <div>
            <div className="flex items-center gap-2 text-[16px] text-slate-600">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-[#2563eb]" />
              Cash as on 31/03/2027
            </div>

            <p className="mt-1 text-right text-[18px] font-medium text-slate-900">
              ₹0.00 <span className="text-slate-700">( = )</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashflowGraph;