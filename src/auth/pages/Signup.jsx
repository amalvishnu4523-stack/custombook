import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.name || !form.username || !form.password || !form.confirm) {
      setError('All fields are required.')
      return
    }

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    const existing = JSON.parse(localStorage.getItem('users') || '[]')
    if (existing.find(u => u.username === form.username)) {
      setError('Username already taken. Try a different one.')
      return
    }

    const newUser = { name: form.name, username: form.username, password: form.password }
    localStorage.setItem('users', JSON.stringify([...existing, newUser]))
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen w-full">

      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-16 text-white"
        style={{ background: 'linear-gradient(145deg, #1a2f6e 0%, #243580 60%, #1e3a8a 100%)' }}
      >
        {/* Icon logo */}
        <img
          src="/techgeum_logo.png"
          alt="Techgeum"
          className="mb-10 h-28 w-28 object-contain drop-shadow-xl"
        />

        <h2 className="mb-3 text-4xl font-extrabold leading-snug text-center tracking-tight">
          Your accounting,<br />simplified
        </h2>
        <p className="text-center text-blue-200 text-base leading-relaxed max-w-xs">
          Join thousands of businesses that trust Techgeum Books to keep their finances in order.
        </p>

        {/* Feature list */}
        <div className="mt-12 w-full max-w-sm space-y-4">
          {[
            'Invoice & expense tracking',
            'Real-time financial reports',
            'Multi-user access control',
            'Bank reconciliation',
          ].map(feature => (
            <div key={feature} className="flex items-center gap-3">
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ background: 'rgba(255,255,255,0.18)' }}
              >
                <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-sm text-blue-100">{feature}</span>
            </div>
          ))}
        </div>

        <p className="mt-12 text-xs text-blue-300 tracking-widest uppercase">
          Powered by Techgeum
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">

          {/* Wordmark logo */}
          <div className="mb-10 flex justify-center">
            <img
              src="/techgeum_logo2.png"
              alt="Techgeum"
              className="h-20 object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center">Create your account</h1>
          <p className="mt-2 text-sm text-gray-400 text-center">Get started — it only takes a minute</p>

          {/* Error */}
          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">!</span>
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{ background: 'linear-gradient(135deg, #1a2f6e, #2563eb)' }}
            >
              Create Account
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Signup
