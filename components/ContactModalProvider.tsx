'use client';

import { createContext, useContext, useState } from 'react';
import { useLanguage } from './LanguageProvider';

type ContactModalContextValue = {
  openContactModal: () => void;
  closeContactModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | undefined>(undefined);

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const openContactModal = () => setIsOpen(true);
  const closeContactModal = () => {
    setIsOpen(false);
    setStatus('idle');
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Contact request failed');
      }
      setStatus('success');
      setFormData({ fullName: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact request:', error);
      setStatus('error');
    }
  };

  return (
    <ContactModalContext.Provider value={{ openContactModal, closeContactModal }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">{t('contact.title')}</h2>
              <button
                type="button"
                onClick={closeContactModal}
                className="rounded-lg p-2 text-gray-500 hover:text-gray-900 hover:bg-slate-100 transition-colors"
                aria-label={t('contact.close')}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-900">{t('contact.fullName')}</label>
                <input
                  value={formData.fullName}
                  onChange={(event) => handleChange('fullName', event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-gray-900 focus:border-[#ff8701] focus:bg-white focus:outline-none"
                  placeholder={t('contact.fullNamePlaceholder')}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-900">{t('contact.email')}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-gray-900 focus:border-[#ff8701] focus:bg-white focus:outline-none"
                    placeholder={t('contact.emailPlaceholder')}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">{t('contact.phone')}</label>
                  <input
                    value={formData.phone}
                    onChange={(event) => handleChange('phone', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-gray-900 focus:border-[#ff8701] focus:bg-white focus:outline-none"
                    placeholder={t('contact.phonePlaceholder')}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900">{t('contact.message')}</label>
                <textarea
                  value={formData.message}
                  onChange={(event) => handleChange('message', event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-gray-900 focus:border-[#ff8701] focus:bg-white focus:outline-none min-h-[120px]"
                  placeholder={t('contact.messagePlaceholder')}
                  required
                />
              </div>
              {status === 'success' && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {t('contact.success')}
                </div>
              )}
              {status === 'error' && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {t('contact.error')}
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeContactModal}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:border-slate-300 hover:text-gray-900 transition-colors"
                >
                  {t('contact.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="rounded-xl bg-[#ff8701] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {status === 'loading' ? t('contact.submitting') : t('contact.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error('useContactModal must be used within ContactModalProvider');
  }
  return context;
}
