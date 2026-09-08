import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search, Settings, Plus, ChevronDown, Upload, RefreshCw, HelpCircle, GripVertical, Trash2 } from 'lucide-react'

/* ── Sample data ── */
const CUSTOMERS    = ['Amal Vishnu', 'Priya Nair', 'Rahul Menon', 'Sneha Thomas', 'Kiran Kumar']
const SALESPERSONS = ['Amal Vishnu', 'Priya Nair']
const TAXES        = ['', 'GST 5%', 'GST 12%', 'GST 18%', 'GST 28%']

const SAMPLE_QUOTES = [
  { id: 1, number: 'QT-000001', customer: 'Amal Vishnu',  reference: '',    quoteDate: '2026-08-01', expiryDate: '', salesperson: '', project: '', subject: '', customerNotes: 'Looking forward for your business.', terms: '', discount: 0, taxType: 'TDS', tax: '', adjustment: '', items: [{ id:1, details:'Wireless Mouse', qty:1, rate:799 }] },
  { id: 2, number: 'QT-000002', customer: 'Priya Nair',   reference: 'hbj', quoteDate: '2026-09-08', expiryDate: '', salesperson: '', project: '', subject: '', customerNotes: 'Looking forward for your business.', terms: '', discount: 0, taxType: 'TDS', tax: '', adjustment: '', items: [{ id:1, details:'', qty:1, rate:0 }] },
]

const inputCls  = 'w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'
const selectCls = 'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {children}{required && ' *'}
    </label>
  )
}

function FieldRow({ label, required, half, children }) {
  return (
    <div className={`flex items-start gap-4 py-2 ${half ? 'w-1/2' : ''}`}>
      <div className="w-32 shrink-0 pt-2">
        <Label required={required}>{label}</Label>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

const EMPTY_ITEM = () => ({ id: Date.now(), details: '', qty: 1, rate: 0 })

function QuotesForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = !!id
  const existing = isEdit ? SAMPLE_QUOTES.find(q => String(q.id) === String(id)) : null
  const fileRef  = useRef()

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    customer:      existing?.customer      ?? '',
    number:        existing?.number        ?? 'QT-000003',
    reference:     existing?.reference     ?? '',
    quoteDate:     existing?.quoteDate     ?? today,
    expiryDate:    existing?.expiryDate    ?? '',
    salesperson:   existing?.salesperson   ?? '',
    project:       existing?.project       ?? '',
    subject:       existing?.subject       ?? '',
    customerNotes: existing?.customerNotes ?? 'Looking forward for your business.',
    terms:         existing?.terms         ?? '',
    discount:      existing?.discount      ?? 0,
    taxType:       existing?.taxType       ?? 'TDS',
    tax:           existing?.tax           ?? '',
    adjustment:    existing?.adjustment    ?? '',
  })

  const [items, setItems] = useState(
    existing?.items ?? [EMPTY_ITEM()]
  )
  const [errors, setErrors] = useState({})

  /* ── handlers ── */
  function handle(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  function handleItem(index, field, value) {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, [field]: value } : it))
  }

  function addRow() { setItems(prev => [...prev, EMPTY_ITEM()]) }

  function removeRow(index) {
    setItems(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== index))
  }

  /* ── totals ── */
  const subTotal     = items.reduce((s, it) => s + (Number(it.qty) * Number(it.rate)), 0)
  const discountAmt  = subTotal * (Number(form.discount) / 100)
  const adjustAmt    = Number(form.adjustment) || 0
  const total        = subTotal - discountAmt + adjustAmt

  const fmt = v => v.toFixed(2)

  /* ── submit ── */
  function validate() {
    const errs = {}
    if (!form.customer)  errs.customer  = 'Customer is required.'
    if (!form.quoteDate) errs.quoteDate = 'Quote date is required.'
    return errs
  }

  function handleSubmit(asDraft = false) {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    console.log(asDraft ? 'Draft:' : 'Send:', { ...form, items })
    navigate('/sales/quotes')
  }

  /* ── bottom bar ── */
  function BottomBar() {
    return (
      <div className="sticky bottom-0 z-10 flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleSubmit(true)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Save as Draft
          </button>
          <button type="button" onClick={() => handleSubmit(false)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
            Save and Send
          </button>
          <button type="button" onClick={() => navigate('/sales/quotes')} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition">
            Cancel
          </button>
        </div>
        <div className="text-xs text-gray-400">
          PDF Template: <span className="text-gray-600">'Spreadsheet Template'</span>{' '}
          <button className="text-blue-600 hover:underline">Change</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-50">

      {/* ── Form content ── */}
      <div className="flex-1 overflow-y-auto">

        {/* ══ Section 1 — Header fields ══ */}
        <div className="border-b border-gray-200 bg-white px-8 py-5">

          {/* Customer Name */}
          <div className="mb-4 flex items-center gap-4">
            <div className="w-32 shrink-0">
              <Label required>Customer Name</Label>
            </div>
            <div className="flex flex-1 gap-2 max-w-md">
              <div className="relative flex-1">
                <select
                  name="customer" value={form.customer} onChange={handle}
                  className={`${selectCls} ${errors.customer ? 'border-red-400' : ''}`}
                >
                  <option value="">Select or add a customer</option>
                  {CUSTOMERS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                <Search className="h-4 w-4" />
              </button>
            </div>
            {errors.customer && <p className="text-xs text-red-500">{errors.customer}</p>}
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-1">

            {/* Left column */}
            <div>
              <FieldRow label="Quote#" required>
                <div className="flex gap-2">
                  <input name="number" value={form.number} onChange={handle} className={`${inputCls} ${errors.number ? 'border-red-400' : ''}`} />
                  <button type="button" className="text-gray-400 hover:text-gray-600"><Settings className="h-4 w-4" /></button>
                </div>
              </FieldRow>

              <FieldRow label="Reference#">
                <input name="reference" value={form.reference} onChange={handle} className={inputCls} />
              </FieldRow>

              <FieldRow label="Quote Date" required>
                <input name="quoteDate" type="date" value={form.quoteDate} onChange={handle} className={`${inputCls} ${errors.quoteDate ? 'border-red-400' : ''}`} />
              </FieldRow>
            </div>

            {/* Right column */}
            <div>
              <FieldRow label="Expiry Date">
                <input name="expiryDate" type="date" value={form.expiryDate} onChange={handle} placeholder="dd/MM/yyyy" className={inputCls} />
              </FieldRow>
            </div>

          </div>

          {/* Salesperson + Project */}
          <div className="mt-2 grid grid-cols-2 gap-x-12 gap-y-1">
            <div>
              <FieldRow label="Salesperson">
                <select name="salesperson" value={form.salesperson} onChange={handle} className={selectCls}>
                  <option value="">Select or Add Salesperson</option>
                  {SALESPERSONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FieldRow>
            </div>
            <div>
              <FieldRow label="Project Name">
                <select name="project" value={form.project} onChange={handle} className={`${selectCls} ${!form.customer ? 'cursor-not-allowed opacity-60' : ''}`} disabled={!form.customer}>
                  <option value="">Select a project</option>
                </select>
                {!form.customer && <p className="mt-1 text-xs text-blue-500">Select a customer to associate a project.</p>}
              </FieldRow>
            </div>
          </div>

          {/* Subject */}
          <div className="mt-2 flex items-start gap-4">
            <div className="w-32 shrink-0 pt-2 flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">Subject</span>
              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <textarea
              name="subject" value={form.subject} onChange={handle} rows={2}
              placeholder="Let your customer know what this Quote is for"
              className={`${inputCls} max-w-md resize-none`}
            />
          </div>
        </div>

        {/* ══ Section 2 — Item Table ══ */}
        <div className="border-b border-gray-200 bg-white mt-4 px-8 py-5">

          {/* Table header */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">Item Table</span>
            <button type="button" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
              <RefreshCw className="h-3.5 w-3.5" />
              Bulk Actions
            </button>
          </div>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-6 px-2 py-2" />
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Item Details</th>
                <th className="w-28 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Quantity</th>
                <th className="w-32 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Rate</th>
                <th className="w-28 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Amount</th>
                <th className="w-8 px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-2 py-3 text-gray-300 cursor-grab"><GripVertical className="h-4 w-4" /></td>
                  <td className="px-3 py-2">
                    <input
                      value={item.details}
                      onChange={e => handleItem(i, 'details', e.target.value)}
                      placeholder="Type or click to select an item."
                      className="w-full rounded border-0 bg-transparent px-0 py-1 text-sm outline-none focus:border-b focus:border-blue-400 placeholder:text-gray-300"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number" min="0" value={item.qty}
                      onChange={e => handleItem(i, 'qty', e.target.value)}
                      className="w-full rounded border border-gray-200 px-2 py-1 text-right text-sm outline-none focus:border-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number" min="0" value={item.rate}
                      onChange={e => handleItem(i, 'rate', e.target.value)}
                      className="w-full rounded border border-gray-200 px-2 py-1 text-right text-sm outline-none focus:border-blue-400"
                    />
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
            <button type="button" onClick={addRow} className="flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition">
              <Plus className="h-3.5 w-3.5" />
              Add New Row
              <ChevronDown className="h-3 w-3" />
            </button>
            <button type="button" className="flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition">
              <Plus className="h-3.5 w-3.5" />
              Add Items in Bulk
            </button>
          </div>

          {/* Totals — right aligned */}
          <div className="mt-6 flex justify-end">
            <div className="w-80 space-y-2 text-sm">

              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Sub Total</span>
                <span className="font-semibold text-gray-800">{fmt(subTotal)}</span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Discount</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded border border-gray-200 overflow-hidden">
                    <input
                      type="number" min="0" max="100" name="discount" value={form.discount}
                      onChange={handle}
                      className="w-14 px-2 py-1 text-right text-sm outline-none"
                    />
                    <span className="border-l border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500">%</span>
                  </div>
                  <span className="w-16 text-right text-gray-700">{fmt(discountAmt)}</span>
                </div>
              </div>

              {/* TDS / TCS */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {['TDS', 'TCS'].map(t => (
                    <label key={t} className="flex cursor-pointer items-center gap-1 text-sm text-gray-600">
                      <input type="radio" name="taxType" value={t} checked={form.taxType === t} onChange={handle} className="h-3.5 w-3.5 accent-blue-600" />
                      {t}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <select name="tax" value={form.tax} onChange={handle} className="rounded border border-gray-200 px-2 py-1 text-xs outline-none w-32">
                    {TAXES.map(t => <option key={t} value={t}>{t || 'Select a Tax'}</option>)}
                  </select>
                  <span className="w-16 text-right text-gray-400">- 0.00</span>
                </div>
              </div>

              {/* Adjustment */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  <input name="adjustment" value="Adjustment" readOnly className="w-24 rounded border border-gray-200 px-2 py-1 text-xs outline-none text-gray-600" />
                  <input name="adjustment" type="number" value={form.adjustment} onChange={handle} className="w-20 rounded border border-gray-200 px-2 py-1 text-sm outline-none" />
                  <HelpCircle className="h-4 w-4 text-gray-300" />
                </div>
                <span className="w-16 text-right text-gray-700">{fmt(adjustAmt)}</span>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                <span className="text-base font-bold text-gray-800">Total ( ₹ )</span>
                <span className="text-base font-bold text-gray-900">{fmt(total)}</span>
              </div>

            </div>
          </div>
        </div>

        {/* ══ Section 3 — Notes, Terms, Attachments ══ */}
        <div className="mt-4 bg-white px-8 py-6">
          <div className="grid grid-cols-2 gap-8">

            {/* Left */}
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Customer Notes</label>
                <textarea
                  name="customerNotes" value={form.customerNotes} onChange={handle} rows={4}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Terms &amp; Conditions</label>
                <textarea
                  name="terms" value={form.terms} onChange={handle} rows={4}
                  placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Right */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Attach File(s) to Quote</label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 rounded-l-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  <Upload className="h-4 w-4" />
                  Upload File
                </button>
                <button type="button" className="rounded-r-lg border border-l-0 border-gray-300 bg-white px-2 py-2 text-gray-500 hover:bg-gray-50">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <input ref={fileRef} type="file" multiple className="hidden" />
              </div>
              <p className="mt-2 text-xs text-gray-400">You can upload a maximum of 5 files, 10MB each</p>
            </div>

          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-6" />
      </div>

      <BottomBar />
    </div>
  )
}

export default QuotesForm
