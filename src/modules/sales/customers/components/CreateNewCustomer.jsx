import { useState } from 'react'
import Button from '../../../../shared/components/ui/Button'

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  company: '',
  gstin: '',
  billingAddress: '',
  currency: 'INR',
  paymentTerms: 'Due on Receipt',
}

const PAYMENT_TERMS = [
  'Due on Receipt',
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
]

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

function CreateNewCustomer({ onClose, onSave }) {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { id, value } = e.target
    setForm(prev => ({ ...prev, [id]: value }))
    setErrors(prev => ({ ...prev, [id]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())  errs.name  = 'Customer name is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address.'
    if (!form.phone.trim()) errs.phone = 'Phone number is required.'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave?.({ ...form, id: Date.now(), receivables: 0, status: 'Active' })
    setForm(INITIAL)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Customer Name */}
      <Field label="Customer Name" required>
        <input
          id="name"
          type="text"
          placeholder="e.g. Amal Vishnu"
          value={form.name}
          onChange={handleChange}
          className={inputCls}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </Field>

      {/* Company */}
      <Field label="Company Name">
        <input
          id="company"
          type="text"
          placeholder="e.g. Techgeum Pvt. Ltd."
          value={form.company}
          onChange={handleChange}
          className={inputCls}
        />
      </Field>

      {/* Email */}
      <Field label="Email" required>
        <input
          id="email"
          type="email"
          placeholder="e.g. amal@example.com"
          value={form.email}
          onChange={handleChange}
          className={inputCls}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </Field>

      {/* Phone */}
      <Field label="Phone" required>
        <input
          id="phone"
          type="tel"
          placeholder="e.g. 9876543210"
          value={form.phone}
          onChange={handleChange}
          className={inputCls}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </Field>

      {/* GSTIN */}
      <Field label="GSTIN">
        <input
          id="gstin"
          type="text"
          placeholder="e.g. 29ABCDE1234F1Z5"
          value={form.gstin}
          onChange={handleChange}
          className={inputCls}
        />
      </Field>

      {/* Currency */}
      <Field label="Currency">
        <select id="currency" value={form.currency} onChange={handleChange} className={inputCls}>
          <option value="INR">INR — Indian Rupee</option>
          <option value="USD">USD — US Dollar</option>
          <option value="EUR">EUR — Euro</option>
          <option value="GBP">GBP — British Pound</option>
        </select>
      </Field>

      {/* Payment Terms */}
      <Field label="Payment Terms">
        <select id="paymentTerms" value={form.paymentTerms} onChange={handleChange} className={inputCls}>
          {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>

      {/* Billing Address */}
      <Field label="Billing Address">
        <textarea
          id="billingAddress"
          rows={3}
          placeholder="Street, City, State, PIN"
          value={form.billingAddress}
          onChange={handleChange}
          className={`${inputCls} resize-none`}
        />
      </Field>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Customer
        </Button>
      </div>

    </form>
  )
}

export default CreateNewCustomer
