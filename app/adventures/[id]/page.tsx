import { notFound } from 'next/navigation';
import { getTripById } from '../../../lib/db';
import { prisma } from '../../../lib/prisma';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AdventureGallery from '../../../components/AdventureGallery';
import AdventureDetailsPanel from '../../../components/AdventureDetailsPanel';
import BookingForm from '../../../components/BookingForm';

type ItineraryItem = {
  city?: string;
  nights?: string;
};

function normalizeItinerary(itinerary: unknown): ItineraryItem[] {
  if (!Array.isArray(itinerary)) {
    return [];
  }
  return itinerary.filter((item): item is ItineraryItem => typeof item === 'object' && item !== null);
}

export default async function AdventureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (Number.isNaN(id)) {
    notFound();
  }

  const trip = await getTripById(id);
  if (!trip || trip.active === false) {
    notFound();
  }

  const rawImages = Array.isArray(trip.images) ? trip.images : [];
  const images = rawImages.filter((image: unknown): image is string => typeof image === 'string' && image.length > 0);
  if (images.length === 0 && trip.image) {
    images.push(trip.image);
  }
  const itinerary = normalizeItinerary(trip.itinerary);
  const rawFaqs = Array.isArray(trip.faqs) ? trip.faqs : [];
  const faqs = rawFaqs.filter((item: unknown): item is { question?: string; answer?: string } => (
    typeof item === 'object' && item !== null
  ));

  const bookingSum = await prisma.booking.aggregate({
    where: { tripId: trip.id },
    _sum: { people: true },
  });
  const bookedPeople = bookingSum._sum.people ?? 0;
  const capacityLeft = trip.capacity ? trip.capacity - bookedPeople : null;
  const cutoffDate = trip.cutoffDate ? new Date(trip.cutoffDate) : null;
  const isPastCutoff = cutoffDate ? new Date() > cutoffDate : false;
  const isFull = capacityLeft !== null && capacityLeft <= 0;
  const isBookingOpen = !isPastCutoff && !isFull;
  const bookingMessage = isFull
    ? 'No spots left for this trip.'
    : isPastCutoff
      ? 'Booking cutoff date has passed.'
      : '';

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            <div className="flex flex-col gap-4">
              <AdventureGallery images={images} location={trip.location} />
            </div>

            <AdventureDetailsPanel
              trip={{
                id: trip.id,
                location: trip.location,
                dates: trip.dates,
                duration: trip.duration,
                price: trip.price,
                description: trip.description,
              }}
              itinerary={itinerary}
              faqs={faqs}
              isBookingOpen={isBookingOpen}
              bookingMessage={bookingMessage}
            />
          </div>
        </div>

        <section id="booking-form" className="bg-[#ff8701]/10 py-12">
          <div className="container mx-auto px-4 max-w-screen-xl">
            <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
              <BookingForm
                tripId={trip.id}
                tripLabel={`${trip.location} · ${trip.dates}`}
                isOpen={isBookingOpen}
                closedMessage={bookingMessage}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
