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
    'featured.title': 'Featured Adventures',
    'featured.subtitle': 'Discover our handpicked selection of extraordinary destinations and unforgettable experiences',
    'memories.title': 'Wander more, worry less.',
    'memories.subtitle': 'Real moments from our recent adventures.',
    'memories.follow': 'Follow our Instagram to see more of the memories we create together.',
    'about.title': 'Why Choose Mik Adventures?',
    'about.body': "With over a decade of experience in crafting extraordinary travel experiences, Mik Adventures has been your trusted partner in creating memories that last a lifetime. We believe that travel is not just about visiting places—it's about connecting with cultures, challenging yourself, and discovering the world through new perspectives.",
    'about.expertGuides': 'Expert Guides',
    'about.expertGuidesDesc': 'Local experts who know every hidden gem',
    'about.safety': 'Safety First',
    'about.safetyDesc': 'Your safety is our top priority',
    'about.sustainable': 'Sustainable Travel',
    'about.sustainableDesc': 'Responsible tourism that preserves cultures',
    'about.support': '24/7 Support',
    'about.supportDesc': "We're here for you throughout your journey",
    'about.years': 'Years of Experience',
    'about.travelers': 'Happy Travelers',
    'about.destinations': 'Destinations Explored',
    'footer.blurb': 'Creating extraordinary journeys with trusted guides, unforgettable moments, and seamless travel support.',
    'footer.contact': 'Contact',
    'footer.explore': 'Explore',
    'footer.home': 'Home',
    'footer.adventures': 'Adventures',
    'footer.about': 'About',
    'footer.allTrips': 'All Trips',
    'footer.rights': 'All rights reserved.',
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
    'featured.title': 'Aventurat e Veçuara',
    'featured.subtitle': 'Zbuloni përzgjedhjen tonë të destinacioneve të jashtëzakonshme dhe përjetimeve të paharrueshme',
    'memories.title': 'Ende më shumë aventura, më pak shqetësime.',
    'memories.subtitle': 'Momente të vërteta nga aventurat tona të fundit.',
    'memories.follow': 'Na ndiqni në Instagram për më shumë kujtime që krijojmë së bashku.',
    'about.title': 'Pse të zgjidhni Mik Adventures?',
    'about.body': 'Me mbi një dekadë përvojë në krijimin e udhëtimeve të jashtëzakonshme, Mik Adventures ka qenë partneri juaj i besuar për kujtime që zgjasin një jetë. Ne besojmë se udhëtimi nuk është vetëm të vizitosh vende—por të lidhesh me kultura, të sfidosh veten dhe të zbulosh botën me një perspektivë të re.',
    'about.expertGuides': 'Udhërrëfyes Ekspertë',
    'about.expertGuidesDesc': 'Ekspertë lokalë që njohin çdo perlë të fshehur',
    'about.safety': 'Siguria e Para',
    'about.safetyDesc': 'Siguria juaj është prioriteti ynë',
    'about.sustainable': 'Udhëtim i Qëndrueshëm',
    'about.sustainableDesc': 'Turizëm i përgjegjshëm që ruan kulturat',
    'about.support': 'Mbështetje 24/7',
    'about.supportDesc': 'Jemi pranë jush gjatë gjithë udhëtimit',
    'about.years': 'Vite Përvojë',
    'about.travelers': 'Udhëtarë të Lumtur',
    'about.destinations': 'Destinacione të Eksploruara',
    'footer.blurb': 'Krijojmë udhëtime të jashtëzakonshme me udhërrëfyes të besuar, momente të paharrueshme dhe mbështetje të plotë.',
    'footer.contact': 'Kontakt',
    'footer.explore': 'Eksploro',
    'footer.home': 'Ballina',
    'footer.adventures': 'Aventurat',
    'footer.about': 'Rreth nesh',
    'footer.allTrips': 'Të gjitha udhëtimet',
    'footer.rights': 'Të gjitha të drejtat e rezervuara.',
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
