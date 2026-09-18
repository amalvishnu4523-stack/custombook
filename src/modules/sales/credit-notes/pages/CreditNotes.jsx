import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, date: '18/09/2026', number: 'CN-00001', reference: '', customer: 'abc', invoice: '', status: 'Draft', amount: 777, balance: 777 },
]

const fmtAmt = (val) =>
  `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

const COLUMNS = [
  {
    key: 'date', header: 'Date', minWidth: 130,
    render: (val) => <span className="text-gray-700">{val}</span>,
  },
  {
    key: 'number', header: 'Credit Note#', minWidth: 160,
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
    key: 'invoice', header: 'Invoice#', minWidth: 140,
    render: (val) => <span className="text-gray-700">{val || ''}</span>,
  },
  {
    key: 'status', header: 'Status', minWidth: 110,
    render: (val) => (
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{val}</span>
    ),
  },
  {
    key: 'amount', header: 'Amount', minWidth: 120, align: 'right',
    render: (val) => <span className="text-gray-800">{fmtAmt(val)}</span>,
  },
  {
    key: 'balance', header: 'Balance', minWidth: 120, align: 'right',
    render: (val) => <span className="text-gray-800">{fmtAmt(val)}</span>,
  },
]

function CreditNotes() {
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  return (
    <DataTable
      title="All Credit Notes"
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New"
      onNew={() => navigate('/sales/credit-notes/new')}
      showSearch={false}
      showFilter={false}
      selectable
      selectedRows={selected}
      onSelectAll={() => setSelected(selected.length === SAMPLE.length ? [] : SAMPLE.map(r => r.id))}
      onSelectRow={(key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
      onRowClick={(row) => navigate(`/sales/credit-notes/${row.id}`)}
    />
  )
}

export default CreditNotes
