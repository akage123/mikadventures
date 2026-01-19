'use client';

import Link from 'next/link';
import TripCard from './TripCard';
import { useTrips } from './TripContext';
import type { Trip } from './TripContext';
import { useLanguage } from './LanguageProvider';
import RevealOnScroll from './RevealOnScroll';

type FeaturedTripsProps = {
  initialTrips?: Trip[];
};

export default function FeaturedTrips({ initialTrips = [] }: FeaturedTripsProps) {
  const { trips } = useTrips();
  const { t } = useLanguage();
  const featuredTrips = (trips.length ? trips : initialTrips).slice(0, 6);
  return (
    <section id="trips" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <RevealOnScroll threshold={0.05}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('featured.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('featured.subtitle')}
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTrips.map((trip) => (
            <RevealOnScroll key={trip.id} threshold={0.05}>
              <TripCard
                id={trip.id}
                location={trip.location}
                dates={trip.dates}
                duration={trip.duration}
                price={trip.price}
                originalPrice={trip.originalPrice}
                image={trip.images?.[0] ?? trip.image}
                description={trip.description}
                badge={trip.badge}
              />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll threshold={0.05}>
          <div className="text-center mt-12">
            <Link
              href="/trips"
              className="inline-flex px-8 py-4 text-white font-semibold rounded-full hover:brightness-110 transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{backgroundColor: '#ff8701'}}
            >
              {t('trips.viewAll')}
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
