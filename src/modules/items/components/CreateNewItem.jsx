import { useState } from 'react'
import Button from '../../../shared/components/ui/Button'

const UNITS = ['pcs', 'hrs', 'kg', 'ltr', 'box', 'set', 'doz']

const INITIAL = {
  name: '',
  type: 'Goods',
  sku: '',
  unit: 'pcs',
  salesPrice: '',
  purchasePrice: '',
  stock: '',
  description: '',
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-300 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

function CreateNewItem({ onClose, onSave }) {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { id, value } = e.target
    setForm(prev => ({ ...prev, [id]: value }))
    setErrors(prev => ({ ...prev, [id]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())    errs.name = 'Item name is required.'
    if (!form.sku.trim())     errs.sku  = 'SKU is required.'
    if (!form.salesPrice)     errs.salesPrice = 'Sales price is required.'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave?.({ ...form, id: Date.now() })
    setForm(INITIAL)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Type toggle */}
      <Field label="Item Type" required>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {['Goods', 'Service'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, type: t }))}
              className={`flex-1 py-2 text-sm font-medium transition ${
                form.type === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      {/* Name */}
      <Field label="Item Name" required>
        <input
          id="name"
          type="text"
          placeholder="e.g. Wireless Mouse"
          value={form.name}
          onChange={handleChange}
          className={inputCls}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </Field>

      {/* SKU */}
      <Field label="SKU" required>
        <input
          id="sku"
          type="text"
          placeholder="e.g. WM-001"
          value={form.sku}
          onChange={handleChange}
          className={inputCls}
        />
        {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku}</p>}
      </Field>

      {/* Unit */}
      <Field label="Unit">
        <select id="unit" value={form.unit} onChange={handleChange} className={inputCls}>
          {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </Field>

      {/* Sales Price */}
      <Field label="Sales Price (₹)" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
          <input
            id="salesPrice"
            type="number"
            min="0"
            placeholder="0.00"
            value={form.salesPrice}
            onChange={handleChange}
            className={`${inputCls} pl-7`}
          />
        </div>
        {errors.salesPrice && <p className="mt-1 text-xs text-red-500">{errors.salesPrice}</p>}
      </Field>

      {/* Purchase Price */}
      <Field label="Purchase Price (₹)">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
          <input
            id="purchasePrice"
            type="number"
            min="0"
            placeholder="0.00"
            value={form.purchasePrice}
            onChange={handleChange}
            className={`${inputCls} pl-7`}
          />
        </div>
      </Field>

      {/* Stock — only for Goods */}
      {form.type === 'Goods' && (
        <Field label="Opening Stock">
          <input
            id="stock"
            type="number"
            min="0"
            placeholder="0"
            value={form.stock}
            onChange={handleChange}
            className={inputCls}
          />
        </Field>
      )}

      {/* Description */}
      <Field label="Description">
        <textarea
          id="description"
          rows={3}
          placeholder="Optional description..."
          value={form.description}
          onChange={handleChange}
          className={`${inputCls} resize-none`}
        />
      </Field>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
        <Button variant="secondary" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Item
        </Button>
      </div>

    </form>
  )
}

export default CreateNewItem
