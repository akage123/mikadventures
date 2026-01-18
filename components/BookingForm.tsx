'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageProvider';

type BookingFormProps = {
  tripId: number;
  tripLabel: string;
  isOpen: boolean;
  closedMessage: string;
};

export default function BookingForm({ tripId, tripLabel, isOpen, closedMessage }: BookingFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    country: '',
    instagram: '',
    people: '1',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tripId,
          people: Number(formData.people),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      setFormData({
        fullName: '',
        phone: '',
        email: '',
        country: '',
        instagram: '',
        people: '1',
      });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (error) {
      console.error('Booking error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-black">{t('booking.title')}</h3>
        <span className="text-sm text-gray-500">{t('booking.trip')}: {tripLabel}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">{t('booking.fullName')}</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black focus:border-[#ff8701] focus:ring-2 focus:ring-[#ff8701]"
            disabled={!isOpen}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">{t('booking.phone')}</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black focus:border-[#ff8701] focus:ring-2 focus:ring-[#ff8701]"
            disabled={!isOpen}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">{t('booking.email')}</label>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black focus:border-[#ff8701] focus:ring-2 focus:ring-[#ff8701]"
            disabled={!isOpen}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">{t('booking.country')}</label>
          <input
            type="text"
            value={formData.country}
            onChange={(event) => setFormData({ ...formData, country: event.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black focus:border-[#ff8701] focus:ring-2 focus:ring-[#ff8701]"
            placeholder={t('booking.country')}
            disabled={!isOpen}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">{t('booking.instagram')}</label>
          <input
            type="text"
            value={formData.instagram}
            onChange={(event) => setFormData({ ...formData, instagram: event.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black focus:border-[#ff8701] focus:ring-2 focus:ring-[#ff8701]"
            placeholder="@yourhandle"
            disabled={!isOpen}
          />
          <span className="text-xs text-gray-500">{t('booking.instagramHelp')}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">{t('booking.people')}</label>
          <input
            type="number"
            min="1"
            value={formData.people}
            onChange={(event) => setFormData({ ...formData, people: event.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black focus:border-[#ff8701] focus:ring-2 focus:ring-[#ff8701]"
            disabled={!isOpen}
            required
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={!isOpen || status === 'submitting'}
          className="bg-gradient-to-r from-[#ff8701] to-orange-500 text-white px-8 py-3 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-300 font-bold shadow-lg disabled:opacity-70"
        >
          {status === 'submitting' ? t('booking.submitting') : t('booking.submit')}
        </button>
        {!isOpen && <span className="text-sm font-semibold text-gray-500">{closedMessage || t('booking.closed')}</span>}
        {status === 'success' && <span className="text-sm font-semibold text-emerald-600">{t('booking.success')}</span>}
        {status === 'error' && <span className="text-sm font-semibold text-red-600">{t('booking.error')}</span>}
      </div>
    </form>
  );
}
