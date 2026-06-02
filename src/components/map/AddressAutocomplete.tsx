"use client"

import { useState, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Loader2 } from "lucide-react"

interface GeocodeResult {
  place_name: string
  center: [number, number]
  context?: Array<{ id: string; text: string }>
}

interface AddressAutocompleteProps {
  onSelect: (data: {
    address: string
    city: string
    state: string
    country: string
    lat: number
    lng: number
  }) => void
}

export function AddressAutocomplete({ onSelect }: AddressAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=address,place,locality&limit=5`
      )
      const data = await response.json()
      setSuggestions(data.features || [])
    } catch (error) {
      console.error("Geocoding error:", error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value)
    }, 300)
  }

  const handleSelect = (result: GeocodeResult) => {
    setQuery(result.place_name)
    setShowSuggestions(false)
    setSuggestions([])

    // Extract context data
    const context = result.context || []
    const city = context.find((c) => c.id.startsWith("place"))?.text || ""
    const state = context.find((c) => c.id.startsWith("region"))?.text || ""
    const country = context.find((c) => c.id.startsWith("country"))?.text || ""

    onSelect({
      address: result.place_name,
      city,
      state,
      country,
      lat: result.center[1],
      lng: result.center[0],
    })
  }

  return (
    <div className="relative">
      <Label>Search Address</Label>
      <div className="relative mt-1.5">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Start typing an address..."
          className="pl-10"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((result, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0"
            >
              <p className="text-sm font-medium">{result.place_name}</p>
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  )
}
