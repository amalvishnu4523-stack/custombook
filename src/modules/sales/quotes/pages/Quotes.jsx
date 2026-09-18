import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, number: 'QT-000002', reference: 'hbj', customer: 'ddcompany', date: '02/09/2026', amount: 777,  status: 'Invoiced' },
  { id: 2, number: 'QT-000001', reference: '',    customer: 'abc',       date: '02/09/2026', amount: 10,   status: 'Draft' },
]

const STATUS_STYLES = {
  Draft:    'text-gray-400',
  Sent:     'text-blue-600',
  Accepted: 'text-green-600',
  Invoiced: 'text-green-600',
  Expired:  'text-red-500',
  Declined: 'text-red-500',
}

const COLUMNS = [
  {
    key: 'date', header: 'Date', minWidth: 130,
    render: (val) => <span className="text-gray-700">{val}</span>,
  },
  {
    key: 'number', header: 'Quote Number', minWidth: 160,
    render: (val) => <span className="font-medium text-blue-600">{val}</span>,
  },
  {
    key: 'reference', header: 'Reference Number', minWidth: 160,
    render: (val) => <span className="text-gray-700">{val || ''}</span>,
  },
  {
    key: 'customer', header: 'Customer Name', minWidth: 180,
    render: (val) => <span className="text-gray-700">{val}</span>,
  },
  {
    key: 'status', header: 'Status', minWidth: 120,
    render: (val) => (
      <span className={`text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[val] ?? 'text-gray-400'}`}>
        {val}
      </span>
    ),
  },
  {
    key: 'amount', header: 'Amount', minWidth: 120, align: 'right',
    render: (val) => <span className="text-gray-800">₹{Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>,
  },
]

function Quotes() {
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  return (
    <DataTable
      title="All Quotes"
      titleDropdown
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New"
      onNew={() => navigate('/sales/quotes/new')}
      onRowClick={(row) => navigate(`/sales/quotes/${row.id}`)}
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
