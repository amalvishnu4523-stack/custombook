import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Settings, ChevronDown, ChevronRight, Upload, HelpCircle, Calendar } from 'lucide-react'

/* ── Static options ── */
const CUSTOMERS = [
  { id: 1, name: 'abc',          pan: '123456789' },
  { id: 2, name: 'Priya Nair',   pan: 'AABCP1234D' },
  { id: 3, name: 'Kiran Kumar',  pan: 'AACKK5678E' },
  { id: 4, name: 'Amal Vishnu',  pan: 'AACAV9012F' },
  { id: 5, name: 'Sneha Thomas', pan: 'AACST3456G' },
]

const PAYMENT_MODES = ['Cash', 'Bank Transfer', 'Cheque', 'UPI', 'Credit Card', 'Others']
const DEPOSIT_TO    = ['Petty Cash', 'Current Account', 'Savings Account', 'Undeposited Funds']

/* ── Sample existing payments (for edit mode) ── */
const SAMPLE_PAYMENTS = [
  {
    id: 1,
    number: 'PR-001',
    customerId: 1,
    amountReceived: 45,
    bankCharges: 0,
    paymentDate: '2026-09-16',
    paymentNumber: '1',
    paymentMode: 'Cash',
    depositTo: 'Petty Cash',
    reference: '',
    taxDeducted: 'none',
    notes: '',
    invoices: [
      { id: 1, date: '01/09/2026', dueDate: '01/09/2026', invoiceNumber: 'Customer opening balance', invoiceAmount: 4589, amountDue: 4589, paymentReceivedOn: '2026-09-16', payment: 45 },
    ],
  },
  {
    id: 2,
    number: 'PR-002',
    customerId: 3,
    amountReceived: 15000,
    bankCharges: 0,
    paymentDate: '2026-08-12',
    paymentNumber: '2',
    paymentMode: 'UPI',
    depositTo: 'Current Account',
    reference: 'REF-005',
    taxDeducted: 'none',
    notes: '',
    invoices: [
      { id: 1, date: '10/08/2026', dueDate: '15/08/2026', invoiceNumber: 'INV-003', invoiceAmount: 15000, amountDue: 15000, paymentReceivedOn: '2026-08-12', payment: 15000 },
    ],
  },
]

/* ── Helpers ── */
const inputCls  = 'w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'
const selectCls = `${inputCls} bg-white`

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {children}{required && ' *'}
    </label>
  )
}

function FieldRow({ label, required, children, hint }) {
  return (
    <div className="flex items-start gap-4 py-2.5">
      <div className="w-44 shrink-0 pt-2">
        <Label required={required}>{label}</Label>
        {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
      </div>
      <div className="flex-1 max-w-xs">{children}</div>
    </div>
  )
}

function fmt(v) {
  return Number(v).toFixed(2)
}

function PaymentReceivedForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = !!id
  const existing = isEdit ? SAMPLE_PAYMENTS.find(p => String(p.id) === String(id)) : null
  const fileRef  = useRef()

  const today = new Date().toISOString().split('T')[0]

  /* ── form state ── */
  const [form, setForm] = useState({
    customerId:      existing?.customerId      ?? '',
    amountReceived:  existing?.amountReceived  ?? '',
    bankCharges:     existing?.bankCharges     ?? 0,
    paymentDate:     existing?.paymentDate     ?? today,
    paymentNumber:   existing?.paymentNumber   ?? '1',
    paymentMode:     existing?.paymentMode     ?? 'Cash',
    depositTo:       existing?.depositTo       ?? 'Petty Cash',
    reference:       existing?.reference       ?? '',
    taxDeducted:     existing?.taxDeducted     ?? 'none',
    notes:           existing?.notes           ?? '',
  })

  /* ── unpaid invoice rows ── */
  const [invoiceRows, setInvoiceRows] = useState(
    existing?.invoices ?? [
      { id: 1, date: '01/09/2026', dueDate: '01/09/2026', invoiceNumber: 'Customer opening balance', invoiceAmount: 4589, amountDue: 4589, paymentReceivedOn: today, payment: 0 },
    ]
  )

  const [errors, setErrors] = useState({})

  const selectedCustomer = CUSTOMERS.find(c => String(c.id) === String(form.customerId))

  function handle(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  function handleInvoicePayment(idx, value) {
    setInvoiceRows(prev => prev.map((r, i) => i === idx ? { ...r, payment: value } : r))
  }

  function handleInvoiceDate(idx, value) {
    setInvoiceRows(prev => prev.map((r, i) => i === idx ? { ...r, paymentReceivedOn: value } : r))
  }

  /* ── summary calculations ── */
  const amountReceived      = Number(form.amountReceived) || 0
  const amountUsed          = invoiceRows.reduce((s, r) => s + (Number(r.payment) || 0), 0)
  const amountRefunded      = 0
  const amountInExcess      = Math.max(0, amountReceived - amountUsed)

  /* ── validation ── */
  function validate() {
    const errs = {}
    if (!form.customerId)     errs.customerId     = 'Customer is required.'
    if (!form.amountReceived) errs.amountReceived = 'Amount received is required.'
    if (!form.paymentDate)    errs.paymentDate    = 'Payment date is required.'
    if (!form.depositTo)      errs.depositTo      = 'Deposit to is required.'
    return errs
  }

  function handleSubmit(asPaid = false) {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    console.log(isEdit ? 'Update Payment:' : 'Create Payment:', { ...form, asPaid, invoiceRows })
    navigate('/sales/payments-received')
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto">

        {/* ══ Header ══ */}
        <div className="border-b border-gray-200 bg-white px-8 py-5">
          <h1 className="mb-5 text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Payment' : 'New Payment'}
          </h1>

          <div className="flex gap-12">
            {/* ── Left column: fields ── */}
            <div className="flex-1">

              {/* Customer Name */}
              <FieldRow label="Customer Name" required>
                <div className="space-y-1">
                  <select
                    name="customerId"
                    value={form.customerId}
                    onChange={handle}
                    className={`${selectCls} ${errors.customerId ? 'border-red-400' : ''}`}
                  >
                    <option value="">Select a customer</option>
                    {CUSTOMERS.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {selectedCustomer && (
                    <p className="text-xs text-gray-500">
                      PAN: <span className="text-blue-500">{selectedCustomer.pan}</span>
                    </p>
                  )}
                  {errors.customerId && <p className="text-xs text-red-500">{errors.customerId}</p>}
                </div>
              </FieldRow>

              {/* Amount Received */}
              <FieldRow label="Amount Received" required>
                <div className="flex overflow-hidden rounded border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-100">
                  <span className="flex items-center bg-gray-100 px-3 text-xs font-medium text-gray-500 border-r border-gray-300">
                    INR
                  </span>
                  <input
                    type="number"
                    name="amountReceived"
                    value={form.amountReceived}
                    onChange={handle}
                    min="0"
                    step="0.01"
                    className="flex-1 px-3 py-2 text-sm outline-none"
                    placeholder="0.00"
                  />
                </div>
                {errors.amountReceived && <p className="mt-1 text-xs text-red-500">{errors.amountReceived}</p>}
              </FieldRow>

              {/* Bank Charges */}
              <FieldRow label="Bank Charges (if any)">
                <input
                  type="number"
                  name="bankCharges"
                  value={form.bankCharges}
                  onChange={handle}
                  min="0"
                  step="0.01"
                  className={inputCls}
                />
              </FieldRow>

              {/* Payment Date */}
              <FieldRow label="Payment Date" required>
                <div className="relative">
                  <input
                    type="date"
                    name="paymentDate"
                    value={form.paymentDate}
                    onChange={handle}
                    className={`${inputCls} ${errors.paymentDate ? 'border-red-400' : ''}`}
                  />
                </div>
                {errors.paymentDate && <p className="mt-1 text-xs text-red-500">{errors.paymentDate}</p>}
              </FieldRow>

              {/* Payment # */}
              <FieldRow label="Payment #" required>
                <div className="flex items-center gap-2">
                  <input
                    name="paymentNumber"
                    value={form.paymentNumber}
                    onChange={handle}
                    className={inputCls}
                  />
                  <button type="button" className="shrink-0 text-gray-400 hover:text-gray-600 transition">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </FieldRow>

              {/* Payment Mode */}
              <FieldRow label="Payment Mode">
                <div className="relative">
                  <select name="paymentMode" value={form.paymentMode} onChange={handle} className={selectCls}>
                    {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </FieldRow>

              {/* Deposit To */}
              <FieldRow label="Deposit To" required>
                <select
                  name="depositTo"
                  value={form.depositTo}
                  onChange={handle}
                  className={`${selectCls} ${errors.depositTo ? 'border-red-400' : ''}`}
                >
                  {DEPOSIT_TO.map(d => <option key={d}>{d}</option>)}
                </select>
                {errors.depositTo && <p className="mt-1 text-xs text-red-500">{errors.depositTo}</p>}
              </FieldRow>

              {/* Reference # */}
              <FieldRow label="Reference#">
                <input name="reference" value={form.reference} onChange={handle} className={inputCls} />
              </FieldRow>

              {/* Tax deducted? */}
              <FieldRow label="Tax deducted?">
                <div className="flex items-center gap-6 pt-1.5">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="radio"
                      name="taxDeducted"
                      value="none"
                      checked={form.taxDeducted === 'none'}
                      onChange={handle}
                      className="accent-blue-600"
                    />
                    No Tax deducted
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="radio"
                      name="taxDeducted"
                      value="tds"
                      checked={form.taxDeducted === 'tds'}
                      onChange={handle}
                      className="accent-blue-600"
                    />
                    Yes, TDS (Income Tax)
                  </label>
                </div>
              </FieldRow>
            </div>

            {/* ── Right column: customer details pill ── */}
            {selectedCustomer && (
              <div className="mt-12 shrink-0">
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-gray-700 transition"
                >
                  {selectedCustomer.name}'s Details
                  <ChevronRight className="h-4 w-4 opacity-70" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ══ Unpaid Invoices ══ */}
        <div className="mt-4 border-b border-gray-200 bg-white px-8 py-5">

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-800">Unpaid Invoices</span>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 transition"
              >
                <Calendar className="h-3.5 w-3.5" />
                Filter by Date Range
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setInvoiceRows(prev => prev.map(r => ({ ...r, payment: 0 })))}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear Applied Amount
            </button>
          </div>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 w-28">Date</th>
                <th className="py-2 px-3 text-left text-xs font-semibold uppercase tracking-wide text-blue-500">Invoice Number</th>
                <th className="py-2 px-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 w-32">Invoice Amount</th>
                <th className="py-2 px-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 w-28">Amount Due</th>
                <th className="py-2 px-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 w-36">
                  <span className="flex items-center justify-end gap-1">
                    Payment Received On
                    <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                  </span>
                </th>
                <th className="py-2 px-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 w-28">Payment</th>
              </tr>
            </thead>
            <tbody>
              {invoiceRows.map((row, i) => (
                <tr key={row.id} className="border-b border-gray-100">
                  <td className="py-3 px-3">
                    <p className="text-gray-800">{row.date}</p>
                    <p className="text-xs text-gray-400">Due Date: {row.dueDate}</p>
                  </td>
                  <td className="py-3 px-3 font-medium text-gray-800">{row.invoiceNumber}</td>
                  <td className="py-3 px-3 text-right text-gray-700">{row.invoiceAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right">
                    <p className="text-gray-700">{row.amountDue.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">
                      ₹{Number(row.payment).toFixed(2)}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <input
                      type="date"
                      value={row.paymentReceivedOn}
                      onChange={e => handleInvoiceDate(i, e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-blue-400"
                    />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.payment}
                      onChange={e => handleInvoicePayment(i, e.target.value)}
                      className="w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm outline-none focus:border-blue-400"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="py-3 px-3 text-right text-sm font-semibold text-gray-700">Total</td>
                <td className="py-3 px-3 text-right text-sm font-semibold text-gray-900">{fmt(amountUsed)}</td>
              </tr>
            </tfoot>
          </table>

          <p className="mt-1 text-xs text-gray-400 italic">**List contains only SENT invoices</p>

          {/* Amount summary */}
          <div className="mt-4 flex justify-end">
            <div className="w-72 space-y-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
              <SummaryRow label="Amount Received :"       value={fmt(amountReceived)} />
              <SummaryRow label="Amount used for Payments :" value={fmt(amountUsed)} />
              <SummaryRow label="Amount Refunded :"       value={fmt(amountRefunded)} />
              <SummaryRow
                label={
                  <span className="flex items-center gap-1 text-orange-600">
                    <span className="text-orange-500">⚠</span> Amount in Excess:
                  </span>
                }
                value={
                  <span className="text-gray-800">
                    ₹ {fmt(amountInExcess)}
                  </span>
                }
              />
            </div>
          </div>
        </div>

        {/* ══ Notes & Attachments ══ */}
        <div className="mt-4 bg-white px-8 py-6">

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Notes{' '}
              <span className="font-normal text-gray-400">(Internal use. </span>
              <span className="font-normal text-red-400">Not visible to customer</span>
              <span className="font-normal text-gray-400">)</span>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handle}
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Attachments</label>
            <div className="flex items-center gap-0">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 rounded-l-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <Upload className="h-4 w-4" />
                Upload File
              </button>
              <button
                type="button"
                className="rounded-r-lg border border-l-0 border-gray-300 bg-white px-2 py-2 text-gray-500 hover:bg-gray-50 transition"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <input ref={fileRef} type="file" multiple className="hidden" />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">You can upload a maximum of 5 files, 5MB each</p>
          </div>

        </div>

        <div className="h-8" />
      </div>

      {/* ══ Bottom Bar ══ */}
      <div className="sticky bottom-0 z-10 flex items-center gap-2 border-t border-gray-200 bg-white px-6 py-3">
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          {isEdit ? 'Update' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Save as Paid
        </button>
        <button
          type="button"
          onClick={() => navigate('/sales/payments-received')}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  )
}

export default PaymentReceivedForm
