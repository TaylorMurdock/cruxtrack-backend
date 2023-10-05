/*
  Warnings:

  - You are about to drop the column `climberId` on the `Gear` table. All the data in the column will be lost.
  - You are about to drop the column `climberId` on the `Journal` table. All the data in the column will be lost.
  - You are about to drop the column `climberId` on the `Route` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Gear" DROP CONSTRAINT "Gear_climberId_fkey";

-- DropForeignKey
ALTER TABLE "Journal" DROP CONSTRAINT "Journal_climberId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_climberId_fkey";

-- AlterTable
ALTER TABLE "Gear" DROP COLUMN "climberId";

-- AlterTable
ALTER TABLE "Journal" DROP COLUMN "climberId";

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "climberId";

-- DropEnum
DROP TYPE "Username";
