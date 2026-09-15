import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search, Plus, ChevronDown, RefreshCw, HelpCircle, GripVertical, Trash2, X, Pencil } from 'lucide-react'
import { SAMPLE_RECURRING } from './RecurringInvoiceDetails'

/* ── Constants ── */
const CUSTOMERS    = ['Amal Vishnu', 'Priya Nair', 'Rahul Menon', 'Sneha Thomas', 'Kiran Kumar']
const SALESPERSONS = ['Amal Vishnu', 'Priya Nair']
const REPEAT_OPTIONS = ['Day', 'Week', 'Month', 'Year']
const PAYMENT_TERMS  = ['Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60']
const TAXES          = ['', 'GST 5%', 'GST 12%', 'GST 18%', 'GST 28%']

/* ── Styles ── */
const inputCls  = 'w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'
const selectCls = 'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {children}{required && <span className="text-red-500"> *</span>}
    </label>
  )
}

function FieldRow({ label, required, hint, children }) {
  return (
    <div className="flex items-start gap-4 py-2.5">
      <div className="w-44 shrink-0 pt-2 flex items-center gap-1">
        <Label required={required}>{label}</Label>
        {hint && <HelpCircle className="h-3.5 w-3.5 text-gray-300" />}
      </div>
      <div className="flex-1 max-w-xs">{children}</div>
    </div>
  )
}

const EMPTY_ITEM = () => ({ id: Date.now(), details: '', qty: 1, rate: 0 })

function RecurringInvoiceForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = !!id
  const existing = isEdit ? SAMPLE_RECURRING?.find(r => String(r.id) === String(id)) : null

  const today   = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric' }).split('/').join('/')

  const [form, setForm] = useState({
    customer:        existing?.customerName  ?? '',
    profileName:     existing?.profileName   ?? '',
    orderNumber:     '',
    repeatEvery:     'Week',
    startOn:         today,
    endsOn:          '',
    neverExpires:    true,
    paymentTerms:    existing?.paymentTerms  ?? 'Due on Receipt',
    salesperson:     '',
    subject:         '',
    customerNotes:   'Thanks for your business.',
    terms:           '',
    discount:        0,
    tax:             '',
    adjustment:      '',
    roundOff:        0,
  })

  const [items, setItems]   = useState(existing?.items?.map(i => ({ ...i, details: i.name })) ?? [EMPTY_ITEM()])
  const [errors, setErrors] = useState({})

  function handle(e) {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  function handleItem(index, field, value) {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, [field]: value } : it))
  }

  function addRow()       { setItems(prev => [...prev, EMPTY_ITEM()]) }
  function removeRow(idx) { setItems(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)) }

  /* ── Totals ── */
  const subTotal    = items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0)
  const discountAmt = subTotal * (Number(form.discount) / 100)
  const adjustAmt   = Number(form.adjustment) || 0
  const roundOff    = Number(form.roundOff) || 0
  const total       = subTotal - discountAmt + adjustAmt + roundOff
  const fmt = v => Number(v).toFixed(2)

  function validate() {
    const errs = {}
    if (!form.customer)    errs.customer    = 'Customer is required.'
    if (!form.profileName) errs.profileName = 'Profile name is required.'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    console.log(isEdit ? 'Updated:' : 'Created:', { ...form, items })
    navigate('/sales/recurring-invoices')
  }

  const backPath = isEdit ? `/sales/recurring-invoices/${id}` : '/sales/recurring-invoices'

  return (
    <div className="flex min-h-full flex-col bg-white">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-gray-500" />
          <h1 className="text-lg font-semibold text-gray-900">
            {isEdit ? `Edit Recurring Invoice — ${existing?.profileName}` : 'New Recurring Invoice'}
          </h1>
        </div>
        <button type="button" onClick={() => navigate(backPath)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto bg-gray-50">

        {/* ══ Section 1 — Header fields ══ */}
        <div className="border-b border-gray-200 bg-white px-8 py-5">

          {/* Customer Name */}
          <div className="mb-2 flex items-center gap-4">
            <div className="w-44 shrink-0"><Label required>Customer Name</Label></div>
            <div className="flex gap-2 max-w-sm flex-1">
              <select name="customer" value={form.customer} onChange={handle}
                className={`${selectCls} ${errors.customer ? 'border-red-400' : ''}`}>
                <option value="">Select Customer</option>
                {CUSTOMERS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                <Search className="h-4 w-4" />
              </button>
            </div>
            {errors.customer && <p className="text-xs text-red-500">{errors.customer}</p>}
          </div>

          {/* Profile Name */}
          <FieldRow label="Profile Name" required>
            <input name="profileName" value={form.profileName} onChange={handle}
              className={`${inputCls} ${errors.profileName ? 'border-red-400' : ''}`} />
            {errors.profileName && <p className="mt-1 text-xs text-red-500">{errors.profileName}</p>}
          </FieldRow>

          {/* Order Number */}
          <FieldRow label="Order Number">
            <input name="orderNumber" value={form.orderNumber} onChange={handle} className={inputCls} />
          </FieldRow>

          {/* Repeat Every */}
          <FieldRow label="Repeat Every" required>
            <select name="repeatEvery" value={form.repeatEvery} onChange={handle} className={selectCls}>
              {REPEAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </FieldRow>

          {/* Start On + Ends On + Never Expires */}
          <div className="flex items-start gap-6 py-2.5">
            <div className="w-44 shrink-0 pt-2"><Label>Start On</Label></div>
            <div className="w-44">
              <input name="startOn" value={form.startOn} onChange={handle} className={inputCls} placeholder="dd/MM/yyyy" />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-sm font-medium text-gray-700">Ends On</span>
              <input name="endsOn" value={form.endsOn} onChange={handle} disabled={form.neverExpires}
                placeholder="dd/MM/yyyy"
                className={`w-32 rounded border border-gray-300 px-3 py-2 text-sm outline-none ${form.neverExpires ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'focus:border-blue-500'}`}
              />
              <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-700">
                <input type="checkbox" name="neverExpires" checked={form.neverExpires} onChange={handle}
                  className="h-4 w-4 accent-blue-600 rounded" />
                Never Expires
              </label>
            </div>
          </div>

          {/* Payment Terms */}
          <FieldRow label="Payment Terms">
            <select name="paymentTerms" value={form.paymentTerms} onChange={handle} className={selectCls}>
              {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FieldRow>

          {/* Salesperson */}
          <FieldRow label="Salesperson">
            <select name="salesperson" value={form.salesperson} onChange={handle} className={selectCls}>
              <option value="">Select or Add Salesperson</option>
              {SALESPERSONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </FieldRow>

          {/* Associate Project(s) Hours */}
          <FieldRow label="Associate Project(s) Hours">
            <p className="pt-2 text-sm italic text-gray-400">
              {form.customer ? 'No active projects for this customer.' : 'There are no active projects for this customer.'}
            </p>
          </FieldRow>

          {/* Subject */}
          <div className="flex items-start gap-4 py-2.5">
            <div className="w-44 shrink-0 pt-2 flex items-center gap-1">
              <Label>Subject</Label>
              <HelpCircle className="h-3.5 w-3.5 text-gray-300" />
            </div>
            <textarea name="subject" value={form.subject} onChange={handle} rows={2}
              placeholder="Let your customer know what this Recurring Invoice is for"
              className={`${inputCls} max-w-xs resize`} />
          </div>

        </div>

        {/* ══ Section 2 — Item Table ══ */}
        <div className="border-b border-gray-200 bg-white mt-4 px-8 py-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">Item Table</span>
            <button type="button" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
              <RefreshCw className="h-3.5 w-3.5" /> Bulk Actions
            </button>
          </div>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-6 px-2 py-2" />
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Item Details</th>
                <th className="w-28 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Quantity</th>
                <th className="w-32 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Rate</th>
                <th className="w-28 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Amount</th>
                <th className="w-8 px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-2 py-3 text-gray-300 cursor-grab"><GripVertical className="h-4 w-4" /></td>
                  <td className="px-3 py-2">
                    <input value={item.details} onChange={e => handleItem(i, 'details', e.target.value)}
                      placeholder="Type or click to select an item."
                      className="w-full bg-transparent px-0 py-1 text-sm outline-none placeholder:text-gray-300" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" min="0" value={item.qty} onChange={e => handleItem(i, 'qty', e.target.value)}
                      className="w-full rounded border border-gray-200 px-2 py-1 text-right text-sm outline-none focus:border-blue-400" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" min="0" value={item.rate} onChange={e => handleItem(i, 'rate', e.target.value)}
                      className="w-full rounded border border-gray-200 px-2 py-1 text-right text-sm outline-none focus:border-blue-400" />
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-gray-800">
                    {fmt(Number(item.qty) * Number(item.rate))}
                  </td>
                  <td className="px-2 py-2">
                    <button type="button" onClick={() => removeRow(i)} className="text-gray-300 hover:text-red-400 transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add row buttons */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex overflow-hidden rounded-full border border-blue-300">
              <button type="button" onClick={addRow}
                className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition">
                <Plus className="h-3.5 w-3.5" /> Add New Row
              </button>
              <button type="button" className="border-l border-blue-300 bg-blue-50 px-2 py-1.5 text-blue-600 hover:bg-blue-100 transition">
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <button type="button"
              className="flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition">
              <Plus className="h-3.5 w-3.5" /> Add Items in Bulk
            </button>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-80 space-y-2 text-sm">

              <div className="flex items-center justify-between font-semibold text-gray-700">
                <span>Sub Total</span>
                <span>{fmt(subTotal)}</span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Discount</span>
                <div className="flex items-center gap-2">
                  <div className="flex overflow-hidden rounded border border-gray-200">
                    <input type="number" min="0" max="100" name="discount" value={form.discount} onChange={handle}
                      className="w-14 px-2 py-1 text-right text-sm outline-none" />
                    <span className="border-l border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500">%</span>
                  </div>
                  <span className="w-16 text-right text-gray-700">{fmt(discountAmt)}</span>
                </div>
              </div>

              {/* TDS */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">TDS</span>
                <div className="flex items-center gap-2">
                  <select name="tax" value={form.tax} onChange={handle}
                    className="w-32 rounded border border-gray-200 px-2 py-1 text-xs outline-none">
                    {TAXES.map(t => <option key={t} value={t}>{t || 'Select a Tax'}</option>)}
                  </select>
                  <span className="w-16 text-right text-gray-400">- 0.00</span>
                </div>
              </div>

              {/* Adjustment */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  <input value="Adjustment" readOnly className="w-24 rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 outline-none" />
                  <input type="number" name="adjustment" value={form.adjustment} onChange={handle}
                    className="w-20 rounded border border-gray-200 px-2 py-1 text-sm outline-none" />
                  <HelpCircle className="h-4 w-4 text-gray-300" />
                </div>
                <span className="w-16 text-right text-gray-700">{fmt(adjustAmt)}</span>
              </div>

              {/* Round Off */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-gray-500">Round Off</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    (No Rounding)
                    <button type="button" className="text-blue-400 hover:text-blue-600">
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <span className="text-right text-gray-700">{fmt(roundOff)}</span>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                <span className="text-base font-bold text-gray-800">Total ( ₹ )</span>
                <span className="text-base font-bold text-gray-900">{fmt(total)}</span>
              </div>

            </div>
          </div>
        </div>

        {/* ══ Section 3 — Notes + Terms ══ */}
        <div className="mt-4 bg-white px-8 py-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Customer Notes</label>
                <textarea name="customerNotes" value={form.customerNotes} onChange={handle} rows={4}
                  className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Terms &amp; Conditions</label>
                <textarea name="terms" value={form.terms} onChange={handle} rows={4}
                  placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                  className={`${inputCls} resize-none`} />
              </div>
            </div>
          </div>
        </div>

        <div className="h-6" />

        {/* ── Sticky bottom bar ── */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center gap-2">
            <button type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
              {isEdit ? 'Update' : 'Save'}
            </button>
            <button type="button" onClick={() => navigate(backPath)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
          <div className="text-sm text-gray-400">
            PDF Template: <span className="text-gray-600">'Spreadsheet Template'</span>{' '}
            <button type="button" className="text-blue-600 hover:underline">Change</button>
          </div>
        </div>

      </form>
    </div>
  )
}

export default RecurringInvoiceForm
