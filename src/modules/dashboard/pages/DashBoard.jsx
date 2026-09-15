import ReceivablesCard  from '../components/cards/ReceivablesCard'
import PayablesCard     from '../components/cards/PayablesCard'
import CashflowGraph    from '../components/graphs/CashflowGraph'
import IncomeExpenseGraph from '../components/graphs/IncomeExpenseGraph'
import TopExpense       from '../components/graphs/TopExpense'

function DashBoard() {
  return (
    <div className="min-h-full bg-slate-50 p-6 space-y-6">

      {/* ── Row 1: Receivables + Payables ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReceivablesCard />
        <PayablesCard />
      </div>

      {/* ── Row 2: Cash Flow (full width) ── */}
      <CashflowGraph />

      {/* ── Row 3: Income & Expense + Top Expenses ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <IncomeExpenseGraph />
        <TopExpense />
      </div>

    </div>
  )
}

export default DashBoard
