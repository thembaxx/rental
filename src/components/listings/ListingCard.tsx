"use client"

import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
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
      className="group block overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <Image
          src={listing.images[0] || "/placeholder.jpg"}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          {listing.featured ? (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent-foreground">
              Featured
            </span>
          ) : (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-foreground">
              Rental
            </span>
          )}
          <button
            onClick={handleFavorite}
            className="rounded-2xl bg-background/90 p-2 shadow-sm backdrop-blur transition hover:bg-background"
            aria-label="Favorite listing"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
          </button>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-foreground line-clamp-1">{listing.title}</h3>
          <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500" /> 4.5
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {listing.city}, {listing.country}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {listing.bedrooms !== null && (
            <span className="rounded-2xl bg-background px-3 py-2">{listing.bedrooms} beds</span>
          )}
          {listing.bathrooms !== null && (
            <span className="rounded-2xl bg-background px-3 py-2">{listing.bathrooms} baths</span>
          )}
          {listing.areaSqm && <span className="rounded-2xl bg-background px-3 py-2">{listing.areaSqm} m²</span>}
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <span className="text-lg font-semibold text-foreground">{formatPrice(Number(listing.price), listing.priceType)}</span>
          <span className="text-sm text-muted-foreground">{listing._count?.favorites || 0} saves</span>
        </div>
      </div>
    </Link>
  )
}
