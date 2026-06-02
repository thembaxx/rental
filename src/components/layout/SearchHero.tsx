"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

export function SearchHero() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?city=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="relative bg-primary text-primary-foreground py-20 px-4">
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white" />
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find your perfect place
        </h1>
        <p className="text-lg opacity-90 mb-8">
          Discover apartments, houses, rooms, and more. No fees, direct contact with landlords.
        </p>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
            <Input
              type="text"
              placeholder="Search by city, neighborhood, or address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 bg-white text-foreground"
            />
          </div>
          <Button type="submit" size="lg" className="gap-2">
            <Search className="w-4 h-4" />
            Search
          </Button>
        </form>
      </div>
    </div>
  )
}
