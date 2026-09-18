import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, number: 'INV-000003', orderNumber: '',    customer: 'abc',       date: '15/09/2026', dueDate: '15/09/2026', amount: 777,  balance: 777,  status: 'Draft' },
  { id: 2, number: 'INV-000002', orderNumber: 'hbj', customer: 'ddcompany', date: '02/09/2026', dueDate: '02/09/2026', amount: 777,  balance: 777,  status: 'Draft' },
  { id: 3, number: 'INV-000001', orderNumber: '',    customer: 'abc',       date: '02/09/2026', dueDate: '02/09/2026', amount: 10,   balance: 10,   status: 'Draft' },
]

const fmtAmt = (val) =>
  `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

const COLUMNS = [
  {
    key: 'date', header: 'Date', minWidth: 130,
    render: (val) => <span className="text-gray-700">{val}</span>,
  },
  {
    key: 'number', header: 'Invoice#', minWidth: 160,
    render: (val) => <span className="font-medium text-blue-600">{val}</span>,
  },
  {
    key: 'orderNumber', header: 'Order Number', minWidth: 150,
    render: (val) => <span className="text-gray-700">{val || ''}</span>,
  },
  {
    key: 'customer', header: 'Customer Name', minWidth: 180,
    render: (val) => <span className="text-gray-700">{val}</span>,
  },
  {
    key: 'status', header: 'Status', minWidth: 110,
    render: (val) => (
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{val}</span>
    ),
  },
  {
    key: 'dueDate', header: 'Due Date', minWidth: 130,
    render: (val) => <span className="text-gray-700">{val}</span>,
  },
  {
    key: 'amount', header: 'Amount', minWidth: 120, align: 'right',
    render: (val) => <span className="text-gray-800">{fmtAmt(val)}</span>,
  },
  {
    key: 'balance', header: 'Balance Due', minWidth: 130, align: 'right',
    render: (val) => <span className="text-gray-800">{fmtAmt(val)}</span>,
  },
]

function Invoices() {
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  return (
    <DataTable
      title="All Invoices"
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New"
      onNew={() => navigate('/sales/invoices/new')}
      onRowClick={(row) => navigate(`/sales/invoices/${row.id}`)}
      showSearch={false}
      showFilter={false}
      selectable
      selectedRows={selected}
      onSelectAll={() => setSelected(selected.length === SAMPLE.length ? [] : SAMPLE.map(r => r.id))}
      onSelectRow={(key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
    />
  )
}

export default Invoices
