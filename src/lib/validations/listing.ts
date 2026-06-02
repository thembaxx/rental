import { z } from "zod"

export const listingSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100),
  description: z.string().min(50, "Description must be at least 50 characters").max(5000),
  price: z.number().positive("Price must be positive"),
  priceType: z.enum(["MONTHLY", "NIGHTLY", "TOTAL"]),
  propertyType: z.enum(["APARTMENT", "HOUSE", "ROOM", "PARKING", "STORAGE", "STUDIO", "LOFT", "OTHER"]),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  areaSqm: z.number().positive().optional(),
  furnished: z.boolean().default(false),
  petFriendly: z.boolean().default(false),
  maxGuests: z.number().min(1).optional(),
  availableFrom: z.date().optional(),
  availableUntil: z.date().optional(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().optional(),
  country: z.string().min(2),
  zipCode: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1, "At least one image required").max(10),
})

export type ListingInput = z.infer<typeof listingSchema>

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
  type: z.enum(["LISTING", "LISTER", "SEEKER"]),
  listingId: z.string().optional(),
  recipientId: z.string(),
})

export const messageSchema = z.object({
  content: z.string().min(1).max(2000),
  conversationId: z.string(),
})
