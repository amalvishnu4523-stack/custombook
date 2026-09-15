import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, profile: 'Monthly Retainer', customer: 'Amal Vishnu',  frequency: 'Monthly', nextDate: '2026-09-01', amount: 15000, status: 'Active' },
  { id: 2, profile: 'Weekly Support',   customer: 'Priya Nair',   frequency: 'Weekly',  nextDate: '2026-09-03', amount: 3500,  status: 'Active' },
  { id: 3, profile: 'Annual License',   customer: 'Kiran Kumar',  frequency: 'Yearly',  nextDate: '2027-01-01', amount: 60000, status: 'Active' },
  { id: 4, profile: 'Hosting Plan',     customer: 'Rahul Menon',  frequency: 'Monthly', nextDate: '2026-09-10', amount: 999,   status: 'Stopped' },
]

const COLUMNS = [
  { key: 'profile',   header: 'Profile Name', minWidth: 180 },   
  { key: 'customer',  header: 'Customer',     minWidth: 180 },
  { key: 'frequency', header: 'Frequency',    minWidth: 120 },
  { key: 'nextDate',  header: 'Next Invoice', minWidth: 140 },
  { key: 'amount',    header: 'Amount (₹)',   minWidth: 140, align: 'right', render: (val) => `₹${val.toLocaleString('en-IN')}` },
  {
    key: 'status', header: 'Status', minWidth: 110,
    render: (val) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        val === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}>{val}</span>
    ),
  },
]

function RecurringInvoices() {
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  return (
    <DataTable
      title="Recurring Invoices"
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New Profile"
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
