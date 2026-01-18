-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'Unknown';

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "badge" TEXT,
ADD COLUMN     "originalPrice" TEXT;
