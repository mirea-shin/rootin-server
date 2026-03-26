-- AlterTable
ALTER TABLE "User" ADD COLUMN     "guest_expires_at" TIMESTAMP(3),
ADD COLUMN     "is_guest" BOOLEAN NOT NULL DEFAULT false;
