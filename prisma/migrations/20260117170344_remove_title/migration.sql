/*
  Warnings:

  - You are about to drop the column `rating` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "rating",
DROP COLUMN "title",
ADD COLUMN     "dates" TEXT NOT NULL DEFAULT '';
