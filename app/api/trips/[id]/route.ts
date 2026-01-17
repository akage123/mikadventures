import { NextResponse } from 'next/server';
import { createTripsTable, deleteTrip, updateTrip } from '../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
      return NextResponse.json({ error: 'POSTGRES_URL not set' }, { status: 503 });
    }
    await createTripsTable();
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid trip id' }, { status: 400 });
    }

    const updates = await request.json();
    const updated = await updateTrip(id, updates);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    if (!process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
      return NextResponse.json({ error: 'POSTGRES_URL not set' }, { status: 503 });
    }
    await createTripsTable();
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid trip id' }, { status: 400 });
    }

    await deleteTrip(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 });
  }
}
