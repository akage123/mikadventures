import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

const BOOKING_NOTIFY_EMAIL = process.env.BOOKING_NOTIFY_EMAIL ?? 'vu02vu@gmail.com';

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

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const emailText = [
        `New booking from ${booking.fullName}`,
        '',
        `Trip: ${booking.trip.location} (${booking.trip.dates})`,
        `People: ${booking.people}`,
        `Status: ${booking.status}`,
        '',
        `Email: ${booking.email}`,
        `Phone: ${booking.phone}`,
        `Country: ${booking.country}`,
        `Instagram: ${booking.instagram || 'N/A'}`,
        '',
        `Booking ID: ${booking.id}`,
        `Created: ${booking.createdAt.toISOString()}`,
      ].join('\n');

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Mik Adventures <onboarding@resend.dev>',
            to: [BOOKING_NOTIFY_EMAIL],
            subject: `New booking from ${booking.fullName}`,
            text: emailText,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send booking email:', emailError);
      }
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
