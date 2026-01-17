import Image from 'next/image';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[60vh] flex items-center justify-center bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-linear-to-br from-gray-100 via-transparent to-gray-50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0,0,0,0.05) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(0,0,0,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center min-h-screen">
          {/* Left side - Text content */}
          <div className="text-left lg:col-span-2">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Next Adventure
              <span className="block" style={{color: '#f5dbc9'}}>
                Awaits
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Discover extraordinary destinations, create unforgettable memories, and embark on journeys that will transform your perspective on the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="px-8 py-4 text-white font-semibold rounded-full hover:brightness-110 transition-all duration-300 transform hover:scale-105 shadow-lg" style={{backgroundColor: '#ff8701'}}>
                Explore Trips
              </button>
              <button className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
              <div className="text-left">
                <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-gray-600 text-sm">Happy Travelers</div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-gray-900 mb-2">25+</div>
                <div className="text-gray-600 text-sm">Destinations</div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-gray-900 mb-2">10+</div>
                <div className="text-gray-600 text-sm">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right side - Person image */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/random/person.png"
              alt="Travel enthusiast"
              width={400}
              height={480}
              className="rounded-lg object-cover max-w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}