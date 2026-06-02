import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create sample listings
  const listings = [
    {
      title: "Modern Downtown Apartment with City Views",
      description: "Stunning 2-bedroom apartment in the heart of downtown. Features floor-to-ceiling windows, modern kitchen with stainless steel appliances, in-unit laundry, and access to building amenities including gym and rooftop terrace. Walking distance to public transit, restaurants, and shopping.",
      price: 2500,
      priceType: "MONTHLY" as const,
      propertyType: "APARTMENT" as const,
      bedrooms: 2,
      bathrooms: 2,
      areaSqm: 85,
      furnished: true,
      petFriendly: false,
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      country: "United States",
      lat: 40.7128,
      lng: -74.006,
      zipCode: "10001",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"],
      amenities: ["WIFI", "PARKING", "LAUNDRY", "AC", "GYM", "ELEVATOR", "FURNISHED"],
      status: "ACTIVE" as const,
      featured: true,
    },
    {
      title: "Cozy Studio in Historic Brownstone",
      description: "Charming studio apartment in a beautifully preserved brownstone. Original hardwood floors, exposed brick walls, and high ceilings. Recently renovated bathroom and kitchenette. Quiet tree-lined street just steps from the park and subway.",
      price: 1800,
      priceType: "MONTHLY" as const,
      propertyType: "STUDIO" as const,
      bedrooms: 0,
      bathrooms: 1,
      areaSqm: 45,
      furnished: false,
      petFriendly: true,
      address: "456 Park Avenue, Studio 2",
      city: "New York",
      state: "NY",
      country: "United States",
      lat: 40.7282,
      lng: -73.9942,
      zipCode: "10010",
      images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"],
      amenities: ["WIFI", "HEATING", "KITCHEN", "PET_FRIENDLY"],
      status: "ACTIVE" as const,
      featured: false,
    },
    {
      title: "Spacious 3BR House with Garden",
      description: "Beautiful 3-bedroom house with private garden and patio. Perfect for families or roommates. Large living room with fireplace, updated kitchen, two full bathrooms. Includes washer/dryer, central AC, and off-street parking. Close to schools and parks.",
      price: 3500,
      priceType: "MONTHLY" as const,
      propertyType: "HOUSE" as const,
      bedrooms: 3,
      bathrooms: 2,
      areaSqm: 150,
      furnished: false,
      petFriendly: true,
      address: "789 Oak Street",
      city: "Brooklyn",
      state: "NY",
      country: "United States",
      lat: 40.6782,
      lng: -73.9442,
      zipCode: "11201",
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"],
      amenities: ["WIFI", "PARKING", "LAUNDRY", "AC", "GARDEN", "PET_FRIENDLY", "WATER_INCLUDED"],
      status: "ACTIVE" as const,
      featured: true,
    },
    {
      title: "Luxury Loft in Arts District",
      description: "Industrial-chic loft with soaring 14-foot ceilings, exposed ductwork, and massive windows. Open floor plan perfect for creative professionals. Polished concrete floors, gourmet kitchen with island, and walk-in closet. Building features 24/7 doorman and package room.",
      price: 3200,
      priceType: "MONTHLY" as const,
      propertyType: "LOFT" as const,
      bedrooms: 1,
      bathrooms: 1.5,
      areaSqm: 95,
      furnished: true,
      petFriendly: false,
      address: "321 Creative Way, Unit 8",
      city: "Los Angeles",
      state: "CA",
      country: "United States",
      lat: 34.0407,
      lng: -118.2468,
      zipCode: "90013",
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"],
      amenities: ["WIFI", "PARKING", "AC", "GYM", "ELEVATOR", "FURNISHED", "SECURITY_SYSTEM"],
      status: "ACTIVE" as const,
      featured: false,
    },
    {
      title: "Private Room in Shared House",
      description: "Furnished private room in a friendly shared house. House has 4 bedrooms total, shared kitchen, living room, and two bathrooms. All utilities included. High-speed internet, weekly cleaning service. Looking for a respectful, clean roommate.",
      price: 900,
      priceType: "MONTHLY" as const,
      propertyType: "ROOM" as const,
      bedrooms: 1,
      bathrooms: 1,
      areaSqm: 20,
      furnished: true,
      petFriendly: false,
      address: "555 Community Drive",
      city: "Austin",
      state: "TX",
      country: "United States",
      lat: 30.2672,
      lng: -97.7431,
      zipCode: "78701",
      images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=600&fit=crop"],
      amenities: ["WIFI", "LAUNDRY", "KITCHEN", "TV", "FURNISHED", "WATER_INCLUDED", "ELECTRICITY_INCLUDED"],
      status: "ACTIVE" as const,
      featured: false,
    },
    {
      title: "Beachfront Condo with Ocean Views",
      description: "Wake up to ocean views in this stunning beachfront condo. 2 bedrooms, 2 bathrooms, private balcony overlooking the Pacific. Resort-style amenities include pool, hot tub, and beach access. Fully furnished with coastal decor. Available for short or long term.",
      price: 4500,
      priceType: "MONTHLY" as const,
      propertyType: "APARTMENT" as const,
      bedrooms: 2,
      bathrooms: 2,
      areaSqm: 110,
      furnished: true,
      petFriendly: true,
      address: "888 Ocean Drive, Unit 1205",
      city: "Miami",
      state: "FL",
      country: "United States",
      lat: 25.7617,
      lng: -80.1918,
      zipCode: "33139",
      images: ["https://images.unsplash.com/photo-1512918760513-95f192631f00?w=800&h=600&fit=crop"],
      amenities: ["WIFI", "PARKING", "LAUNDRY", "AC", "POOL", "GYM", "BALCONY", "FURNISHED", "PET_FRIENDLY"],
      status: "ACTIVE" as const,
      featured: true,
    },
  ]

  // Create a demo user first
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@rentspace.com" },
    update: {},
    create: {
      email: "demo@rentspace.com",
      name: "Demo Lister",
      isLister: true,
      emailVerified: new Date(),
    },
  })

  for (const listing of listings) {
    await prisma.listing.upsert({
      where: { id: listing.title.replace(/\s+/g, "-").toLowerCase() },
      update: {},
      create: {
        ...(listing as any),
        listerId: demoUser.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })
  }

  console.log(`Seeded ${listings.length} listings`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
