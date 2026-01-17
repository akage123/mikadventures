'use client';

import TripCard from './TripCard';
import { useTrips } from './TripContext';

export default function FeaturedTrips() {
  const { trips } = useTrips();
  return (
    <section id="trips" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Adventures
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of extraordinary destinations and unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              title={trip.title}
              location={trip.location}
              duration={trip.duration}
              price={trip.price}
              image={trip.image}
              description={trip.description}
              rating={trip.rating}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors transform hover:scale-105 shadow-lg">
            View All Trips
          </button>
        </div>
      </div>
    </section>
  );
}