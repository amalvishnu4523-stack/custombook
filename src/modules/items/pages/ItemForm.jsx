import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ImageIcon, ArrowLeft } from 'lucide-react'
import { createItem, updateItem, getItemById } from '../api/itemsApi'

const UNITS              = ['box', 'cm', 'doz', 'ft', 'g', 'hrs', 'kg', 'km', 'ltr', 'mg', 'm', 'pcs', 'set']
const SALES_ACCOUNTS     = ['Sales', 'Product Sales', 'Service Revenue', 'Other Income']
const PURCHASE_ACCOUNTS  = ['Cost of Goods Sold', 'Purchases', 'Inventory', 'Other Expenses']
const INVENTORY_ACCOUNTS = ['Inventory Asset', 'Stock in Hand', 'Raw Materials']
const VALUATION_METHODS  = [
  { value: 'fifo',             label: 'FIFO' },
  { value: 'weighted_average', label: 'Weighted Average' },
]

const inputCls  = 'w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'
const selectCls = `${inputCls} bg-white`

function Label({ children, required }) {
  return (
    <label className="mb-1 block text-sm text-gray-600">
      {children}{required && <span className="ml-0.5 text-red-500"> *</span>}
    </label>
  )
}

function InrInput({ name, value, onChange, placeholder = '0.00' }) {
  return (
    <div className="flex">
      <span className="flex items-center rounded-l border border-r-0 border-gray-300 bg-gray-50 px-3 text-xs font-medium text-gray-500">
        INR
      </span>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min="0"
        step="0.01"
        className="w-full rounded-r border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
      />
    </div>
  )
}

function SectionHeader({ label, name, checked, onToggle }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-base font-semibold text-gray-800">
      <input type="checkbox" name={name} checked={checked} onChange={onToggle} className="h-4 w-4 rounded accent-blue-600" />
      {label}
    </label>
  )
}

function ItemForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const fileRef  = useRef()
  const isEdit   = !!id

  const emptyForm = {
    name:               '',
    item_type:          'goods',
    sku:                '',
    unit:               '',
    is_excise_product:  false,
    sales_enabled:      true,
    selling_price:      '',
    sales_account:      'Sales',
    sales_description:  '',
    tax:                '',
    purchase_enabled:   true,
    cost_price:         '',
    purchase_account:   'Cost of Goods Sold',
    purchase_description: '',
    preferred_vendor_id: null,
    track_inventory:    true,
    inventory_account:  'Inventory Asset',
    opening_stock:      '0',
    rate_per_unit:      '0.00',
    valuation_method:   'fifo',
    image:              null,
    imagePreview:       null,
  }

  const [form,        setForm]        = useState(emptyForm)
  const [errors,      setErrors]      = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading,     setLoading]     = useState(false)
  const [fetching,    setFetching]    = useState(isEdit)

  // Fetch existing item when in edit mode
  useEffect(() => {
    if (!isEdit) return
    setFetching(true)
    getItemById(id)
      .then(res => {
        if (res.success) {
          const d = res.data
          setForm({
            name:                 d.name               ?? '',
            item_type:            d.item_type           ?? 'goods',
            sku:                  d.sku                 ?? '',
            unit:                 d.unit                ?? '',
            is_excise_product:    d.is_excise_product   ?? false,
            sales_enabled:        d.sales_enabled       ?? true,
            selling_price:        d.selling_price       ?? '',
            sales_account:        d.sales_account       ?? 'Sales',
            sales_description:    d.sales_description   ?? '',
            tax:                  d.tax                 ?? '',
            purchase_enabled:     d.purchase_enabled    ?? true,
            cost_price:           d.cost_price          ?? '',
            purchase_account:     d.purchase_account    ?? 'Cost of Goods Sold',
            purchase_description: d.purchase_description ?? '',
            preferred_vendor_id:  d.preferred_vendor_id ?? null,
            track_inventory:      d.track_inventory     ?? true,
            inventory_account:    d.inventory_account   ?? 'Inventory Asset',
            opening_stock:        d.opening_stock       ?? '0',
            rate_per_unit:        d.rate_per_unit       ?? '0.00',
            valuation_method:     ['fifo','weighted_average'].includes(d.valuation_method)
                                    ? d.valuation_method : 'fifo',
            image:                null,
            imagePreview:         d.image_url ?? null,
          })
        }
      })
      .catch(err => setSubmitError(err?.response?.data?.message || 'Failed to load item.'))
      .finally(() => setFetching(false))
  }, [id])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  function handleImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setForm(p => ({ ...p, image: file, imagePreview: URL.createObjectURL(file) }))
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file?.type.startsWith('image/')) return
    setForm(p => ({ ...p, image: file, imagePreview: URL.createObjectURL(file) }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())                              errs.name          = 'Name is required.'
    if (form.sales_enabled    && !form.selling_price)   errs.selling_price = 'Selling price is required.'
    if (form.purchase_enabled && !form.cost_price)      errs.cost_price    = 'Cost price is required.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setSubmitError('')

    const payload = {
      item_type:            form.item_type,
      name:                 form.name,
      sku:                  form.sku,
      unit:                 form.unit,
      is_excise_product:    form.is_excise_product,
      sales_enabled:        form.sales_enabled,
      selling_price:        form.sales_enabled    ? form.selling_price      : '0.00',
      sales_account:        form.sales_enabled    ? form.sales_account      : '',
      sales_description:    form.sales_enabled    ? form.sales_description  : '',
      tax:                  form.tax,
      purchase_enabled:     form.purchase_enabled,
      cost_price:           form.purchase_enabled ? form.cost_price         : '0.00',
      purchase_account:     form.purchase_enabled ? form.purchase_account   : '',
      purchase_description: form.purchase_enabled ? form.purchase_description : '',
      preferred_vendor_id:  form.preferred_vendor_id || null,
      track_inventory:      form.track_inventory,
      inventory_account:    form.track_inventory   ? form.inventory_account  : '',
      opening_stock:        form.track_inventory   ? form.opening_stock       : '0',
      rate_per_unit:        form.rate_per_unit,
      valuation_method:     ['fifo', 'weighted_average'].includes(form.valuation_method)
                              ? form.valuation_method
                              : 'fifo',
    }

    try {
      if (isEdit) {
        await updateItem(id, payload)
        navigate(`/items/${id}`)
      } else {
        await createItem(payload)
        navigate('/items')
      }
    } catch (err) {
      const data = err?.response?.data
      console.error('Item save error:', JSON.stringify(data, null, 2))

      // Map field-level errors from backend
      if (data && typeof data === 'object') {
        const fieldErrs = {}
        const source = data.errors ?? data
        Object.entries(source).forEach(([k, v]) => {
          if (k !== 'detail' && k !== 'message') {
            fieldErrs[k] = Array.isArray(v) ? v[0] : String(v)
          }
        })
        if (Object.keys(fieldErrs).length) setErrors(fieldErrs)
      }

      setSubmitError(
        data?.message ||
        data?.detail ||
        (typeof data === 'object' ? JSON.stringify(data) : null) ||
        err?.message ||
        'Failed to save item.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full bg-gray-50">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(isEdit ? `/items/${id}` : '/items')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Item' : 'New Item'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(isEdit ? `/items/${id}` : '/items')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="submit" form="item-form" disabled={loading || fetching}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-60">
            {loading && <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>}
            {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {fetching && (
        <div className="flex items-center justify-center py-20 text-sm text-gray-400">
          <svg className="mr-2 h-5 w-5 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>
          Loading item…
        </div>
      )}

      {/* API error */}
      {submitError && (
        <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {submitError}
        </div>
      )}

      {/* ── Form ── */}
      {!fetching && (
      <form id="item-form" onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-5 px-6 py-6">

        {/* ── Basic Info ── */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex gap-8">
            <div className="flex-1 space-y-5">

              {/* Name */}
              <div>
                <Label required>Name</Label>
                <input name="name" value={form.name} onChange={handleChange} autoComplete="off"
                  className={`${inputCls} ${errors.name ? 'border-red-400' : ''}`} />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* SKU */}
              <div>
                <Label>SKU</Label>
                <input name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. PEN-01" className={inputCls} />
                {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku}</p>}
              </div>

              {/* Type */}
              <div>
                <Label>Type</Label>
                <div className="mt-1 flex items-center gap-6">
                  {[{ value: 'goods', label: 'Goods' }, { value: 'service', label: 'Service' }].map(t => (
                    <label key={t.value} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                      <input type="radio" name="item_type" value={t.value} checked={form.item_type === t.value}
                        onChange={handleChange} className="h-4 w-4 accent-blue-600" />
                      {t.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Unit */}
              <div>
                <Label>Unit</Label>
                <select name="unit" value={form.unit} onChange={handleChange} className={selectCls}>
                  <option value="">Select or type to add</option>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              {/* Excise */}
              <div>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" name="is_excise_product" checked={form.is_excise_product}
                    onChange={handleChange} className="h-4 w-4 accent-blue-600" />
                  Is Excise Product
                </label>
              </div>

            </div>

            {/* Image */}
            <div className="w-48 shrink-0" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
              <div onClick={() => fileRef.current?.click()}
                className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-blue-400 hover:bg-blue-50">
                {form.imagePreview ? (
                  <img src={form.imagePreview} alt="preview" className="h-full w-full rounded-xl object-cover" />
                ) : (
                  <>
                    <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-xs leading-snug text-blue-500">Drag image(s) here or<br /><span className="underline">Browse images</span></p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </div>
          </div>
        </div>

        {/* ── Sales Information ── */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionHeader label="Sales Information" name="sales_enabled" checked={form.sales_enabled} onToggle={handleChange} />
          {form.sales_enabled && (
            <div className="mt-5 grid grid-cols-2 gap-5">
              <div>
                <Label required>Selling Price</Label>
                <InrInput name="selling_price" value={form.selling_price} onChange={handleChange} />
                {errors.selling_price && <p className="mt-1 text-xs text-red-500">{errors.selling_price}</p>}
              </div>
              <div>
                <Label required>Account</Label>
                <select name="sales_account" value={form.sales_account} onChange={handleChange} className={selectCls}>
                  {SALES_ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <Label>Tax</Label>
                <input name="tax" value={form.tax} onChange={handleChange} placeholder="e.g. GST 18%" className={inputCls} />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <textarea name="sales_description" value={form.sales_description} onChange={handleChange}
                  rows={3} className={`${inputCls} resize-none`} />
              </div>
            </div>
          )}
        </div>

        {/* ── Purchase Information ── */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionHeader label="Purchase Information" name="purchase_enabled" checked={form.purchase_enabled} onToggle={handleChange} />
          {form.purchase_enabled && (
            <div className="mt-5 grid grid-cols-2 gap-5">
              <div>
                <Label required>Cost Price</Label>
                <InrInput name="cost_price" value={form.cost_price} onChange={handleChange} />
                {errors.cost_price && <p className="mt-1 text-xs text-red-500">{errors.cost_price}</p>}
              </div>
              <div>
                <Label required>Account</Label>
                <select name="purchase_account" value={form.purchase_account} onChange={handleChange} className={selectCls}>
                  {PURCHASE_ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <textarea name="purchase_description" value={form.purchase_description} onChange={handleChange}
                  rows={3} className={`${inputCls} resize-none`} />
              </div>
            </div>
          )}
        </div>

        {/* ── Inventory Tracking ── */}
        {form.item_type === 'goods' && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <SectionHeader label="Track Inventory" name="track_inventory" checked={form.track_inventory} onToggle={handleChange} />
            {form.track_inventory && (
              <div className="mt-5 grid grid-cols-2 gap-5">
                <div>
                  <Label required>Inventory Account</Label>
                  <select name="inventory_account" value={form.inventory_account} onChange={handleChange} className={selectCls}>
                    {INVENTORY_ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Valuation Method</Label>
                  <select name="valuation_method" value={form.valuation_method} onChange={handleChange} className={selectCls}>
                    {VALUATION_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Opening Stock</Label>
                  <input type="number" name="opening_stock" value={form.opening_stock} onChange={handleChange}
                    min="0" className={inputCls} />
                </div>
                <div>
                  <Label>Rate Per Unit</Label>
                  <InrInput name="rate_per_unit" value={form.rate_per_unit} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>
        )}

      </form>
      )}
    </div>
  )
}

export default ItemForm
