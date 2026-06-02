"use client"

import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Bed, Bath, Star } from "lucide-react"
import { toggleFavorite } from "@/actions/listings"
import { useState } from "react"
import { ListingWithLister } from "@/types"

interface ListingCardProps {
  listing: ListingWithLister
  isSelected?: boolean
  onHover?: () => void
}

export function ListingCard({ listing, isSelected, onHover }: ListingCardProps) {
  const [isFav, setIsFav] = useState(false)

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFav(!isFav)
    await toggleFavorite(listing.id)
  }

  return (
    <Link
      href={`/listing/${listing.id}`}
      onMouseEnter={onHover}
      className={`group block border rounded-xl overflow-hidden transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary shadow-md" : ""
      }`}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={listing.images[0] || "/placeholder.jpg"}
          alt={listing.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </button>
        {listing.featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold line-clamp-1 flex-1">{listing.title}</h3>
          <div className="flex items-center gap-1 ml-2 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>4.5</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{listing.city}, {listing.country}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          {listing.bedrooms !== null && (
            <span className="flex items-center gap-1">
              <Bed className="w-3 h-3" /> {listing.bedrooms}
            </span>
          )}
          {listing.bathrooms !== null && (
            <span className="flex items-center gap-1">
              <Bath className="w-3 h-3" /> {listing.bathrooms}
            </span>
          )}
          {listing.areaSqm && <span>{listing.areaSqm}m²</span>}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">
            {formatPrice(Number(listing.price), listing.priceType)}
          </span>
          <span className="text-xs text-muted-foreground">
            {listing._count?.favorites || 0} saves
          </span>
        </div>
      </div>
    </Link>
  )
}
