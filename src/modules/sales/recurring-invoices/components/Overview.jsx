import { useState } from 'react'
import { Phone, Smartphone, ChevronDown, Info, CreditCard } from 'lucide-react'

function Overview({ profile }) {
  const [showAll, setShowAll] = useState(true)

  const p = profile ?? {
    customerName:      'abc',
    email:             'amalvishnukvk2@gmail.com',
    workPhone:         '+91-654795',
    mobile:            '+91-78797979',
    profileStatus:     'Active',
    startDate:         '15/09/2026',
    endDate:           'Never Expires',
    paymentTerms:      'Due on Receipt',
    manuallyCreated:   1,
    billingAddress:    '',
    shippingAddress:   '',
    customerNotes:     'Thanks for your business.',
    invoiceAmount:     777,
    nextInvoiceDate:   '22/09/2026',
    recurringPeriod:   'Weekly',
    unpaidAmount:      0,
    childInvoices: [
      {
        id: 1,
        customer:    'abc',
        number:      'INV-000003',
        date:        '15/09/2026',
        amount:      777,
        status:      'DRAFT',
        source:      'Manually Added',
      },
    ],
  }

  return (
    <div className="flex min-h-0 flex-1 divide-x divide-gray-200">

      {/* ══ LEFT PANEL ══ */}
      <div className="w-72 shrink-0 overflow-y-auto p-5">

        {/* Customer name */}
        <p className="mb-3 border-b border-gray-200 pb-2 text-sm font-semibold text-gray-800">
          {p.customerName}
        </p>

        {/* Contact card */}
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-400">
            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="font-semibold text-blue-600">{p.customerName}</p>
            <p>{p.email}</p>
            <p className="flex items-center gap-1 mt-0.5">
              <Phone className="h-3 w-3" /> {p.workPhone}
            </p>
            <p className="flex items-center gap-1">
              <Smartphone className="h-3 w-3" /> {p.mobile}
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="mb-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Details</p>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <dt className="w-36 shrink-0 text-gray-400">Profile Status:</dt>
              <dd>
                <span className="rounded bg-green-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {p.profileStatus}
                </span>
              </dd>
            </div>
            {[
              { label: 'Start Date:',               value: p.startDate },
              { label: 'End Date:',                 value: p.endDate },
              { label: 'Payment Terms:',            value: p.paymentTerms },
              { label: 'Manually Created\nInvoices:', value: p.manuallyCreated },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <dt className="w-36 shrink-0 whitespace-pre-wrap text-gray-400">{label}</dt>
                <dd className="font-medium text-gray-800">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Preference note */}
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs text-gray-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
            <p>
              Recurring Invoice preference has been set to{' '}
              <span className="font-semibold">"Create Invoices as Drafts"</span>
            </p>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="mb-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Address</p>
          <p className="text-sm text-gray-500">
            {p.billingAddress || 'Billing Address'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {p.shippingAddress || 'Shipping Address'}
          </p>
        </div>

        {/* CUSTOMER NOTES */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Customer Notes</p>
          <p className="text-sm text-gray-600">{p.customerNotes}</p>
        </div>

      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="flex-1 overflow-y-auto px-6 py-5">

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-3 divide-x divide-gray-200 rounded-xl border border-gray-200 bg-white">
          {[
            { label: 'Invoice Amount',   value: `₹${Number(p.invoiceAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, highlight: false },
            { label: 'Next Invoice Date', value: p.nextInvoiceDate, highlight: true },
            { label: 'Recurring Period',  value: p.recurringPeriod, highlight: false },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="px-6 py-4 text-center">
              <p className="mb-1 text-sm text-gray-400">{label}</p>
              <p className={`text-base font-semibold ${highlight ? 'text-blue-600' : 'text-gray-800'}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* All Child Invoices header */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAll(p => !p)}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-gray-600 transition"
          >
            All Child Invoices
            <ChevronDown className={`h-4 w-4 text-blue-500 transition-transform ${showAll ? '' : '-rotate-90'}`} />
          </button>
          <span className="text-sm text-gray-500">
            Unpaid Invoices : ₹{Number(p.unpaidAmount).toFixed(2)}
          </span>
        </div>

        {/* Child invoices list */}
        {showAll && (
          <div className="space-y-3">
            {p.childInvoices.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">No child invoices found.</p>
            ) : (
              p.childInvoices.map(inv => (
                <div key={inv.id} className="rounded-xl border border-gray-200 bg-white px-5 py-4">
                  <div className="flex items-start justify-between">

                    {/* Left */}
                    <div className="text-sm">
                      <p className="font-semibold text-gray-800 mb-1">{inv.customer}</p>
                      <div className="flex items-center gap-2 text-blue-600">
                        <button className="hover:underline font-medium">{inv.number}</button>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">{inv.date}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <Info className="h-3.5 w-3.5" />
                        {inv.source}
                      </div>
                    </div>

                    {/* Right */}
                    <div className="text-right">
                      <p className="text-base font-semibold text-gray-900 mb-1">
                        ₹{Number(inv.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="mb-2 text-xs font-semibold text-gray-400">{inv.status}</p>
                      <button
                        type="button"
                        className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition flex items-center gap-1"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        Record Payment
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default Overview
