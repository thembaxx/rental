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
    <section className="bg-background px-4 pb-10 pt-8 sm:pb-14 sm:pt-10">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-5 shadow-soft sm:p-8">
        <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Rentals designed for speed</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Find your next home in minutes.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Browse verified listings, message hosts instantly, and book the rental that fits your move schedule.
          </p>

          <form onSubmit={handleSearch} className="mt-7 grid gap-3 sm:flex sm:items-center">
            <label className="sr-only" htmlFor="search-input">
              Search rentals
            </label>
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by city, neighborhood, or address"
                className="h-14 rounded-[1.5rem] border border-border bg-background pl-12 pr-4 text-foreground shadow-card"
              />
            </div>
            <Button type="submit" size="lg" className="min-w-[10rem] rounded-[1.5rem] py-4">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
