'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { useContactModal } from './ContactModalProvider';

export default function Footer() {
  const { t } = useLanguage();
  const { openContactModal } = useContactModal();
  return (
    <footer id="contact" className="bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-screen-xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo/logo.png"
                alt="Mik Adventures Logo"
                width={200}
                height={120}
              />
            </div>
            <p className="text-gray-600 mb-6">
              {t('footer.blurb')}
            </p>
            <button
              type="button"
              onClick={openContactModal}
              className="mb-6 inline-flex items-center justify-center rounded-xl border border-[#ff8701] px-4 py-2 text-sm font-semibold text-[#ff8701] hover:bg-[#ff8701] hover:text-white transition-colors"
            >
              {t('footer.contactCta')}
            </button>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/mik_adventures/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-gray-200 text-gray-700 hover:text-[#ff8701] hover:border-[#ff8701] transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37a4 4 0 11-7.37 2.62 4 4 0 017.37-2.62" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/people/Mik-Adventures/100064132351604/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-gray-200 text-gray-700 hover:text-[#ff8701] hover:border-[#ff8701] transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@mik_adventures"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-gray-200 text-gray-700 hover:text-[#ff8701] hover:border-[#ff8701] transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21.7 8.05a5.42 5.42 0 0 1-3.14-1.02 5.46 5.46 0 0 1-1.99-3.12h-3.1v11.02a2.62 2.62 0 1 1-2.62-2.62c.26 0 .52.04.77.11V9.2a5.83 5.83 0 0 0-1.05-.1 5.73 5.73 0 1 0 5.73 5.73V9.1a8.6 8.6 0 0 0 4.4 1.22V8.05z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('footer.contact')}</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Mis Edit Durham 23/10, Pristina 10000</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+38344363014</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+355692318155</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('footer.explore')}</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/" className="hover:text-[#ff8701] transition-colors">{t('footer.home')}</Link></li>
              <li><Link href="/trips" className="hover:text-[#ff8701] transition-colors">{t('footer.adventures')}</Link></li>
              <li><Link href="/about" className="hover:text-[#ff8701] transition-colors">{t('footer.about')}</Link></li>
              <li><Link href="/trips" className="hover:text-[#ff8701] transition-colors">{t('footer.allTrips')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Mik Adventures. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
