import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 });
    }

    const body = await request.json();
    if (!body?.status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: body.status },
      include: { trip: true },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
