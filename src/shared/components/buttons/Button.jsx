function Button({
  children,
  onClick,
  type = 'button',

  // Dynamic styles
  color = '#3b82f6',
  textColor = '#ffffff',
  size = '14px',
  padding = '12px 20px',
  width = 'auto',
  height = 'auto',
  radius = '8px',

  // Other styles
  fontWeight = 500,
  background,
  border = 'none',

  // State
  disabled = false,

  // Extra Tailwind classes
  className = '',

  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        transition
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
      style={{
        background: background || color,
        color: textColor,
        fontSize: size,
        padding: padding,
        width: width,
        height: height,
        borderRadius: radius,
        fontWeight: fontWeight,
        border: border,
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button