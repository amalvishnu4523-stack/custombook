import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, name: 'Amal Vishnu',  email: 'amal@example.com',   phone: '9876543210', receivables: 12000, status: 'Active'   },
  { id: 2, name: 'Priya Nair',   email: 'priya@example.com',  phone: '9123456780', receivables: 5500,  status: 'Active'   },
  { id: 3, name: 'Rahul Menon',  email: 'rahul@example.com',  phone: '9001234567', receivables: 0,     status: 'Inactive' },
  { id: 4, name: 'Sneha Thomas', email: 'sneha@example.com',  phone: '9988776655', receivables: 3200,  status: 'Active'   },
  { id: 5, name: 'Kiran Kumar',  email: 'kiran@example.com',  phone: '9871234560', receivables: 8900,  status: 'Active'   },
]

const COLUMNS = [
  { key: 'name',  header: 'Customer Name', minWidth: 180 },
  { key: 'email', header: 'Email',         minWidth: 200 },
  { key: 'phone', header: 'Phone',         minWidth: 140 },
  {
    key: 'receivables',
    header: 'Receivables (₹)',
    minWidth: 160,
    align: 'right',
    render: (val) => `₹${val.toLocaleString('en-IN')}`,
  },
  {
    key: 'status',
    header: 'Status',
    minWidth: 100,
    render: (val) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        val === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}>{val}</span>
    ),
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
