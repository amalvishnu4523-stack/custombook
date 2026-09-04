import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.username || !form.password) {
      setError('Please enter your username and password.')
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(
      u => u.username === form.username && u.password === form.password
    )

    if (!user) {
      setError('Invalid username or password.')
      return
    }

    localStorage.setItem('token', user.username)
    localStorage.setItem('currentUser', JSON.stringify(user))
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen w-full">

      {/* ── Left Panel ── */}
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
          Manage your finances<br />with confidence
        </h2>
        <p className="text-center text-blue-200 text-base leading-relaxed max-w-xs">
          Track expenses, manage invoices, and get real-time insights — all in one place.
        </p>

      

        {/* Bottom tagline */}
        <p className="mt-12 text-xs text-blue-300 tracking-widest uppercase">
          Powered by Techgeum
        </p>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">

          {/* Wordmark logo — always visible on right */}
          <div className="mb-10 flex justify-center">
            <img
              src="/techgeum_logo2.png"
              alt="Techgeum"
              className="h-20 object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-400 text-center">Sign in to your account to continue</p>

          {/* Error banner */}
          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">!</span>
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} autoComplete="off">

            {/* Username */}
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-600">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="off"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-300 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-600">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-300 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{ background: 'linear-gradient(135deg, #1a2f6e, #2563eb)' }}
            >
              Sign In
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
