import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="container mx-auto flex h-20 max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo/logo.png"
              alt="Mika Adventures Logo"
              width={130}
              height={130}
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-10">
          <Link href="#home" className="text-gray-800 hover:text-[#ff8701] transition-all duration-300 font-semibold text-lg relative group font-montserrat">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8701] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="#trips" className="text-gray-800 hover:text-[#ff8701] transition-all duration-300 font-semibold text-lg relative group font-montserrat">
            Adventures
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8701] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="#about" className="text-gray-800 hover:text-[#ff8701] transition-all duration-300 font-semibold text-lg relative group font-montserrat">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8701] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="#contact" className="text-gray-800 hover:text-[#ff8701] transition-all duration-300 font-semibold text-lg relative group font-montserrat">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8701] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/admin" className="text-gray-800 hover:text-[#ff8701] transition-all duration-300 font-semibold text-lg relative group font-montserrat">
            Admin
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8701] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
        <button
  className="
    hidden md:block
    px-6 py-2.5 text-sm font-semibold
    text-white
    rounded-full
    border border-white/30
    shadow-[0_10px_25px_rgba(255,135,1,0.4)]
    hover:shadow-[0_14px_35px_rgba(255,135,1,0.6)]
    hover:scale-[1.03]
    hover:brightness-110
    transition-all duration-300 ease-out
  "
  style={{backgroundColor: '#ff8701'}}
>
  Book Now
</button>

          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}