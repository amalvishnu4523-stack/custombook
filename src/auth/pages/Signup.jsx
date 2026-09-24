import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axiosInstance from '../../api/axiosInstance'
import { signupUser } from '../api/authApi'

const PHONE_CODES = ['+91', '+1', '+44', '+971', '+966', '+61', '+65', '+60', '+92', '+880', '+94', '+977']

const COUNTRIES = [
  { code: 'IN', name: 'India',          phoneCode: '+91'  },
  { code: 'US', name: 'United States',  phoneCode: '+1'   },
  { code: 'GB', name: 'United Kingdom', phoneCode: '+44'  },
  { code: 'AE', name: 'UAE',            phoneCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia',   phoneCode: '+966' },
  { code: 'CA', name: 'Canada',         phoneCode: '+1'   },
  { code: 'AU', name: 'Australia',      phoneCode: '+61'  },
  { code: 'SG', name: 'Singapore',      phoneCode: '+65'  },
  { code: 'MY', name: 'Malaysia',       phoneCode: '+60'  },
  { code: 'PK', name: 'Pakistan',       phoneCode: '+92'  },
  { code: 'BD', name: 'Bangladesh',     phoneCode: '+880' },
  { code: 'LK', name: 'Sri Lanka',      phoneCode: '+94'  },
  { code: 'NP', name: 'Nepal',          phoneCode: '+977' },
]

const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

function Label({ children, required }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-gray-700">
      {children}{required && <span className="ml-0.5 text-red-400">*</span>}
    </label>
  )
}

function Signup() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    user_type:          'business_user',
    company_name:       '',
    email:              '',
    phone_country_code: '+91',
    phone:              '',
    password:           '',
    confirm:            '',
    country:            'IN',
    state:              '',
    terms_accepted:     false,
  })

  const [selectedCountry, setSelectedCountry] = useState('IN')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [errors,       setErrors]       = useState({})
  const [submitted,    setSubmitted]    = useState(false)
  const [submitError,  setSubmitError]  = useState('')
  const [loading,      setLoading]      = useState(false)
  const [states,       setStates]       = useState([])
  const [statesLoading, setStatesLoading] = useState(false)

  // Fetch states from API whenever country changes
  useEffect(() => {
    if (!selectedCountry) { setStates([]); return }
    setStatesLoading(true)
    setStates([])

    // Auto-set phone code from local map immediately
    const countryObj = COUNTRIES.find(c => c.code === selectedCountry)
    if (countryObj) {
      setForm(p => ({ ...p, state: '', phone_country_code: countryObj.phoneCode }))
    } else {
      setForm(p => ({ ...p, state: '' }))
    }

    axiosInstance.get(`/api/accounts/states/?country=${selectedCountry}`)
      .then(res => {
        const data = res.data
        if (data.success && Array.isArray(data.data?.states)) {
          setStates(data.data.states)
          if (data.data.phone_country_code) {
            setForm(p => ({ ...p, phone_country_code: data.data.phone_country_code }))
          }
        } else {
          setStates([])
        }
      })
      .catch(err => {
        console.error('States API error:', err)
        setStates([])
      })
      .finally(() => setStatesLoading(false))
  }, [selectedCountry])

  function handle(e) {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setErrors(p => ({ ...p, [name]: '' }))
    if (name === 'country') setSelectedCountry(value)
  }

  function validate() {
    const errs = {}
    if (!form.company_name.trim())  errs.company_name = 'Company name is required.'
    if (!form.email.trim())         errs.email        = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email.'
    if (!form.phone.trim())         errs.phone        = 'Phone number is required.'
    if (!form.password)             errs.password     = 'Password is required.'
    else if (form.password.length < 8) errs.password  = 'Password must be at least 8 characters.'
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Must contain at least one uppercase letter.'
    else if (!/[0-9]/.test(form.password)) errs.password = 'Must contain at least one number.'
    if (form.password !== form.confirm) errs.confirm  = 'Passwords do not match.'
    if (!form.country)              errs.country      = 'Country is required.'
    if (!form.state)                errs.state        = 'State is required.'
    if (!form.terms_accepted)       errs.terms_accepted = 'You must accept the terms.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setSubmitError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    const payload = {
      user_type:          form.user_type,
      company_name:       form.company_name,
      email:              form.email,
      phone_country_code: form.phone_country_code,
      phone:              form.phone,
      password:           form.password,
      country:            form.country,
      state:              form.state,
      terms_accepted:     form.terms_accepted,
    }
    try {
      const res = await signupUser(payload)
      if (res?.data?.token) localStorage.setItem('token', res.data.token)
      navigate('/login')
    } catch (err) {
      const responseData = err?.response?.data
      if (responseData?.errors) {
        // Map backend field errors into our errors state
        const fieldErrs = {}
        Object.entries(responseData.errors).forEach(([key, val]) => {
          fieldErrs[key] = Array.isArray(val) ? val[0] : val
        })
        setErrors(fieldErrs)
      }
      const msg =
        responseData?.message ||
        responseData?.detail ||
        err?.message ||
        'Signup failed. Please try again.'
      setSubmitError(msg)
    } finally {
      setLoading(false)
    }
  }

  const hasError = submitted && (Object.keys(errors).length > 0 || !!submitError)

  return (
    <div className="flex min-h-screen w-full">

      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center px-14 text-white"
        style={{ background: 'linear-gradient(145deg, #1a2f6e 0%, #243580 60%, #1e3a8a 100%)' }}
      >
        <img src="/techgeum_logo.png" alt="Techgeum" className="mb-8 h-24 w-24 object-contain drop-shadow-xl" />
        <h2 className="mb-3 text-center text-3xl font-extrabold leading-snug tracking-tight">
          Your accounting,<br />simplified
        </h2>
        <p className="max-w-xs text-center text-sm leading-relaxed text-blue-200">
          Join thousands of businesses that trust Techgeum Books to keep their finances in order.
        </p>
        <div className="mt-10 w-full max-w-xs space-y-3">
          {['Invoice & expense tracking', 'Real-time financial reports', 'Multi-user access control', 'Bank reconciliation'].map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm text-blue-100">{f}</span>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs uppercase tracking-widest text-blue-400">Powered by Techgeum</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex w-full lg:w-7/12 flex-col items-center justify-start overflow-y-auto bg-gray-50 px-6 py-10">
        <div className="w-full max-w-lg">

          <div className="mb-8 flex justify-center">
            <img src="/techgeum_logo2.png" alt="Techgeum" className="h-16 object-contain" />
          </div>

          <h1 className="text-center text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-center text-sm text-gray-400">Fill in the details below to get started</p>

          {/* API error banner */}
          {submitError && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">!</span>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>

            {/* User Type */}
            <div>
              <div className="flex gap-3">
                {[
                  { value: 'business_user',   label: 'Business User' },
                  { value: 'tax_consultant',  label: 'Tax Consultant' },
                  { value: 'student_learner', label: 'Student/Learner' },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`flex flex-1 cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition ${
                      form.user_type === opt.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="user_type"
                      value={opt.value}
                      checked={form.user_type === opt.value}
                      onChange={handle}
                      className="h-4 w-4 accent-blue-600 shrink-0"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Company Name */}
            <div>
              <Label required>Company Name</Label>
              <input name="company_name" value={form.company_name} onChange={handle} placeholder="e.g. Abc Studio" className={`${inputCls} ${errors.company_name ? 'border-red-300' : ''}`} />
              {errors.company_name && <p className="mt-1 text-xs text-red-500">{errors.company_name}</p>}
            </div>

            {/* Email */}
            <div>
              <Label required>Email Address</Label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@company.com" className={`${inputCls} ${errors.email ? 'border-red-300' : ''}`} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <Label required>Phone Number</Label>
              <div className={`flex overflow-hidden rounded-xl border bg-white shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 ${errors.phone ? 'border-red-300' : 'border-gray-200'}`}>
                <select
                  name="phone_country_code"
                  value={form.phone_country_code}
                  onChange={handle}
                  className="border-r border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 outline-none"
                >
                  {PHONE_CODES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handle}
                  placeholder="9876543210"
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Country + State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>Country</Label>
                <select name="country" value={form.country} onChange={handle} className={`${inputCls} ${errors.country ? 'border-red-300' : ''}`}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
                {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
              </div>
              <div>
                <Label required>State</Label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handle}
                  className={`${inputCls} ${errors.state ? 'border-red-300' : ''}`}
                  disabled={!form.country || statesLoading}
                >
                  <option value="">
                    {statesLoading ? 'Loading states…' : 'Select state'}
                  </option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <Label required>Password</Label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handle}
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
                  className={`${inputCls} pr-12 ${errors.password ? 'border-red-300' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <Label required>Confirm Password</Label>
              <div className="relative">
                <input
                  name="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={handle}
                  placeholder="Re-enter your password"
                  className={`${inputCls} pr-12 ${errors.confirm ? 'border-red-300' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                form.terms_accepted ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
              }`}>
                <input
                  type="checkbox"
                  name="terms_accepted"
                  checked={form.terms_accepted}
                  onChange={handle}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="font-semibold text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="font-semibold text-blue-600 hover:underline">Privacy Policy</a>
                </span>
              </label>
              {errors.terms_accepted && <p className="mt-1 text-xs text-red-500">{errors.terms_accepted}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #1a2f6e, #2563eb)' }}
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                  </svg>
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Signup
