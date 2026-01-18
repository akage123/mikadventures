'use client';

import Link from 'next/link';
import TripCard from './TripCard';
import { useTrips } from './TripContext';
import { useLanguage } from './LanguageProvider';
import RevealOnScroll from './RevealOnScroll';

export default function FeaturedTrips() {
  const { trips } = useTrips();
  const { t } = useLanguage();
  return (
    <section id="trips" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Adventures
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of extraordinary destinations and unforgettable experiences
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.slice(0, 6).map((trip, index) => (
            <RevealOnScroll key={trip.id} className={index % 3 === 0 ? 'delay-150' : index % 3 === 1 ? 'delay-200' : 'delay-250'}>
              <TripCard
                id={trip.id}
                location={trip.location}
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

        <RevealOnScroll className="delay-200">
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
