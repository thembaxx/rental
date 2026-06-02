"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createListing } from "@/actions/listings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CloudinaryUpload } from "@/components/upload/CloudinaryUpload"
import { AddressAutocomplete } from "@/components/map/AddressAutocomplete"
import { listingSchema } from "@/lib/validations/listing"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

const STEPS = ["Location", "Details", "Amenities", "Photos", "Pricing", "Review"]
const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "ROOM", label: "Room" },
  { value: "STUDIO", label: "Studio" },
  { value: "LOFT", label: "Loft" },
  { value: "PARKING", label: "Parking" },
  { value: "STORAGE", label: "Storage" },
  { value: "OTHER", label: "Other" },
]
const AMENITIES_LIST = [
  "WIFI", "PARKING", "LAUNDRY", "AC", "HEATING", "KITCHEN",
  "TV", "POOL", "GYM", "ELEVATOR", "BALCONY", "GARDEN",
  "PET_FRIENDLY", "FURNISHED", "SECURITY_SYSTEM",
  "WATER_INCLUDED", "ELECTRICITY_INCLUDED",
]

type ListingFormData = {
  title: string
  description: string
  price: number
  priceType: "MONTHLY" | "NIGHTLY" | "TOTAL"
  propertyType: "APARTMENT" | "HOUSE" | "ROOM" | "STUDIO" | "LOFT" | "PARKING" | "STORAGE" | "OTHER"
  bedrooms: number
  bathrooms: number
  areaSqm?: number
  furnished: boolean
  petFriendly: boolean
  maxGuests?: number
  address: string
  city: string
  state: string
  country: string
  lat: number
  lng: number
  amenities: string[]
  images: string[]
}

export default function NewListingPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    priceType: "MONTHLY" as const,
    propertyType: "APARTMENT" as const,
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: undefined as number | undefined,
    furnished: false,
    petFriendly: false,
    maxGuests: undefined as number | undefined,
    address: "",
    city: "",
    state: "",
    country: "",
    lat: 40.7128,
    lng: -74.006,
    amenities: [] as string[],
    images: [] as string[],
  })

  const updateField = <K extends keyof ListingFormData>(field: K, value: ListingFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleAddressSelect = (data: {
    address: string
    city: string
    state: string
    country: string
    lat: number
    lng: number
  }) => {
    setFormData((prev) => ({
      ...prev,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      lat: data.lat,
      lng: data.lng,
    }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next.address
      delete next.city
      delete next.country
      return next
    })
  }

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const validateStep = () => {
    const stepErrors: Record<string, string> = {}

    if (step === 0) {
      if (!formData.address.trim()) stepErrors.address = "Address is required"
      if (!formData.city.trim()) stepErrors.city = "City is required"
      if (!formData.country.trim()) stepErrors.country = "Country is required"
    }
    if (step === 1) {
      if (!formData.title.trim() || formData.title.length < 10) stepErrors.title = "Title must be at least 10 characters"
      if (!formData.description.trim() || formData.description.length < 50) stepErrors.description = "Description must be at least 50 characters"
      if (formData.price <= 0) stepErrors.price = "Price must be greater than 0"
    }
    if (step === 3) {
      if (formData.images.length === 0) stepErrors.images = "At least one image is required"
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep() && step < STEPS.length - 1) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    setLoading(true)

    try {
      const result = listingSchema.safeParse(formData)
      if (!result.success) {
        const fieldErrors: Record<string, string> = {}
        result.error.issues.forEach((err) => {
          fieldErrors[err.path[0] as string] = err.message
        })
        setErrors(fieldErrors)
        setLoading(false)
        return
      }

      await createListing(result.data)
      router.push("/my-listings")
    } catch (err) {
      console.error(err)
      setErrors({ submit: "Failed to create listing. Please try again." })
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0: // Location with Geocoding
        return (
          <div className="space-y-4">
            <AddressAutocomplete onSelect={handleAddressSelect} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Address *</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="123 Main Street"
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
              </div>
              <div>
                <Label>City *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="New York"
                  className={errors.city ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>State/Province</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  placeholder="NY"
                />
              </div>
              <div>
                <Label>Country *</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  placeholder="United States"
                  className={errors.country ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              Coordinates: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
            </div>
          </div>
        )

      case 1: // Details
        return (
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Spacious 2BR Apartment in Downtown"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
            </div>
            <div>
              <Label>Description *</Label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your property in detail..."
                rows={5}
                className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Property Type</Label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => updateField("propertyType", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Price *</Label>
                <Input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => updateField("price", Number(e.target.value))}
                  placeholder="1500"
                  className={errors.price ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div>
              <Label>Price Type</Label>
              <div className="flex gap-2">
                {["MONTHLY", "NIGHTLY", "TOTAL"].map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={formData.priceType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateField("priceType", type)}
                  >
                    {type === "MONTHLY" ? "/month" : type === "NIGHTLY" ? "/night" : "total"}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  value={formData.bedrooms || ""}
                  onChange={(e) => updateField("bedrooms", Number(e.target.value))}
                  placeholder="2"
                />
              </div>
              <div>
                <Label>Bathrooms</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={formData.bathrooms || ""}
                  onChange={(e) => updateField("bathrooms", Number(e.target.value))}
                  placeholder="1"
                />
              </div>
              <div>
                <Label>Area (m²)</Label>
                <Input
                  type="number"
                  value={formData.areaSqm || ""}
                  onChange={(e) => updateField("areaSqm", Number(e.target.value))}
                  placeholder="80"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.furnished}
                  onCheckedChange={(checked) => updateField("furnished", checked)}
                />
                <span className="text-sm">Furnished</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.petFriendly}
                  onCheckedChange={(checked) => updateField("petFriendly", checked)}
                />
                <span className="text-sm">Pet Friendly</span>
              </label>
            </div>
          </div>
        )

      case 2: // Amenities
        return (
          <div className="space-y-4">
            <Label>Select Amenities</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES_LIST.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <span className="text-sm capitalize">{amenity.replace(/_/g, " ").toLowerCase()}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 3: // Photos with Cloudinary
        return (
          <div className="space-y-4">
            <div>
              <Label>Upload Photos (max 10)</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Drag to reorder. First image will be the primary photo.
              </p>
              <CloudinaryUpload
                images={formData.images}
                onImagesChange={(images) => updateField("images", images)}
                maxImages={10}
              />
              {errors.images && <p className="text-sm text-red-500 mt-1">{errors.images}</p>}
            </div>
          </div>
        )

      case 4: // Pricing Summary
        return (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-2">Pricing Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span className="font-medium">${formData.price.toLocaleString()} {formData.priceType === "MONTHLY" ? "/month" : formData.priceType === "NIGHTLY" ? "/night" : "total"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Property Type</span>
                  <span className="font-medium capitalize">{formData.propertyType.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="font-medium">{formData.city}, {formData.country}</span>
                </div>
                <div className="flex justify-between">
                  <span>Photos</span>
                  <span className="font-medium">{formData.images.length} uploaded</span>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Listing Rules</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Listings expire after 30 days and can be refreshed</li>
                <li>Be honest in your description and photos</li>
                <li>Respond to inquiries within 24 hours</li>
                <li>No discriminatory language or practices</li>
              </ul>
            </div>
          </div>
        )

      case 5: // Review
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Review Your Listing</h3>
            <div className="border rounded-xl overflow-hidden">
              {formData.images[0] && (
                <div className="aspect-video bg-muted relative">
                  <Image
                    src={formData.images[0]}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-semibold text-lg">{formData.title}</h4>
                <p className="text-muted-foreground text-sm mt-1">{formData.address}, {formData.city}</p>
                <p className="font-bold text-xl mt-2">${formData.price.toLocaleString()} {formData.priceType === "MONTHLY" ? "/mo" : formData.priceType === "NIGHTLY" ? "/night" : ""}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.amenities.slice(0, 5).map((a) => (
                    <span key={a} className="text-xs bg-muted px-2 py-1 rounded-full capitalize">{a.replace(/_/g, " ").toLowerCase()}</span>
                  ))}
                  {formData.amenities.length > 5 && (
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">+{formData.amenities.length - 5} more</span>
                  )}
                </div>
              </div>
            </div>
            {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <section className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-600">New Listing</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Create your next property listing</h1>
            <p className="mt-2 text-sm text-slate-600">A guided multi-step form to help you publish a polished rental in minutes.</p>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
              {STEPS.map((s, i) => (
                <span key={s} className={i <= step ? "text-sky-600" : "text-slate-400"}>
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white shadow-inner">
              <div
                className="h-full rounded-full bg-sky-600 transition-all duration-300"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-sm">
        <div className="min-h-[400px] space-y-6">{renderStep()}</div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext} className="gap-2">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="gap-2">
              {loading ? (
                <>Publishing...</>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Publish Listing
                </>
              )}
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
