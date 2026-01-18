'use client';

import { useState } from 'react';

type AdventureGalleryProps = {
  images: string[];
  location: string;
};

export default function AdventureGallery({ images, location }: AdventureGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] ?? '');

  if (images.length === 0) {
    return null;
  }

  const activeIndex = Math.max(0, images.indexOf(activeImage));
  const primaryImage = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl">
        <img
          src={primaryImage}
          alt={location}
          className="w-full object-cover"
          loading="lazy"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border ${activeImage === image ? 'border-[#ff8701]' : 'border-slate-200'}`}
            >
              <img src={image} alt={`${location} ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
