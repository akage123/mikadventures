'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import RevealOnScroll from '../../components/RevealOnScroll';
import { useLanguage } from '../../components/LanguageProvider';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16">
        <div className="container mx-auto max-w-screen-xl px-4">
          <RevealOnScroll className="delay-100">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#ff8701] font-semibold mb-4">
                  {t('header.about')}
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                  {t('about.title')}
                </h1>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  {t('about.body')}
                </p>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                  {t('about.intro')}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-orange-50 via-white to-slate-50 p-8 shadow-lg">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-gray-500">{t('about.beliefLabel')}</p>
                    <h2 className="text-2xl font-semibold text-gray-900 mt-2">{t('about.beliefTitle')}</h2>
                  </div>
                  <ul className="space-y-4 text-gray-600">
                    <li className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#ff8701]"></span>
                      <span>{t('about.value1Title')}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#ff8701]"></span>
                      <span>{t('about.value2Title')}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#ff8701]"></span>
                      <span>{t('about.value3Title')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="delay-200">
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: t('about.value1Title'), body: t('about.value1Body') },
                { title: t('about.value2Title'), body: t('about.value2Body') },
                { title: t('about.value3Title'), body: t('about.value3Body') },
              ].map((card) => (
                <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900">{card.title}</h3>
                  <p className="mt-3 text-gray-600">{card.body}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="delay-300">
            <div className="mt-16 rounded-3xl bg-[#ff8701] text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold">{t('about.ctaTitle')}</h2>
                <p className="mt-2 text-white/90">{t('about.ctaBody')}</p>
              </div>
              <a
                href="/trips"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#ff8701] hover:bg-orange-50 transition-colors"
              >
                {t('about.ctaButton')}
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </main>
      <Footer />
    </div>
  );
}
