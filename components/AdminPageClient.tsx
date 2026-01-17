'use client';

import dynamic from 'next/dynamic';

const Admin = dynamic(() => import('./Admin'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#ff8701]/20 border-t-[#ff8701] mx-auto"></div>
          <p className="text-black mt-6 text-lg font-medium">Loading admin tools...</p>
        </div>
      </div>
    </div>
  ),
});

export default function AdminPageClient() {
  return <Admin />;
}
