import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Upload, Globe } from 'lucide-react'

/* ── Sample data (shared with list/detail) ── */
export const SAMPLE_CUSTOMERS = [
  {
    id: 1,
    customerType: 'Business',
    salutation: 'Mr.', firstName: 'Amal', lastName: 'Vishnu',
    companyName: 'Techgeum Pvt. Ltd.',
    displayName: 'Amal Vishnu',
    email: 'amal@example.com',
    workPhone: '9876543210', workPhoneCode: '+91',
    mobile: '',             mobileCode: '+91',
    language: 'English',
    // Other Details
    pan: 'ABCDE1234F',
    currency: 'INR- Indian Rupee',
    accountsReceivable: '',
    openingBalance: '',
    paymentTerms: 'Due on Receipt',
    enablePortal: false,
    websiteUrl: '',
    department: 'Engineering',
    designation: 'Director',
    twitter: '', skype: '', facebook: '',
    receivables: 12000, status: 'Active',
  },
  {
    id: 2,
    customerType: 'Individual',
    salutation: 'Ms.', firstName: 'Priya', lastName: 'Nair',
    companyName: '',
    displayName: 'Priya Nair',
    email: 'priya@example.com',
    workPhone: '9123456780', workPhoneCode: '+91',
    mobile: '', mobileCode: '+91',
    language: 'English',
    pan: '', currency: 'INR- Indian Rupee', accountsReceivable: '', openingBalance: '',
    paymentTerms: 'Net 30', enablePortal: false, websiteUrl: '', department: '', designation: '',
    twitter: '', skype: '', facebook: '',
    receivables: 5500, status: 'Active',
  },
  {
    id: 3,
    customerType: 'Business',
    salutation: 'Mr.', firstName: 'Rahul', lastName: 'Menon',
    companyName: '', displayName: 'Rahul Menon',
    email: 'rahul@example.com',
    workPhone: '9001234567', workPhoneCode: '+91', mobile: '', mobileCode: '+91',
    language: 'English',
    pan: '', currency: 'INR- Indian Rupee', accountsReceivable: '', openingBalance: '',
    paymentTerms: 'Due on Receipt', enablePortal: false, websiteUrl: '', department: '', designation: '',
    twitter: '', skype: '', facebook: '',
    receivables: 0, status: 'Inactive',
  },
  {
    id: 4,
    customerType: 'Business',
    salutation: 'Ms.', firstName: 'Sneha', lastName: 'Thomas',
    companyName: 'STS Ltd', displayName: 'Sneha Thomas',
    email: 'sneha@example.com',
    workPhone: '9988776655', workPhoneCode: '+91', mobile: '', mobileCode: '+91',
    language: 'English',
    pan: '', currency: 'INR- Indian Rupee', accountsReceivable: '', openingBalance: '',
    paymentTerms: 'Net 30', enablePortal: false, websiteUrl: '', department: '', designation: '',
    twitter: '', skype: '', facebook: '',
    receivables: 3200, status: 'Active',
  },
  {
    id: 5,
    customerType: 'Business',
    salutation: 'Mr.', firstName: 'Kiran', lastName: 'Kumar',
    companyName: 'KK Traders', displayName: 'Kiran Kumar',
    email: 'kiran@example.com',
    workPhone: '9871234560', workPhoneCode: '+91', mobile: '', mobileCode: '+91',
    language: 'English',
    pan: '', currency: 'INR- Indian Rupee', accountsReceivable: '', openingBalance: '',
    paymentTerms: 'Net 45', enablePortal: false, websiteUrl: '', department: '', designation: '',
    twitter: '', skype: '', facebook: '',
    receivables: 8900, status: 'Active',
  },
]

/* ── Constants ── */
const SALUTATIONS    = ['', 'Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.']
const PHONE_CODES    = ['+91', '+1', '+44', '+61', '+971']
const LANGUAGES      = ['English', 'Hindi', 'Tamil', 'Malayalam', 'Telugu', 'Kannada']
const CURRENCIES     = ['INR- Indian Rupee', 'USD- US Dollar', 'EUR- Euro', 'GBP- British Pound']
const PAYMENT_TERMS  = ['Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60']
const TABS           = ['Other Details', 'Address', 'Contact Persons', 'Custom Fields', 'Reporting Tags', 'Remarks']
const AR_ACCOUNTS    = ['', 'Accounts Receivable', 'Trade Receivables', 'Other Receivables']

const COUNTRIES = ['', 'India', 'United States', 'United Kingdom', 'Australia', 'Canada', 'UAE', 'Singapore']
const STATES    = ['', 'Andhra Pradesh', 'Delhi', 'Goa', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal']

/* ── Shared styles ── */
const inputCls  = 'w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-300'
const selectCls = 'rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100'

function FieldRow({ label, required, hint, children }) {
  return (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
      <div className="w-48 shrink-0 pt-2">
        <span className={`text-sm ${required ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
          {label}{required && ' *'}
        </span>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function AddrRow({ label, children }) {
  return (
    <div className="flex items-start gap-4">
      <span className="w-32 shrink-0 pt-2 text-sm text-gray-600">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function CustomerForm() {
  const navigate    = useNavigate()
  const { id }      = useParams()
  const isEdit      = !!id
  const existing    = isEdit ? SAMPLE_CUSTOMERS.find(c => String(c.id) === String(id)) : null
  const fileRef     = useRef()

  const [activeTab, setActiveTab] = useState('Other Details')

  const [form, setForm] = useState({
    customerType:       existing?.customerType       ?? 'Business',
    salutation:         existing?.salutation         ?? '',
    firstName:          existing?.firstName          ?? '',
    lastName:           existing?.lastName           ?? '',
    companyName:        existing?.companyName        ?? '',
    displayName:        existing?.displayName        ?? '',
    email:              existing?.email              ?? '',
    workPhone:          existing?.workPhone          ?? '',
    workPhoneCode:      existing?.workPhoneCode      ?? '+91',
    mobile:             existing?.mobile             ?? '',
    mobileCode:         existing?.mobileCode         ?? '+91',
    language:           existing?.language           ?? 'English',
    // Other Details
    pan:                existing?.pan                ?? '',
    currency:           existing?.currency           ?? 'INR- Indian Rupee',
    accountsReceivable: existing?.accountsReceivable ?? '',
    openingBalance:     existing?.openingBalance     ?? '',
    paymentTerms:       existing?.paymentTerms       ?? 'Due on Receipt',
    enablePortal:       existing?.enablePortal       ?? false,
    websiteUrl:         existing?.websiteUrl         ?? '',
    department:         existing?.department         ?? '',
    designation:        existing?.designation        ?? '',
    twitter:            existing?.twitter            ?? '',
    skype:              existing?.skype              ?? '',
    facebook:           existing?.facebook           ?? '',
    // Billing Address
    billAttention:      existing?.billAttention      ?? '',
    billCountry:        existing?.billCountry        ?? '',
    billStreet1:        existing?.billStreet1        ?? '',
    billStreet2:        existing?.billStreet2        ?? '',
    billCity:           existing?.billCity           ?? '',
    billState:          existing?.billState          ?? '',
    billPinCode:        existing?.billPinCode        ?? '',
    billPhone:          existing?.billPhone          ?? '',
    billPhoneCode:      existing?.billPhoneCode      ?? '+91',
    billFax:            existing?.billFax            ?? '',
    // Shipping Address
    shipAttention:      existing?.shipAttention      ?? '',
    shipCountry:        existing?.shipCountry        ?? '',
    shipStreet1:        existing?.shipStreet1        ?? '',
    shipStreet2:        existing?.shipStreet2        ?? '',
    shipCity:           existing?.shipCity           ?? '',
    shipState:          existing?.shipState          ?? '',
    shipPinCode:        existing?.shipPinCode        ?? '',
    shipPhone:          existing?.shipPhone          ?? '',
    shipPhoneCode:      existing?.shipPhoneCode      ?? '+91',
    shipFax:            existing?.shipFax            ?? '',
  })

  const [contactPersons, setContactPersons] = useState(
    existing?.contactPersons ?? [
      { id: 1, salutation: '', firstName: '', lastName: '', email: '', workPhone: '', workPhoneCode: '+91', mobile: '', mobileCode: '+91' }
    ]
  )

  function handleContact(index, field, value) {
    setContactPersons(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c))
  }

  function addContactPerson() {
    setContactPersons(prev => [...prev, {
      id: Date.now(), salutation: '', firstName: '', lastName: '', email: '',
      workPhone: '', workPhoneCode: '+91', mobile: '', mobileCode: '+91'
    }])
  }

  function removeContactPerson(index) {
    setContactPersons(prev => prev.filter((_, i) => i !== index))
  }

  const [errors, setErrors] = useState({})

  function handle(e) {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  // Auto-build display name options from entered name parts
  const displayNameOptions = [
    form.firstName && form.lastName   ? `${form.firstName} ${form.lastName}` : null,
    form.companyName || null,
    form.firstName  || null,
    form.lastName   || null,
  ].filter(Boolean)

  function validate() {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName   = 'First name is required.'
    if (!form.displayName)      errs.displayName = 'Display name is required.'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      setActiveTab('Other Details') // errors are in top section
      return
    }
    console.log(isEdit ? 'Updated:' : 'Created:', form)
    navigate(isEdit ? `/sales/customers/${id}` : '/sales/customers')
  }

  return (
    <div className="min-h-full bg-white">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(isEdit ? `/sales/customers/${id}` : '/sales/customers')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {isEdit ? `Edit Customer — ${existing?.displayName}` : 'New Customer'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(isEdit ? `/sales/customers/${id}` : '/sales/customers')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="customer-form"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      <form id="customer-form" onSubmit={handleSubmit} className="mx-auto max-w-5xl px-6 py-6">

        {/* ── Top fields ── */}
        <div className="space-y-0 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white px-6 mb-6">

          {/* Customer Type */}
          <FieldRow label="Customer Type">
            <div className="flex items-center gap-6 pt-2">
              {['Business', 'Individual'].map(t => (
                <label key={t} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio" name="customerType" value={t}
                    checked={form.customerType === t}
                    onChange={handle}
                    className="h-4 w-4 accent-blue-600"
                  />
                  {t}
                </label>
              ))}
            </div>
          </FieldRow>

          {/* Primary Contact */}
          <FieldRow label="Primary Contact">
            <div className="flex gap-2">
              <select name="salutation" value={form.salutation} onChange={handle} className={`${selectCls} w-32`}>
                {SALUTATIONS.map(s => <option key={s} value={s}>{s || 'Salutation'}</option>)}
              </select>
              <div className="flex-1">
                <input
                  name="firstName" value={form.firstName} onChange={handle}
                  placeholder="First Name"
                  className={`${inputCls} ${errors.firstName ? 'border-red-400' : ''}`}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <input name="lastName" value={form.lastName} onChange={handle} placeholder="Last Name" className={`${inputCls} flex-1`} />
            </div>
          </FieldRow>

          {/* Company Name */}
          {form.customerType === 'Business' && (
            <FieldRow label="Company Name">
              <input name="companyName" value={form.companyName} onChange={handle} className={inputCls} />
            </FieldRow>
          )}

          {/* Display Name */}
          <FieldRow label="Display Name" required>
            <select
              name="displayName" value={form.displayName} onChange={handle}
              className={`${selectCls} w-full ${errors.displayName ? 'border-red-400' : ''}`}
            >
              <option value="">Select or type to add</option>
              {displayNameOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {errors.displayName && <p className="mt-1 text-xs text-red-500">{errors.displayName}</p>}
          </FieldRow>

          {/* Email Address */}
          <FieldRow label="Email Address">
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="email@example.com" className={inputCls} />
          </FieldRow>

          {/* Phone */}
          <FieldRow label="Phone">
            <div className="flex gap-3">
              <div className="flex flex-1 gap-1">
                <select name="workPhoneCode" value={form.workPhoneCode} onChange={handle} className={`${selectCls} w-20`}>
                  {PHONE_CODES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input name="workPhone" value={form.workPhone} onChange={handle} placeholder="Work Phone" className={inputCls} />
              </div>
              <div className="flex flex-1 gap-1">
                <select name="mobileCode" value={form.mobileCode} onChange={handle} className={`${selectCls} w-20`}>
                  {PHONE_CODES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input name="mobile" value={form.mobile} onChange={handle} placeholder="Mobile" className={inputCls} />
              </div>
            </div>
          </FieldRow>

          {/* Customer Language */}
          <FieldRow label="Customer Language">
            <select name="language" value={form.language} onChange={handle} className={`${selectCls} w-64`}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </FieldRow>

        </div>

        {/* ── Tabs ── */}
        <div className="border-b border-gray-200 mb-0">
          <div className="flex gap-0">
            {TABS.map(tab => (
              <button
                key={tab} type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="rounded-b-xl border border-t-0 border-gray-200 bg-white px-6 mb-8">

          {activeTab === 'Other Details' && (
            <div className="divide-y divide-gray-100">

              <FieldRow label="PAN">
                <input name="pan" value={form.pan} onChange={handle} className={`${inputCls} w-64`} />
              </FieldRow>

              <FieldRow label="Currency">
                <select name="currency" value={form.currency} onChange={handle} className={`${selectCls} w-64`}>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FieldRow>

              <FieldRow label="Accounts Receivable">
                <select name="accountsReceivable" value={form.accountsReceivable} onChange={handle} className={`${selectCls} w-64`}>
                  {AR_ACCOUNTS.map(a => <option key={a} value={a}>{a || 'Select an account'}</option>)}
                </select>
              </FieldRow>

              <FieldRow label="Opening Balance">
                <div className="flex w-64">
                  <span className="flex items-center rounded-l border border-r-0 border-gray-300 bg-gray-50 px-3 text-xs font-medium text-gray-500">INR</span>
                  <input name="openingBalance" type="number" min="0" value={form.openingBalance} onChange={handle} placeholder="0.00" className="w-full rounded-r border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100" />
                </div>
              </FieldRow>

              <FieldRow label="Payment Terms">
                <select name="paymentTerms" value={form.paymentTerms} onChange={handle} className={`${selectCls} w-64`}>
                  {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FieldRow>

              <FieldRow label="Enable Portal?">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 pt-2">
                  <input
                    type="checkbox" name="enablePortal" checked={form.enablePortal} onChange={handle}
                    className="h-4 w-4 rounded accent-blue-600"
                  />
                  Allow portal access for this customer
                </label>
              </FieldRow>

              <FieldRow label="Documents" hint="You can upload a maximum of 10 files, 10MB each">
                <div className="flex items-center gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 rounded-l-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Upload className="h-4 w-4" />
                    Upload File
                  </button>
                  <button type="button" className="rounded-r-lg border border-l-0 border-gray-300 bg-white px-2 py-2 text-gray-500 hover:bg-gray-50 transition">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <input ref={fileRef} type="file" multiple className="hidden" />
                </div>
              </FieldRow>

              <FieldRow label="Website URL">
                <div className="flex w-64 items-center rounded border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-100 bg-white overflow-hidden">
                  <span className="px-3 text-gray-400"><Globe className="h-4 w-4" /></span>
                  <input name="websiteUrl" value={form.websiteUrl} onChange={handle} placeholder="ex: www.example.com" className="flex-1 py-2 pr-3 text-sm outline-none" />
                </div>
              </FieldRow>

              <FieldRow label="Department">
                <input name="department" value={form.department} onChange={handle} className={`${inputCls} w-64`} />
              </FieldRow>

              <FieldRow label="Designation">
                <input name="designation" value={form.designation} onChange={handle} className={`${inputCls} w-64`} />
              </FieldRow>

              {/* X / Twitter */}
              <FieldRow label="X">
                <div>
                  <div className="flex w-64 items-center rounded border border-gray-300 overflow-hidden">
                    <span className="flex h-9 w-9 items-center justify-center bg-gray-50 border-r border-gray-300">
                      <svg className="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </span>
                    <input name="twitter" value={form.twitter} onChange={handle} className="flex-1 px-3 py-2 text-sm outline-none" />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">https://x.com/</p>
                </div>
              </FieldRow>

              {/* Skype */}
              <FieldRow label="Skype Name/Number">
                <div className="flex w-64 items-center rounded border border-gray-300 overflow-hidden">
                  <span className="flex h-9 w-9 items-center justify-center bg-blue-50 border-r border-gray-300">
                    <span className="text-blue-500 font-bold text-sm">S</span>
                  </span>
                  <input name="skype" value={form.skype} onChange={handle} className="flex-1 px-3 py-2 text-sm outline-none" />
                </div>
              </FieldRow>

              {/* Facebook */}
              <FieldRow label="Facebook">
                <div>
                  <div className="flex w-64 items-center rounded border border-gray-300 overflow-hidden">
                    <span className="flex h-9 w-9 items-center justify-center bg-blue-600 border-r border-gray-300">
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </span>
                    <input name="facebook" value={form.facebook} onChange={handle} className="flex-1 px-3 py-2 text-sm outline-none" />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">http://www.facebook.com/</p>
                </div>
              </FieldRow>

            </div>
          )}

          {activeTab === 'Address' && (
            <div className="py-6">
              <div className="grid grid-cols-2 gap-x-12">

                {/* ── Billing Address ── */}
                <div>
                  <h3 className="mb-5 text-base font-semibold text-gray-900">Billing Address</h3>
                  <div className="space-y-4">

                    <AddrRow label="Attention">
                      <input name="billAttention" value={form.billAttention} onChange={handle} className={inputCls} />
                    </AddrRow>

                    <AddrRow label="Country/Region">
                      <select name="billCountry" value={form.billCountry} onChange={handle} className={`${selectCls} w-full`}>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c || 'Select'}</option>)}
                      </select>
                    </AddrRow>

                    <AddrRow label="Address">
                      <textarea name="billStreet1" value={form.billStreet1} onChange={handle} rows={2} placeholder="Street 1" className={`${inputCls} resize-none mb-2`} />
                      <textarea name="billStreet2" value={form.billStreet2} onChange={handle} rows={2} placeholder="Street 2" className={`${inputCls} resize-none`} />
                    </AddrRow>

                    <AddrRow label="City">
                      <input name="billCity" value={form.billCity} onChange={handle} className={inputCls} />
                    </AddrRow>

                    <AddrRow label="State">
                      <select name="billState" value={form.billState} onChange={handle} className={`${selectCls} w-full`}>
                        {STATES.map(s => <option key={s} value={s}>{s || 'Select or type to add'}</option>)}
                      </select>
                    </AddrRow>

                    <AddrRow label="Pin Code">
                      <input name="billPinCode" value={form.billPinCode} onChange={handle} className={inputCls} />
                    </AddrRow>

                    <AddrRow label="Phone">
                      <div className="flex gap-2">
                        <select name="billPhoneCode" value={form.billPhoneCode} onChange={handle} className={`${selectCls} w-20 shrink-0`}>
                          {PHONE_CODES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <input name="billPhone" value={form.billPhone} onChange={handle} className={inputCls} />
                      </div>
                    </AddrRow>

                    <AddrRow label="Fax Number">
                      <input name="billFax" value={form.billFax} onChange={handle} className={inputCls} />
                    </AddrRow>

                  </div>
                </div>

                {/* ── Shipping Address ── */}
                <div>
                  <div className="mb-5 flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">Shipping Address</h3>
                    <span className="text-gray-400 text-sm">(</span>
                    <button
                      type="button"
                      onClick={() => setForm(p => ({
                        ...p,
                        shipAttention: p.billAttention,
                        shipCountry:   p.billCountry,
                        shipStreet1:   p.billStreet1,
                        shipStreet2:   p.billStreet2,
                        shipCity:      p.billCity,
                        shipState:     p.billState,
                        shipPinCode:   p.billPinCode,
                        shipPhone:     p.billPhone,
                        shipPhoneCode: p.billPhoneCode,
                        shipFax:       p.billFax,
                      }))}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <span className="text-blue-500">↓</span> Copy billing address
                    </button>
                    <span className="text-gray-400 text-sm">)</span>
                  </div>
                  <div className="space-y-4">

                    <AddrRow label="Attention">
                      <input name="shipAttention" value={form.shipAttention} onChange={handle} className={inputCls} />
                    </AddrRow>

                    <AddrRow label="Country/Region">
                      <select name="shipCountry" value={form.shipCountry} onChange={handle} className={`${selectCls} w-full`}>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c || 'Select'}</option>)}
                      </select>
                    </AddrRow>

                    <AddrRow label="Address">
                      <textarea name="shipStreet1" value={form.shipStreet1} onChange={handle} rows={2} placeholder="Street 1" className={`${inputCls} resize-none mb-2`} />
                      <textarea name="shipStreet2" value={form.shipStreet2} onChange={handle} rows={2} placeholder="Street 2" className={`${inputCls} resize-none`} />
                    </AddrRow>

                    <AddrRow label="City">
                      <input name="shipCity" value={form.shipCity} onChange={handle} className={inputCls} />
                    </AddrRow>

                    <AddrRow label="State">
                      <select name="shipState" value={form.shipState} onChange={handle} className={`${selectCls} w-full`}>
                        {STATES.map(s => <option key={s} value={s}>{s || 'Select or type to add'}</option>)}
                      </select>
                    </AddrRow>

                    <AddrRow label="Pin Code">
                      <input name="shipPinCode" value={form.shipPinCode} onChange={handle} className={inputCls} />
                    </AddrRow>

                    <AddrRow label="Phone">
                      <div className="flex gap-2">
                        <select name="shipPhoneCode" value={form.shipPhoneCode} onChange={handle} className={`${selectCls} w-20 shrink-0`}>
                          {PHONE_CODES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <input name="shipPhone" value={form.shipPhone} onChange={handle} className={inputCls} />
                      </div>
                    </AddrRow>

                    <AddrRow label="Fax Number">
                      <input name="shipFax" value={form.shipFax} onChange={handle} className={inputCls} />
                    </AddrRow>

                  </div>
                </div>

              </div>
            </div>
          )}
          {activeTab === 'Contact Persons' && (
            <div className="py-5">
              <table className="w-full border-collapse text-sm table-fixed">
                <colgroup>
                  <col className="w-32" />
                  <col className="w-36" />
                  <col className="w-36" />
                  <col />
                  <col className="w-52" />
                  <col className="w-52" />
                  <col className="w-16" />
                </colgroup>
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Salutation</th>
                    <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">First Name</th>
                    <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Last Name</th>
                    <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Email Address</th>
                    <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Work Phone</th>
                    <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Mobile</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {contactPersons.map((cp, i) => (
                    <tr key={cp.id} className="border-b border-gray-100">
                      {/* Salutation */}
                      <td className="py-2 pr-3">
                        <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2.5 py-2">
                          <select
                            value={cp.salutation}
                            onChange={e => handleContact(i, 'salutation', e.target.value)}
                            className="w-full bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
                          >
                            {SALUTATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </td>

                      {/* First Name */}
                      <td className="py-2 pr-3">
                        <input
                          value={cp.firstName}
                          onChange={e => handleContact(i, 'firstName', e.target.value)}
                          className="w-full rounded border border-gray-200 px-2.5 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                        />
                      </td>

                      {/* Last Name */}
                      <td className="py-2 pr-3">
                        <input
                          value={cp.lastName}
                          onChange={e => handleContact(i, 'lastName', e.target.value)}
                          className="w-full rounded border border-gray-200 px-2.5 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                        />
                      </td>

                      {/* Email */}
                      <td className="py-2 pr-3">
                        <input
                          type="email"
                          value={cp.email}
                          onChange={e => handleContact(i, 'email', e.target.value)}
                          className="w-full rounded border border-gray-200 px-2.5 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                        />
                      </td>

                      {/* Work Phone */}
                      <td className="py-2 pr-3">
                        <div className="flex gap-1.5">
                          <div className="flex items-center rounded border border-gray-200 bg-white px-2 py-2 gap-1 shrink-0">
                            <select
                              value={cp.workPhoneCode}
                              onChange={e => handleContact(i, 'workPhoneCode', e.target.value)}
                              className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
                            >
                              {PHONE_CODES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <svg className="h-3 w-3 text-gray-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <input
                            value={cp.workPhone}
                            onChange={e => handleContact(i, 'workPhone', e.target.value)}
                            className="flex-1 min-w-0 rounded border border-gray-200 px-2.5 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                          />
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="py-2 pr-3">
                        <div className="flex gap-1.5">
                          <div className="flex items-center rounded border border-gray-200 bg-white px-2 py-2 gap-1 shrink-0">
                            <select
                              value={cp.mobileCode}
                              onChange={e => handleContact(i, 'mobileCode', e.target.value)}
                              className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
                            >
                              {PHONE_CODES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <svg className="h-3 w-3 text-gray-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <input
                            value={cp.mobile}
                            onChange={e => handleContact(i, 'mobile', e.target.value)}
                            className="flex-1 min-w-0 rounded border border-gray-200 px-2.5 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                          />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded text-gray-300 hover:text-gray-500 transition"
                          >
                            <svg viewBox="0 0 4 18" className="h-4 w-2 fill-current" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="2" cy="2"  r="1.5"/>
                              <circle cx="2" cy="9"  r="1.5"/>
                              <circle cx="2" cy="16" r="1.5"/>
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeContactPerson(i)}
                            className="flex h-7 w-7 items-center justify-center rounded text-red-300 hover:text-red-500 transition"
                          >
                            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="15" y1="9" x2="9" y2="15"/>
                              <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                onClick={addContactPerson}
                className="mt-5 flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
              >
                <span className="text-base font-bold leading-none">+</span>
                Add Contact Person
              </button>
            </div>
          )}
          {activeTab === 'Custom Fields' && (
            <p className="py-12 text-center text-sm text-gray-400">No custom fields configured.</p>
          )}
          {activeTab === 'Reporting Tags' && (
            <p className="py-12 text-center text-sm text-gray-400">No reporting tags associated.</p>
          )}
          {activeTab === 'Remarks' && (
            <div className="py-4">
              <textarea rows={4} placeholder="Add remarks..." className={`${inputCls} resize-none`} />
            </div>
          )}

        </div>

        {/* ── Bottom Save / Cancel ── */}
        <div className="flex items-center gap-3">
          <button type="submit" form="customer-form" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
            {isEdit ? 'Update' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate(isEdit ? `/sales/customers/${id}` : '/sales/customers')} className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}

export default CustomerForm
