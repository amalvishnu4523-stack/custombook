import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../shared/components/table/DataTable'
import { getItems } from '../api/itemsApi'

const fmtPrice = (val) =>
  val != null && val !== '' ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : ''

const COLUMNS = [
  {
    key: 'name', header: 'Name', minWidth: 160,
    render: (val) => <span className="font-medium text-blue-600">{val}</span>,
  },
  {
    key: 'purchase_description', header: 'Purchase Description', minWidth: 200,
    render: (val) => <span className="text-gray-600">{val || ''}</span>,
  },
  {
    key: 'cost_price', header: 'Purchase Rate', minWidth: 140, align: 'right',
    render: (val) => <span className="text-gray-800">{fmtPrice(val)}</span>,
  },
  {
    key: 'sales_description', header: 'Description', minWidth: 200,
    render: (val) => <span className="text-gray-600">{val || ''}</span>,
  },
  {
    key: 'selling_price', header: 'Rate', minWidth: 120, align: 'right',
    render: (val) => <span className="text-gray-800">{fmtPrice(val)}</span>,
  },
  {
    key: 'unit', header: 'Usage Unit', minWidth: 100,
    render: (val) => <span className="text-gray-600">{val || ''}</span>,
  },
]

function Items() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [selectedRows, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    // Debug: check token exists
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Not authenticated. Please log in again.')
      setLoading(false)
      return
    }

    getItems()
      .then(res => {
        if (res.success && Array.isArray(res.data?.results)) {
          setItems(res.data.results)

        } else {
          setError(`Unexpected response: ${JSON.stringify(res)}`)
        }
      })
      .catch((err) => {
        const status = err?.response?.status
        const msg = err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          'Could not connect to the server.'
        setError(`${status ? `[${status}] ` : ''}${msg}`)
      })
      .finally(() => setLoading(false))
  }, [])





  return (
    <div className="min-h-full">
      {error && (
        <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}
      <DataTable
        title="Items"
        columns={COLUMNS}
        data={items}
        rowKey="item_id"
        showSearch={false}
        showFilter={false}
        newButtonText="New Item"
        onNew={() => navigate('/items/new')}
        onRowClick={(row) => navigate(`/items/${row.item_id}`)}
        selectable
        selectedRows={selectedRows}
        onSelectAll={() => setSelected(selectedRows.length === items.length ? [] : items.map(r => r.item_id))}
        onSelectRow={(key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
        emptyMessage={loading ? 'Loading items…' : 'No items found'}
      />
    </div>
  )
}

export default Items
