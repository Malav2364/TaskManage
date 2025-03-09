/*
  Warnings:

  - Added the required column `UserId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_id_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "UserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
