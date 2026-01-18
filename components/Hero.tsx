'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import RevealOnScroll from './RevealOnScroll';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-[60vh] flex items-center justify-center bg-white overflow-hidden">
      {/* Background Pattern */}
      <Image
                src="/images/random/jesus.png"
                alt="Jesus"
                width={320}
                height={220}
                className="absolute right-10 bottom-10 opacity-20  "
                priority
              />
                            <Image
                src="/images/random/mountfuji.png"
                alt="Mount Fuji"
                width={360}
                height={240}
                className="absolute -left-6 -top-6 w-44 opacity-15 md:left-10 md:top-10 md:w-[400px] md:opacity-20"
                priority
              />
      <div className="absolute inset-0 opacity-10">
     
        <div className="absolute inset-0 bg-linear-to-br from-gray-100 via-transparent to-gray-50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0,0,0,0.05) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(0,0,0,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center min-h-[70vh]">
          {/* Left side - Text content */}
          <div className="relative text-left lg:col-span-2">
            <div className="absolute inset-0 -z-10 pointer-events-none">

              <Image
                src="/images/random/egyptpyramids.png"
                alt="Egypt Pyramids"
                width={320}
                height={220}
                className="absolute right-0 bottom-6 w-40 opacity-15 md:bottom-10 md:w-[320px] md:opacity-20"
                priority
              />
              
            </div>
            <RevealOnScroll className="delay-100">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                {t('hero.title')}
                <span className="block" style={{color: '#ff8701'}}>
                  {t('hero.subtitle')}
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll className="delay-200">
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                {t('hero.description')}
              </p>
            </RevealOnScroll>

            <RevealOnScroll className="delay-300">
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/trips"
                  className="inline-block px-8 py-4 text-white font-semibold rounded-full hover:brightness-110 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  style={{backgroundColor: '#ff8701'}}
                >
                  {t('hero.exploreTrips')}
                </Link>
              </div>
            </RevealOnScroll>

            {/* Stats */}
            <RevealOnScroll className="delay-400">
              <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
                <div className="text-left">
                  <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                  <div className="text-gray-600 text-sm">{t('hero.happyTravelers')}</div>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-gray-900 mb-2">25+</div>
                  <div className="text-gray-600 text-sm">{t('hero.destinations')}</div>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-gray-900 mb-2">10+</div>
                  <div className="text-gray-600 text-sm">{t('hero.yearsExperience')}</div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right side - Person image */}
          <RevealOnScroll className="delay-500">
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/images/random/person.png"
                alt="Travel enthusiast"
                width={400}
                height={480}
                className="rounded-lg object-cover max-w-full h-auto"
                priority
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
