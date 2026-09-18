import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, name: 'ddcompany',   companyName: 'ddcompany', email: '',                        phone: '',            receivables: 0,    unusedCredits: 0 },
  { id: 2, name: 'abc',         companyName: 'abc',       email: 'amalvishnukvk2@gmail.com', phone: '+91-654795', receivables: 4589, unusedCredits: 0 },
  { id: 3, name: 'Rahul Menon', companyName: '',          email: 'rahul@example.com',        phone: '9001234567', receivables: 0,    unusedCredits: 0 },
  { id: 4, name: 'Sneha Thomas',companyName: '',          email: 'sneha@example.com',        phone: '9988776655', receivables: 3200, unusedCredits: 0 },
  { id: 5, name: 'Kiran Kumar', companyName: '',          email: 'kiran@example.com',        phone: '9871234560', receivables: 8900, unusedCredits: 0 },
]

const fmtAmt = (val) => `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

const COLUMNS = [
  {
    key: 'name', header: 'Name', minWidth: 160,
    render: (val) => <span className="font-medium text-blue-600">{val}</span>,
  },
  {
    key: 'companyName', header: 'Company Name', minWidth: 180,
    render: (val) => <span className="text-gray-700">{val || ''}</span>,
  },
  {
    key: 'email', header: 'Email', minWidth: 220,
    render: (val) => <span className="text-gray-600">{val || ''}</span>,
  },
  {
    key: 'phone', header: 'Work Phone', minWidth: 140,
    render: (val) => <span className="text-gray-600">{val || ''}</span>,
  },
  {
    key: 'receivables', header: 'Receivables (BCY)', minWidth: 160, align: 'right',
    render: (val) => <span className="text-gray-800">{fmtAmt(val)}</span>,
  },
  {
    key: 'unusedCredits', header: 'Unused Credits (BCY)', minWidth: 180, align: 'right',
    render: (val) => <span className="text-gray-800">{fmtAmt(val)}</span>,
  },
]

function Customers() {
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  return (
    <DataTable
      title="Customers"
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New Customer"
      onNew={() => navigate('/sales/customers/new')}
      onRowClick={(row) => navigate(`/sales/customers/${row.id}`)}
      showSearch={false}
      showFilter={false}
      selectable
      selectedRows={selected}
      onSelectAll={() => setSelected(selected.length === SAMPLE.length ? [] : SAMPLE.map(r => r.id))}
      onSelectRow={(key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
    />
  )
}

export default Customers
