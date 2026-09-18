import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ImageIcon, ArrowLeft } from 'lucide-react'
import { getItemById, addItem, updateItem } from '../store/itemsStore'

const UNITS             = ['box', 'cm', 'doz', 'ft', 'g', 'hrs', 'kg', 'km', 'ltr', 'mg', 'm', 'pcs', 'set']
const SALES_ACCOUNTS    = ['Sales', 'Product Sales', 'Service Revenue', 'Other Income']
const PURCHASE_ACCOUNTS = ['Cost of Goods Sold', 'Purchases', 'Inventory', 'Other Expenses']
const VENDORS           = ['', 'Vendor 1', 'Vendor 2', 'Vendor 3']

const inputCls  = 'w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'
const selectCls = 'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'

function Label({ children, required, red }) {
  return (
    <label className={`mb-1 block text-sm ${red ? 'font-medium text-red-500' : 'text-gray-600'}`}>
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  )
}

function InrInput({ name, value, onChange }) {
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
        placeholder="0.00"
        min="0"
        className="w-full rounded-r border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
      />
    </div>
  )
}

function SectionHeader({ label, name, checked, onToggle }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-base font-semibold text-gray-800">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onToggle}
        className="h-4 w-4 rounded accent-blue-600"
      />
      {label}
    </label>
  )
}

function ItemForm() {
  const navigate    = useNavigate()
  const { id }      = useParams()
  const fileRef     = useRef()

  // If `id` exists in the URL → edit mode, otherwise → create mode
  const isEdit      = !!id
  const existing    = isEdit ? getItemById(id) : null

  const [form, setForm] = useState(() => {
    if (existing) {
      return {
        name:                existing.name,
        type:                existing.type,
        unit:                existing.unit ?? '',
        salesEnabled:        true,
        sellingPrice:        existing.salesPrice    ?? '',
        salesAccount:        existing.salesAccount  ?? 'Sales',
        salesDescription:    existing.description   ?? '',
        purchaseEnabled:     existing.purchasePrice != null,
        costPrice:           existing.purchasePrice    ?? '',
        purchaseAccount:     existing.purchaseAccount  ?? 'Cost of Goods Sold',
        purchaseDescription: existing.purchaseDescription ?? '',
        preferredVendor:     '',
        image:               null,
        imagePreview:        null,
      }
    }
    return {
      name: '', type: 'Goods', unit: '',
      salesEnabled: true, sellingPrice: '', salesAccount: 'Sales', salesDescription: '',
      purchaseEnabled: true, costPrice: '', purchaseAccount: 'Cost of Goods Sold',
      purchaseDescription: '', preferredVendor: '',
      image: null, imagePreview: null,
    }
  })

  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setForm(prev => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }))
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setForm(prev => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())                        errs.name         = 'Name is required.'
    if (form.salesEnabled    && !form.sellingPrice) errs.sellingPrice = 'Selling price is required.'
    if (form.purchaseEnabled && !form.costPrice)    errs.costPrice    = 'Cost price is required.'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const data = {
      name:                form.name,
      type:                form.type,
      unit:                form.unit,
      salesPrice:          form.salesEnabled    ? Number(form.sellingPrice)   : null,
      salesAccount:        form.salesEnabled    ? form.salesAccount           : null,
      salesDescription:    form.salesEnabled    ? form.salesDescription       : '',
      purchasePrice:       form.purchaseEnabled ? Number(form.costPrice)      : null,
      purchaseAccount:     form.purchaseEnabled ? form.purchaseAccount        : null,
      purchaseDescription: form.purchaseEnabled ? form.purchaseDescription    : '',
      stock:               form.type === 'Goods' ? (existing?.stock ?? 0)    : null,
      sku:                 existing?.sku ?? '',
    }

    if (isEdit) {
      updateItem(id, data)
      navigate(`/items/${id}`)
    } else {
      addItem(data)
      navigate('/items')
    }
  }

  return (
    <div className="min-h-full bg-gray-50">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(isEdit ? `/items/${id}` : '/items')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {isEdit ? `Edit Item — ${existing?.name ?? ''}` : 'New Item'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(isEdit ? `/items/${id}` : '/items')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="item-form"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {/* ── Form ── */}
      <form id="item-form" onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-5 px-6 py-6">

        {/* Basic Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex gap-8">

            <div className="flex-1 space-y-5">

              <div>
                <Label red required>Name</Label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="off"
                  className={`${inputCls} ${errors.name ? 'border-red-400' : ''}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <Label>Type</Label>
                <div className="mt-1 flex items-center gap-6">
                  {['Goods', 'Service'].map(t => (
                    <label key={t} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="type"
                        value={t}
                        checked={form.type === t}
                        onChange={handleChange}
                        className="h-4 w-4 accent-blue-600"
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Unit</Label>
                <select name="unit" value={form.unit} onChange={handleChange} className={selectCls}>
                  <option value="">Select or type to add</option>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

            </div>

            {/* Image */}
            <div className="w-48 shrink-0" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
              <div
                onClick={() => fileRef.current?.click()}
                className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-blue-400 hover:bg-blue-50"
              >
                {form.imagePreview ? (
                  <img src={form.imagePreview} alt="preview" className="h-full w-full rounded-xl object-cover" />
                ) : (
                  <>
                    <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-xs leading-snug text-blue-500">
                      Drag image(s) here or<br />
                      <span className="underline">Browse images</span>
                    </p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </div>

          </div>
        </div>

        {/* Sales Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionHeader label="Sales Information" name="salesEnabled" checked={form.salesEnabled} onToggle={handleChange} />
          {form.salesEnabled && (
            <div className="mt-5 grid grid-cols-2 gap-5">
              <div>
                <Label red required>Selling Price</Label>
                <InrInput name="sellingPrice" value={form.sellingPrice} onChange={handleChange} />
                {errors.sellingPrice && <p className="mt-1 text-xs text-red-500">{errors.sellingPrice}</p>}
              </div>
              <div>
                <Label red required>Account</Label>
                <select name="salesAccount" value={form.salesAccount} onChange={handleChange} className={selectCls}>
                  {SALES_ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <textarea name="salesDescription" value={form.salesDescription} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} />
              </div>
            </div>
          )}
        </div>

        {/* Purchase Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionHeader label="Purchase Information" name="purchaseEnabled" checked={form.purchaseEnabled} onToggle={handleChange} />
          {form.purchaseEnabled && (
            <div className="mt-5 grid grid-cols-2 gap-5">
              <div>
                <Label red required>Cost Price</Label>
                <InrInput name="costPrice" value={form.costPrice} onChange={handleChange} />
                {errors.costPrice && <p className="mt-1 text-xs text-red-500">{errors.costPrice}</p>}
              </div>
              <div>
                <Label red required>Account</Label>
                <select name="purchaseAccount" value={form.purchaseAccount} onChange={handleChange} className={selectCls}>
                  {PURCHASE_ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <Label>Description</Label>
                <textarea name="purchaseDescription" value={form.purchaseDescription} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <Label>Preferred Vendor</Label>
                <select name="preferredVendor" value={form.preferredVendor} onChange={handleChange} className={selectCls}>
                  {VENDORS.map(v => <option key={v} value={v}>{v || '— Select vendor —'}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

      </form>
    </div>
  )
}

export default ItemForm
