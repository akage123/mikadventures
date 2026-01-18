import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedTrips from '../components/FeaturedTrips';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Memories from '../components/Memories';
import Footer from '../components/Footer';
import { getTrips } from '../lib/db';

type InitialTrip = {
  id: number;
  location: string;
  dates: string;
  duration: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  images?: string[];
  description: string;
  badge?: string | null;
};

export default async function Home() {
  const trips = await getTrips();
  const initialTrips: InitialTrip[] = trips
    .filter((trip) => trip.active !== false)
    .map((trip) => ({
      id: trip.id,
      location: trip.location,
      dates: trip.dates,
      duration: trip.duration,
      price: trip.price,
      originalPrice: trip.originalPrice ?? null,
      image: trip.image,
      images: Array.isArray(trip.images)
        ? trip.images.filter((image: unknown): image is string => typeof image === 'string' && image.length > 0)
        : undefined,
      description: trip.description,
      badge: trip.badge ?? null,
    }));

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedTrips initialTrips={initialTrips} />
      <Memories />
      <Gallery />
      <About />
      <Footer />
    </div>
  );
}
