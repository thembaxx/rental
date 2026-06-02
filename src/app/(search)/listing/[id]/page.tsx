import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { formatPrice, formatDate } from "@/lib/utils"
import { auth } from "@/lib/auth"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Maximize, Calendar, PawPrint, Sofa, Star, MessageCircle, Heart, Share2, Flag } from "lucide-react"

async function getListing(id: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      lister: { select: { id: true, name: true, image: true, createdAt: true } },
      reviews: {
        include: { author: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true, favorites: true } },
    },
  })

  if (!listing || listing.status !== "ACTIVE") return null
  return listing
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id)
  if (!listing) notFound()

  const session = await auth()
  const isOwner = session?.user?.id === listing.listerId

  // Increment view count
  await prisma.listing.update({
    where: { id: listing.id },
    data: { viewCount: { increment: 1 } },
  })

  const avgRating = listing.reviews.length > 0
      ? listing.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / listing.reviews.length
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{listing.address}, {listing.city}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Flag className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 rounded-xl overflow-hidden">
        <div className="relative aspect-[4/3] md:aspect-auto md:h-[400px]">
          <Image
            src={listing.images[0] || "/placeholder.jpg"}
            alt={listing.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="hidden md:grid grid-cols-2 gap-2">
          {listing.images.slice(1, 5).map((img: string, i: number) => (
            <div key={i} className="relative aspect-square">
              <Image src={img} alt={`${listing.title} ${i + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4">
            {listing.bedrooms !== null && (
              <Badge variant="secondary" className="gap-1">
                <Bed className="w-4 h-4" /> {listing.bedrooms} beds
              </Badge>
            )}
            {listing.bathrooms !== null && (
              <Badge variant="secondary" className="gap-1">
                <Bath className="w-4 h-4" /> {listing.bathrooms} baths
              </Badge>
            )}
            {listing.areaSqm && (
              <Badge variant="secondary" className="gap-1">
                <Maximize className="w-4 h-4" /> {listing.areaSqm} m²
              </Badge>
            )}
            <Badge variant="secondary" className="gap-1">
              <Calendar className="w-4 h-4" /> {listing.propertyType.toLowerCase()}
            </Badge>
            {listing.petFriendly && (
              <Badge variant="secondary" className="gap-1">
                <PawPrint className="w-4 h-4" /> Pet friendly
              </Badge>
            )}
            {listing.furnished && (
              <Badge variant="secondary" className="gap-1">
                <Sofa className="w-4 h-4" /> Furnished
              </Badge>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">About this place</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
          </div>

          {/* Amenities */}
          {listing.amenities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.amenities.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {amenity.replace(/_/g, " ").toLowerCase()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">Reviews</h2>
              {avgRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{avgRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({listing._count.reviews} reviews)</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {listing.reviews.map((review: any) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {review.author.name?.[0] || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.author.name || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{review.rating}</span>
                    </div>
                  </div>
                  {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="border rounded-xl p-6 shadow-sm sticky top-4">
            <div className="mb-4">
              <span className="text-2xl font-bold">{formatPrice(Number(listing.price), listing.priceType)}</span>
            </div>

            {!isOwner && session?.user && (
              <div className="space-y-3">
                <Link href={`/inbox?listing=${listing.id}`}>
                  <Button className="w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contact Lister
                  </Button>
                </Link>
                <Button variant="outline" className="w-full gap-2">
                  <Heart className="w-4 h-4" />
                  Save to Favorites
                </Button>
              </div>
            )}

            {!session?.user && (
              <Button className="w-full" asChild>
                <Link href="/">Sign in to contact</Link>
              </Button>
            )}

            {isOwner && (
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/my-listings/${listing.id}/edit`}>Edit Listing</Link>
              </Button>
            )}

            {/* Lister Profile */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-medium">
                  {listing.lister.name?.[0] || "?"}
                </div>
                <div>
                  <p className="font-medium">{listing.lister.name || "Host"}</p>
                  <p className="text-xs text-muted-foreground">
                    Member since {formatDate(listing.lister.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
