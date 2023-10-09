/*
  Warnings:

  - You are about to drop the column `climberId` on the `Route` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_climberId_fkey";

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "climberId";
