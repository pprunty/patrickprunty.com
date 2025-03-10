"use client"

import React from "react"
import { MemoizedImage } from "@/modules/common/components/MemoizedImage"

interface PhotoGridProps {
  images: string[]
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 py-4">
      {images.map((src, index) => (
        <div
          key={index}
          className="relative aspect-square"
          // Only display images that complete full rows
          style={{
            display:
              // For mobile/tablet (2 columns): hide if not in a complete row of 2
              (index >= Math.floor(images.length / 2) * 2 && window.innerWidth < 1024) ||
              // For desktop (3 columns): hide if not in a complete row of 3
              (index >= Math.floor(images.length / 3) * 3 && window.innerWidth >= 1024)
                ? "none"
                : "block",
          }}
        >
          <MemoizedImage
            src={src}
            alt={`Photo ${index + 1}`}
            width={600}
            height={600}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  )
}

export default React.memo(PhotoGrid)

