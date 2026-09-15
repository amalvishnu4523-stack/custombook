import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const incomeExpenseData = [
  { month: "Apr", year: "2026", income: 0, expense: 0 },
  { month: "May", year: "2026", income: 0, expense: 0 },
  { month: "Jun", year: "2026", income: 0, expense: 0 },
  { month: "Jul", year: "2026", income: 0, expense: 0 },
  { month: "Aug", year: "2026", income: 0, expense: 0 },
  { month: "Sep", year: "2026", income: 0, expense: 0 },
  { month: "Oct", year: "2026", income: 0, expense: 0 },
  { month: "Nov", year: "2026", income: 0, expense: 0 },
  { month: "Dec", year: "2026", income: 0, expense: 0 },
  { month: "Jan", year: "2027", income: 0, expense: 0 },
  { month: "Feb", year: "2027", income: 0, expense: 0 },
  { month: "Mar", year: "2027", income: 0, expense: 0 },
];

function IncomeExpenseGraph() {
  const [mode, setMode] = useState("Cash");

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex h-[58px] items-center justify-between border-b border-slate-200 bg-slate-50/70 px-6">
        <h2 className="text-[20px] font-medium text-slate-800 underline decoration-dotted underline-offset-8">
          Income and Expense
        </h2>

        <button className="flex items-center gap-2 text-[16px] text-slate-800">
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
              strokeWidth="2"
              d="m6 9 6 6 6-6"
            />
          </svg>
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-start justify-between px-5 pt-6">
        <div className="flex gap-8">
          {/* Income */}
          <div>
            <div className="flex items-center gap-1.5 text-[16px] text-slate-500">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-[#20b779]" />
              Total Income
            </div>

            <p className="mt-1 text-[19px] text-slate-900">
              ₹0.00
            </p>
          </div>

          {/* Expense */}
          <div>
            <div className="flex items-center gap-1.5 text-[16px] text-slate-500">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-[#d94b5c]" />
              Total Expenses
            </div>

            <p className="mt-1 text-[19px] text-slate-900">
              ₹0.00
            </p>
          </div>
        </div>

        {/* Accrual / Cash */}
        <div className="flex overflow-hidden rounded border border-slate-300">
          <button
            onClick={() => setMode("Accrual")}
            className={`px-2 py-1 text-sm transition ${
              mode === "Accrual"
                ? "bg-white text-slate-900"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Accrual
          </button>

          <button
            onClick={() => setMode("Cash")}
            className={`border-l border-slate-300 px-2 py-1 text-sm transition ${
              mode === "Cash"
                ? "bg-slate-200 text-slate-900"
                : "bg-white text-slate-600"
            }`}
          >
            Cash
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 px-5">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={incomeExpenseData}
            margin={{
              top: 5,
              right: 15,
              left: 5,
              bottom: 15,
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
                fontSize: 11,
              }}
            />

            <YAxis
              domain={[0, 5000]}
              ticks={[0, 1000, 2000, 3000, 4000, 5000]}
              axisLine={false}
              tickLine={false}
              width={35}
              tick={{
                fill: "#475569",
                fontSize: 11,
              }}
              tickFormatter={(value) =>
                value === 0 ? "0" : `${value / 1000} K`
              }
            />

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />

            {/* Income */}
            <Line
              type="monotone"
              dataKey="income"
              stroke="#20b779"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />

            {/* Expense */}
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#d94b5c"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Note */}
      <div className="px-6 pb-20 pt-7 text-[14px] text-slate-500">
        * Income and expense values displayed are exclusive of taxes.
      </div>
    </div>
  );
}

export default IncomeExpenseGraph;