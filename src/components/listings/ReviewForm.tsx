"use client"

import { useState } from "react"
import { createReview } from "@/actions/reviews"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface ReviewFormProps {
  listingId?: string
  recipientId: string
  type: "LISTING" | "LISTER" | "SEEKER"
  onSuccess?: () => void
}

export function ReviewForm({ listingId, recipientId, type, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setLoading(true)
    setError("")

    try {
      await createReview({
        rating,
        comment: comment || undefined,
        type,
        listingId,
        recipientId,
      })
      setRating(0)
      setComment("")
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || "Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-xl p-4">
      <h3 className="font-semibold">Write a Review</h3>

      {/* Star Rating */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating > 0 ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating] : "Select a rating"}
        </span>
      </div>

      {/* Comment */}
      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)..."
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={loading} size="sm">
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
