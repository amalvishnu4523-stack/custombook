import { useState } from 'react'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, number: 'CN-001', customer: 'Amal Vishnu',  date: '2026-08-07', invoice: 'INV-001', amount: 2000,  balance: 2000,  status: 'Open' },
  { id: 2, number: 'CN-002', customer: 'Kiran Kumar',  date: '2026-08-14', invoice: 'INV-003', amount: 5000,  balance: 0,     status: 'Closed' },
  { id: 3, number: 'CN-003', customer: 'Sneha Thomas', date: '2026-08-19', invoice: 'INV-005', amount: 1500,  balance: 1500,  status: 'Open' },
]

const COLUMNS = [
  { key: 'number',   header: 'Credit Note #', minWidth: 140 },
  { key: 'customer', header: 'Customer',      minWidth: 180 },
  { key: 'date',     header: 'Date',          minWidth: 120 },
  { key: 'invoice',  header: 'Invoice',       minWidth: 130 },
  { key: 'amount',   header: 'Amount (₹)',    minWidth: 140, align: 'right', render: (val) => `₹${val.toLocaleString('en-IN')}` },
  { key: 'balance',  header: 'Balance (₹)',   minWidth: 140, align: 'right', render: (val) => `₹${val.toLocaleString('en-IN')}` },
  {
    key: 'status', header: 'Status', minWidth: 100,
    render: (val) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        val === 'Open' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
      }`}>{val}</span>
    ),
  },
]

function CreditNotes() {
  const [selected, setSelected] = useState([])

  return (
    <DataTable
      title="Credit Notes"
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New Credit Note"
      onNew={() => {}}
      showSearch={false}
      showFilter={false}
      selectable
      selectedRows={selected}
      onSelectAll={() => setSelected(selected.length === SAMPLE.length ? [] : SAMPLE.map(r => r.id))}
      onSelectRow={(key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
    />
  )
}

export default CreditNotes
