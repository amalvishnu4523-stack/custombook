import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, number: 'QT-001', customer: 'Amal Vishnu',  date: '2026-08-01', expiry: '2026-08-15', amount: 15000, status: 'Sent' },
  { id: 2, number: 'QT-002', customer: 'Priya Nair',   date: '2026-08-05', expiry: '2026-08-20', amount: 8200,  status: 'Draft' },
  { id: 3, number: 'QT-003', customer: 'Rahul Menon',  date: '2026-08-10', expiry: '2026-08-25', amount: 32000, status: 'Accepted' },
  { id: 4, number: 'QT-004', customer: 'Sneha Thomas', date: '2026-08-12', expiry: '2026-08-27', amount: 5500,  status: 'Expired' },
]

const STATUS_STYLES = {
  Draft:    'bg-gray-100 text-gray-600',
  Sent:     'bg-blue-100 text-blue-700',
  Accepted: 'bg-green-100 text-green-700',
  Expired:  'bg-red-100 text-red-600',
}

const COLUMNS = [
  { key: 'number',   header: 'Quote #',     minWidth: 120 },
  { key: 'customer', header: 'Customer',    minWidth: 180 },
  { key: 'date',     header: 'Date',        minWidth: 120 },
  { key: 'expiry',   header: 'Expiry',      minWidth: 120 },
  { key: 'amount',   header: 'Amount (₹)',  minWidth: 140, align: 'right', render: (val) => `₹${val.toLocaleString('en-IN')}` },
  {
    key: 'status', header: 'Status', minWidth: 110,
    render: (val) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[val]}`}>{val}</span>
    ),
  },
]

function Quotes() {
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  return (
    <DataTable
      title="Quotes"
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New Quote"
      onNew={() => navigate('/sales/quotes/new')}
      onRowClick={(row) => navigate(`/sales/quotes/${row.id}/edit`)}
      showSearch={false}
      showFilter={false}
      selectable
      selectedRows={selected}
      onSelectAll={() => setSelected(selected.length === SAMPLE.length ? [] : SAMPLE.map(r => r.id))}
      onSelectRow={(key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
    />
  )
}

export default Quotes
