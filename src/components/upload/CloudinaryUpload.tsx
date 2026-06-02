"use client"

import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface CloudinaryUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function CloudinaryUpload({ images, onImagesChange, maxImages = 10 }: CloudinaryUploadProps) {
  const handleUpload = (result: any) => {
    if (result.event === "success") {
      const newImage = result.info.secure_url
      onImagesChange([...images, newImage].slice(0, maxImages))
    }
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const reorderImages = (from: number, to: number) => {
    const newImages = [...images]
    const [moved] = newImages.splice(from, 1)
    newImages.splice(to, 0, moved)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {images.length < maxImages && (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          signatureEndpoint="/api/sign-cloudinary"
          options={{
            maxFiles: maxImages - images.length,
            sources: ["local", "url", "camera"],
            multiple: true,
            resourceType: "image",
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
            maxFileSize: 10000000, // 10MB
          }}
          onSuccess={handleUpload}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              className="w-full h-32 border-dashed"
              onClick={() => open()}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload ({images.length}/{maxImages})
                </span>
              </div>
            </Button>
          )}
        </CldUploadWidget>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {images.map((img, i) => (
            <div
              key={img}
              className={`relative aspect-square rounded-lg overflow-hidden group border-2 ${
                i === 0 ? "border-primary" : "border-transparent"
              }`}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", String(i))}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const from = Number(e.dataTransfer.getData("text/plain"))
                reorderImages(from, i)
              }}
            >
              <Image
                src={img}
                alt={`Listing image ${i + 1}`}
                fill
                className="object-cover"
              />
              {i === 0 && (
                <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">
                  Primary
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
