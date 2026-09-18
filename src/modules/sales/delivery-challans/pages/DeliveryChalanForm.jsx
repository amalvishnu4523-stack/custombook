import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Search, Settings, Plus, ChevronDown,
  Upload, HelpCircle, GripVertical, Trash2,
} from 'lucide-react'

/* ── Static options ── */
const CUSTOMERS     = ['Amal Vishnu', 'Priya Nair', 'Rahul Menon', 'Sneha Thomas', 'Kiran Kumar']
const CHALLAN_TYPES = [
  'Supply of Liquid Gas',
  'Job Work',
  'Supply on Approval',
  'Others',
]

/* ── Sample existing challans (for edit mode) ── */
const SAMPLE_CHALLANS = [
  {
    id: 1,
    number: 'DC-00001',
    customer: 'abc',
    reference: '',
    challanDate: '2026-09-15',
    challanType: 'Supply of Liquid Gas',
    customerNotes: '',
    terms: '',
    discount: 0,
    adjustment: '',
    items: [{ id: 1, details: 'bike', description: 'nbb', qty: 1, rate: 777 }],
  },
  {
    id: 2,
    number: 'DC-00002',
    customer: 'Rahul Menon',
    reference: '',
    challanDate: '2026-09-16',
    challanType: 'Job Work',
    customerNotes: '',
    terms: '',
    discount: 0,
    adjustment: '',
    items: [{ id: 1, details: 'Monitor Stand', description: '', qty: 1, rate: 5500 }],
  },
]

/* ── Helpers ── */
const inputCls  = 'w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'
const selectCls = 'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {children}{required && <span className="text-red-400"> *</span>}
    </label>
  )
}

function FieldRow({ label, required, children }) {
  return (
    <div className="flex items-start gap-4 py-2">
      <div className="w-44 shrink-0 pt-2">
        <Label required={required}>{label}</Label>
      </div>
      <div className="flex-1 max-w-xs">{children}</div>
    </div>
  )
}

const EMPTY_ITEM = () => ({ id: Date.now(), details: '', description: '', qty: 1, rate: 0 })

function DeliveryChalanForm() {
  const navigate  = useNavigate()
  const { id }    = useParams()
  const isEdit    = !!id
  const existing  = isEdit ? SAMPLE_CHALLANS.find(c => String(c.id) === String(id)) : null
  const fileRef   = useRef()

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    customer:      existing?.customer      ?? '',
    number:        existing?.number        ?? 'DC-00002',
    reference:     existing?.reference     ?? '',
    challanDate:   existing?.challanDate   ?? today,
    challanType:   existing?.challanType   ?? '',
    customerNotes: existing?.customerNotes ?? '',
    terms:         existing?.terms         ?? '',
    discount:      existing?.discount      ?? 0,
    adjustment:    existing?.adjustment    ?? '',
  })

  const [items, setItems] = useState(existing?.items ?? [EMPTY_ITEM()])
  const [errors, setErrors] = useState({})

  /* ── field handlers ── */
  function handle(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  function handleItem(index, field, value) {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, [field]: value } : it))
  }

  function addRow()        { setItems(prev => [...prev, EMPTY_ITEM()]) }
  function removeRow(idx)  { setItems(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)) }

  /* ── totals ── */
  const subTotal    = items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0)
  const discountAmt = subTotal * (Number(form.discount) / 100)
  const adjustAmt   = Number(form.adjustment) || 0
  const total       = subTotal - discountAmt + adjustAmt
  const fmt         = v => Number(v).toFixed(2)

  /* ── validation ── */
  function validate() {
    const errs = {}
    if (!form.customer)    errs.customer    = 'Customer is required.'
    if (!form.challanDate) errs.challanDate = 'Challan date is required.'
    if (!form.challanType) errs.challanType = 'Challan type is required.'
    return errs
  }

  /* ── submit ── */
  function handleSubmit(asDraft = false) {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    console.log(isEdit ? 'Update Challan:' : 'Create Challan:', { ...form, asDraft, items })
    navigate('/sales/delivery-challans')
  }

  /* ── bottom bar ── */
  function BottomBar() {
    return (
      <div className="sticky bottom-0 z-10 flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            {isEdit ? 'Update' : 'Save as Draft'}
          </button>
          {!isEdit && (
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Save and Send
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/sales/delivery-challans')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
          >
            Cancel
          </button>
        </div>
        <div className="text-xs text-gray-400">
          PDF Template: <span className="text-gray-600">'Standard Template'</span>{' '}
          <button type="button" className="text-blue-600 hover:underline">Change</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto">

        {/* ══ Header ══ */}
        <div className="border-b border-gray-200 bg-white px-8 py-5">

          {/* Page title */}
          <h1 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span className="text-gray-500">🚚</span>
            {isEdit ? `Edit Delivery Challan — ${existing?.number}` : 'New Delivery Challan'}
          </h1>

          {/* Customer Name */}
          <div className="mb-4 flex items-center gap-4">
            <div className="w-44 shrink-0">
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
                {CUSTOMERS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
            {errors.customer && <p className="text-xs text-red-500">{errors.customer}</p>}
          </div>

          {/* Meta fields */}
          <div className="grid grid-cols-2 gap-x-16">
            <div>
              {/* Delivery Challan # */}
              <FieldRow label="Delivery Challan#" required>
                <div className="flex items-center gap-2">
                  <input
                    name="number"
                    value={form.number}
                    onChange={handle}
                    className={`${inputCls} ${errors.number ? 'border-red-400' : ''}`}
                  />
                  <button type="button" className="shrink-0 text-gray-400 hover:text-gray-600">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </FieldRow>

              {/* Reference # */}
              <FieldRow label="Reference#">
                <input name="reference" value={form.reference} onChange={handle} className={inputCls} />
              </FieldRow>

              {/* Challan Date */}
              <FieldRow label="Delivery Challan Date" required>
                <input
                  name="challanDate"
                  type="date"
                  value={form.challanDate}
                  onChange={handle}
                  className={`${inputCls} ${errors.challanDate ? 'border-red-400' : ''}`}
                />
                {errors.challanDate && <p className="mt-1 text-xs text-red-500">{errors.challanDate}</p>}
              </FieldRow>

              {/* Challan Type */}
              <FieldRow label="Challan Type" required>
                <select
                  name="challanType"
                  value={form.challanType}
                  onChange={handle}
                  className={`${selectCls} ${errors.challanType ? 'border-red-400' : ''}`}
                >
                  <option value="">Choose a proper challan type.</option>
                  {CHALLAN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.challanType && <p className="mt-1 text-xs text-red-500">{errors.challanType}</p>}
              </FieldRow>
            </div>
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
                <th className="w-32 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Quantity
                </th>
                <th className="w-36 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
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
                      className="mt-0.5 w-full rounded border-0 bg-transparent px-0 py-0.5 text-xs text-gray-400 outline-none placeholder:text-gray-200 focus:border-b focus:border-blue-300"
                    />
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
              className="flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
            >
              <Plus className="h-3.5 w-3.5" />
              Add New Row
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Items in Bulk
            </button>
          </div>

          {/* Totals */}
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
                  <div className="flex items-center overflow-hidden rounded border border-gray-200">
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

              {/* Adjustment */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Adjustment</span>
                  <input
                    name="adjustment"
                    type="number"
                    value={form.adjustment}
                    onChange={handle}
                    className="w-24 rounded border border-gray-200 px-2 py-1 text-right text-sm outline-none ml-2"
                  />
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

        {/* ══ Notes, Terms & Attachments ══ */}
        <div className="mt-4 bg-white px-8 py-6">
          <div className="grid grid-cols-2 gap-8">

            {/* Left — Notes + Terms */}
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Customer Notes</label>
                <textarea
                  name="customerNotes"
                  value={form.customerNotes}
                  onChange={handle}
                  rows={4}
                  placeholder="Enter any notes to be displayed in your transaction"
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Terms &amp; Conditions</label>
                <textarea
                  name="terms"
                  value={form.terms}
                  onChange={handle}
                  rows={4}
                  placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Right — Attachments */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Attach File(s) to Delivery Challan
              </label>
              <div className="flex items-center gap-0">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 rounded-l-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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
              <p className="mt-2 text-xs text-gray-400">You can upload a maximum of 5 files, 10MB each</p>
            </div>

          </div>
        </div>

        <div className="h-6" />
      </div>

      <BottomBar />
    </div>
  )
}

export default DeliveryChalanForm
