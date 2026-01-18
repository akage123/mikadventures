'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Language = 'en' | 'sq';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    'header.home': 'Home',
    'header.adventures': 'Adventures',
    'header.about': 'About',
    'header.contact': 'Contact',
    'header.admin': 'Admin',
    'header.bookNow': 'Book Now',
    'trips.title': 'All Trips',
    'trips.subtitle': 'Explore every adventure and narrow it down with filters.',
    'trips.search': 'Search',
    'trips.location': 'Location',
    'trips.maxPrice': 'Max price',
    'trips.none': 'No trips match your filters yet.',
    'booking.title': 'Book now',
    'booking.trip': 'Trip',
    'booking.fullName': 'Full name',
    'booking.phone': 'Phone number',
    'booking.email': 'Email',
    'booking.country': 'Country',
    'booking.instagram': 'Instagram (optional)',
    'booking.instagramHelp': 'We use this only to contact you about your booking.',
    'booking.people': 'Number of people',
    'booking.submit': 'Submit booking',
    'booking.submitting': 'Submitting...',
    'booking.success': 'Booking received.',
    'booking.error': 'Booking failed.',
    'booking.closed': 'Bookings are closed for this trip.',
    'adventure.about': 'About this trip',
    'adventure.duration': 'Duration',
    'adventure.price': 'Price',
    'adventure.cityBreakdown': 'City breakdown',
    'adventure.noBreakdown': 'No city breakdown provided yet.',
    'adventure.faqTitle': 'Trip FAQ',
    'adventure.noFaq': 'No FAQ details added yet.',
    'hero.title': 'Your Next Adventure',
    'hero.subtitle': 'Awaits',
    'hero.description': 'Discover extraordinary destinations, create unforgettable memories, and embark on journeys that will transform your perspective on the world.',
    'hero.exploreTrips': 'Explore Trips',
    'hero.learnMore': 'Learn More',
    'hero.happyTravelers': 'Happy Travelers',
    'hero.destinations': 'Destinations',
    'hero.yearsExperience': 'Years Experience',
    'trips.viewAll': 'View All Adventures',
    'adventure.bookNow': 'Book Now',
  },
  sq: {
    'header.home': 'Ballina',
    'header.adventures': 'Aventurat',
    'header.about': 'Rreth nesh',
    'header.contact': 'Kontakt',
    'header.admin': 'Admin',
    'header.bookNow': 'Rezervo tani',
    'trips.title': 'Të gjitha udhëtimet',
    'trips.subtitle': 'Shfletoni aventurat dhe filtroni sipas preferencave.',
    'trips.search': 'Kërko',
    'trips.location': 'Destinacioni',
    'trips.maxPrice': 'Çmimi maksimal',
    'trips.none': 'Nuk ka udhëtime që përputhen me filtrat.',
    'booking.title': 'Rezervo tani',
    'booking.trip': 'Udhëtimi',
    'booking.fullName': 'Emri i plotë',
    'booking.phone': 'Numri i telefonit',
    'booking.email': 'Email',
    'booking.country': 'Shteti',
    'booking.instagram': 'Instagram (opsional)',
    'booking.instagramHelp': 'E përdorim vetëm për t’ju kontaktuar për rezervimin.',
    'booking.people': 'Numri i personave',
    'booking.submit': 'Dërgo rezervimin',
    'booking.submitting': 'Duke dërguar...',
    'booking.success': 'Rezervimi u pranua.',
    'booking.error': 'Rezervimi dështoi.',
    'booking.closed': 'Rezervimet janë të mbyllura për këtë udhëtim.',
    'adventure.about': 'Rreth këtij udhëtimi',
    'adventure.duration': 'Kohëzgjatja',
    'adventure.price': 'Çmimi',
    'adventure.cityBreakdown': 'Ndarja sipas qyteteve',
    'adventure.noBreakdown': 'Nuk ka ende ndarje sipas qyteteve.',
    'adventure.faqTitle': 'Pyetje të shpeshta',
    'adventure.noFaq': 'Nuk ka pyetje të shpeshta ende.',
    'hero.title': 'Aventura Juaj Tjetër',
    'hero.subtitle': 'Ju Pret',
    'hero.description': 'Zbuloni destinacione të jashtëzakonshme, krijoni kujtime të paharrueshme dhe ndërmerrni udhëtime që do të transformojnë perspektivën tuaj për botën.',
    'hero.exploreTrips': 'Shfletoni Udhëtimet',
    'hero.learnMore': 'Mësoni Më Shumë',
    'hero.happyTravelers': 'Udhëtarë të Lumtur',
    'hero.destinations': 'Destinacione',
    'hero.yearsExperience': 'Vite Përvoja',
    'trips.viewAll': 'Shihni Të Gjitha Udhëtimet',
    'adventure.bookNow': 'Rezervo Tani',
  },
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const stored = window.localStorage.getItem('mika-language');
    if (stored === 'en' || stored === 'sq') {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('mika-language', language);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key: string) => translations[language][key] ?? key,
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
