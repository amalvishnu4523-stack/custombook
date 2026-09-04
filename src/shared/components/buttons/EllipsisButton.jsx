import { MoreHorizontal } from "lucide-react";

const EllipsisButton = ({
  onClick,
  size = "md",
  disabled = false,
  className = "",
  ariaLabel = "More options",
}) => {
  const sizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        ${sizes[size]}
        inline-flex
        items-center
        justify-center
        rounded-md
        border
        border-gray-200
        bg-white
        text-gray-600
        transition
        hover:bg-gray-50
        hover:text-gray-900
        focus:outline-none
        focus:ring-2
        focus:ring-gray-200
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
    >
      <MoreHorizontal size={20} strokeWidth={2} />
    </button>
  );
};

export default EllipsisButton;