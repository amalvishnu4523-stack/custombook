import { useState } from 'react'
import { Settings, Plus, ChevronUp, ChevronDown, UserCircle } from 'lucide-react'

/* ── tiny bar-chart (pure CSS) ── */
const MONTHS = ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026']
const INCOME_DATA = [0, 0, 0, 777, 0, 0, 0] // sample — last 6 months

function IncomeBar({ value, max }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex h-24 w-8 items-end justify-center rounded-sm bg-gray-100">
        <div
          className="w-full rounded-sm bg-blue-400 transition-all"
          style={{ height: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ── collapsible section ── */
function Section({ title, defaultOpen = true, onAdd, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</span>
        <div className="flex items-center gap-2">
          {onAdd && (
            <span
              onClick={e => { e.stopPropagation(); onAdd() }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
            >
              <Plus className="h-3 w-3" />
            </span>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

function Overview({ customer }) {
  const [incomePeriod, setIncomePeriod]   = useState('Last 6 Months')
  const [incomeMethod, setIncomeMethod]   = useState('Accrual')

  const maxIncome = Math.max(...INCOME_DATA, 1)
  const totalIncome = INCOME_DATA.reduce((a, b) => a + b, 0)

  return (
    <div className="flex min-h-0 flex-1 gap-0 divide-x divide-gray-200">

      {/* ══ LEFT PANEL ══ */}
      <div className="w-72 shrink-0 overflow-y-auto">

        {/* Contact card */}
        <div className="border-b border-gray-200 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-800">{customer.companyName || customer.displayName}</p>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-400">
                <UserCircle className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {customer.salutation} {customer.firstName} {customer.lastName}
                </p>
                <button className="text-xs text-blue-600 hover:underline">Invite to Portal</button>
              </div>
            </div>
            <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
        </div>

        {/* ADDRESS */}
        <Section title="Address">
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-700">Billing Address</p>
              <p className="text-gray-400">
                {customer.billingAddress || 'No Billing Address'}{' '}
                <button className="text-blue-600 hover:underline">- New Address</button>
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Shipping Address</p>
              <p className="text-gray-400">
                No Shipping Address{' '}
                <button className="text-blue-600 hover:underline">- New Address</button>
              </p>
            </div>
          </div>
        </Section>

        {/* OTHER DETAILS */}
        <Section title="Other Details">
          <dl className="space-y-2 text-sm">
            {[
              { label: 'Customer Type',     value: customer.customerType },
              { label: 'Default Currency',  value: customer.currency?.split('-')[0]?.trim() ?? 'INR' },
              {
                label: 'Portal Status',
                value: customer.enablePortal
                  ? <span className="text-green-600 font-medium">● Enabled</span>
                  : <span className="text-red-500 font-medium">● Disabled</span>,
              },
              { label: 'Customer Language', value: customer.language },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <dt className="w-36 shrink-0 text-gray-400">{label}</dt>
                <dd className="font-medium text-gray-800">{value}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* CONTACT PERSONS */}
        <Section title="Contact Persons" onAdd={() => {}}>
          <p className="text-sm text-gray-400">No contact persons found.</p>

          {/* Portal promo card */}
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <UserCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <p>
                Customer Portal allows your customers to keep track of all the transactions between them and your business.{' '}
                <button className="text-blue-600 hover:underline">Learn More</button>
              </p>
            </div>
            <button className="mt-3 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
              Enable Portal
            </button>
          </div>
        </Section>

        {/* RECORD INFO */}
        <Section title="Record Info" defaultOpen={false}>
          <p className="text-sm text-gray-400">No record info available.</p>
        </Section>

      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="flex-1 overflow-y-auto px-6 py-5">

        {/* Payment due period */}
        <div className="mb-6">
          <p className="text-sm text-gray-400">Payment due period</p>
          <p className="mt-1 text-sm font-medium text-gray-800">{customer.paymentTerms || 'Due on Receipt'}</p>
        </div>

        {/* Receivables table */}
        <div className="mb-8">
          <h3 className="mb-3 text-base font-semibold text-gray-900">Receivables</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Currency</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Outstanding Receivables</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Unused Credits</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-700">{customer.currency || 'INR- Indian Rupee'}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">
                  ₹{(customer.receivables ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">₹0.00</td>
              </tr>
            </tbody>
          </table>
          <button className="mt-2 text-sm text-blue-600 hover:underline">Enter Opening Balance</button>
        </div>

        {/* Income chart */}
        <div className="mb-2">
          <div className="mb-3 flex items-center gap-3">
            <h3 className="text-base font-semibold text-gray-900">Income</h3>
            <p className="text-xs text-gray-400">This chart is displayed in the organisation's base currency.</p>
            <div className="ml-auto flex items-center gap-2">
              <select value={incomePeriod} onChange={e => setIncomePeriod(e.target.value)} className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 outline-none">
                {['Last 6 Months', 'Last 12 Months', 'This Year'].map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={incomeMethod} onChange={e => setIncomeMethod(e.target.value)} className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 outline-none">
                {['Accrual', 'Cash'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Y-axis labels + bars */}
          <div className="flex items-end gap-1">
            <div className="flex flex-col justify-between pr-2 text-right text-xs text-gray-400" style={{ height: '6rem' }}>
              {[5, 4, 3, 2, 1, 0].map(v => <span key={v}>{v}K</span>)}
            </div>
            <div className="flex flex-1 items-end justify-between gap-1">
              {INCOME_DATA.map((val, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <IncomeBar value={val} max={maxIncome} />
                  <span className="text-center text-xs text-gray-400 leading-tight whitespace-pre-wrap">{MONTHS[i].replace(' ', '\n')}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-3 text-sm font-medium text-gray-800">
            Total Income ( {incomePeriod} ) -{' '}
            <span>₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </p>
        </div>

        {/* ── Activity timeline ── */}
        <div className="mt-8">
          <h3 className="mb-4 text-base font-semibold text-gray-900">Activity</h3>
          <div className="relative pl-6">
            {/* vertical line */}
            <div className="absolute left-2 top-0 h-full w-0.5 bg-blue-200" />

            {[
              { date: '02/09/2026', time: '11:46 AM', title: 'Invoice updated',       desc: 'Invoice INV-000002 created from Quote QT-000002', by: 'Amal Vishnu' },
              { date: '02/09/2026', time: '11:45 AM', title: 'Quote added',           desc: 'Quote QT-000002 of amount ₹777.00 created',       by: 'Amal Vishnu' },
              { date: '02/09/2026', time: '11:44 AM', title: 'Contact person added',  desc: 'Contact person dd has been created',               by: 'Amal Vishnu' },
              { date: '02/09/2026', time: '11:44 AM', title: 'Contact added',         desc: 'Contact created',                                  by: 'Amal Vishnu' },
            ].map((ev, i) => (
              <div key={i} className="relative mb-5 flex gap-4">
                {/* dot */}
                <div className="absolute -left-4 flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue-400 bg-white">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                </div>

                {/* timestamp */}
                <div className="w-28 shrink-0 text-xs text-gray-400 pt-0.5">
                  <p>{ev.date}</p>
                  <p>{ev.time}</p>
                </div>

                {/* card */}
                <div className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm font-semibold text-gray-900">{ev.title}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {ev.desc}{' '}
                    <span className="text-gray-400">by</span>{' '}
                    <span className="font-medium text-gray-700">{ev.by}</span>
                    {ev.title !== 'Contact added' && (
                      <> {' - '}<button className="text-blue-600 hover:underline">View Details</button></>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Overview
