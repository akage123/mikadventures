interface TripCardProps {
  title: string;
  location: string;
  duration: string;
  price: string;
  image: string;
  description: string;
  rating?: number;
}

export default function TripCard({
  title,
  location,
  duration,
  price,
  image,
  description,
  rating = 4.8
}: TripCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-[28rem] bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm opacity-90">{location}</p>
        </div>
      </div>

    </div>
  );
}