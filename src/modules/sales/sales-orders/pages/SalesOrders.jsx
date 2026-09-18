import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  {
    id: 1,
    number: 'SO-00002',
    reference: '',
    customer: 'abc',
    date: '18/09/2026',
    status: 'Draft',
    invoiced: '',
    payment: '',
    amount: 9,
    expectedShipment: '19/09/2026',
    orderStatus: 'Draft',
    deliveryMethod: '',
  },
  {
    id: 2,
    number: 'SO-00001',
    reference: '',
    customer: 'ddcompany',
    date: '09/09/2026',
    status: 'Draft',
    invoiced: '',
    payment: '',
    amount: 777,
    expectedShipment: '',
    orderStatus: 'Draft',
    deliveryMethod: '',
  },
]

const fmtAmt = (val) =>
  `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

/* Gray dot for invoiced / payment columns */
const Dot = () => (
  <span className="inline-block h-2 w-2 rounded-full bg-gray-300" />
)

const COLUMNS = [
  {
    key: 'date', header: 'Date', minWidth: 130,
    render: (val) => <span className="text-gray-700">{val}</span>,
  },
  {
    key: 'number', header: 'Sales Order#', minWidth: 160,
    render: (val) => <span className="font-medium text-blue-600">{val}</span>,
  },
  {
    key: 'reference', header: 'Reference#', minWidth: 140,
    render: (val) => <span className="text-gray-600">{val || ''}</span>,
  },
  {
    key: 'customer', header: 'Customer Name', minWidth: 180,
    render: (val) => <span className="text-gray-700">{val}</span>,
  },
  {
    key: 'status', header: 'Status', minWidth: 120,
    render: (val) => (
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{val}</span>
    ),
  },
  {
    key: 'invoiced', header: 'Invoiced', minWidth: 100, align: 'center',
    render: () => <Dot />,
  },
  {
    key: 'payment', header: 'Payment', minWidth: 100, align: 'center',
    render: () => <Dot />,
  },
  {
    key: 'amount', header: 'Amount', minWidth: 120, align: 'right',
    render: (val) => <span className="text-gray-800">{fmtAmt(val)}</span>,
  },
  {
    key: 'expectedShipment', header: 'Expected Shipment Date', minWidth: 200,
    render: (val) => <span className="text-gray-700">{val || ''}</span>,
  },
  {
    key: 'orderStatus', header: 'Order Status', minWidth: 130,
    render: (val) => (
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{val}</span>
    ),
  },
  {
    key: 'deliveryMethod', header: 'Delivery Method', minWidth: 160,
    render: (val) => <span className="text-gray-600">{val || ''}</span>,
  },
]

function SalesOrders() {
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  return (
    <DataTable
      title="All Sales Orders"
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New"
      onNew={() => navigate('/sales/orders/new')}
      onRowClick={(row) => navigate(`/sales/orders/${row.id}`)}
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
