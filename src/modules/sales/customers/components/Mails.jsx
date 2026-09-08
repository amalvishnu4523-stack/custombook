import { Mail, ChevronDown, AlertTriangle } from 'lucide-react'

function Mails() {
  return (
    <div className="p-6 max-w-5xl">
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3">
          <span className="text-sm font-semibold text-gray-800">System Mails</span>
          <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition">
            <Mail className="h-4 w-4" />
            Link Email account
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Empty state */}
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
          <AlertTriangle className="h-5 w-5 text-orange-400" />
          <span>No emails sent.</span>
        </div>

      </div>
    </div>
  )
}

export default Mails
