'use client';

import { useEffect, useRef, useState } from 'react';
import { useTrips, Trip } from './TripContext';

type Booking = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  country: string;
  instagram?: string | null;
  people: number;
  status: string;
  trip: {
    id: number;
    location: string;
    dates: string;
  };
};

export default function Admin() {
  const { trips, loading, addTrip, updateTrip, deleteTrip } = useTrips();
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    location: '',
    dates: '',
    duration: '',
    price: '',
    originalPrice: '',
    capacity: '',
    cutoffDate: '',
    images: [] as string[],
    description: '',
    badge: '',
    active: true,
    itinerary: [{ city: '', nights: '' }],
    faqs: [{ question: '', answer: '' }]
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingStatus, setBookingStatus] = useState('all');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (!response.ok) {
          throw new Error('Failed to load bookings');
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error loading bookings:', error);
      }
    };

    loadBookings();
  }, []);

  useEffect(() => {
    if (!editingTrip || !descriptionRef.current) {
      return;
    }
    const element = descriptionRef.current;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }, [editingTrip, formData.description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        image: formData.images[0] ?? '',
        capacity: formData.capacity ? Number(formData.capacity) : null,
        cutoffDate: formData.cutoffDate || null,
      };

      if (editingTrip) {
        const updated = await updateTrip(editingTrip.id, payload);
        setEditingTrip(updated);
        setFormData({
          location: updated.location,
          dates: updated.dates,
          duration: updated.duration,
          price: updated.price,
          originalPrice: updated.originalPrice ?? '',
          capacity: updated.capacity ? String(updated.capacity) : '',
          cutoffDate: updated.cutoffDate ? updated.cutoffDate.slice(0, 10) : '',
          images: updated.images?.length ? updated.images : updated.image ? [updated.image] : [],
          description: updated.description,
          badge: updated.badge ?? '',
          active: updated.active ?? true,
          itinerary: updated.itinerary?.length ? updated.itinerary : [{ city: '', nights: '' }],
          faqs: updated.faqs?.length ? updated.faqs : [{ question: '', answer: '' }]
        });
        setImagePreview(updated.images?.[0] ?? updated.image ?? '');
        setToast({ type: 'success', message: 'Adventure updated' });
        setTimeout(() => setToast(null), 2000);
      } else {
        await addTrip(payload);
        setIsAddingTrip(false);
        setEditingTrip(null);

        setFormData({
          location: '',
          dates: '',
          duration: '',
          price: '',
          originalPrice: '',
          capacity: '',
          cutoffDate: '',
          images: [],
          description: '',
          badge: '',
          active: true,
          itinerary: [{ city: '', nights: '' }],
          faqs: [{ question: '', answer: '' }]
        });
        setImagePreview('');
        setToast({ type: 'success', message: 'Adventure created' });
        setTimeout(() => setToast(null), 2000);
      }
    } catch (error) {
      console.error('Error saving trip:', error);
      setToast({ type: 'error', message: 'Failed to save adventure' });
      setTimeout(() => setToast(null), 3000);
      alert('Error saving trip. Please try again.');
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setIsAddingTrip(true);
    setFormData({
      location: trip.location,
      dates: trip.dates,
      duration: trip.duration,
      price: trip.price,
      originalPrice: trip.originalPrice ?? '',
      capacity: trip.capacity ? String(trip.capacity) : '',
      cutoffDate: trip.cutoffDate ? trip.cutoffDate.slice(0, 10) : '',
      images: trip.images?.length ? trip.images : trip.image ? [trip.image] : [],
      description: trip.description,
      badge: trip.badge ?? '',
      active: trip.active ?? true,
      itinerary: trip.itinerary?.length ? trip.itinerary : [{ city: '', nights: '' }],
      faqs: trip.faqs?.length ? trip.faqs : [{ question: '', answer: '' }]
    });
    setImagePreview(trip.images?.[0] ?? trip.image ?? '');
    setTimeout(() => {
      const form = document.getElementById('admin-trip-form');
      form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleCancel = () => {
    setIsAddingTrip(false);
    setEditingTrip(null);
    setFormData({
      location: '',
      dates: '',
      duration: '',
      price: '',
      originalPrice: '',
      capacity: '',
      cutoffDate: '',
      images: [],
      description: '',
      badge: '',
      active: true,
      itinerary: [{ city: '', nights: '' }],
      faqs: [{ question: '', answer: '' }]
    });
    setImagePreview('');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) {
      return;
    }
    Promise.all(
      files.map((file) => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.readAsDataURL(file);
      }))
    ).then((results) => {
      const filtered = results.filter(Boolean);
      if (filtered.length === 0) {
        return;
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...filtered] }));
      setImagePreview(prev => prev || filtered[0]);
    });
  };

  const handleItineraryChange = (index: number, field: 'city' | 'nights', value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAddItineraryRow = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { city: '', nights: '' }]
    }));
  };

  const handleRemoveItineraryRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addFaqRow = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFaqRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const handleSetMainImage = (image: string) => {
    setFormData(prev => {
      const remaining = prev.images.filter((item) => item !== image);
      return { ...prev, images: [image, ...remaining] };
    });
    setImagePreview(image);
  };

  const handleRemoveImage = (image: string) => {
    setFormData(prev => {
      const remaining = prev.images.filter((item) => item !== image);
      return { ...prev, images: remaining };
    });
    setImagePreview((prev) => {
      if (prev === image) {
        const next = formData.images.find((item) => item !== image);
        return next ?? '';
      }
      return prev;
    });
  };

  const handleBookingStatusChange = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update booking');
      }
      const updated = await response.json();
      setBookings((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (error) {
      console.error('Error updating booking:', error);
      setToast({ type: 'error', message: 'Failed to update booking' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleExportBookings = () => {
    const rows = bookings
      .filter((booking) => bookingStatus === 'all' || booking.status === bookingStatus)
      .map((booking) => ({
        id: booking.id,
        fullName: booking.fullName,
        phone: booking.phone,
        email: booking.email,
        country: booking.country,
        instagram: booking.instagram ?? '',
        people: booking.people,
        status: booking.status,
        trip: `${booking.trip.location} (${booking.trip.dates})`,
      }));

    const headers = [
      'id',
      'fullName',
      'phone',
      'email',
      'country',
      'instagram',
      'people',
      'status',
      'trip',
    ];

    const escapeCell = (value: string | number) => {
      const stringValue = String(value ?? '');
      if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csv = [
      headers.join(','),
      ...rows.map((row) => headers.map((key) => escapeCell((row as Record<string, string | number>)[key])).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <div className={`rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
            {toast.message}
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 max-w-screen-xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-[#ff8701] to-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Trip Management Admin</h1>
                  <p className="text-black">Manage your travel adventures and destinations</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAddingTrip(true);
                setEditingTrip(null);
                setFormData({
                  location: '',
                  dates: '',
                  duration: '',
                  price: '',
                  originalPrice: '',
                  capacity: '',
                  cutoffDate: '',
                  images: [],
                  description: '',
                  badge: '',
                  active: true,
                  itinerary: [{ city: '', nights: '' }],
                  faqs: [{ question: '', answer: '' }]
                });
                setImagePreview('');
              }}
              className="bg-gradient-to-r from-[#ff8701] to-orange-500 text-white px-8 py-4 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Trip
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black text-sm font-medium">Total Trips</p>
                  <p className="text-3xl font-bold text-black">{trips.length}</p>
                </div>
                <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black text-sm font-medium">Active Destinations</p>
                  <p className="text-3xl font-bold text-black">{new Set(trips.map(t => t.location)).size}</p>
                </div>
                <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

          {/* Trip Form */}
          {(isAddingTrip || editingTrip) && (
            <div id="admin-trip-form" className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-[#ff8701] to-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingTrip ? 'Edit Trip Details' : 'Create New Adventure'}
                  </h2>
                  <p className="text-black">
                    {editingTrip ? 'Update the trip information below' : 'Fill in the details to add a new trip to your collection'}
                  </p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="e.g., Santorini, Greece"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m4 0H3m18 0v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9" />
                    </svg>
                    Dates
                  </label>
                  <input
                    type="text"
                    value={formData.dates}
                    onChange={(e) => setFormData({...formData, dates: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="e.g., May 12–19, 2025"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="e.g., 7 Days"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Price
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="e.g., $2,499"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Original Price (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="e.g., $2,999"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 01.88 7.903A5 5 0 1112 6a4 4 0 014 1z" />
                    </svg>
                    Capacity (optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="e.g., 20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m4 0H3m18 0v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9" />
                    </svg>
                    Booking cutoff date (optional)
                  </label>
                  <input
                    type="date"
                    value={formData.cutoffDate}
                    onChange={(e) => setFormData({...formData, cutoffDate: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Image Upload
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                    multiple
                    required={!editingTrip && formData.images.length === 0}
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-3 space-y-3">
                      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <img src={imagePreview || formData.images[0]} alt="Trip preview" className="h-48 w-full object-cover" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={`${image}-${index}`} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(image)}
                              className="relative block w-full"
                            >
                              <img src={image} alt={`Preview ${index + 1}`} className="h-28 w-full object-cover" />
                              {formData.images[0] === image && (
                                <span className="absolute top-2 left-2 rounded-full bg-[#ff8701] px-2 py-1 text-xs font-semibold text-white">
                                  Main
                                </span>
                              )}
                            </button>
                            <div className="flex items-center justify-between px-3 py-2 text-xs">
                              <button
                                type="button"
                                onClick={() => handleSetMainImage(image)}
                                className="rounded-md px-2 py-1 text-[#ff8701] hover:bg-orange-50"
                              >
                                Set main
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(image)}
                                className="rounded-md px-2 py-1 text-gray-600 hover:bg-red-50 hover:text-red-600"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Description
                  </label>
                  <textarea
                    ref={descriptionRef}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white resize-none ${editingTrip ? '' : 'h-32'}`}
                    placeholder="Describe the amazing adventure..."
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Badge (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="e.g., ON SALE"
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8m-4-4v8m-7 4h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      FAQ (optional)
                    </label>
                    <button
                      type="button"
                      onClick={addFaqRow}
                      className="text-sm font-semibold text-[#ff8701] hover:text-orange-600 transition-colors"
                    >
                      + Add FAQ
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.faqs.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-[2fr_2fr_auto] gap-3 items-start">
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Question (e.g., Visa required?)"
                        />
                        <input
                          type="text"
                          value={item.answer}
                          onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Answer"
                        />
                        <button
                          type="button"
                          onClick={() => removeFaqRow(index)}
                          className="text-sm text-gray-500 hover:text-red-500 transition-colors mt-2"
                          disabled={formData.faqs.length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m4 0H3m18 0v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9" />
                      </svg>
                      City Breakdown
                    </label>
                    <button
                      type="button"
                      onClick={handleAddItineraryRow}
                      className="text-sm font-semibold text-[#ff8701] hover:text-orange-600 transition-colors"
                    >
                      + Add City
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.itinerary.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-3 items-center">
                        <input
                          type="text"
                          value={item.city}
                          onChange={(e) => handleItineraryChange(index, 'city', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="City (e.g., Osaka)"
                          required
                        />
                        <input
                          type="text"
                          value={item.nights}
                          onChange={(e) => handleItineraryChange(index, 'nights', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Nights (e.g., 4)"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItineraryRow(index)}
                          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                          disabled={formData.itinerary.length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#ff8701] to-orange-500 text-white px-8 py-4 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingTrip ? 'Update Adventure' : 'Create Adventure'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full sm:w-auto bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Bookings */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
                <p className="text-sm text-gray-600">Track booking status and client details.</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-900">Status</label>
                <select
                  value={bookingStatus}
                  onChange={(event) => setBookingStatus(event.target.value)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-black focus:border-[#ff8701] focus:ring-2 focus:ring-[#ff8701]"
                >
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="closed">Closed</option>
                </select>
                <button
                  type="button"
                  onClick={handleExportBookings}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#ff8701] hover:text-[#ff8701] transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {bookings.length === 0 ? (
              <p className="text-gray-600">No bookings yet.</p>
            ) : (
              <div className="space-y-4">
                {bookings
                  .filter((booking) => bookingStatus === 'all' || booking.status === bookingStatus)
                  .map((booking) => (
                    <div key={booking.id} className="rounded-xl border border-gray-200 p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold text-gray-900">{booking.fullName}</div>
                          <div className="text-sm text-gray-600">
                            {booking.trip.location} · {booking.trip.dates} · {booking.people} people
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.phone} · {booking.email}
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.country}
                          </div>
                          {booking.instagram && (
                            <div className="text-sm text-gray-600">Instagram: {booking.instagram}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-semibold text-gray-900">Status</label>
                          <select
                            value={booking.status}
                            onChange={(event) => handleBookingStatusChange(booking.id, event.target.value)}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-black focus:border-[#ff8701] focus:ring-2 focus:ring-[#ff8701]"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Trips Gallery */}
          {!loading && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <div key={trip.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden transform hover:-translate-y-2">
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={trip.images?.[0] ?? trip.image}
                      alt={trip.location}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                    <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-lg font-semibold">{trip.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 bg-gradient-to-b from-white to-slate-50 flex flex-col min-h-[280px]">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-100 rounded-xl p-3 text-center">
                        <div className="text-xs text-black uppercase tracking-wide font-semibold mb-1">Duration</div>
                        <div className="text-lg font-bold text-black">{trip.dates}</div>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                        <div className="text-xs text-black uppercase tracking-wide font-semibold mb-1">Price</div>
                        <div className="text-lg font-bold text-black">{trip.price}</div>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <p className={`text-black text-sm leading-relaxed mb-6 ${editingTrip?.id === trip.id ? '' : 'line-clamp-3'}`}>
                        {trip.description}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-auto mb-4">
                      <div className="flex items-center justify-between w-full bg-white rounded-xl border border-gray-200 px-4 py-3">
                        <div className="text-sm font-semibold text-gray-900">
                          {trip.active ? 'Active' : 'Inactive'}
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await updateTrip(trip.id, { active: !trip.active });
                            } catch (error) {
                              console.error('Error updating trip status:', error);
                              alert('Error updating trip status. Please try again.');
                            }
                          }}
                          className={`relative h-7 w-14 rounded-full transition-colors ${trip.active ? 'bg-[#ff8701]' : 'bg-gray-300'}`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${trip.active ? 'translate-x-[26px]' : 'translate-x-0'}`}
                          />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          handleEdit(trip);
                          document.getElementById('admin-trip-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this adventure? This action cannot be undone.')) {
                            try {
                              await deleteTrip(trip.id);
                            } catch (error) {
                              console.error('Error deleting trip:', error);
                              alert('Error deleting trip. Please try again.');
                            }
                          }
                        }}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#ff8701]/20 border-t-[#ff8701] mx-auto"></div>
              </div>
              <p className="text-black mt-6 text-lg font-medium">Loading your adventures...</p>
              <p className="text-black mt-2">Connecting to the database</p>
            </div>
          )}

          {trips.length === 0 && !loading && (
            <div className="text-center py-20 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-dashed border-slate-300">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-[#ff8701] to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Ready to Create Adventures?</h3>
                <p className="text-black mb-8 leading-relaxed">
                  Start building your collection of amazing travel experiences. Each trip tells a story and creates unforgettable memories.
                </p>
                <button
                  onClick={() => setIsAddingTrip(true)}
                  className="bg-gradient-to-r from-[#ff8701] to-orange-500 text-white px-8 py-4 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your First Adventure
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
