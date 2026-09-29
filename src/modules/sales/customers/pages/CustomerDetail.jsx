import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, Trash2, User, Loader2 } from 'lucide-react'
import { getCustomerById, deleteCustomer } from '../api/customersApi'
import Overview from '../components/Overview'
import Comments from '../components/Comments'
import Transactions from '../components/Transactions'
import Mails from '../components/Mails'
import Statement from '../components/Statement'

const TABS = ['Overview', 'Transactions', 'Mails', 'Statement', 'History', 'Comments', 'Documents']

function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getCustomerById(id)
      .then(res => {
        if (res?.data) {
          let d = res.data
          if (Array.isArray(d?.results) && d.results.length > 0) {
            d = d.results[0]
          } else if (Array.isArray(d) && d.length > 0) {
            d = d[0]
          }
          const formatted = {
            id: d.customer_id || d.id || id,
            customer_id: d.customer_id || d.id || id,
            customerType: d.customer_type === 'individual' ? 'Individual' : 'Business',
            salutation: d.salutation || '',
            firstName: d.first_name || '',
            lastName: d.last_name || '',
            companyName: d.company_name || '',
            displayName: d.display_name || `${d.first_name || ''} ${d.last_name || ''}`.trim() || d.company_name || 'Customer',
            email: d.email || '',
            workPhone: d.phone || '',
            workPhoneCode: d.phone_country_code || '+91',
            mobile: d.mobile || '',
            mobileCode: d.mobile_country_code || '+91',
            currency: d.currency || 'INR',
            openingBalance: d.opening_balance || 0,
            paymentTerms: d.payment_terms || 'Due on Receipt',
            enablePortal: Boolean(
              d.allow_portal_access === true ||
              d.portal_enabled === true ||
              String(d.portal_status).toLowerCase() === 'enabled' ||
              String(d.portal_status).toLowerCase() === 'active'
            ),
            websiteUrl: d.website || '',
            receivables: Number(d.receivables || d.opening_balance || 0),
            unusedCredits: Number(d.unused_credits || 0),
            status: d.status ? (d.status.charAt(0).toUpperCase() + d.status.slice(1)) : 'Active',
            billing_address: d.billing_address || {},
            shipping_address: d.shipping_address || {},
            billingAddress: d.billing_address ? [
              d.billing_address.attention,
              d.billing_address.street1,
              d.billing_address.street2,
              d.billing_address.city,
              d.billing_address.state,
              d.billing_address.zip_code,
              d.billing_address.country,
            ].filter(Boolean).join(', ') : '',
            shippingAddress: d.shipping_address ? [
              d.shipping_address.attention,
              d.shipping_address.street1,
              d.shipping_address.street2,
              d.shipping_address.city,
              d.shipping_address.state,
              d.shipping_address.zip_code,
              d.shipping_address.country,
            ].filter(Boolean).join(', ') : '',
            contact_persons: d.contact_persons || [],
            social_links: d.social_links || [],
          }
          setCustomer(formatted)
        } else {
          setCustomer(null)
        }
      })
      .catch(err => {
        console.error('Failed to load customer:', err)
        setCustomer(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleDeleteCustomer() {
    try {
      setDeleting(true)
      setDeleteError('')
      await deleteCustomer(id)
      setShowDeleteModal(false)
      navigate('/sales/customers')
    } catch (err) {
      console.error('Failed to delete customer:', err)
      const msg = err.response?.data?.message || err.response?.data?.detail || 'Failed to delete customer. Please try again.'
      setDeleteError(msg)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading customer details...</span>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <User className="mb-4 h-12 w-12" />
        <p className="text-lg font-medium">Customer not found</p>
        <button onClick={() => navigate('/sales/customers')} className="mt-4 text-sm text-blue-500 hover:underline">
          Back to Customers
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-white">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{customer.displayName}</h1>
          {customer.companyName && (
            <p className="text-sm text-gray-400">{customer.companyName}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/sales/customers/${id}/edit`)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
            title="Edit Customer"
          >
            <Pencil className="h-4 w-4 text-gray-500" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setDeleteError('')
              setShowDeleteModal(true)
            }}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition shadow-sm disabled:opacity-50"
            title="Delete Customer"
          >
            <Trash2 className="h-4 w-4" />
            <span>{deleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-gray-200 px-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mr-6 pb-3 pt-3 text-sm font-medium transition border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'Overview' && (
          <Overview
            customer={customer}
            onCustomerUpdate={(updatedPatch) => {
              setCustomer(prev => (prev ? { ...prev, ...updatedPatch } : prev))
            }}
          />
        )}
        {activeTab === 'Transactions' && <Transactions />}
        {activeTab === 'Mails'        && <Mails />}
        {activeTab === 'History'      && <p className="p-8 text-sm text-gray-400">No history available.</p>}
        {activeTab === 'Comments'     && <Comments />}
        {activeTab === 'Documents'    && <p className="p-8 text-sm text-gray-400">No documents uploaded.</p>}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Delete Customer</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete <span className="font-semibold text-gray-800">{customer.displayName}</span>? This action cannot be undone.
            </p>
            {deleteError && (
              <p className="mt-2 text-sm text-red-600 font-medium">{deleteError}</p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCustomer}
                disabled={deleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {deleting ? 'Deleting...' : 'Delete Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default CustomerDetail
