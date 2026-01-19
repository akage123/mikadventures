import Link from 'next/link';

interface TripCardProps {
  id: number;
  location: string;
  dates: string;
  duration: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  description: string;
  badge?: string | null;
}

export default function TripCard({
  id,
  location,
  dates,
  duration,
  price,
  originalPrice,
  image,
  description,
  badge
}: TripCardProps) {
  return (
    <Link
      href={`/adventures/${id}`}
      className="group block bg-white rounded-lg shadow-lg overflow-hidden border border-transparent hover:border-[#e09540] hover:shadow-[0_12px_30px_rgba(224,149,64,0.25)] transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-[28rem] bg-gray-200">
        <img
          src={image}
          alt={location}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/35 via-black/10 to-transparent backdrop-blur-[2px]"></div>
        {badge && (
          <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#b85a00] shadow-sm">
            {badge}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-bold text-white">
                <svg className="h-5 w-5 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </h3>
              <p className="mt-1 text-sm text-white/80">{dates}</p>
            </div>
            <div className="text-right">
              {originalPrice && (
                <p className="text-sm font-semibold text-red-200 line-through">
                  {originalPrice} €
                </p>
              )}
              <p className="text-2xl font-bold text-white">{price} €</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
