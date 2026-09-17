import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, number: 'DC-001', customer: 'Amal Vishnu',  date: '2026-08-05', salesOrder: 'SO-001', quantity: 10, status: 'Delivered' },
  { id: 2, number: 'DC-002', customer: 'Sneha Thomas', date: '2026-08-09', salesOrder: 'SO-003', quantity: 4,  status: 'Draft' },
  { id: 3, number: 'DC-003', customer: 'Kiran Kumar',  date: '2026-08-13', salesOrder: 'SO-004', quantity: 7,  status: 'Delivered' },
  { id: 4, number: 'DC-004', customer: 'Priya Nair',   date: '2026-08-18', salesOrder: 'SO-002', quantity: 2,  status: 'Draft' },
]

const STATUS_STYLES = {
  Draft:     'bg-gray-100 text-gray-600',
  Delivered: 'bg-green-100 text-green-700',
}

const COLUMNS = [
  { key: 'number',     header: 'Challan #',     minWidth: 130 },
  { key: 'customer',   header: 'Customer',      minWidth: 180 },
  { key: 'date',       header: 'Date',          minWidth: 120 },
  { key: 'salesOrder', header: 'Sales Order',   minWidth: 140 },
  { key: 'quantity',   header: 'Qty',           minWidth: 80,  align: 'right' },
  {
    key: 'status', header: 'Status', minWidth: 120,
    render: (val) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[val]}`}>{val}</span>
    ),
  },
]

function DeliveryChallans() {
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  return (
    <DataTable
      title="Delivery Challans"
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New Challan"
      onNew={() => navigate('/sales/delivery-challans/new')}
      showSearch={false}
      showFilter={false}
      selectable
      selectedRows={selected}
      onSelectAll={() => setSelected(selected.length === SAMPLE.length ? [] : SAMPLE.map(r => r.id))}
      onSelectRow={(key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
      onRowClick={(row) => navigate(`/sales/delivery-challans/${row.id}`)}
    />
  )
}

export default DeliveryChallans
