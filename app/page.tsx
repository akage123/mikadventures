import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedTrips from '../components/FeaturedTrips';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Memories from '../components/Memories';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedTrips />
      <Memories />
      <Gallery />
      <About />
      <Footer />
    </div>
  );
}
