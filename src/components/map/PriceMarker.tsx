"use client"

interface PriceMarkerProps {
  price: number
  isSelected?: boolean
  onClick?: () => void
}

export function PriceMarker({ price, isSelected, onClick }: PriceMarkerProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg transition-all hover:scale-110 ${
        isSelected
          ? "bg-primary text-primary-foreground scale-110"
          : "bg-white text-foreground hover:bg-gray-50"
      }`}
    >
      ${price.toLocaleString()}
    </button>
  )
}
