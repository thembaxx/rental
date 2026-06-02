import { prisma } from "@/lib/prisma"
import { SearchHero } from "@/components/layout/SearchHero"
import { ListingCard } from "@/components/listings/ListingCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Shield, MessageCircle } from "lucide-react"

async function getFeaturedListings() {
  try {
    return await prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        featured: true,
        expiresAt: { gt: new Date() },
      },
      include: {
        lister: { select: { id: true, name: true, image: true } },
        _count: { select: { reviews: true, favorites: true } },
      },
      take: 8,
      orderBy: { refreshedAt: "desc" },
    })
  } catch (err: any) {
    console.warn('Featured listings unavailable:', err?.code ?? err?.message ?? 'Unknown error')
    return []
  }
}

async function getRecentListings() {
  try {
    return await prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
      },
      include: {
        lister: { select: { id: true, name: true, image: true } },
        _count: { select: { reviews: true, favorites: true } },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    })
  } catch (err: any) {
    console.warn('Recent listings unavailable:', err?.code ?? err?.message ?? 'Unknown error')
    return []
  }
}

export default async function HomePage() {
  const [featured, recent] = await Promise.all([
    getFeaturedListings(),
    getRecentListings(),
  ])

  return (
    <div className="space-y-10">
      <SearchHero />

      <section className="px-4">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">Fast rentals, familiar flow</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                A cleaner rental experience that feels like the apps you already trust.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Skip the clutter and browse listings with clear photos, transparent details, and direct host connection.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[1.5rem] border border-border bg-background p-5">
                <p className="text-sm font-semibold text-foreground">Verified hosts</p>
                <p className="mt-2 text-sm text-muted-foreground">Every listing gets a simple trust badge and guest rating summary.</p>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-background p-5">
                <p className="text-sm font-semibold text-foreground">Move-in ready</p>
                <p className="mt-2 text-sm text-muted-foreground">Search active rentals with real availability and fast communication.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">Featured homes</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">Top choices for your next move</h2>
          </div>
          <Link href="/search" className="flex items-center justify-center rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-muted">
            View all listings
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.length > 0 ? (
            featured.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <div className="col-span-full rounded-[1.5rem] border border-dashed border-border bg-surface p-10 text-center text-muted-foreground">
              No featured rentals are available right now.
            </div>
          )}
        </div>
      </section>

      <section className="px-4">
        <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[1.5rem] bg-background p-6">
              <p className="text-sm font-semibold text-foreground">Fast search</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Tap into curated city searches and fast filters that reduce decision fatigue.</p>
            </div>
            <div className="rounded-[1.5rem] bg-background p-6">
              <p className="text-sm font-semibold text-foreground">Secure connections</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Message hosts directly through the app and keep communication in one place.</p>
            </div>
            <div className="rounded-[1.5rem] bg-background p-6">
              <p className="text-sm font-semibold text-foreground">Clear pricing</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Every listing includes transparent rent details and a simplified cost summary.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">New arrivals</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">Browse recently added rentals</h2>
          </div>
          <Link href="/search" className="rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-muted">
            Browse newest
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recent.length > 0 ? (
            recent.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <div className="col-span-full rounded-[1.5rem] border border-dashed border-border bg-surface p-10 text-center text-muted-foreground">
              No recently added rentals found.
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-10">
        <div className="rounded-[2rem] border border-border bg-secondary px-6 py-8 text-secondary-foreground shadow-soft sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-secondary-foreground/75">List with confidence</p>
              <h2 className="mt-3 text-2xl font-semibold">Post your rental in under 5 minutes.</h2>
            </div>
            <Link href="/my-listings/new">
              <Button variant="default" size="lg" className="rounded-[1.5rem] bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Post your listing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
