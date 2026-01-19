'use client';

import { useEffect, useRef, useState } from 'react';

export default function Gallery() {
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = marqueeRef.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => setIsActive(true));
          } else {
            setTimeout(() => setIsActive(true), 150);
          }
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const slides = [
    {
      reverse: false,
      items: [
        { type: 'short', src: '/images/gallery/gallery1.jpg', alt: 'Gallery 1' },
        { type: 'tall', src: '/images/gallery/gallery2.jpg', alt: 'Gallery 2' }
      ]
    },
    {
      reverse: true,
      items: [
        { type: 'short', src: '/images/gallery/gallery3.jpg', alt: 'Gallery 3' },
        { type: 'tall', src: '/images/gallery/gallery4.jpg', alt: 'Gallery 4' }
      ]
    },
    {
      reverse: false,
      items: [
        { type: 'short', src: '/images/gallery/gallery5.jpg', alt: 'Gallery 5' },
        { type: 'tall', src: '/images/gallery/gallery6.jpg', alt: 'Gallery 6' }
      ]
    },
    {
      reverse: true,
      items: [
        { type: 'short', src: '/images/gallery/gallery7.jpg', alt: 'Gallery 7' },
        { type: 'tall', src: '/images/gallery/gallery8.jpg', alt: 'Gallery 8' }
      ]
    },
    {
      reverse: false,
      items: [
        { type: 'short', src: '/images/gallery/gallery9.jpg', alt: 'Gallery 9' },
        { type: 'tall', src: '/images/gallery/gallery10.jpg', alt: 'Gallery 10' }
      ]
    },
    {
      reverse: true,
      items: [
        { type: 'short', src: '/images/gallery/gallery11.jpg', alt: 'Gallery 11' },
        { type: 'tall', src: '/images/gallery/gallery12.jpg', alt: 'Gallery 12' }
      ]
    },
    {
      reverse: false,
      items: [
        { type: 'short', src: '/images/gallery/gallery13.jpg', alt: 'Gallery 13' },
        { type: 'tall', src: '/images/gallery/gallery14.jpg', alt: 'Gallery 14' }
      ]
    },
    {
      reverse: true,
      items: [
        { type: 'short', src: '/images/gallery/gallery15.jpg', alt: 'Gallery 15' },
        { type: 'tall', src: '/images/gallery/gallery16.jpg', alt: 'Gallery 16' }
      ]
    }
  ];

  const baseSlides = slides.length < 8 ? [...slides, ...slides] : slides;
  const loop = [...baseSlides, ...baseSlides];

  return (
    <section className="w-full py-16 overflow-hidden bg-gradient-to-r from-white to-slate-100">


        <div ref={marqueeRef} className="marquee relative overflow-hidden">
          <div className={`marquee-content flex w-max ${isActive ? 'is-active' : ''}`}>
            {(() => {
              let imageCounter = 0;
              return loop.map((slide, index) => (
                <div
                  key={`${slide.items[0].src}-${index}`}
                  className={`marquee-slide flex ${slide.reverse ? 'flex-col-reverse' : 'flex-col'} gap-4 sm:gap-5 mr-4 sm:mr-5 shrink-0`}
                >
                  {slide.items.map((item) => {
                    imageCounter += 1;
                    return (
                      <div
                        key={item.src}
                        className={`overflow-hidden rounded-[10px] ${
                          item.type === 'short' ? 'h-[200px]' : 'h-[300px]'
                        } max-w-[180px] sm:max-w-[215px]`}
                      >
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="auto"
                        />
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
          </div>
        </div>

      <style>{`
        .marquee-content {
          animation: marquee 30s linear infinite;
          animation-play-state: paused;
          will-change: transform;
        }

        .marquee-content.is-active {
          animation-play-state: running;
        }

        .marquee:hover .marquee-content {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-content,
          .marquee-content.is-active {
            animation: none;
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
