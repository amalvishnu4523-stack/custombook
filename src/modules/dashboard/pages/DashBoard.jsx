import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboardOverview, getDashboardUpdates, getDashboardSupport } from '../api/dashboardApi'
import {
  Users, FileText, Receipt, CreditCard,
  TrendingUp, TrendingDown, Landmark, Wallet,
  AlertCircle, ChevronDown, RefreshCw,
  PartyPopper, Wrench, Calendar,
  Bell, CheckCircle,
  Rocket, BarChart2, Settings, ChevronRight, Headphones,
} from 'lucide-react'

const PERIODS = [
  { value: 'this_fiscal_year',   label: 'This Fiscal Year' },
  { value: 'last_fiscal_year',   label: 'Last Fiscal Year' },
  { value: 'this_month',         label: 'This Month' },
  { value: 'last_month',         label: 'Last Month' },
  { value: 'this_quarter',       label: 'This Quarter' },
  { value: 'last_quarter',       label: 'Last Quarter' },
]

const QUICK_ACTION_ICONS = {
  new_customer: Users,
  new_invoice:  FileText,
  new_bill:     Receipt,
  new_expense:  CreditCard,
}

const QUICK_ACTION_ROUTES = {
  new_customer: '/sales/customers/new',
  new_invoice:  '/sales/invoices/new',
  new_bill:     '/purchases/bills/new',
  new_expense:  '/purchases/expenses/new',
}

function fmt(val) {
  return `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor, sub, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition ${onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-md' : ''}`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
        <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
        {sub != null && (
          <p className="text-xs text-gray-400">{sub}</p>
        )}
      </div>
    </div>
  )
}

function DetailModal({ detail, onClose }) {
  if (!detail) return null
  const split = detail.overdue_split ?? {}

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">{detail.title}</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-px bg-gray-100">
          {[
            { label: 'Total',   value: detail.total_display   },
            { label: 'Current', value: detail.current_display },
            { label: 'Overdue', value: detail.overdue_display },
          ].map(item => (
            <div key={item.label} className="bg-white px-5 py-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-base font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Overdue breakdown */}
        <div className="px-6 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Overdue Breakdown
            {detail.overdue_count > 0 && (
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-red-600 normal-case">
                {detail.overdue_count} invoice{detail.overdue_count > 1 ? 's' : ''}
              </span>
            )}
          </p>
          <div className="space-y-2">
            {Object.values(split).map(bucket => (
              <div key={bucket.label} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5">
                <span className="text-sm text-gray-600">{bucket.label}</span>
                <span className="text-sm font-semibold text-gray-900">{bucket.amount_display}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 h-24 shadow-sm" />
  )
}

function DashBoard() {
  const navigate   = useNavigate()
  const [period,    setPeriod]    = useState('this_fiscal_year')
  const [data,      setData]      = useState(null)
  const [updates,   setUpdates]   = useState(null)
  const [support,   setSupport]   = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [modal,     setModal]     = useState(null) // 'receivables' | 'payables' | null

  async function fetchDashboard(p) {
    setLoading(true)
    setError('')
    try {
      const res = await getDashboardOverview(p)
      if (res.success) setData(res.data)
      else setError('Failed to load dashboard data.')
    } catch (e) {
      setError('Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchUpdates(p) {
    setLoading(true)
    setError('')
    try {
      const res = await getDashboardUpdates(p)
      if (res.success) setUpdates(res.data)
      else setError('Failed to load updates.')
    } catch (e) {
      setError('Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchSupport(p) {
    setLoading(true)
    setError('')
    try {
      const res = await getDashboardSupport(p)
      if (res.success) setSupport(res.data)
      else setError('Failed to load support data.')
    } catch (e) {
      setError('Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'overview') fetchDashboard(period)
    else if (activeTab === 'updates') fetchUpdates(period)
    else if (activeTab === 'support') fetchSupport(period)
  }, [period, activeTab])

  const d = data

  return (
    <div className="min-h-full bg-gray-50 p-6 space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{d?.title ?? 'Business Overview'}</h1>
          <p className="text-sm text-gray-400">
            {d ? `${d.start_date}  →  ${d.end_date}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="relative">
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              {PERIODS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={() => {
            if (activeTab === 'overview') fetchDashboard(period)
            else if (activeTab === 'updates') fetchUpdates(period)
            else if (activeTab === 'support') fetchSupport(period)
          }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      {d?.tabs && (
        <div className="flex gap-1 rounded-xl border border-gray-200 bg-white p-1 w-fit shadow-sm">
          {d.tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => {
            setActiveTab(tab.key)
          }}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Stat Cards — overview only ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
          ) : (
            <>
              <StatCard label="Total Receivables" value={fmt(d?.receivables)} icon={TrendingUp} iconBg="bg-blue-50" iconColor="text-blue-600" sub={d?.overdue_invoices_count ? `${d.overdue_invoices_count} overdue` : null} onClick={() => setModal('receivables')} />
              <StatCard label="Total Payables" value={fmt(d?.payables)} icon={TrendingDown} iconBg="bg-orange-50" iconColor="text-orange-500" sub={d?.overdue_bills_count ? `${d.overdue_bills_count} overdue` : null} onClick={() => setModal('payables')} />
              <StatCard label="Bank Balance" value={fmt(d?.bank_balance)} icon={Landmark} iconBg="bg-green-50" iconColor="text-green-600" />
              <StatCard label="Cash in Hand" value={fmt(d?.cash_in_hand)} icon={Wallet} iconBg="bg-purple-50" iconColor="text-purple-600" />
            </>
          )}
        </div>
      )}

      {/* ── Income / Expense — overview only ── */}
      {activeTab === 'overview' && !loading && d && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <div>
              <p className="text-xs font-medium text-gray-500">Total Income</p>
              <p className="text-xl font-bold text-green-600">{fmt(d.income_total)}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <div>
              <p className="text-xs font-medium text-gray-500">Total Expenses</p>
              <p className="text-xl font-bold text-red-500">{fmt(d.expense_total)}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      {activeTab === 'overview' && !loading && d?.quick_actions?.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {d.quick_actions.map(action => {
              const Icon  = QUICK_ACTION_ICONS[action.key] ?? FileText
              const route = QUICK_ACTION_ROUTES[action.key]
              return (
                <button
                  key={action.key}
                  onClick={() => route && navigate(route)}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  {action.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Updates Tab ── */}
      {activeTab === 'updates' && (
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white h-24 shadow-sm" />
            ))
          ) : updates?.updates?.length > 0 ? (
            <>
              {updates.unread_count > 0 && (
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <Bell className="h-4 w-4" />
                  {updates.unread_count} unread update{updates.unread_count > 1 ? 's' : ''}
                </div>
              )}
              {updates.updates.map(update => {
                const iconMap = {
                  party_popper: PartyPopper,
                  wrench:       Wrench,
                  calendar:     Calendar,
                  credit_card:  CreditCard,
                }
                const typeColors = {
                  feature:     { bg: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
                  maintenance: { bg: 'bg-orange-50', text: 'text-orange-500', badge: 'bg-orange-100 text-orange-700' },
                  reminder:    { bg: 'bg-blue-50',   text: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700' },
                  integration: { bg: 'bg-green-50',  text: 'text-green-600',  badge: 'bg-green-100 text-green-700' },
                }
                const Icon    = iconMap[update.icon] ?? Bell
                const colors  = typeColors[update.type] ?? typeColors.feature

                return (
                  <div
                    key={update.key}
                    className={`flex items-start gap-4 rounded-2xl border bg-white p-4 shadow-sm transition ${
                      !update.is_read ? 'border-blue-200' : 'border-gray-200'
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}>
                      <Icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-semibold text-gray-900">{update.title}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${colors.badge}`}>
                          {update.type}
                        </span>
                        {!update.is_read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{update.description}</p>
                      <p className="mt-1.5 text-xs text-gray-400">{update.relative_time}</p>
                    </div>
                    {update.is_read && (
                      <CheckCircle className="h-4 w-4 shrink-0 text-green-400 mt-1" />
                    )}
                  </div>
                )
              })}
            </>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
              No updates available.
            </div>
          )}
        </div>
      )}

      {/* ── Support Tab ── */}
      {activeTab === 'support' && (
        <div className="space-y-5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white h-40 shadow-sm" />
            ))
          ) : support ? (
            <>
              {/* Heading */}
              <div className="mb-2">
                <h2 className="text-lg font-bold text-gray-900">{support.heading}</h2>
                <p className="text-sm text-gray-400">{support.subheading}</p>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {support.categories?.map(cat => {
                  const iconMap = {
                    rocket:    Rocket,
                    bar_chart: BarChart2,
                    settings:  Settings,
                  }
                  const Icon = iconMap[cat.icon] ?? FileText
                  const colorMap = {
                    getting_started:    { bg: 'bg-blue-50',   icon: 'text-blue-600' },
                    financial_reports:  { bg: 'bg-green-50',  icon: 'text-green-600' },
                    account_management: { bg: 'bg-purple-50', icon: 'text-purple-600' },
                  }
                  const colors = colorMap[cat.key] ?? { bg: 'bg-gray-50', icon: 'text-gray-600' }

                  return (
                    <div key={cat.key} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                      <div className="mb-3 flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}>
                          <Icon className={`h-5 w-5 ${colors.icon}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{cat.title}</p>
                          <p className="text-xs text-gray-400">{cat.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-1.5">
                        {cat.items.map(item => (
                          <li key={item.key}>
                            <button
                              onClick={() => item.path && navigate(item.path)}
                              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-gray-600 transition hover:bg-gray-50 hover:text-blue-600"
                            >
                              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>

              {/* Contact Support */}
              {support.contact && (
                <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                      <Headphones className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{support.contact.heading}</p>
                      <p className="text-xs text-gray-500">{support.contact.subheading}</p>
                    </div>
                  </div>
                  <button className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition">
                    {support.contact.button_label}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
              No support data available.
            </div>
          )}
        </div>
      )}

      {/* ── Detail Modal ── */}
      <DetailModal
        detail={modal === 'receivables' ? d?.receivables_detail : modal === 'payables' ? d?.payables_detail : null}
        onClose={() => setModal(null)}
      />

    </div>
  )
}

export default DashBoard
