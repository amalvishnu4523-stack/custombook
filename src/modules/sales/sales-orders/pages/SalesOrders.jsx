import { useState } from 'react'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, number: 'SO-001', customer: 'Amal Vishnu',  date: '2026-08-02', delivery: '2026-08-10', amount: 24000, status: 'Confirmed' },
  { id: 2, number: 'SO-002', customer: 'Kiran Kumar',  date: '2026-08-06', delivery: '2026-08-14', amount: 11500, status: 'Draft' },
  { id: 3, number: 'SO-003', customer: 'Sneha Thomas', date: '2026-08-11', delivery: '2026-08-20', amount: 6800,  status: 'Delivered' },
  { id: 4, number: 'SO-004', customer: 'Priya Nair',   date: '2026-08-15', delivery: '2026-08-22', amount: 39000, status: 'Confirmed' },
]

const STATUS_STYLES = {
  Draft:     'bg-gray-100 text-gray-600',
  Confirmed: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
}

const COLUMNS = [
  { key: 'number',   header: 'Order #',        minWidth: 120 },
  { key: 'customer', header: 'Customer',        minWidth: 180 },
  { key: 'date',     header: 'Order Date',      minWidth: 130 },
  { key: 'delivery', header: 'Delivery Date',   minWidth: 130 },
  { key: 'amount',   header: 'Amount (₹)',      minWidth: 140, align: 'right', render: (val) => `₹${val.toLocaleString('en-IN')}` },
  {
    key: 'status', header: 'Status', minWidth: 120,
    render: (val) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[val]}`}>{val}</span>
    ),
  },
]

function SalesOrders() {
  const [selected, setSelected] = useState([])

  return (
    <DataTable
      title="Sales Orders"
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New Sales Order"
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

export default SalesOrders
