/*
  Warnings:

  - You are about to drop the column `action` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `resource` on the `permissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branchId` to the `departments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "permissions_resource_action_key";

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "branchId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "action",
DROP COLUMN "resource",
ADD COLUMN     "group" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "departments_branchId_idx" ON "departments"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
