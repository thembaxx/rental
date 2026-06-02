"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SearchFilters } from "@/types"
import { SlidersHorizontal, X } from "lucide-react"
import { useState } from "react"

const AMENITIES = [
  "WIFI", "PARKING", "LAUNDRY", "AC", "HEATING",
  "KITCHEN", "TV", "POOL", "GYM", "ELEVATOR",
  "BALCONY", "GARDEN", "PET_FRIENDLY", "FURNISHED",
  "SECURITY_SYSTEM", "WATER_INCLUDED", "ELECTRICITY_INCLUDED",
]

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "ROOM", label: "Room" },
  { value: "STUDIO", label: "Studio" },
  { value: "LOFT", label: "Loft" },
  { value: "PARKING", label: "Parking" },
  { value: "STORAGE", label: "Storage" },
]

interface FilterSidebarProps {
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
}

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters({ ...filters, [key]: value })
  }

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities || []
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity]
    updateFilter("amenities", updated)
  }

  const clearFilters = () => {
    setFilters({ minPrice: 0, maxPrice: 10000 })
  }

  const hasFilters =
    filters.minPrice !== 0 ||
    filters.maxPrice !== 10000 ||
    filters.propertyType ||
    filters.bedrooms ||
    filters.amenities?.length

  return (
    <div className="border-b">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-medium">Filters</span>
          {hasFilters && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="w-3 h-3" /> Clear
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Hide" : "Show"}
          </Button>
        </div>
      </div>

      <div className={`${isOpen ? "block" : "hidden"} lg:block p-4 space-y-6`}>
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="font-medium">Price Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) => updateFilter("minPrice", Number(e.target.value))}
              className="h-9"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) => updateFilter("maxPrice", Number(e.target.value))}
              className="h-9"
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-3">
          <Label className="font-medium">Property Type</Label>
          <div className="space-y-2">
            {PROPERTY_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.propertyType === type.value}
                  onCheckedChange={() =>
                    updateFilter(
                      "propertyType",
                      filters.propertyType === type.value ? undefined : type.value
                    )
                  }
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div className="space-y-3">
          <Label className="font-medium">Bedrooms</Label>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((num) => (
              <Button
                key={num}
                variant={filters.bedrooms === num ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() =>
                  updateFilter("bedrooms", filters.bedrooms === num ? undefined : num)
                }
              >
                {num === 0 ? "Studio" : `${num}+`}
              </Button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <Label className="font-medium">Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.amenities?.includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                />
                <span className="text-xs capitalize">{amenity.replace(/_/g, " ").toLowerCase()}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
