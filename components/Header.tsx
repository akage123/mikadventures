'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

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
          <Link href="trips" className="text-gray-800 hover:text-[#ff8701] transition-all duration-300 font-semibold text-lg relative group font-montserrat">
            {t('header.adventures')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8701] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="#about" className="text-gray-800 hover:text-[#ff8701] transition-all duration-300 font-semibold text-lg relative group font-montserrat">
            {t('header.about')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8701] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          {/* <Link href="#contact" className="text-gray-800 hover:text-[#ff8701] transition-all duration-300 font-semibold text-lg relative group font-montserrat">
            {t('header.contact')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8701] transition-all duration-300 group-hover:w-full"></span>
          </Link> */}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'sq' : 'en')}
            className="hidden md:inline-flex px-5 py-3 text-xs font-semibold text-gray-700 border border-orange-500 rounded-full hover:border-[#ff8701] hover:text-[#ff8701] transition-all"
          >
            {language === 'en' ? 'SQ' : 'EN'}
          </button>
        

          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
