import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { signinUser } from '../api/authApi'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function validate() {
    if (!form.email.trim()) return 'Email is required.'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.'
    if (!form.password) return 'Password is required.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError('')

    try {
      const res = await signinUser({ email: form.email, password: form.password })

      // Store tokens and user info from API response
      localStorage.setItem('access_token', res.access)
      localStorage.setItem('refresh_token', res.refresh)
      localStorage.setItem('token', res.access)
      localStorage.setItem('currentUser', JSON.stringify(res.user))
      localStorage.setItem('organization', JSON.stringify(res.organization))

      navigate('/dashboard')
    } catch (err) {
      const data = err?.response?.data
      const msg =
        data?.detail ||
        data?.message ||
        data?.non_field_errors?.[0] ||
        (data?.email?.[0]) ||
        (data?.password?.[0]) ||
        'Invalid email or password. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-300 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

  return (
    <div className="flex min-h-screen w-full">

      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-16 text-white"
        style={{ background: 'linear-gradient(145deg, #1a2f6e 0%, #243580 60%, #1e3a8a 100%)' }}
      >
        <img src="/techgeum_logo.png" alt="Techgeum" className="mb-10 h-28 w-28 object-contain drop-shadow-xl" />
        <h2 className="mb-3 text-center text-4xl font-extrabold leading-snug tracking-tight">
          Manage your finances<br />with confidence
        </h2>
        <p className="max-w-xs text-center text-base leading-relaxed text-blue-200">
          Track expenses, manage invoices, and get real-time insights — all in one place.
        </p>
        <p className="mt-12 text-xs uppercase tracking-widest text-blue-300">Powered by Techgeum</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex w-full flex-col items-center justify-center bg-slate-50 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">

          <div className="mb-10 flex justify-center">
            <img src="/techgeum_logo2.png" alt="Techgeum" className="h-20 object-contain" />
          </div>

          <h1 className="text-center text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-center text-sm text-gray-400">Sign in to your account to continue</p>

          {/* Error banner */}
          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">!</span>
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-600">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-600">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
              Create one
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Login
