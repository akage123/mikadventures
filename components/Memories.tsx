import RevealOnScroll from './RevealOnScroll';

export default function Memories() {
  return (
    <section id="memories" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <RevealOnScroll className="delay-100">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Wander more, worry less.
            </h2>
            <p className="text-lg text-gray-600">
              Real moments from our recent adventures.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="delay-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['/videos/video1.mp4', '/videos/video2.mp4', '/videos/video3.mp4'].map((src) => (
              <div key={src} className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                <video
                  src={src}
                  controls
                  playsInline
                  className="w-full h-72 md:h-100 lg:h-170 object-cover"
                />
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="delay-300">
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <p className="text-gray-700 text-lg">
              Follow our Instagram to see more of the memories we create together.
            </p>
            <a
              href="https://www.instagram.com/mik_adventures/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-gray-300 px-6 py-3 text-gray-900 hover:border-[#ff8701] hover:text-[#ff8701] transition-colors"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37a4 4 0 11-7.37 2.62 4 4 0 017.37-2.62" />
                <circle cx="17.5" cy="6.5" r="1" />
              </svg>
              @mik_adventures
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
