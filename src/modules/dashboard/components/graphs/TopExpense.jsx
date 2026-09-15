import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const expenseData = [
  {
    name: "Purchase",
    value: 42000,
  },
  {
    name: "Salaries",
    value: 30000,
  },
  {
    name: "Rent",
    value: 18000,
  },
  {
    name: "Travel",
    value: 8500,
  },
  {
    name: "Utilities",
    value: 5500,
  },
];

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

function TopExpense() {
  const totalExpense = expenseData.reduce(
    (total, item) => total + item.value,
    0
  );

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex h-[58px] items-center justify-between border-b border-slate-200 bg-slate-50/70 px-6">
        <h2 className="text-[20px] font-medium text-slate-800">
          Top Expenses
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

      {/* Content */}
      <div className="grid min-h-[450px] grid-cols-1 items-center gap-5 px-6 py-8 md:grid-cols-2">
        {/* Donut Chart */}
        <div className="relative h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={85}
                outerRadius={125}
                paddingAngle={3}
                stroke="none"
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm text-slate-500">
              Total Expense
            </span>

            <span className="mt-1 text-xl font-semibold text-slate-800">
              ₹{totalExpense.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Expense List */}
        <div className="space-y-5">
          {expenseData.map((expense, index) => {
            const percentage = (
              (expense.value / totalExpense) *
              100
            ).toFixed(1);

            return (
              <div key={expense.name}>
                {/* Name + Amount */}
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-[3px]"
                      style={{
                        backgroundColor:
                          COLORS[index % COLORS.length],
                      }}
                    />

                    <span className="text-[15px] text-slate-600">
                      {expense.name}
                    </span>
                  </div>

                  <span className="text-[15px] font-medium text-slate-800">
                    ₹{expense.value.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Progress */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor:
                        COLORS[index % COLORS.length],
                    }}
                  />
                </div>

                <div className="mt-1 text-right text-xs text-slate-400">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-6 py-4">
        <p className="text-sm text-slate-400">
          * Expense values displayed are exclusive of taxes.
        </p>
      </div>
    </div>
  );
}

export default TopExpense;