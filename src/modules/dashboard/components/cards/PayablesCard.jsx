import React from "react";

function PayablesCard() {
  const totalUnpaid = 0;
  const current = 0;
  const overdue = 0;

  const overduePercentage =
    totalUnpaid > 0 ? (overdue / totalUnpaid) * 100 : 0;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex h-[58px] items-center justify-between border-b border-slate-200 bg-slate-50/70 px-5">
        <h2 className="text-[20px] font-medium text-slate-800">
          Total Payables
        </h2>

        <button className="flex items-center gap-1.5 text-[16px] text-slate-800 transition hover:text-blue-600">
          <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-blue-500 text-[13px] font-bold leading-none text-white">
            +
          </span>
          New
        </button>
      </div>

      {/* Content */}
      <div className="px-[18px] py-5">
        {/* Total unpaid bills */}
        <p className="text-[16px] text-slate-600">
          Total Unpaid Bills
        </p>

        <p className="mt-1 text-[23px] font-medium text-slate-900">
          ₹
          {totalUnpaid.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </p>

        {/* Progress bar */}
        <div className="mt-5 h-[14px] w-full overflow-hidden bg-slate-100">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{
              width: `${overduePercentage}%`,
            }}
          />
        </div>

        {/* Current / Overdue */}
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[18px]">
          {/* Current */}
          <div className="flex items-center gap-1.5">
            <span className="h-[11px] w-[11px] rounded-[3px] bg-blue-600" />

            <span className="text-slate-600">
              Current :
            </span>

            <span className="font-medium text-slate-900">
              ₹
              {current.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Overdue */}
          <div className="flex items-center gap-1.5">
            <span className="h-[11px] w-[11px] rounded-[3px] bg-orange-500" />

            <span className="text-slate-600">
              Overdue :
            </span>

            <span className="font-medium text-slate-900">
              ₹
              {overdue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>

            <span className="text-[13px] text-slate-900">
              ▼
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayablesCard;