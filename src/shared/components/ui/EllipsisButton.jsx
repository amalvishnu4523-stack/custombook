import { MoreHorizontal } from 'lucide-react'

function EllipsisButton({ onClick, className = '', size = 'md', ...props }) {
  const sizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 ${sizes[size]} ${className}`}
      aria-label="More options"
      {...props}
    >
      <MoreHorizontal size={18} />
    </button>
  )
}

export default EllipsisButton
