import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, number: 'INV-001', customer: 'Amal Vishnu',  date: '2026-08-01', due: '2026-08-16', amount: 18000, balance: 18000, status: 'Unpaid'  },
  { id: 2, number: 'INV-002', customer: 'Priya Nair',   date: '2026-08-03', due: '2026-08-18', amount: 9500,  balance: 0,     status: 'Paid'    },
  { id: 3, number: 'INV-003', customer: 'Kiran Kumar',  date: '2026-08-08', due: '2026-08-23', amount: 27000, balance: 12000, status: 'Partial' },
  { id: 4, number: 'INV-004', customer: 'Rahul Menon',  date: '2026-07-20', due: '2026-08-04', amount: 4400,  balance: 4400,  status: 'Overdue' },
  { id: 5, number: 'INV-005', customer: 'Sneha Thomas', date: '2026-08-15', due: '2026-08-30', amount: 33000, balance: 33000, status: 'Unpaid'  },
]

const STATUS_STYLES = {
  Unpaid:  'bg-yellow-100 text-yellow-700',
  Paid:    'bg-green-100 text-green-700',
  Partial: 'bg-blue-100 text-blue-700',
  Overdue: 'bg-red-100 text-red-600',
}

const COLUMNS = [
  { key: 'number',   header: 'Invoice #',    minWidth: 130 },
  { key: 'customer', header: 'Customer',     minWidth: 180 },
  { key: 'date',     header: 'Invoice Date', minWidth: 130 },
  { key: 'due',      header: 'Due Date',     minWidth: 120 },
  { key: 'amount',   header: 'Amount (₹)',   minWidth: 140, align: 'right', render: (val) => `₹${val.toLocaleString('en-IN')}` },
  { key: 'balance',  header: 'Balance (₹)',  minWidth: 140, align: 'right', render: (val) => `₹${val.toLocaleString('en-IN')}` },
  {
    key: 'status', header: 'Status', minWidth: 110,
    render: (val) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[val]}`}>{val}</span>
    ),
  },
]

function Invoices() {
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  return (
    <DataTable
      title="Invoices"
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New Invoice"
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
