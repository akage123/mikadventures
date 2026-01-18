'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export interface Trip {
  id: number;
  location: string;
  dates: string;
  duration: string;
  price: string;
  originalPrice?: string | null;
  capacity?: number | null;
  cutoffDate?: string | null;
  image: string;
  images?: string[];
  description: string;
  badge?: string | null;
  active?: boolean;
  itinerary?: { city: string; nights: string }[];
  faqs?: { question: string; answer: string }[];
}

interface TripContextType {
  trips: Trip[];
  loading: boolean;
  addTrip: (trip: Omit<Trip, 'id'>) => Promise<void>;
  updateTrip: (id: number, trip: Partial<Trip>) => Promise<Trip>;
  deleteTrip: (id: number) => Promise<void>;
  getTripById: (id: number) => Trip | undefined;
  refreshTrips: () => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const defaultTrips: Trip[] = [];

async function fetchTrips(options?: { all?: boolean }): Promise<Trip[]> {
  const query = options?.all ? '?all=true' : '';
  const response = await fetch(`/api/trips${query}`);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error ?? 'Failed to load trips';
    throw new Error(message);
  }
  return response.json();
}

async function createTrip(tripData: Omit<Trip, 'id'>): Promise<Trip> {
  const response = await fetch('/api/trips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error ?? 'Failed to create trip';
    throw new Error(message);
  }
  return response.json();
}

async function patchTrip(id: number, tripData: Partial<Trip>): Promise<Trip> {
  const response = await fetch(`/api/trips/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error ?? 'Failed to update trip';
    throw new Error(message);
  }
  return response.json();
}

async function removeTrip(id: number): Promise<void> {
  const response = await fetch(`/api/trips/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error ?? 'Failed to delete trip';
    throw new Error(message);
  }
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  // Initialize database and load trips
  useEffect(() => {
    const initializeTrips = async () => {
      try {
        // Try to load from database
        const dbTrips = await fetchTrips({ all: isAdminPath });

        setTrips(dbTrips);
      } catch (error) {
        console.error('Error initializing trips:', error);
        // Fallback to localStorage if database fails
        const savedTrips = localStorage.getItem('mika-adventures-trips');
        if (savedTrips) {
          try {
            setTrips(JSON.parse(savedTrips));
          } catch (localError) {
            console.error('Error loading from localStorage:', localError);
            setTrips([]);
          }
        } else {
          setTrips([]);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeTrips();
  }, []);

  const addTrip = async (tripData: Omit<Trip, 'id'>) => {
    try {
      const newTrip = await createTrip(tripData);
      setTrips(prev => [newTrip, ...prev]);
    } catch (error) {
      console.error('Error adding trip:', error);
      // Fallback to local state
      const newTrip: Trip = {
        ...tripData,
        id: Math.max(...trips.map(t => t.id), 0) + 1
      };
      setTrips(prev => [newTrip, ...prev]);
    }
  };

  const updateTrip = async (id: number, tripData: Partial<Trip>) => {
    try {
      const updatedTrip = await patchTrip(id, tripData);
      setTrips(prev => prev.map(trip =>
        trip.id === id ? updatedTrip : trip
      ));
      return updatedTrip;
    } catch (error) {
      console.error('Error updating trip:', error);
      // Fallback to local state
      let fallbackTrip: Trip | undefined;
      setTrips(prev => prev.map(trip => {
        if (trip.id === id) {
          fallbackTrip = { ...trip, ...tripData };
          return fallbackTrip;
        }
        return trip;
      }));
      if (fallbackTrip) {
        return fallbackTrip;
      }
      throw error;
    }
  };

  const deleteTrip = async (id: number) => {
    try {
      await removeTrip(id);
      setTrips(prev => prev.filter(trip => trip.id !== id));
    } catch (error) {
      console.error('Error deleting trip:', error);
      // Fallback to local state
      setTrips(prev => prev.filter(trip => trip.id !== id));
    }
  };

  const getTripById = (id: number) => {
    return trips.find(trip => trip.id === id);
  };

  const refreshTrips = async () => {
    try {
      const dbTrips = await fetchTrips({ all: isAdminPath });
      setTrips(dbTrips);
    } catch (error) {
      console.error('Error refreshing trips:', error);
    }
  };

  return (
    <TripContext.Provider value={{
      trips,
      loading,
      addTrip,
      updateTrip,
      deleteTrip,
      getTripById,
      refreshTrips
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}
