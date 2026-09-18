import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../shared/components/table/DataTable'
import { getItems, subscribe } from '../store/itemsStore'

const fmtPrice = (val) => val != null ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : ''

const COLUMNS = [
  {
    key: 'name', header: 'Name', minWidth: 160,
    render: (val) => <span className="font-medium text-blue-600">{val}</span>,
  },
  {
    key: 'purchaseDescription', header: 'Purchase Description', minWidth: 200,
    render: (val) => <span className="text-gray-600">{val || ''}</span>,
  },
  {
    key: 'purchasePrice', header: 'Purchase Rate', minWidth: 140, align: 'right',
    render: (val) => <span className="text-gray-800">{fmtPrice(val)}</span>,
  },
  {
    key: 'salesDescription', header: 'Description', minWidth: 200,
    render: (val) => <span className="text-gray-600">{val || ''}</span>,
  },
  {
    key: 'salesPrice', header: 'Rate', minWidth: 120, align: 'right',
    render: (val) => <span className="text-gray-800">{fmtPrice(val)}</span>,
  },
  {
    key: 'unit', header: 'Usage Unit', minWidth: 100,
    render: (val) => <span className="text-gray-600">{val || ''}</span>,
  },
]

function Items() {
  const [items, setItems] = useState(getItems)
  const [selectedRows, setSelected] = useState([])
  const navigate = useNavigate()

  useEffect(() => subscribe(setItems), [])

  return (
    <DataTable
      title="Items"
      columns={COLUMNS}
      data={items}
      rowKey="id"
      showSearch={false}
      showFilter={false}
      newButtonText="New Item"
      onNew={() => navigate('/items/new')}
      onRowClick={(row) => navigate(`/items/${row.id}`)}
      selectable
      selectedRows={selectedRows}
      onSelectAll={() => setSelected(selectedRows.length === items.length ? [] : items.map(r => r.id))}
      onSelectRow={(key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
      emptyMessage="No items found"
    />
  )
}

export default Items
