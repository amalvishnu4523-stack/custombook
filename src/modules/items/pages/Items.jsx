import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../shared/components/table/DataTable'

const SAMPLE_ITEMS = [
  { id: 1, name: 'Wireless Mouse',      sku: 'WM-001', type: 'Goods',   unit: 'pcs', salesPrice: 799,  purchasePrice: 500,  stock: 120 },
  { id: 2, name: 'Mechanical Keyboard', sku: 'MK-002', type: 'Goods',   unit: 'pcs', salesPrice: 2499, purchasePrice: 1800, stock: 45  },
  { id: 3, name: 'Web Development',     sku: 'SV-001', type: 'Service', unit: 'hrs', salesPrice: 1500, purchasePrice: null, stock: null },
  { id: 4, name: 'USB-C Hub',           sku: 'UH-003', type: 'Goods',   unit: 'pcs', salesPrice: 1299, purchasePrice: 900,  stock: 30  },
  { id: 5, name: 'SEO Audit',           sku: 'SV-002', type: 'Service', unit: 'hrs', salesPrice: 2000, purchasePrice: null, stock: null },
  { id: 6, name: 'Monitor Stand',       sku: 'MS-004', type: 'Goods',   unit: 'pcs', salesPrice: 999,  purchasePrice: 650,  stock: 60  },
]

const COLUMNS = [
  { key: 'name', header: 'Item Name', minWidth: 200 },
  { key: 'sku',  header: 'SKU',       minWidth: 120 },
  {
    key: 'type', header: 'Type', minWidth: 100,
    render: (val) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        val === 'Service' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
      }`}>{val}</span>
    ),
  },
  { key: 'unit', header: 'Unit', minWidth: 80, align: 'center' },
  {
    key: 'salesPrice', header: 'Sales Price (₹)', minWidth: 140, align: 'right',
    render: (val) => val != null ? `₹${val.toLocaleString('en-IN')}` : '—',
  },
  {
    key: 'purchasePrice', header: 'Purchase Price (₹)', minWidth: 160, align: 'right',
    render: (val) => val != null ? `₹${val.toLocaleString('en-IN')}` : '—',
  },
  {
    key: 'stock', header: 'Stock', minWidth: 100, align: 'right',
    render: (val) => val != null ? val : '—', 
  },
]

function Items() {
  const [selectedRows, setSelected] = useState([])
  const navigate = useNavigate()

  return (
    <DataTable
      title="Items"
      columns={COLUMNS}
      data={SAMPLE_ITEMS}
      rowKey="id"
      showSearch={false}
      showFilter={false}
      newButtonText="New Item" 
      onNew={() => navigate('/items/new')}
      onRowClick={(row) => navigate(`/items/${row.id}`)} 
      selectable
      selectedRows={selectedRows}
      onSelectAll={() => setSelected(selectedRows.length === SAMPLE_ITEMS.length ? [] : SAMPLE_ITEMS.map(r => r.id))}
      onSelectRow={(key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
      emptyMessage="No items found"
    />
  )
}

export default Items
