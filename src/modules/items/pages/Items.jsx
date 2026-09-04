import { useState } from 'react'
import DataTable from '../../../shared/components/table/DataTable'
import Drawer from '../../../shared/components/ui/Drawer'
import CreateNewItem from '../components/CreateNewItem'

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
  const [items, setItems]           = useState(SAMPLE_ITEMS)
  const [selectedRows, setSelected] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  function handleSelectAll() {
    setSelected(selectedRows.length === items.length ? [] : items.map(r => r.id))
  }

  function handleSelectRow(key) {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  function handleSaveItem(newItem) {
    setItems(prev => [...prev, newItem])
  }

  return (
    <>
      <DataTable
        title="Items"
        columns={COLUMNS}
        data={items}
        rowKey="id"
        showSearch={false}
        showFilter={false}
        newButtonText="New Item"
        onNew={() => setDrawerOpen(true)}
        selectable
        selectedRows={selectedRows}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        emptyMessage="No items found"
      />

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="New Item"
      >
        <CreateNewItem
          onClose={() => setDrawerOpen(false)}
          onSave={handleSaveItem}
        />
      </Drawer>
    </>
  )
}

export default Items
