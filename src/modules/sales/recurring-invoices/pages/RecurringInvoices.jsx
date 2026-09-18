import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, customer: 'abc', profile: 'amal', frequency: 'Weekly', lastInvoiceDate: '15/09/2026', nextInvoiceDate: '22/09/2026', status: 'Active', amount: 777 },
]

const fmtAmt = (val) =>
  `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

const COLUMNS = [
  {
    key: 'customer', header: 'Customer Name', minWidth: 180,
    render: (val) => <span className="text-gray-700">{val}</span>,
  },
  {
    key: 'profile', header: 'Profile Name', minWidth: 180,
    render: (val) => <span className="font-medium text-blue-600">{val}</span>,
  },
  {
    key: 'frequency', header: 'Frequency', minWidth: 130,
    render: (val) => <span className="text-gray-700">{val}</span>,
  },
  {
    key: 'lastInvoiceDate', header: 'Last Invoice Date', minWidth: 160,
    render: (val) => <span className="text-gray-700">{val}</span>,
  },
  {
    key: 'nextInvoiceDate', header: 'Next Invoice Date', minWidth: 160,
    render: (val) => <span className="text-gray-700">{val}</span>,
  },
  {
    key: 'status', header: 'Status', minWidth: 110,
    render: (val) => (
      <span className={`text-xs font-semibold uppercase tracking-wide ${
        val === 'Active' ? 'text-green-600' : 'text-gray-400'
      }`}>{val}</span>
    ),
  },
  {
    key: 'amount', header: 'Amount', minWidth: 130, align: 'right',
    render: (val) => <span className="text-gray-800">{fmtAmt(val)}</span>,
  },
]

function RecurringInvoices() {
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  return (
    <DataTable
      title="All Recurring Invoices"
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New"
      onNew={() => navigate('/sales/recurring-invoices/new')}
      onRowClick={(row) => navigate(`/sales/recurring-invoices/${row.id}`)}
      showSearch={false}
      showFilter={false}
      selectable
      selectedRows={selected}
      onSelectAll={() => setSelected(selected.length === SAMPLE.length ? [] : SAMPLE.map(r => r.id))}
      onSelectRow={(key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
    />
  )
}

export default RecurringInvoices
