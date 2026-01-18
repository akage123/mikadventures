-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "cutoffDate" TIMESTAMP(3),
ADD COLUMN     "faqs" JSONB;
