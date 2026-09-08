import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, User } from 'lucide-react'
import { SAMPLE_CUSTOMERS } from './CustomerForm'
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

  const customer = SAMPLE_CUSTOMERS.find(c => String(c.id) === String(id))

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
        <button
          onClick={() => navigate(`/sales/customers/${id}/edit`)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
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
        {activeTab === 'Overview' && <Overview customer={customer} />}
        {activeTab === 'Transactions' && <Transactions />}
        {activeTab === 'Mails'        && <Mails />}
        {activeTab === 'History'      && <p className="p-8 text-sm text-gray-400">No history available.</p>}
        {activeTab === 'Comments'     && <Comments />}
        {activeTab === 'Documents'    && <p className="p-8 text-sm text-gray-400">No documents uploaded.</p>}
      </div>

    </div>
  )
}

export default CustomerDetail
