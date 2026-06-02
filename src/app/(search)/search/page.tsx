"use client"

import { useState, useCallback, useEffect } from "react"
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { FilterSidebar } from "@/components/listings/FilterSidebar"
import { ListingCard } from "@/components/listings/ListingCard"
import { PriceMarker } from "@/components/map/PriceMarker"
import { SearchFilters } from "@/types"
import { ListingWithLister } from "@/types"

export default function SearchPage() {
  const [viewState, setViewState] = useState({
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 12,
  })
  const [listings, setListings] = useState<ListingWithLister[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: 0,
    maxPrice: 10000,
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const fetchListings = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      north: (viewState.latitude + 0.1).toString(),
      south: (viewState.latitude - 0.1).toString(),
      east: (viewState.longitude + 0.1).toString(),
      west: (viewState.longitude - 0.1).toString(),
      ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() }),
      ...(filters.propertyType && { propertyType: filters.propertyType }),
      ...(filters.bedrooms && { bedrooms: filters.bedrooms.toString() }),
      ...(filters.amenities?.length && { amenities: filters.amenities.join(",") }),
    })

    try {
      const res = await fetch(`/api/listings/search?${params}`)
      const data = await res.json()
      setListings(data)
    } catch (err) {
      console.error("Failed to fetch listings:", err)
    } finally {
      setLoading(false)
    }
  }, [viewState, filters])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-full lg:w-[45%] xl:w-[40%] overflow-y-auto border-r bg-background">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        <div className="p-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No listings found in this area.</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or zooming out.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isSelected={selectedId === listing.id}
                  onHover={() => setSelectedId(listing.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="hidden lg:block flex-1 relative">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onMoveEnd={fetchListings}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
          <NavigationControl position="top-right" />
          {listings.map((listing) => (
            <Marker
              key={listing.id}
              longitude={listing.lng}
              latitude={listing.lat}
            >
              <PriceMarker
                price={Number(listing.price)}
                isSelected={selectedId === listing.id}
                onClick={() => setSelectedId(listing.id)}
              />
            </Marker>
          ))}
        </Map>
      </div>
    </div>
  )
}
