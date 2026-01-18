import { prisma } from './prisma';

export async function createTripsTable() {
  return;
}

export async function getTrips() {
  try {
    return await prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
}

export async function getTripById(id: number) {
  try {
    return await prisma.trip.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error fetching trip by id:', error);
    return null;
  }
}

export async function addTrip(trip: {
  location: string;
  dates: string;
  duration: string;
  price: string;
  originalPrice?: string;
  capacity?: number | null;
  cutoffDate?: Date | string | null;
  image: string;
  images?: string[];
  description: string;
  badge?: string;
  active?: boolean;
  itinerary?: unknown;
  faqs?: unknown;
}) {
  try {
    const images = Array.isArray(trip.images) && trip.images.length > 0 ? trip.images : [trip.image];
    return await prisma.trip.create({
      data: {
        location: trip.location,
        dates: trip.dates,
        duration: trip.duration,
        price: trip.price,
        originalPrice: trip.originalPrice ?? null,
        capacity: trip.capacity ?? null,
        cutoffDate: trip.cutoffDate ? new Date(trip.cutoffDate) : null,
        image: images[0] ?? trip.image,
        images,
        description: trip.description,
        badge: trip.badge ?? null,
        active: trip.active ?? true,
        itinerary: trip.itinerary ?? [],
        faqs: trip.faqs ?? [],
      },
    });
  } catch (error) {
    console.error('Error adding trip:', error);
    throw error;
  }
}

export async function updateTrip(id: number, trip: Partial<{
  location: string;
  dates: string;
  duration: string;
  price: string;
  originalPrice: string;
  capacity: number | null;
  cutoffDate: Date | string | null;
  image: string;
  images: string[];
  description: string;
  badge: string;
  active: boolean;
  itinerary: unknown;
  faqs: unknown;
}>) {
  try {
    const images = Array.isArray(trip.images) && trip.images.length > 0 ? trip.images : undefined;
    const itinerary = trip.itinerary === undefined ? undefined : trip.itinerary ?? [];
    const faqs = trip.faqs === undefined ? undefined : trip.faqs ?? [];
    return await prisma.trip.update({
      where: { id },
      data: {
        ...(trip.location !== undefined ? { location: trip.location } : {}),
        ...(trip.dates !== undefined ? { dates: trip.dates } : {}),
        ...(trip.duration !== undefined ? { duration: trip.duration } : {}),
        ...(trip.price !== undefined ? { price: trip.price } : {}),
        ...(trip.originalPrice !== undefined ? { originalPrice: trip.originalPrice || null } : {}),
        ...(trip.capacity !== undefined ? { capacity: trip.capacity || null } : {}),
        ...(trip.cutoffDate !== undefined ? { cutoffDate: trip.cutoffDate ? new Date(trip.cutoffDate) : null } : {}),
        ...(trip.image !== undefined ? { image: trip.image } : {}),
        ...(images !== undefined ? { images, image: images[0] ?? trip.image } : {}),
        ...(trip.description !== undefined ? { description: trip.description } : {}),
        ...(trip.badge !== undefined ? { badge: trip.badge || null } : {}),
        ...(trip.active !== undefined ? { active: trip.active } : {}),
        ...(itinerary !== undefined ? { itinerary } : {}),
        ...(faqs !== undefined ? { faqs } : {}),
      },
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
}

export async function deleteTrip(id: number) {
  try {
    await prisma.trip.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
}
