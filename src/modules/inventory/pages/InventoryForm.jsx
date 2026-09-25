import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getAdjustmentById, createAdjustment, updateAdjustment } from '../api/inventoryApi'

const REASONS = [
  'Stock Written off', 'Automobile Usage', 'Stolen goods',
  'Damaged goods', 'Opening Stock', 'Other',
]
const TYPES    = ['Quantity', 'Value']
const ACCOUNTS = ['Inventory Asset', 'Cost of Goods Sold', 'Stock Written Off', 'Other Expenses']

const inputCls  = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
const selectCls = `${inputCls} cursor-pointer`

function Label({ children, required }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-gray-700">
      {children}{required && <span className="ml-0.5 text-red-400">*</span>}
    </label>
  )
}

const EMPTY_ITEM = () => ({ id: Date.now(), item: '', qty: '', rate: '', account: '' })

function toISODate(val) {
  if (!val) return new Date().toISOString().split('T')[0]
  // already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
  try { return new Date(val).toISOString().split('T')[0] } catch { return val }
}

function InventoryForm() {
  const navigate    = useNavigate()
  const { id }      = useParams()
  const isEdit      = !!id

  const [form, setForm] = useState({
    date:        new Date().toISOString().split('T')[0],
    reason:      '',
    type:        'Quantity',
    reference:   '',
    description: '',
    account:     'Inventory Asset',
    location:    '',
    notes:       '',
  })

  const [items,       setItems]       = useState([EMPTY_ITEM()])
  const [errors,      setErrors]      = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading,     setLoading]     = useState(false)
  const [fetching,    setFetching]    = useState(isEdit)

  // Fetch existing adjustment in edit mode
  useEffect(() => {
    if (!isEdit) return
    setFetching(true)
    getAdjustmentById(id)
      .then(res => {
        if (res.success && res.data) {
          const d = res.data
          setForm({
            date:        toISODate(d.date ?? d.adjustment_date),
            reason:      d.reason      ?? '',
            type:        d.adjustment_type ?? d.type ?? 'Quantity',
            reference:   d.reference_number ?? d.reference ?? '',
            description: d.description ?? '',
            account:     d.account ?? d.inventory_account ?? 'Inventory Asset',
            location:    d.location    ?? '',
            notes:       d.notes       ?? '',
          })
          // Map line items
          const lineItems = d.items ?? d.line_items ?? []
          if (lineItems.length > 0) {
            setItems(lineItems.map((it, i) => ({
              id:      Date.now() + i,
              item:    it.item_name ?? it.name ?? it.item ?? '',
              qty:     it.quantity_adjusted ?? it.quantity ?? it.qty ?? '',
              rate:    it.rate ?? it.purchase_rate ?? '',
              account: it.account ?? it.inventory_account ?? '',
            })))
          }
        } else {
          setSubmitError('Failed to load adjustment data.')
        }
      })
      .catch(err => {
        setSubmitError(err?.response?.data?.detail || err?.message || 'Failed to load adjustment.')
      })
      .finally(() => setFetching(false))
  }, [id])

  function handle(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  function handleItem(idx, field, value) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it))
  }

  function addRow()       { setItems(prev => [...prev, EMPTY_ITEM()]) }
  function removeRow(idx) { setItems(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)) }

  function validate() {
    const errs = {}
    if (!form.date)   errs.date   = 'Date is required.'
    if (!form.reason) errs.reason = 'Reason is required.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setSubmitError('')

    const payload = {
      date:             form.date,
      reason:           form.reason,
      adjustment_type:  form.type,
      reference_number: form.reference,
      description:      form.description,
      account:          form.account,
      location:         form.location,
      notes:            form.notes,
      items: items.map(it => ({
        item:    it.item,
        quantity: it.qty,
        rate:    it.rate,
        account: it.account,
      })),
    }

    try {
      if (isEdit) {
        await updateAdjustment(id, payload)
      } else {
        await createAdjustment(payload)
      }
      navigate('/inventory')
    } catch (err) {
      const data = err?.response?.data
      if (data?.errors && typeof data.errors === 'object') {
        const fieldErrs = {}
        Object.entries(data.errors).forEach(([k, v]) => {
          fieldErrs[k] = Array.isArray(v) ? v[0] : String(v)
        })
        setErrors(fieldErrs)
      }
      setSubmitError(
        data?.message || data?.detail || err?.message || 'Failed to save adjustment.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-50">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/inventory')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-bold text-gray-900">
            {isEdit ? 'Edit Inventory Adjustment' : 'New Inventory Adjustment'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate('/inventory')}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="submit" form="inventory-form" disabled={loading || fetching}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60">
            {(loading || fetching) && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
              </svg>
            )}
            {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {/* ── Loading spinner ── */}
      {fetching && (
        <div className="flex items-center justify-center py-20 text-sm text-gray-400">
          <svg className="mr-2 h-5 w-5 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
          </svg>
          Loading adjustment…
        </div>
      )}

      {/* ── API error ── */}
      {submitError && (
        <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {submitError}
        </div>
      )}

      {/* ── Form ── */}
      {!fetching && (
        <form id="inventory-form" onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl space-y-5 px-6 py-6">

          {/* Basic Details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-sm font-semibold text-gray-700">Adjustment Details</h2>
            <div className="grid grid-cols-2 gap-5">

              <div>
                <Label required>Date</Label>
                <input type="date" name="date" value={form.date} onChange={handle}
                  className={`${inputCls} ${errors.date ? 'border-red-300' : ''}`} />
                {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
              </div>

              <div>
                <Label required>Reason</Label>
                <select name="reason" value={form.reason} onChange={handle}
                  className={`${selectCls} ${errors.reason ? 'border-red-300' : ''}`}>
                  <option value="">Select a reason</option>
                  {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason}</p>}
              </div>

              <div>
                <Label>Type</Label>
                <select name="type" value={form.type} onChange={handle} className={selectCls}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <Label>Reference Number</Label>
                <input name="reference" value={form.reference} onChange={handle}
                  placeholder="e.g. REF-001" className={inputCls} />
              </div>

              <div>
                <Label>Account</Label>
                <select name="account" value={form.account} onChange={handle} className={selectCls}>
                  {ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <Label>Location</Label>
                <input name="location" value={form.location} onChange={handle}
                  placeholder="e.g. warehouse1" className={inputCls} />
              </div>

              <div className="col-span-2">
                <Label>Description</Label>
                <textarea name="description" value={form.description} onChange={handle}
                  rows={2} placeholder="Optional description" className={`${inputCls} resize-none`} />
              </div>

            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Items</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">#</th>
                  <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Item</th>
                  <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-28">Quantity</th>
                  {form.type === 'Value' && (
                    <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-28">Rate</th>
                  )}
                  <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Account</th>
                  <th className="pb-2 w-8" />
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="py-2 pr-3">
                      <input value={item.item} onChange={e => handleItem(i, 'item', e.target.value)}
                        placeholder="Type or select an item" className={inputCls} />
                    </td>
                    <td className="py-2 pr-3">
                      <input type="number" min="0" value={item.qty}
                        onChange={e => handleItem(i, 'qty', e.target.value)} className={inputCls} />
                    </td>
                    {form.type === 'Value' && (
                      <td className="py-2 pr-3">
                        <input type="number" min="0" value={item.rate}
                          onChange={e => handleItem(i, 'rate', e.target.value)} className={inputCls} />
                      </td>
                    )}
                    <td className="py-2 pr-3">
                      <select value={item.account} onChange={e => handleItem(i, 'account', e.target.value)} className={selectCls}>
                        <option value="">Select account</option>
                        {ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </td>
                    <td className="py-2 text-center">
                      <button type="button" onClick={() => removeRow(i)}
                        className="text-gray-300 hover:text-red-400 transition text-lg leading-none">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={addRow}
              className="mt-4 flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition">
              + Add Row
            </button>
          </div>

          {/* Notes */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <Label>Notes</Label>
            <textarea name="notes" value={form.notes} onChange={handle} rows={3}
              placeholder="Internal notes (not visible to customers)" className={`${inputCls} resize-none`} />
          </div>

          <div className="h-4" />
        </form>
      )}
    </div>
  )
}

export default InventoryForm
