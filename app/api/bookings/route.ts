import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: { trip: true },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error loading bookings:', error);
    return NextResponse.json({ error: 'Failed to load bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.fullName || !body?.phone || !body?.email || !body?.country || !body?.tripId || !body?.people) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: Number(body.tripId) },
      select: { capacity: true, cutoffDate: true },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    if (trip.cutoffDate && new Date() > trip.cutoffDate) {
      return NextResponse.json({ error: 'Booking cutoff date has passed' }, { status: 400 });
    }

    if (trip.capacity) {
      const bookingSum = await prisma.booking.aggregate({
        where: { tripId: Number(body.tripId) },
        _sum: { people: true },
      });
      const booked = bookingSum._sum.people ?? 0;
      if (booked + Number(body.people) > trip.capacity) {
        return NextResponse.json({ error: 'Trip is full' }, { status: 400 });
      }
    }

    const booking = await prisma.booking.create({
      data: {
        fullName: body.fullName,
        phone: body.phone,
        email: body.email,
        country: body.country,
        instagram: body.instagram ?? null,
        people: Number(body.people),
        tripId: Number(body.tripId),
      },
      include: { trip: true },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
