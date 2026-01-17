import { createClient, sql as pooledSql } from '@vercel/postgres';
import type { QueryResult, QueryResultRow } from '@vercel/postgres';

// Debug: Check environment variables
console.log('Environment check:', {
  POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not set',
  DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
  POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? 'Set' : 'Not set'
});

export async function createTripsTable() {
  try {
    await executeQuery`
      CREATE TABLE IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        duration VARCHAR(100) NOT NULL,
        price VARCHAR(50) NOT NULL,
        image TEXT NOT NULL,
        description TEXT NOT NULL,
        rating DECIMAL(2,1) DEFAULT 5.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Trips table created successfully');
  } catch (error) {
    console.error('Error creating trips table:', error);
  }
}

export async function getTrips() {
  try {
    const result = await executeQuery`SELECT * FROM trips ORDER BY created_at DESC`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
}

export async function addTrip(trip: {
  title: string;
  location: string;
  duration: string;
  price: string;
  image: string;
  description: string;
  rating: number;
}) {
  try {
    const result = await executeQuery`
      INSERT INTO trips (title, location, duration, price, image, description, rating)
      VALUES (${trip.title}, ${trip.location}, ${trip.duration}, ${trip.price}, ${trip.image}, ${trip.description}, ${trip.rating})
      RETURNING *;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error adding trip:', error);
    throw error;
  }
}

export async function updateTrip(id: number, trip: Partial<{
  title: string;
  location: string;
  duration: string;
  price: string;
  image: string;
  description: string;
  rating: number;
  }>) {
  try {
    // Handle different update scenarios
    if (trip.title !== undefined) {
      const result = await executeQuery`UPDATE trips SET title = ${trip.title}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING *`;
      return result.rows[0];
    }
    if (trip.location !== undefined) {
      const result = await executeQuery`UPDATE trips SET location = ${trip.location}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING *`;
      return result.rows[0];
    }
    if (trip.duration !== undefined) {
      const result = await executeQuery`UPDATE trips SET duration = ${trip.duration}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING *`;
      return result.rows[0];
    }
    if (trip.price !== undefined) {
      const result = await executeQuery`UPDATE trips SET price = ${trip.price}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING *`;
      return result.rows[0];
    }
    if (trip.image !== undefined) {
      const result = await executeQuery`UPDATE trips SET image = ${trip.image}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING *`;
      return result.rows[0];
    }
    if (trip.description !== undefined) {
      const result = await executeQuery`UPDATE trips SET description = ${trip.description}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING *`;
      return result.rows[0];
    }
    if (trip.rating !== undefined) {
      const result = await executeQuery`UPDATE trips SET rating = ${trip.rating}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING *`;
      return result.rows[0];
    }

    throw new Error('No valid fields to update');
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
}

export async function deleteTrip(id: number) {
  try {
    await executeQuery`DELETE FROM trips WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
}

type Primitive = string | number | boolean | null | undefined;

async function executeQuery<O extends QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: Primitive[]
): Promise<QueryResult<O>> {
  const pooledUrl = process.env.POSTGRES_URL;
  if (pooledUrl?.includes('db.prisma.io')) {
    throw new Error('POSTGRES_URL points to Prisma Data Proxy. Use the Vercel Postgres pooled URL instead.');
  }
  const shouldUsePool = Boolean(pooledUrl && (pooledUrl.includes('-pooler.') || pooledUrl.includes('localhost')));

  if (shouldUsePool) {
    return pooledSql(strings, ...values);
  }

  const connectionString = process.env.POSTGRES_URL_NON_POOLING ?? pooledUrl;
  if (connectionString?.includes('db.prisma.io')) {
    throw new Error('POSTGRES_URL_NON_POOLING points to Prisma Data Proxy. Use the Vercel Postgres direct URL instead.');
  }
  const client = createClient({ connectionString });
  await client.connect();
  try {
    return await client.sql(strings, ...values);
  } finally {
    await client.end();
  }
}
