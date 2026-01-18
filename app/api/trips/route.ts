import { NextRequest, NextResponse } from 'next/server';
import { addTrip, getTrips } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 503 });
    }
    const trips = await getTrips();
    const all = request.nextUrl.searchParams.get('all') === 'true';
    const filtered = all ? trips : trips.filter((trip) => trip.active !== false);
    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error loading trips:', error);
    return NextResponse.json({ error: 'Failed to load trips' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 503 });
    }
    const body = await request.json();

    const images = Array.isArray(body?.images) ? body.images : body?.image ? [body.image] : [];
    if (!body?.location || !body?.dates || !body?.duration || !body?.price || images.length === 0 || !body?.description) {
      return NextResponse.json({ error: 'Missing required trip fields' }, { status: 400 });
    }

    const trip = await addTrip({
      location: body.location,
      dates: body.dates,
      duration: body.duration,
      price: body.price,
      originalPrice: body.originalPrice ?? null,
      capacity: body.capacity ? Number(body.capacity) : null,
      cutoffDate: body.cutoffDate ? new Date(body.cutoffDate) : null,
      image: images[0],
      images,
      description: body.description,
      badge: body.badge ?? null,
      active: body.active !== undefined ? Boolean(body.active) : true,
      itinerary: Array.isArray(body.itinerary) ? body.itinerary : [],
      faqs: Array.isArray(body.faqs) ? body.faqs : [],
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}
