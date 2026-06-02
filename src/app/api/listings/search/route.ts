import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const { prisma } = await import("@/lib/prisma")
  const { searchParams } = new URL(req.url)

  const north = parseFloat(searchParams.get("north") || "90")
  const south = parseFloat(searchParams.get("south") || "-90")
  const east = parseFloat(searchParams.get("east") || "180")
  const west = parseFloat(searchParams.get("west") || "-180")
  const minPrice = parseFloat(searchParams.get("minPrice") || "0")
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999")
  const propertyType = searchParams.get("propertyType")
  const bedrooms = searchParams.get("bedrooms")
  const amenitiesParam = searchParams.get("amenities")
  const amenities = amenitiesParam ? amenitiesParam.split(",") : []

  try {
    const listings = await prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
        lat: { lte: north, gte: south },
        lng: { lte: east, gte: west },
        price: { gte: minPrice, lte: maxPrice },
        ...(propertyType && { propertyType }),
        ...(bedrooms && { bedrooms: parseInt(bedrooms) }),
        ...(amenities.length > 0 && {
          amenities: { hasEvery: amenities },
        }),
      },
      include: {
        lister: { select: { id: true, name: true, image: true } },
        _count: { select: { reviews: true, favorites: true } },
      },
      take: 100,
      orderBy: { refreshedAt: "desc" },
    })

    return Response.json(listings)
  } catch (error) {
    console.error("Search error:", error)
    return Response.json({ error: "Failed to search listings" }, { status: 500 })
  }
}
