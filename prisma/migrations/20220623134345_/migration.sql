/*
  Warnings:

  - You are about to drop the column `updatedat` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `updatedat` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "updatedat",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "updatedat",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
