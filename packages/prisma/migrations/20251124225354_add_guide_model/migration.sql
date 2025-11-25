-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "guide_id" TEXT;

-- AlterTable
ALTER TABLE "guides" ADD COLUMN     "availability" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guides"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
