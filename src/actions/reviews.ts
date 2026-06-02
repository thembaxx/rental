"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { reviewSchema } from "@/lib/validations/listing"

export async function createReview(data: {
  rating: number
  comment?: string
  type: "LISTING" | "LISTER" | "SEEKER"
  listingId?: string
  recipientId: string
}) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const validated = reviewSchema.parse(data)

  // Prevent self-reviews
  if (validated.recipientId === session.user.id) {
    throw new Error("Cannot review yourself")
  }

  // Prevent duplicate reviews
  const existing = await prisma.review.findFirst({
    where: {
      authorId: session.user.id,
      listingId: validated.listingId,
      type: validated.type,
    },
  })

  if (existing) {
    throw new Error("You have already reviewed this")
  }

  const review = await prisma.review.create({
    data: {
      ...validated,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      recipient: { select: { id: true, name: true, image: true } },
    },
  })

  // Update average rating on listing if it's a listing review
  if (validated.type === "LISTING" && validated.listingId) {
    await updateListingRating(validated.listingId)
  }

  // Update average rating on user if it's a user review
  if (validated.type === "LISTER" || validated.type === "SEEKER") {
    await updateUserRating(validated.recipientId, validated.type)
  }

  revalidatePath(`/listing/${validated.listingId}`)
  revalidatePath(`/profile/${validated.recipientId}`)
  return review
}

async function updateListingRating(listingId: string) {
  const _result = await prisma.review.aggregate({
    where: {
      listingId,
      type: "LISTING",
    },
    _avg: { rating: true },
    _count: { id: true },
  })

  // Store denormalized rating on listing for performance
  // You could add an averageRating field to the Listing model
  // For now, we calculate on the fly
}

async function updateUserRating(userId: string, type: "LISTER" | "SEEKER") {
  const result = await prisma.review.aggregate({
    where: {
      recipientId: userId,
      type,
    },
    _avg: { rating: true },
    _count: { id: true },
  })

  // Check for Superlister eligibility
  if (type === "LISTER") {
    const listingCount = await prisma.listing.count({
      where: { listerId: userId, status: "ACTIVE" },
    })

    const _isSuperlister =
      listingCount >= 5 &&
      (result._avg.rating || 0) >= 4.5 &&
      (result._count.id || 0) >= 10

    // You could add a superlister flag to the User model
  }
}

export async function getReviews({
  listingId,
  recipientId,
  type,
}: {
  listingId?: string
  recipientId?: string
  type?: "LISTING" | "LISTER" | "SEEKER"
}) {
  return prisma.review.findMany({
    where: {
      ...(listingId && { listingId }),
      ...(recipientId && { recipientId }),
      ...(type && { type }),
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}
