import { NextRequest, NextResponse } from 'next/server';
import { deleteTrip, getTripById, updateTrip } from '../../../../lib/db';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 503 });
    }
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid trip id' }, { status: 400 });
    }

    const updates = await request.json();
    const normalizedUpdates = {
      ...updates,
      capacity: updates.capacity ? Number(updates.capacity) : updates.capacity === '' ? null : updates.capacity,
      cutoffDate: updates.cutoffDate ? new Date(updates.cutoffDate) : updates.cutoffDate === '' ? null : updates.cutoffDate,
      active: updates.active !== undefined ? Boolean(updates.active) : updates.active,
    };
    const updated = await updateTrip(id, normalizedUpdates);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 503 });
    }
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid trip id' }, { status: 400 });
    }

    const trip = await getTripById(id);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json(trip);
  } catch (error) {
    console.error('Error loading trip:', error);
    return NextResponse.json({ error: 'Failed to load trip' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 503 });
    }
    const { id: rawId } = await params;
    const id = Number(rawId);
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
