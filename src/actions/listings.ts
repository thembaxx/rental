"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { listingSchema, ListingInput } from "@/lib/validations/listing"

export async function createListing(data: ListingInput) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const validated = listingSchema.parse(data)

  if (!session.user.isLister) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { isLister: true },
    })
  }

  const listing = await prisma.listing.create({
    data: {
      ...validated,
      listerId: session.user.id,
      status: "ACTIVE",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  revalidatePath("/search")
  revalidatePath("/")
  return listing
}

export async function updateListing(id: string, data: Partial<ListingInput>) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const existing = await prisma.listing.findUnique({
    where: { id },
    select: { listerId: true },
  })

  if (!existing || existing.listerId !== session.user.id) {
    throw new Error("Not authorized to edit this listing")
  }

  const listing = await prisma.listing.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })

  revalidatePath(`/listing/${id}`)
  revalidatePath("/search")
  return listing
}

export async function deleteListing(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const existing = await prisma.listing.findUnique({
    where: { id },
    select: { listerId: true },
  })

  if (!existing || existing.listerId !== session.user.id) {
    throw new Error("Not authorized")
  }

  await prisma.listing.delete({ where: { id } })
  revalidatePath("/my-listings")
  revalidatePath("/search")
}

export async function refreshListing(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const existing = await prisma.listing.findUnique({
    where: { id },
    select: { listerId: true, expiresAt: true },
  })

  if (!existing || existing.listerId !== session.user.id) {
    throw new Error("Not authorized")
  }

  const newExpiry = new Date(Math.max(
    Date.now(),
    existing.expiresAt.getTime()
  ) + 30 * 24 * 60 * 60 * 1000)

  await prisma.listing.update({
    where: { id },
    data: {
      refreshedAt: new Date(),
      expiresAt: newExpiry,
    },
  })

  revalidatePath("/my-listings")
}

export async function toggleFavorite(listingId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_listingId: {
        userId: session.user.id,
        listingId,
      },
    },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } })
  } else {
    await prisma.favorite.create({
      data: {
        userId: session.user.id,
        listingId,
      },
    })
  }

  revalidatePath("/favorites")
  revalidatePath(`/listing/${listingId}`)
}
