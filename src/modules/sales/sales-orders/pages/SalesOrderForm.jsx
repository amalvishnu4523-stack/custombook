import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search, Settings, Plus, ChevronDown, Upload, RefreshCw, HelpCircle, GripVertical, Trash2 } from 'lucide-react'

/* ── Sample data ── */
const CUSTOMERS       = ['Amal Vishnu', 'Priya Nair', 'Rahul Menon', 'Sneha Thomas', 'Kiran Kumar']
const SALESPERSONS    = ['Amal Vishnu', 'Priya Nair']
const PAYMENT_TERMS   = ['Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60']
const DELIVERY_METHODS = ['Standard Shipping', 'Express Delivery', 'Pickup', 'Courier']
const TAXES           = ['', 'GST 5%', 'GST 12%', 'GST 18%', 'GST 28%']

export const SAMPLE_SALES_ORDERS = [
  {
    id: 1, number: 'SO-00001', customer: 'Amal Vishnu', reference: '',
    orderDate: '2026-08-02', shipmentDate: '', paymentTerms: 'Due on Receipt',
    deliveryMethod: '', salesperson: '',
    customerNotes: '', terms: '', discount: 0, taxType: 'TDS', tax: '', adjustment: '',
    items: [{ id: 1, details: 'Wireless Mouse', qty: 2, rate: 799 }],
  },
  {
    id: 2, number: 'SO-00002', customer: 'Kiran Kumar', reference: '',
    orderDate: '2026-09-09', shipmentDate: '', paymentTerms: 'Net 30',
    deliveryMethod: '', salesperson: '',
    customerNotes: '', terms: '', discount: 0, taxType: 'TDS', tax: '', adjustment: '',
    items: [{ id: 1, details: '', qty: 1, rate: 0 }],
  },
]

/* ── Shared styles ── */
const inputCls  = 'w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'
const selectCls = 'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {children}{required && ' *'}
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

function SalesOrderForm() {
  const navigate  = useNavigate()
  const { id }    = useParams()
  const isEdit    = !!id
  const existing  = isEdit ? SAMPLE_SALES_ORDERS.find(o => String(o.id) === String(id)) : null
  const fileRef   = useRef()

  const today = new Date().toLocaleDateString('en-GB').split('/').join('/')

  const [form, setForm] = useState({
    customer:      existing?.customer      ?? '',
    number:        existing?.number        ?? 'SO-00002',
    reference:     existing?.reference     ?? '',
    orderDate:     existing?.orderDate     ?? new Date().toISOString().split('T')[0],
    shipmentDate:  existing?.shipmentDate  ?? '',
    paymentTerms:  existing?.paymentTerms  ?? 'Due on Receipt',
    deliveryMethod: existing?.deliveryMethod ?? '',
    salesperson:   existing?.salesperson   ?? '',
    customerNotes: existing?.customerNotes ?? '',
    terms:         existing?.terms         ?? '',
    discount:      existing?.discount      ?? 0,
    taxType:       existing?.taxType       ?? 'TDS',
    tax:           existing?.tax           ?? '',
    adjustment:    existing?.adjustment    ?? '',
  })

  const [items, setItems] = useState(existing?.items ?? [EMPTY_ITEM()])
  const [errors, setErrors] = useState({})

  function handle(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  function handleItem(index, field, value) {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, [field]: value } : it))
  }

  function addRow()        { setItems(prev => [...prev, EMPTY_ITEM()]) }
  function removeRow(idx)  { setItems(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)) }

  /* ── Totals ── */
  const subTotal    = items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0)
  const discountAmt = subTotal * (Number(form.discount) / 100)
  const adjustAmt   = Number(form.adjustment) || 0
  const total       = subTotal - discountAmt + adjustAmt
  const totalQty    = items.reduce((s, it) => s + Number(it.qty), 0)

  const fmt = v => v.toFixed(2)

  function validate() {
    const errs = {}
    if (!form.customer)  errs.customer  = 'Customer is required.'
    if (!form.orderDate) errs.orderDate = 'Order date is required.'
    return errs
  }

  function handleSubmit(asDraft = false) {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    console.log(asDraft ? 'Draft:' : 'Send:', { ...form, items })
    navigate('/sales/orders')
  }

  /* ── Sticky bottom bar ── */
  function BottomBar() {
    return (
      <div className="sticky bottom-0 z-10 flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleSubmit(true)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Save as Draft
          </button>
          <div className="flex overflow-hidden rounded-lg">
            <button type="button" onClick={() => handleSubmit(false)}
              className="rounded-l-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
              Save and Send
            </button>
            <button type="button"
              className="rounded-r-lg border-l border-blue-700 bg-blue-600 px-2 py-2 text-white hover:bg-blue-700 transition">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <button type="button" onClick={() => navigate('/sales/orders')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition">
            Cancel
          </button>
        </div>
        <div className="text-sm text-gray-500">
          <span>Total Amount: <span className="font-medium text-gray-800">₹ {fmt(total)}</span></span>
          <span className="ml-6">Total Quantity: <span className="font-medium text-gray-800">{totalQty}</span></span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto">

        {/* ══ Section 1 — Header fields ══ */}
        <div className="border-b border-gray-200 bg-white px-8 py-5">

          {/* Customer Name */}
          <div className="mb-4 flex items-center gap-4">
            <div className="w-44 shrink-0">
              <Label required>Customer Name</Label>
            </div>
            <div className="flex gap-2 max-w-sm flex-1">
              <select name="customer" value={form.customer} onChange={handle}
                className={`${selectCls} ${errors.customer ? 'border-red-400' : ''}`}>
                <option value="">Select or add a customer</option>
                {CUSTOMERS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                <Search className="h-4 w-4" />
              </button>
            </div>
            {errors.customer && <p className="text-xs text-red-500">{errors.customer}</p>}
          </div>

          {/* Fields */}
          <FieldRow label="Sales Order#" required>
            <div className="flex gap-2">
              <input name="number" value={form.number} onChange={handle}
                className={`${inputCls} ${errors.number ? 'border-red-400' : ''}`} />
              <button type="button" className="text-gray-400 hover:text-gray-600 shrink-0">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </FieldRow>

          <FieldRow label="Reference#" hint>
            <input name="reference" value={form.reference} onChange={handle} className={inputCls} />
          </FieldRow>

          <FieldRow label="Sales Order Date" required>
            <input name="orderDate" type="date" value={form.orderDate} onChange={handle}
              className={`${inputCls} ${errors.orderDate ? 'border-red-400' : ''}`} />
          </FieldRow>

          <FieldRow label="Expected Shipment Date">
            <input name="shipmentDate" type="date" value={form.shipmentDate} onChange={handle}
              placeholder="dd/MM/yyyy" className={inputCls} />
          </FieldRow>

          <FieldRow label="Payment Terms">
            <select name="paymentTerms" value={form.paymentTerms} onChange={handle} className={selectCls}>
              {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FieldRow>

          <FieldRow label="Delivery Method">
            <select name="deliveryMethod" value={form.deliveryMethod} onChange={handle} className={selectCls}>
              <option value="">Select a delivery method or type to add</option>
              {DELIVERY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </FieldRow>

          <FieldRow label="Salesperson">
            <select name="salesperson" value={form.salesperson} onChange={handle} className={selectCls}>
              <option value="">Select or Add Salesperson</option>
              {SALESPERSONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </FieldRow>

        </div>

        {/* ══ Section 2 — Item Table ══ */}
        <div className="border-b border-gray-200 bg-white mt-4 px-8 py-5">

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
                <Plus className="h-3.5 w-3.5" />
                Add New Row
              </button>
              <button type="button" className="border-l border-blue-300 bg-blue-50 px-2 py-1.5 text-blue-600 hover:bg-blue-100 transition">
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <button type="button"
              className="flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition">
              <Plus className="h-3.5 w-3.5" />
              Add Items in Bulk
            </button>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-80 space-y-2 text-sm">

              <div className="flex items-center justify-between font-semibold text-gray-700">
                <span>Sub Total</span>
                <span className="text-gray-800">{fmt(subTotal)}</span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Discount</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center overflow-hidden rounded border border-gray-200">
                    <input type="number" min="0" max="100" name="discount" value={form.discount} onChange={handle}
                      className="w-14 px-2 py-1 text-right text-sm outline-none" />
                    <span className="border-l border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500">%</span>
                  </div>
                  <span className={`w-16 text-right ${discountAmt > 0 ? 'text-orange-500' : 'text-orange-400'}`}>{fmt(discountAmt)}</span>
                </div>
              </div>

              {/* TDS / TCS + Tax */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {['TDS', 'TCS'].map(t => (
                    <label key={t} className="flex cursor-pointer items-center gap-1 text-sm text-gray-600">
                      <input type="radio" name="taxType" value={t} checked={form.taxType === t} onChange={handle}
                        className="h-3.5 w-3.5 accent-blue-600" />
                      {t}
                    </label>
                  ))}
                </div>
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
                <textarea name="customerNotes" value={form.customerNotes} onChange={handle} rows={4}
                  placeholder="Enter any notes to be displayed in your transaction"
                  className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Terms &amp; Conditions</label>
                <textarea name="terms" value={form.terms} onChange={handle} rows={4}
                  placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                  className={`${inputCls} resize-none`} />
              </div>
            </div>

            {/* Right — Attachments */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Attach File(s) to Sales Order</label>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 rounded-l-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  <Upload className="h-4 w-4" />
                  Upload File
                </button>
                <button type="button" className="rounded-r-lg border border-l-0 border-gray-300 bg-white px-2 py-2 text-gray-500 hover:bg-gray-50">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <input ref={fileRef} type="file" multiple className="hidden" />
              </div>
              <p className="mt-2 text-xs text-gray-400">You can upload a maximum of 10 files, 5MB each</p>
            </div>

          </div>
        </div>

        {/* ══ Additional Fields note ══ */}
        <div className="bg-white px-8 py-4 mt-px border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Additional Fields:</span>{' '}
            Add custom fields to your sales orders by going to{' '}
            <span className="italic">Settings ➜ Sales ➜ Sales Orders ➜ Field Customization.</span>
          </p>
        </div>

        <div className="h-6" />
      </div>

      <BottomBar />
    </div>
  )
}

export default SalesOrderForm
