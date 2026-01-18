'use client';

import { useLanguage } from './LanguageProvider';

type ItineraryItem = {
  city?: string;
  nights?: string;
};

type FaqItem = {
  question?: string;
  answer?: string;
};

type AdventureDetailsPanelProps = {
  trip: {
    id: number;
    location: string;
    dates: string;
    duration: string;
    price: string;
    description: string;
  };
  itinerary: ItineraryItem[];
  faqs: FaqItem[];
  isBookingOpen: boolean;
  bookingMessage: string;
};

export default function AdventureDetailsPanel({
  trip,
  itinerary,
  faqs,
  isBookingOpen,
  bookingMessage,
}: AdventureDetailsPanelProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black">{trip.location}</h1>
              <p className="text-lg text-gray-600 mt-2">{trip.dates}</p>
            </div>
            <button
              onClick={() => {
                const bookingForm = document.getElementById('booking-form');
                if (bookingForm) {
                  bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="px-6 py-3 text-white font-semibold rounded-xl hover:brightness-110 transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{backgroundColor: '#ff8701'}}
            >
              {t('adventure.bookNow')}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-slate-100 rounded-xl px-4 py-2 text-sm font-semibold text-black">
            {t('adventure.duration')}: {trip.duration}
          </div>
          <div className="bg-orange-100 rounded-xl px-4 py-2 text-sm font-semibold text-orange-800">
            {t('adventure.price')}: {trip.price}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">{t('adventure.about')}</h2>
          <p className="text-black leading-relaxed whitespace-pre-line">{trip.description}</p>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-black">{t('adventure.cityBreakdown')}</h3>
        </div>
        {itinerary.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itinerary.map((item, index) => (
              <div key={`${item.city ?? 'city'}-${index}`} className="flex items-center justify-between bg-slate-50 rounded-xl px-5 py-4 border border-slate-200">
                <span className="text-lg font-semibold text-black">{item.city ?? 'City'}</span>
                {item.nights && (
                  <span className="text-sm font-semibold text-orange-700">
                    {item.nights} nights
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">{t('adventure.noBreakdown')}</p>
        )}
      </div>

      <div className="mt-12 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-black">{t('adventure.faqTitle')}</h3>
        </div>
        {faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div key={`${item.question ?? 'faq'}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                <div className="text-base font-semibold text-black">{item.question ?? 'Question'}</div>
                <div className="text-sm text-gray-700 mt-2">{item.answer ?? ''}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">{t('adventure.noFaq')}</p>
        )}
      </div>

    </>
  );
}
