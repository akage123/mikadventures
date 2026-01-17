import { NextResponse } from 'next/server';
import { addTrip, createTripsTable, getTrips } from '../../../lib/db';

export async function GET() {
  try {
    if (!process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
      return NextResponse.json({ error: 'POSTGRES_URL not set' }, { status: 503 });
    }
    await createTripsTable();
    const trips = await getTrips();
    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error loading trips:', error);
    return NextResponse.json({ error: 'Failed to load trips' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
      return NextResponse.json({ error: 'POSTGRES_URL not set' }, { status: 503 });
    }
    await createTripsTable();
    const body = await request.json();

    if (!body?.title || !body?.location || !body?.duration || !body?.price || !body?.image || !body?.description || body?.rating === undefined) {
      return NextResponse.json({ error: 'Missing required trip fields' }, { status: 400 });
    }

    const trip = await addTrip({
      title: body.title,
      location: body.location,
      duration: body.duration,
      price: body.price,
      image: body.image,
      description: body.description,
      rating: body.rating,
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}
