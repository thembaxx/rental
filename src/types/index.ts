// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listing = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type User = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Message = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _Review = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _Favorite = any

export type ListingWithLister = Listing & {
  lister: Pick<User, "id" | "name" | "image">
  _count?: {
    reviews: number
    favorites: number
  }
}

export type ConversationWithMessages = {
  id: string
  listingId: string | null
  lastMessageAt: Date
  participants: {
    user: Pick<User, "id" | "name" | "image">
  }[]
  messages: (Message & {
    sender: Pick<User, "id" | "name" | "image">
  })[]
}

export type SearchFilters = {
  minPrice?: number
  maxPrice?: number
  propertyType?: string
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
  furnished?: boolean
  petFriendly?: boolean
}
