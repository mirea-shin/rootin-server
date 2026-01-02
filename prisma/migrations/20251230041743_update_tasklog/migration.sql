/*
  Warnings:

  - Added the required column `status` to the `TaskLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskLog" ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "completed_date" SET DEFAULT CURRENT_TIMESTAMP;
