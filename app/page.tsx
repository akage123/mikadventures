import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedTrips from '../components/FeaturedTrips';
import About from '../components/About';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedTrips />
      <About />
      <Footer />
    </div>
  );
}