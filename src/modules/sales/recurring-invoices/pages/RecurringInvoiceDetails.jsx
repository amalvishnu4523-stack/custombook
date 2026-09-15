import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, Plus, ChevronDown, X } from 'lucide-react'
import Overview from '../components/Overview'
import NextInvoice from '../components/NextInvoice'
import RecentActivities from '../components/RecentActivities'

/* ── Sample recurring invoice profiles ── */
export const SAMPLE_RECURRING = [
  {
    id: 1,
    profileName:     'Monthly Retainer',
    customerName:    'Amal',
    email:           'amalvishnukvk2@gmail.com',
    workPhone:       '+91-654795',
    mobile:          '+91-78797979',
    profileStatus:   'Active',
    startDate:       '15/09/2026',
    endDate:         'Never Expires',
    paymentTerms:    'Due on Receipt',
    manuallyCreated: 1,
    billingAddress:  '',
    shippingAddress: '',
    customerNotes:   'Thanks for your business.',
    invoiceAmount:   777,
    nextInvoiceDate: '22/09/2026',
    recurringPeriod: 'Weekly',
    unpaidAmount:    0,
    childInvoices: [
      { id: 1, customer: 'abc', number: 'INV-000003', date: '15/09/2026', amount: 777, status: 'DRAFT', source: 'Manually Added' },
    ],
    // for next invoice tab
    status:        'Active',
    customer:      'abc',
    invoiceDate:   '22/09/2026',
    terms:         'Due on Receipt',
    dueDate:       '22/09/2026',
    subTotal:      777,
    total:         777,
    balanceDue:    777,
    adjustment:    0,
    items: [{ id: 1, name: 'bike', description: 'nbb', unit: '', qty: 1, rate: 777, amount: 777 }],
  },
  {
    id: 2,
    profileName:     'Weekly Support',
    customerName:    'Priya',
    email:           'priya@example.com',
    workPhone:       '+91-9123456780',
    mobile:          '',
    profileStatus:   'Active',
    startDate:       '01/09/2026',
    endDate:         'Never Expires',
    paymentTerms:    'Net 15',
    manuallyCreated: 0,
    billingAddress:  '',
    shippingAddress: '',
    customerNotes:   '',
    invoiceAmount:   3500,
    nextInvoiceDate: '03/09/2026',
    recurringPeriod: 'Weekly',
    unpaidAmount:    0,
    childInvoices:   [],
    status: 'Active', customer: 'Priya Nair', invoiceDate: '03/09/2026',
    terms: 'Net 15', dueDate: '18/09/2026', subTotal: 3500, total: 3500, balanceDue: 3500,
    adjustment: 0, items: [{ id: 1, name: 'Support', description: '', unit: 'hrs', qty: 1, rate: 3500, amount: 3500 }],
  },
  {
    id: 3,
    profileName:     'Annual License',
    customerName:    'Kiran',
    email:           'kiran@example.com',
    workPhone:       '+91-9871234560',
    mobile:          '',
    profileStatus:   'Active',
    startDate:       '01/01/2026',
    endDate:         'Never Expires',
    paymentTerms:    'Net 30',
    manuallyCreated: 0,
    billingAddress:  '',
    shippingAddress: '',
    customerNotes:   '',
    invoiceAmount:   60000,
    nextInvoiceDate: '01/01/2027',
    recurringPeriod: 'Yearly',
    unpaidAmount:    0,
    childInvoices:   [],
    status: 'Active', customer: 'Kiran Kumar', invoiceDate: '01/01/2027',
    terms: 'Net 30', dueDate: '31/01/2027', subTotal: 60000, total: 60000, balanceDue: 60000,
    adjustment: 0, items: [{ id: 1, name: 'Annual License', description: '', unit: 'pcs', qty: 1, rate: 60000, amount: 60000 }],
  },
  {
    id: 4,
    profileName:     'Hosting Plan',
    customerName:    'Rahul',
    email:           'rahul@example.com',
    workPhone:       '+91-9001234567',
    mobile:          '',
    profileStatus:   'Stopped',
    startDate:       '10/08/2026',
    endDate:         'Never Expires',
    paymentTerms:    'Due on Receipt',
    manuallyCreated: 0,
    billingAddress:  '',
    shippingAddress: '',
    customerNotes:   '',
    invoiceAmount:   999,
    nextInvoiceDate: '10/09/2026',
    recurringPeriod: 'Monthly',
    unpaidAmount:    0,
    childInvoices:   [],
    status: 'Stopped', customer: 'Rahul Menon', invoiceDate: '10/09/2026',
    terms: 'Due on Receipt', dueDate: '10/09/2026', subTotal: 999, total: 999, balanceDue: 999,
    adjustment: 0, items: [{ id: 1, name: 'Hosting', description: '', unit: 'mo', qty: 1, rate: 999, amount: 999 }],
  },
]

const TABS = ['Overview', 'Next Invoice', 'Recent Activities']

function RecurringInvoiceDetails() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')

  const profile = SAMPLE_RECURRING.find(r => String(r.id) === String(id))

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-lg font-medium">Profile not found</p>
        <button onClick={() => navigate('/sales/recurring-invoices')} className="mt-4 text-sm text-blue-500 hover:underline">
          Back to Recurring Invoices
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-white">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">{profile.customerName}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/sales/recurring-invoices/${id}/edit`)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            <Plus className="h-4 w-4" />
            Create Invoice
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            More
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/sales/recurring-invoices')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition"
          >
            <X className="h-4 w-4" />
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
        {activeTab === 'Overview'          && <Overview          profile={profile} />}
        {activeTab === 'Next Invoice'      && <NextInvoice       profile={profile} />}
        {activeTab === 'Recent Activities' && <RecentActivities  />}
      </div>

    </div>
  )
}

export default RecurringInvoiceDetails
