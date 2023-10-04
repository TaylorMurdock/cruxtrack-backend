/*
  Warnings:

  - You are about to drop the column `authorId` on the `Route` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Username" AS ENUM ('basic');

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_authorId_fkey";

-- AlterTable
ALTER TABLE "Gear" ADD COLUMN     "climberId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Journal" ADD COLUMN     "climberId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "authorId",
ADD COLUMN     "climberId" SERIAL NOT NULL;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_climberId_fkey" FOREIGN KEY ("climberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_climberId_fkey" FOREIGN KEY ("climberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gear" ADD CONSTRAINT "Gear_climberId_fkey" FOREIGN KEY ("climberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
