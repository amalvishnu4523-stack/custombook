import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search, Settings, Plus, ChevronDown, HelpCircle, GripVertical, Trash2 } from 'lucide-react'

/* ── Static options ── */
const CUSTOMERS = ['abc', 'Amal Vishnu', 'Priya Nair', 'Rahul Menon', 'Sneha Thomas', 'Kiran Kumar']
const SALESPERSONS = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown']
const ACCOUNTS = ['Sales', 'Service Revenue', 'Other Income', 'Discount']
const TAX_OPTIONS = ['GST 5%', 'GST 12%', 'GST 18%', 'GST 28%', 'No Tax']

/* ── Sample existing credit notes (for edit mode) ── */
const SAMPLE_NOTES = [
  {
    id: 1,
    number: 'CN-00001',
    customer: 'abc',
    reference: '',
    creditDate: '2026-09-18',
    salesperson: '',
    subject: '',
    discount: 0,
    taxType: 'TDS',
    tax: '',
    adjustment: '',
    customerNotes: '',
    terms: '',
    items: [
      { id: 1, details: 'bike', description: 'nbb', account: 'Sales', qty: 1, rate: 777 },
    ],
  },
  {
    id: 2,
    number: 'CN-00002',
    customer: 'Kiran Kumar',
    reference: '',
    creditDate: '2026-08-14',
    salesperson: '',
    subject: '',
    discount: 0,
    taxType: 'TDS',
    tax: '',
    adjustment: '',
    customerNotes: '',
    terms: '',
    items: [
      { id: 1, details: 'Laptop Stand', description: '', account: 'Sales', qty: 1, rate: 5000 },
    ],
  },
]

/* ── Helpers ── */
const inputCls  = 'w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'
const selectCls = `${inputCls} bg-white`

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {children}{required && <span className="text-red-400"> *</span>}
    </label>
  )
}

function FieldRow({ label, required, children, hint }) {
  return (
    <div className="flex items-start gap-4 py-2.5">
      <div className="w-44 shrink-0 pt-2 flex items-center gap-1">
        <Label required={required}>{label}</Label>
        {hint && <HelpCircle className="h-3.5 w-3.5 text-gray-400 shrink-0" />}
      </div>
      <div className="flex-1 max-w-sm">{children}</div>
    </div>
  )
}

const EMPTY_ITEM = () => ({ id: Date.now(), details: '', description: '', account: '', qty: 1, rate: 0 })

function fmt(v) { return Number(v).toFixed(2) }

function CreditNoteForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = !!id
  const existing = isEdit ? SAMPLE_NOTES.find(n => String(n.id) === String(id)) : null

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    customer:      existing?.customer      ?? '',
    number:        existing?.number        ?? 'CN-00002',
    reference:     existing?.reference     ?? '',
    creditDate:    existing?.creditDate    ?? today,
    salesperson:   existing?.salesperson   ?? '',
    subject:       existing?.subject       ?? '',
    discount:      existing?.discount      ?? 0,
    taxType:       existing?.taxType       ?? 'TDS',
    tax:           existing?.tax           ?? '',
    adjustment:    existing?.adjustment    ?? '',
    customerNotes: existing?.customerNotes ?? '',
    terms:         existing?.terms         ?? '',
  })

  const [items, setItems] = useState(existing?.items ?? [EMPTY_ITEM()])
  const [errors, setErrors] = useState({})

  function handle(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
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
  const taxAmt      = form.tax ? -(subTotal - discountAmt) * 0.05 : 0   // illustrative
  const adjustAmt   = Number(form.adjustment) || 0
  const total       = subTotal - discountAmt + taxAmt + adjustAmt

  /* ── Validation ── */
  function validate() {
    const errs = {}
    if (!form.customer)   errs.customer   = 'Customer is required.'
    if (!form.creditDate) errs.creditDate = 'Credit note date is required.'
    return errs
  }

  function handleSubmit(asOpen = false) {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    console.log(isEdit ? 'Update Credit Note:' : 'Create Credit Note:', { ...form, asOpen, items })
    navigate('/sales/credit-notes')
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto">

        {/* ══ Header ══ */}
        <div className="border-b border-gray-200 bg-white px-8 py-5">
          <h1 className="mb-5 text-lg font-semibold text-gray-900">
            {isEdit ? `Edit Credit Note — ${existing?.number}` : 'New Credit Note'}
          </h1>

          {/* Customer Name */}
          <div className="mb-2 flex items-start gap-4">
            <div className="w-44 shrink-0 pt-2">
              <Label required>Customer Name</Label>
            </div>
            <div className="flex gap-2 max-w-sm flex-1">
              <select
                name="customer"
                value={form.customer}
                onChange={handle}
                className={`${selectCls} ${errors.customer ? 'border-red-400' : ''}`}
              >
                <option value="">Select or add a customer</option>
                {CUSTOMERS.map(c => <option key={c}>{c}</option>)}
              </select>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
          {errors.customer && <p className="mb-2 ml-48 text-xs text-red-500">{errors.customer}</p>}

          {/* Meta fields */}
          <div className="mt-2">
            {/* Credit Note # */}
            <FieldRow label="Credit Note#" required>
              <div className="flex items-center gap-2">
                <input name="number" value={form.number} onChange={handle} className={inputCls} />
                <button type="button" className="shrink-0 text-gray-400 hover:text-gray-600 transition">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </FieldRow>

            {/* Reference # */}
            <FieldRow label="Reference#">
              <input name="reference" value={form.reference} onChange={handle} className={inputCls} />
            </FieldRow>

            {/* Credit Note Date */}
            <FieldRow label="Credit Note Date" required>
              <input
                type="date"
                name="creditDate"
                value={form.creditDate}
                onChange={handle}
                className={`${inputCls} ${errors.creditDate ? 'border-red-400' : ''}`}
              />
              {errors.creditDate && <p className="mt-1 text-xs text-red-500">{errors.creditDate}</p>}
            </FieldRow>

            {/* Salesperson */}
            <FieldRow label="Salesperson">
              <select name="salesperson" value={form.salesperson} onChange={handle} className={selectCls}>
                <option value="">Select or Add Salesperson</option>
                {SALESPERSONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </FieldRow>

            {/* Subject */}
            <FieldRow label="Subject" hint>
              <textarea
                name="subject"
                value={form.subject}
                onChange={handle}
                rows={2}
                placeholder="Let your customer know what this Credit Note is for"
                className={`${inputCls} resize-y`}
              />
            </FieldRow>
          </div>
        </div>

        {/* ══ Item Table ══ */}
        <div className="mt-4 border-b border-gray-200 bg-white px-8 py-5">
          <div className="mb-3">
            <span className="text-sm font-semibold text-gray-800">Item Table</span>
          </div>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-6 px-2 py-2" />
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Item Details
                </th>
                <th className="w-44 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Account
                </th>
                <th className="w-28 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Quantity
                </th>
                <th className="w-32 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Rate{' '}
                  <button type="button" className="text-gray-400 hover:text-gray-600 align-middle">
                    <Settings className="inline h-3 w-3" />
                  </button>
                </th>
                <th className="w-28 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>
                <th className="w-8 px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="cursor-grab px-2 py-3 text-gray-300">
                    <GripVertical className="h-4 w-4" />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={item.details}
                      onChange={e => handleItem(i, 'details', e.target.value)}
                      placeholder="Type or click to select an item."
                      className="w-full rounded border-0 bg-transparent px-0 py-1 text-sm outline-none placeholder:text-gray-300 focus:border-b focus:border-blue-400"
                    />
                    <input
                      value={item.description}
                      onChange={e => handleItem(i, 'description', e.target.value)}
                      placeholder="Description"
                      className="mt-0.5 w-full border-0 bg-transparent px-0 py-0.5 text-xs text-gray-400 outline-none placeholder:text-gray-200"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1 rounded border border-gray-200 px-2 py-1">
                      <select
                        value={item.account}
                        onChange={e => handleItem(i, 'account', e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none text-blue-500"
                      >
                        <option value="">Select an account</option>
                        {ACCOUNTS.map(a => <option key={a}>{a}</option>)}
                      </select>
                      <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.qty}
                      onChange={e => handleItem(i, 'qty', e.target.value)}
                      className="w-full rounded border border-gray-200 px-2 py-1 text-right text-sm outline-none focus:border-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={e => handleItem(i, 'rate', e.target.value)}
                      className="w-full rounded border border-gray-200 px-2 py-1 text-right text-sm outline-none focus:border-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-gray-800">
                    {fmt(Number(item.qty) * Number(item.rate))}
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="text-gray-300 transition hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add row buttons */}
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Add New Row
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Add Items in Bulk
            </button>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-80 space-y-3 text-sm">

              {/* Sub Total */}
              <div className="flex justify-between font-semibold text-gray-700">
                <span>Sub Total</span>
                <span>{fmt(subTotal)}</span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Discount</span>
                <div className="flex items-center gap-2">
                  <div className="flex overflow-hidden rounded border border-gray-200">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="discount"
                      value={form.discount}
                      onChange={handle}
                      className="w-14 px-2 py-1 text-right text-sm outline-none"
                    />
                    <span className="border-l border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500">%</span>
                  </div>
                  <span className="w-16 text-right text-gray-700">{fmt(discountAmt)}</span>
                </div>
              </div>

              {/* TDS / TCS + tax select */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {['TDS', 'TCS'].map(t => (
                    <label key={t} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
                      <input
                        type="radio"
                        name="taxType"
                        value={t}
                        checked={form.taxType === t}
                        onChange={handle}
                        className="accent-blue-600"
                      />
                      {t}
                    </label>
                  ))}
                  <select
                    name="tax"
                    value={form.tax}
                    onChange={handle}
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-blue-400"
                  >
                    <option value="">Select a Tax</option>
                    {TAX_OPTIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <span className="w-16 text-right text-gray-700">{fmt(taxAmt)}</span>
              </div>

              {/* Adjustment */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <input
                    name="adjustment"
                    placeholder="Adjustment"
                    value={form.adjustment}
                    onChange={handle}
                    className="w-28 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-blue-400"
                  />
                  <input
                    type="number"
                    name="adjustmentVal"
                    className="w-24 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-blue-400"
                  />
                  <HelpCircle className="h-4 w-4 text-gray-300 shrink-0" />
                </div>
                <span className="w-16 text-right text-gray-700">{fmt(adjustAmt)}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                <span>Total ( ₹ )</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ Notes, Terms & Additional Fields ══ */}
        <div className="mt-4 bg-white px-8 py-6">
          <div className="grid grid-cols-2 gap-8">

            {/* Left */}
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Customer Notes</label>
                <textarea
                  name="customerNotes"
                  value={form.customerNotes}
                  onChange={handle}
                  rows={4}
                  placeholder="Will be displayed on the credit note"
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Right — empty to match layout */}
            <div />
          </div>

          {/* Terms & Conditions — full width */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">Terms &amp; Conditions</label>
            <textarea
              name="terms"
              value={form.terms}
              onChange={handle}
              rows={4}
              placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 resize-none"
            />
          </div>

          {/* Additional Fields notice */}
          <p className="mt-6 text-xs text-gray-500">
            <span className="font-semibold">Additional Fields:</span>{' '}
            Start adding custom fields for your credit notes by going to{' '}
            <span className="italic text-gray-400">Settings</span>
            {' '}➡{' '}
            <span className="italic text-gray-400">Sales</span>
            {' '}➡{' '}
            <span className="italic text-gray-400">Credit Notes.</span>
          </p>
        </div>

        <div className="h-8" />
      </div>

      {/* ══ Bottom Bar ══ */}
      <div className="sticky bottom-0 z-10 flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            {isEdit ? 'Save' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            {isEdit ? 'Save as Open' : 'Save as Open'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/sales/credit-notes')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
          >
            Cancel
          </button>
        </div>
        <div className="text-xs text-gray-400">
          PDF Template: <span className="text-gray-600">'Spreadsheet Template'</span>{' '}
          <button type="button" className="text-blue-600 hover:underline">Change</button>
        </div>
      </div>
    </div>
  )
}

export default CreditNoteForm
