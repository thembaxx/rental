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
    // Avoid crashing the entire page on DB errors. Fall back to empty results.
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
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
    <div>
      {/* Hero */}
      <SearchHero />

      {/* Featured */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Listings</h2>
          <Link href="/search">
            <Button variant="ghost">View all →</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.length > 0 ? (
            featured.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-muted p-16 text-center text-muted-foreground">
              No featured listings are available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Recent */}
      <section className="py-16 px-4 max-w-7xl mx-auto bg-muted/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Just Added</h2>
          <Link href="/search">
            <Button variant="ghost">View all →</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recent.length > 0 ? (
            recent.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-muted p-16 text-center text-muted-foreground">
              No recent listings are available right now.
            </div>
          )}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why RentSpace?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Map-Based Search</h3>
            <p className="text-muted-foreground">
              Explore listings on an interactive map. Draw your search area and see exactly what's available where you want to live.
            </p>
          </div>
          <div className="text-center p-6">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Direct Messaging</h3>
            <p className="text-muted-foreground">
              Chat directly with landlords and property managers. No middlemen, no hidden fees, just honest communication.
            </p>
          </div>
          <div className="text-center p-6">
            <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Verified & Reviewed</h3>
            <p className="text-muted-foreground">
              Every listing and landlord is rated by real renters. Read honest reviews before you even send a message.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Have a place to rent?</h2>
          <p className="text-lg mb-8 opacity-90">
            List your property for free. Reach thousands of potential renters with detailed listings, photos, and instant messaging.
          </p>
          <Link href="/my-listings/new">
            <Button size="lg" variant="secondary">
              Post Your Listing
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
