'use client';

import { useState } from 'react';
import { generateBookingPdf, type BookingPdfData } from '@/lib/pdf/bookingPdf';
import { DocumentPdf32Filled } from '../icons/DocumentPdf32Filled';

type BookingPdfButtonProps = {
  booking: BookingPdfData;
};

export default function BookingPdfButton({ booking }: BookingPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateBookingPdf(booking);
    } catch (error) {
      console.error('Failed to generate booking PDF:', error);
      alert('Failed to generate booking PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${isGenerating ? 'border-gray-200 text-gray-400' : 'border-gray-200 text-gray-700 hover:border-[#ff8701] hover:text-[#ff8701]'}`}
    >
      <DocumentPdf32Filled className="h-4 w-4 text-[#ff8701]" aria-hidden="true" />
      {isGenerating ? 'Preparing...' : 'Download PDF'}
    </button>
  );
}
