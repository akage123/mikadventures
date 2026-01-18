'use client';

import { useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TripCard from '../../components/TripCard';
import { useTrips } from '../../components/TripContext';
import { useLanguage } from '../../components/LanguageProvider';

function parsePrice(value: string): number {
  const normalized = value.replace(/[^\d.,]/g, '').replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function TripsPage() {
  const { trips, loading } = useTrips();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');

  const locations = useMemo(() => {
    const unique = Array.from(new Set(trips.map((trip) => trip.location)));
    return unique.sort();
  }, [trips]);

  const filteredTrips = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    const max = maxPrice ? Number.parseFloat(maxPrice) : null;

    return trips.filter((trip) => {
      if (location !== 'all' && trip.location !== location) {
        return false;
      }

      if (searchValue) {
        const haystack = `${trip.location} ${trip.dates} ${trip.duration} ${trip.description}`.toLowerCase();
        if (!haystack.includes(searchValue)) {
          return false;
        }
      }

      if (max !== null && !Number.isNaN(max)) {
        if (parsePrice(trip.price) > max) {
          return false;
        }
      }

      return true;
    });
  }, [trips, location, search, maxPrice]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-10">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold text-gray-900">{t('trips.title')}</h1>
              <p className="text-gray-600">{t('trips.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900">{t('trips.search')}</label>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black focus:border-[#ff8701] focus:ring-2 focus:ring-[#ff8701]"
                  placeholder={t('trips.search')}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900">{t('trips.location')}</label>
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black focus:border-[#ff8701] focus:ring-2 focus:ring-[#ff8701]"
                >
                  <option value="all">{t('trips.location')}</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900">{t('trips.maxPrice')}</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black focus:border-[#ff8701] focus:ring-2 focus:ring-[#ff8701]"
                  placeholder={t('trips.maxPrice')}
                  min="0"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16 text-gray-600">Loading trips...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    id={trip.id}
                    location={trip.location}
                    duration={trip.duration}
                    price={trip.price}
                    originalPrice={trip.originalPrice}
                    image={trip.images?.[0] ?? trip.image}
                    description={trip.description}
                    badge={trip.badge}
                  />
                ))}
              </div>
            )}

            {!loading && filteredTrips.length === 0 && (
              <div className="text-center py-16 text-gray-600">
                {t('trips.none')}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
