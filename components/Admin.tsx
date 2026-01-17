'use client';

import { useState } from 'react';
import { useTrips, Trip } from './TripContext';

export default function Admin() {
  const { trips, loading, addTrip, updateTrip, deleteTrip } = useTrips();
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration: '',
    price: '',
    image: '',
    description: '',
    rating: 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTrip) {
        await updateTrip(editingTrip.id, formData);
        setEditingTrip(null);
      } else {
        await addTrip(formData);
        setIsAddingTrip(false);
      }

      setFormData({
        title: '',
        location: '',
        duration: '',
        price: '',
        image: '',
        description: '',
        rating: 5
      });
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Error saving trip. Please try again.');
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      title: trip.title,
      location: trip.location,
      duration: trip.duration,
      price: trip.price,
      image: trip.image,
      description: trip.description,
      rating: trip.rating
    });
  };

  const handleCancel = () => {
    setIsAddingTrip(false);
    setEditingTrip(null);
    setFormData({
      title: '',
      location: '',
      duration: '',
      price: '',
      image: '',
      description: '',
      rating: 5
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
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
              onClick={() => setIsAddingTrip(true)}
              className="bg-gradient-to-r from-[#ff8701] to-orange-500 text-white px-8 py-4 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Trip
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black text-sm font-medium">Avg Rating</p>
                  <p className="text-3xl font-bold text-black">
                    {trips.length > 0 ? (trips.reduce((sum, t) => sum + t.rating, 0) / trips.length).toFixed(1) : '0.0'}
                  </p>
                </div>
                <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

          {/* Trip Form */}
          {(isAddingTrip || editingTrip) && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Trip Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="e.g., Santorini Sunset Adventure"
                    required
                  />
                </div>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="/images/trips/santorini.jpg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Rating
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <svg className="w-4 h-4 text-[#ff8701]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-[#ff8701] focus:border-[#ff8701] transition-all duration-200 bg-gray-50 focus:bg-white h-32 resize-none"
                    placeholder="Describe the amazing adventure..."
                    required
                  />
                </div>
                <div className="md:col-span-2 flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#ff8701] to-orange-500 text-white px-8 py-4 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingTrip ? 'Update Adventure' : 'Create Adventure'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3"
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

          {/* Trips Gallery */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <div key={trip.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden transform hover:-translate-y-2">
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                    <div className="absolute top-4 right-4 z-20 bg-[#ff8701]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <span>⭐</span>
                      {trip.rating}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                      <h3 className="text-2xl font-bold mb-2 leading-tight">{trip.title}</h3>
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
                  <div className="p-6 bg-gradient-to-b from-white to-slate-50">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-100 rounded-xl p-3 text-center">
                        <div className="text-xs text-black uppercase tracking-wide font-semibold mb-1">Duration</div>
                        <div className="text-lg font-bold text-black">{trip.duration}</div>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                        <div className="text-xs text-black uppercase tracking-wide font-semibold mb-1">Price</div>
                        <div className="text-lg font-bold text-black">{trip.price}</div>
                      </div>
                    </div>

                    <p className="text-black text-sm leading-relaxed mb-6 line-clamp-3">
                      {trip.description}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(trip)}
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
