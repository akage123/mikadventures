'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { useContactModal } from './ContactModalProvider';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { openContactModal } = useContactModal();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="container mx-auto flex h-20 max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo/logo.png"
              alt="Mik Adventures Logo"
              width={130}
              height={130}
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-10">
          <Link href="/" className="text-gray-800 hover:text-[#ff8701] transition-all duration-300 font-semibold text-lg relative group font-montserrat">
            {t('header.home')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8701] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/trips" className="text-gray-800 hover:text-[#ff8701] transition-all duration-300 font-semibold text-lg relative group font-montserrat">
            {t('header.adventures')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8701] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-[#ff8701] transition-all duration-300 font-semibold text-lg relative group font-montserrat">
            {t('header.about')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8701] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <button
            type="button"
            onClick={openContactModal}
            className="text-gray-800 hover:text-[#ff8701] transition-all duration-300 font-semibold text-lg relative group font-montserrat"
          >
            {t('header.contact')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8701] transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'sq' : 'en')}
            className="hidden md:inline-flex px-5 py-3 text-xs font-semibold text-gray-700 border border-orange-500 rounded-full hover:border-[#ff8701] hover:text-[#ff8701] transition-all"
          >
            {language === 'en' ? 'SQ' : 'EN'}
          </button>
        

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="md:hidden p-2 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-orange-100 bg-white">
          <nav className="container mx-auto max-w-screen-xl px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-gray-800 font-semibold text-base"
            >
              {t('header.home')}
            </Link>
            <Link
              href="/trips"
              onClick={() => setMobileOpen(false)}
              className="text-gray-800 font-semibold text-base"
            >
              {t('header.adventures')}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="text-gray-800 font-semibold text-base"
            >
              {t('header.about')}
            </Link>
            <button
              type="button"
              onClick={() => {
                openContactModal();
                setMobileOpen(false);
              }}
              className="text-left text-gray-800 font-semibold text-base"
            >
              {t('header.contact')}
            </button>
            <button
              type="button"
              onClick={() => {
                setLanguage(language === 'en' ? 'sq' : 'en');
                setMobileOpen(false);
              }}
              className="self-start px-6 py-2 text-xs font-semibold text-gray-700 border border-orange-500 rounded-full hover:border-[#ff8701] hover:text-[#ff8701] transition-all"
            >
              {language === 'en' ? 'SQ' : 'EN'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
