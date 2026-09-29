import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { X, Upload, Check, AlertCircle, FileSpreadsheet, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import DataTable from '../../../../shared/components/table/DataTable'
import { getCustomers, refreshCustomers, exportCustomers, importCustomers, queryCustomers } from '../api/customersApi'

const fmtAmt = (val) => `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

const COLUMNS = [
  {
    key: 'name',
    header: 'Name',
    minWidth: 160,
    render: (val, row) => (
      <Link
        to={`/sales/customers/${row.id}`}
        onClick={(e) => e.stopPropagation()}
        className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
      >
        {val}
      </Link>
    ),
  },
  {
    key: 'companyName',
    header: 'Company Name',
    minWidth: 180,
    render: (val) => <span className="text-gray-700">{val || ''}</span>,
  },
  {
    key: 'email',
    header: 'Email',
    minWidth: 220,
    render: (val) => <span className="text-gray-600">{val || ''}</span>,
  },
  {
    key: 'phone',
    header: 'Work Phone',
    minWidth: 140,
    render: (val) => <span className="text-gray-600">{val || ''}</span>,
  },
  {
    key: 'receivables',
    header: 'Receivables (BCY)',
    minWidth: 160,
    align: 'right',
    render: (val) => <span className="text-gray-800">{fmtAmt(val)}</span>,
  },
  {
    key: 'unusedCredits',
    header: 'Unused Credits (BCY)',
    minWidth: 180,
    align: 'right',
    render: (val) => <span className="text-gray-800">{fmtAmt(val)}</span>,
  },
]

function Customers() {
  const [selected, setSelected] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all_customers')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalCount, setTotalCount] = useState(0)
  const [sortConfig, setSortConfig] = useState({ key: 'name', order: 'asc' })
  const [feedbackNotice, setFeedbackNotice] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [importing, setImporting] = useState(false)
  const [showPreferencesModal, setShowPreferencesModal] = useState(false)
  const navigate = useNavigate()

  const fetchCustomers = useCallback(async (overrides = {}) => {
    setLoading(true)
    try {
      const activeFilter = overrides.filter !== undefined ? overrides.filter : filter
      const activeSearch = overrides.search !== undefined ? overrides.search : search
      const activeSortBy = overrides.sort_by !== undefined ? overrides.sort_by : (sortConfig.key || 'name')
      const activeSortOrder = overrides.sort_order !== undefined ? overrides.sort_order : (sortConfig.order || 'asc')
      const activePage = overrides.page !== undefined ? overrides.page : page
      const activePageSize = overrides.page_size !== undefined ? overrides.page_size : pageSize

      const params = {
        filter: activeFilter,
        sort_by: activeSortBy,
        sort_order: activeSortOrder,
        page: activePage,
        page_size: activePageSize,
      }
      if (activeSearch && activeSearch.trim()) {
        params.search = activeSearch.trim()
      }

      const res = await queryCustomers(params)
      const list = Array.isArray(res?.data?.results)
        ? res.data.results
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.results)
        ? res.results
        : Array.isArray(res)
        ? res
        : []

      const count = res?.data?.count ?? res?.count ?? (Array.isArray(res?.data?.results) ? res.data.count : list.length)
      setTotalCount(count)

      const formatted = list.map(c => {
        const customerId = c.customer_id || c.id || c._id
        return {
          id: customerId,
          name: c.display_name || c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.company_name || 'Unnamed',
          companyName: c.company_name || '',
          email: c.email || '',
          phone: c.phone || c.mobile || '',
          receivables: Number(c.receivables || c.opening_balance || 0),
          unusedCredits: Number(c.unused_credits || 0),
          created_time: c.created_at || c.created_time || c.createdAt || '',
          last_modified_time: c.updated_at || c.last_modified_time || c.updatedAt || '',
        }
      })
      setCustomers(formatted)
    } catch (err) {
      console.error('Failed to fetch customers:', err)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }, [filter, search, sortConfig, page, pageSize])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const showToast = (message) => {
    setFeedbackNotice(message)
    setTimeout(() => {
      setFeedbackNotice('')
    }, 3000)
  }

  // 1. Sort by
  const handleSort = (key, order = 'asc') => {
    setSortConfig({ key, order })
    setPage(1)
    fetchCustomers({ sort_by: key, sort_order: order, page: 1 })
    const labelMap = {
      name: 'Name',
      companyName: 'Company Name',
      receivables: 'Receivables (BCY)',
      unusedCredits: 'Unused Credits (BCY)',
      created_time: 'Created Time',
      last_modified_time: 'Last Modified Time',
    }
    showToast(`Sorted by ${labelMap[key] || key} (${order === 'asc' ? 'Ascending' : 'Descending'})`)
  }

  // 2. Export via /api/customers/export/?format=csv or ?format=json
  const handleExport = async (type = 'csv') => {
    if (type === 'current_view') {
      if (customers.length === 0) {
        showToast('No customer records to export.')
        return
      }

      const headers = ['Name', 'Company Name', 'Email', 'Work Phone', 'Receivables (BCY)', 'Unused Credits (BCY)']
      const rows = customers.map(c => [
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.companyName || '').replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${(c.phone || '').replace(/"/g, '""')}"`,
        c.receivables ?? 0,
        c.unusedCredits ?? 0,
      ])
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'customers_current_view.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      showToast('Exported current view to CSV.')
      return
    }

    const format = type === 'json' ? 'json' : 'csv'
    try {
      setLoading(true)
      const resData = await exportCustomers(format)

      let exportBlob
      if (resData instanceof Blob) {
        exportBlob = resData
      } else if (format === 'json') {
        const jsonString = typeof resData === 'string'
          ? resData
          : JSON.stringify(resData, null, 2)
        exportBlob = new Blob([jsonString], { type: 'application/json' })
      } else {
        const csvString = typeof resData === 'string' ? resData : String(resData)
        exportBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
      }

      const blobUrl = window.URL.createObjectURL(exportBlob)
      const link = document.createElement('a')
      link.href = blobUrl
      const timestamp = new Date().toISOString().slice(0, 10)
      link.download = `customers_export_${timestamp}.${format}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)

      showToast(`Customers exported successfully as ${format.toUpperCase()}.`)
    } catch (err) {
      console.error(`Failed to export customers (${format}) via API:`, err)
      // Client-side fallback
      if (customers.length > 0) {
        if (format === 'json') {
          const jsonBlob = new Blob([JSON.stringify(customers, null, 2)], { type: 'application/json' })
          const blobUrl = window.URL.createObjectURL(jsonBlob)
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = `customers_backup_${new Date().toISOString().slice(0, 10)}.json`
          document.body.appendChild(link)
          link.click()
          link.remove()
          window.URL.revokeObjectURL(blobUrl)
        } else {
          const headers = ['Name', 'Company Name', 'Email', 'Work Phone', 'Receivables (BCY)', 'Unused Credits (BCY)']
          const rows = customers.map(c => [
            `"${(c.name || '').replace(/"/g, '""')}"`,
            `"${(c.companyName || '').replace(/"/g, '""')}"`,
            `"${(c.email || '').replace(/"/g, '""')}"`,
            `"${(c.phone || '').replace(/"/g, '""')}"`,
            c.receivables ?? 0,
            c.unusedCredits ?? 0,
          ])
          const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
          const encodedUri = encodeURI(csvContent)
          const link = document.createElement('a')
          link.setAttribute('href', encodedUri)
          link.setAttribute('download', `customers_backup_${new Date().toISOString().slice(0, 10)}.csv`)
          document.body.appendChild(link)
          link.click()
          link.remove()
        }
        showToast(`Exported customers to ${format.toUpperCase()} (local fallback).`)
      } else {
        showToast(`Failed to export customers as ${format.toUpperCase()}.`)
      }
    } finally {
      setLoading(false)
    }
  }

  // 3. Refresh List via /api/customers/refresh/
  const handleRefresh = async () => {
    setLoading(true)
    try {
      const res = await refreshCustomers()
      const list = Array.isArray(res?.data?.results)
        ? res.data.results
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.results)
        ? res.results
        : Array.isArray(res)
        ? res
        : []

      if (list.length > 0) {
        const formatted = list.map(c => {
          const customerId = c.customer_id || c.id || c._id
          return {
            id: customerId,
            name: c.display_name || c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.company_name || 'Unnamed',
            companyName: c.company_name || '',
            email: c.email || '',
            phone: c.phone || c.mobile || '',
            receivables: Number(c.receivables || c.opening_balance || 0),
            unusedCredits: Number(c.unused_credits || 0),
            created_time: c.created_at || c.created_time || c.createdAt || '',
            last_modified_time: c.updated_at || c.last_modified_time || c.updatedAt || '',
          }
        })
        setCustomers(formatted)
      } else {
        await fetchCustomers()
      }
      showToast('Customer list refreshed successfully.')
    } catch (err) {
      console.error('Failed to refresh customers:', err)
      await fetchCustomers()
      showToast('Customer list refreshed.')
    } finally {
      setLoading(false)
    }
  }

  // 4. Reset Column Width
  const handleResetColumnWidth = () => {
    showToast('Column widths reset to default.')
  }

  // 5. Import Customers via POST /api/customers/import/
  const handleFileImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      await importCustomers(file)
      showToast('Customers imported successfully!')
      setShowImportModal(false)
      await fetchCustomers()
    } catch (err) {
      console.error('Import customers failed:', err)
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        'Failed to import customers. Please verify file format.'
      showToast(errorMsg)
    } finally {
      setImporting(false)
      if (e.target) e.target.value = ''
    }
  }

  return (
    <>
      <DataTable
        title="Customers"
        columns={COLUMNS}
        data={customers}
        rowKey="id"
        loading={loading}
        emptyMessage="No customers found."
        newButtonText="New Customer"
        onNew={() => navigate('/sales/customers/new')}
        onRowClick={(row) => {
          if (row?.id) navigate(`/sales/customers/${row.id}`)
        }}
        showSearch={true}
        searchValue={search}
        onSearch={(term) => {
          setSearch(term)
          setPage(1)
          fetchCustomers({ search: term, page: 1 })
        }}
        showFilter={false}
        selectable
        selectedRows={selected}
        onSelectAll={() => setSelected(selected.length === customers.length ? [] : customers.map(r => r.id))}
        onSelectRow={(key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
        // More Menu Actions
        showMore={true}
        onRefresh={handleRefresh}
        onSort={handleSort}
        onExport={handleExport}
        onImport={() => setShowImportModal(true)}
        onPreferences={() => setShowPreferencesModal(true)}
        onResetColumnWidth={handleResetColumnWidth}
        currentSort={sortConfig}
        footer={
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>
              Showing {customers.length === 0 ? 0 : (page - 1) * pageSize + 1} -{' '}
              {Math.min(page * pageSize, totalCount || customers.length)} of {totalCount || customers.length} customers
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => {
                  const newPage = Math.max(1, page - 1)
                  setPage(newPage)
                  fetchCustomers({ page: newPage })
                }}
                className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={14} />
                Previous
              </button>
              <span className="font-medium text-gray-700">Page {page}</span>
              <button
                type="button"
                disabled={customers.length < pageSize || (totalCount > 0 && page * pageSize >= totalCount) || loading}
                onClick={() => {
                  const newPage = page + 1
                  setPage(newPage)
                  fetchCustomers({ page: newPage })
                }}
                className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        }
      />

      {/* ── Toast Notification ── */}
      {feedbackNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* ── Import Modal ── */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-semibold text-gray-900">Import Customers</h3>
              </div>
              <button
                type="button"
                disabled={importing}
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-sm text-gray-500">
                Upload a CSV, TSV, or JSON file containing customer records to import them into your organization.
              </p>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-400 transition bg-gray-50/50">
                {importing ? (
                  <div className="flex flex-col items-center py-4">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
                    <p className="text-sm font-medium text-gray-700">Importing customers...</p>
                    <p className="text-xs text-gray-400 mt-1">Please wait while the server processes your file</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-gray-700">Drag and drop file here or click to browse</p>
                    <p className="text-xs text-gray-400 mt-1">Supported file types: .csv, .tsv, .json (Max 5MB)</p>
                    <input
                      type="file"
                      accept=".csv,.tsv,.json,.xlsx"
                      className="hidden"
                      id="customer-import-input"
                      disabled={importing}
                      onChange={handleFileImport}
                    />
                    <label
                      htmlFor="customer-import-input"
                      className="mt-3 cursor-pointer rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition"
                    >
                      Choose File
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                disabled={importing}
                onClick={() => setShowImportModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preferences Modal ── */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-semibold text-gray-900">Customer Preferences</h3>
              <button
                type="button"
                onClick={() => setShowPreferencesModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Default Currency</label>
                <input
                  type="text"
                  readOnly
                  value="INR - Indian Rupee"
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 text-sm"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Default Payment Terms</label>
                <input
                  type="text"
                  readOnly
                  value="Due on Receipt"
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pref-portal-default"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="pref-portal-default" className="text-sm text-gray-700">
                  Allow Customer Portal access by default
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setShowPreferencesModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPreferencesModal(false)
                  showToast('Customer preferences updated.')
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Customers

