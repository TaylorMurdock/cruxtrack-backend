/*
  Warnings:

  - You are about to drop the `Journal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Journal" DROP CONSTRAINT "Journal_climberId_fkey";

-- DropTable
DROP TABLE "Journal";
