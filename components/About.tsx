'use client';

import RevealOnScroll from './RevealOnScroll';
import { useLanguage } from './LanguageProvider';

export default function About() {
  const { t } = useLanguage();
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <RevealOnScroll className="delay-100">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t('about.title')}
              </h2>
            </RevealOnScroll>
            <RevealOnScroll className="delay-200">
              <p className="text-lg text-gray-600 mb-8">
                {t('about.body')}
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('about.expertGuides')}</h3>
                  <p className="text-sm text-gray-600">{t('about.expertGuidesDesc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('about.safety')}</h3>
                  <p className="text-sm text-gray-600">{t('about.safetyDesc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('about.sustainable')}</h3>
                  <p className="text-sm text-gray-600">{t('about.sustainableDesc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('about.support')}</h3>
                  <p className="text-sm text-gray-600">{t('about.supportDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <RevealOnScroll className="delay-300">
            <div className="relative">
              <div className="bg-gradient-to-r from-[#f2d8c4] to-[#ff8701] rounded-2xl p-8 text-white">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">10+</div>
                  <div className="text-xl mb-6">{t('about.years')}</div>
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-xl mb-6">{t('about.travelers')}</div>
                  <div className="text-4xl font-bold mb-2">25+</div>
                  <div className="text-xl">{t('about.destinations')}</div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
