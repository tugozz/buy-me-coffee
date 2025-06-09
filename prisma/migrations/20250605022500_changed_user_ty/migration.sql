/*
  Warnings:

  - You are about to drop the column `user` on the `BankCard` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankCard" DROP COLUMN "user";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "user",
ADD COLUMN     "userId" TEXT NOT NULL;
