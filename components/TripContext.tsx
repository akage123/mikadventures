'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Trip {
  id: number;
  title: string;
  location: string;
  duration: string;
  price: string;
  image: string;
  description: string;
  rating: number;
}

interface TripContextType {
  trips: Trip[];
  loading: boolean;
  addTrip: (trip: Omit<Trip, 'id'>) => Promise<void>;
  updateTrip: (id: number, trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: number) => Promise<void>;
  getTripById: (id: number) => Trip | undefined;
  refreshTrips: () => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const defaultTrips: Trip[] = [
  {
    id: 1,
    title: "Santorini Sunset",
    location: "Greece",
    duration: "7 Days",
    price: "$2,499",
    description: "Experience the breathtaking sunsets of Santorini with luxury accommodations, private boat tours, and authentic Greek cuisine.",
    rating: 4.9,
    image: "/images/trips/santorini.jpg"
  },
  {
    id: 2,
    title: "Tokyo Adventure",
    location: "Japan",
    duration: "10 Days",
    price: "$3,299",
    description: "Immerse yourself in Tokyo's vibrant culture, from ancient temples to cutting-edge technology and world-class cuisine.",
    rating: 4.8,
    image: "/images/trips/tokyo.jpg"
  },
  {
    id: 3,
    title: "Swiss Alps Trek",
    location: "Switzerland",
    duration: "8 Days",
    price: "$2,899",
    description: "Hike through stunning alpine landscapes, stay in charming mountain lodges, and enjoy Swiss hospitality at its finest.",
    rating: 4.7,
    image: "/images/trips/swiss-alps.jpg"
  },
  {
    id: 4,
    title: "Bali Paradise",
    location: "Indonesia",
    duration: "9 Days",
    price: "$1,999",
    description: "Discover Bali's spiritual side with temple visits, yoga retreats, and relaxation on pristine beaches with luxury villas.",
    rating: 4.8,
    image: "/images/trips/bali.jpg"
  },
  {
    id: 5,
    title: "Machu Picchu Expedition",
    location: "Peru",
    duration: "12 Days",
    price: "$3,799",
    description: "Trek the Inca Trail to the ancient citadel of Machu Picchu, experience Andean culture, and witness incredible landscapes.",
    rating: 4.9,
    image: "/images/trips/machu-picchu.jpg"
  },
  {
    id: 6,
    title: "Northern Lights",
    location: "Iceland",
    duration: "6 Days",
    price: "$2,699",
    description: "Chase the aurora borealis through Iceland's dramatic landscapes, including geysers, waterfalls, and volcanic wonders.",
    rating: 4.6,
    image: "/images/trips/northern-lights.jpg"
  }
];

async function fetchTrips(): Promise<Trip[]> {
  const response = await fetch('/api/trips');
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

  // Initialize database and load trips
  useEffect(() => {
    const initializeTrips = async () => {
      try {
        // Try to load from database
        const dbTrips = await fetchTrips();

        if (dbTrips.length > 0) {
          setTrips(dbTrips);
        } else {
          // If no trips in database, add default trips
          for (const trip of defaultTrips) {
            await createTrip({
              title: trip.title,
              location: trip.location,
              duration: trip.duration,
              price: trip.price,
              image: trip.image,
              description: trip.description,
              rating: trip.rating
            });
          }
          // Load the trips we just added
          const newDbTrips = await fetchTrips();
          setTrips(newDbTrips);
        }
      } catch (error) {
        console.error('Error initializing trips:', error);
        // Fallback to localStorage if database fails
        const savedTrips = localStorage.getItem('mika-adventures-trips');
        if (savedTrips) {
          try {
            setTrips(JSON.parse(savedTrips));
          } catch (localError) {
            console.error('Error loading from localStorage:', localError);
            setTrips(defaultTrips);
          }
        } else {
          setTrips(defaultTrips);
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
    } catch (error) {
      console.error('Error updating trip:', error);
      // Fallback to local state
      setTrips(prev => prev.map(trip =>
        trip.id === id ? { ...trip, ...tripData } : trip
      ));
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
      const dbTrips = await fetchTrips();
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
