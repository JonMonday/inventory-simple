/*
  Warnings:

  - You are about to drop the column `isActive` on the `request_assignments` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AssignmentMode" AS ENUM ('AUTO_POOL', 'MANUAL_FROM_POOL', 'SPECIFIC_USERS');

-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('POOL', 'USER');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- DropIndex
DROP INDEX "request_assignments_assignedToId_isActive_idx";

-- DropIndex
DROP INDEX "request_assignments_requestId_isActive_idx";

-- AlterTable
ALTER TABLE "request_assignments" DROP COLUMN "isActive",
ADD COLUMN     "assignedRoleKey" TEXT,
ADD COLUMN     "assignmentType" "AssignmentType" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "template_workflow_steps" ADD COLUMN     "allowRequesterSelect" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "assignmentMode" "AssignmentMode" NOT NULL DEFAULT 'AUTO_POOL',
ADD COLUMN     "branchId" TEXT,
ADD COLUMN     "includeRequesterDepartment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxApprovers" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "minApprovers" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "requireAll" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roleKey" TEXT NOT NULL DEFAULT 'unit_head';

-- CreateTable
CREATE TABLE "template_step_specific_users" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "template_step_specific_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "template_step_specific_users_stepId_userId_key" ON "template_step_specific_users"("stepId", "userId");

-- CreateIndex
CREATE INDEX "request_assignments_requestId_status_idx" ON "request_assignments"("requestId", "status");

-- CreateIndex
CREATE INDEX "request_assignments_assignedToId_status_idx" ON "request_assignments"("assignedToId", "status");

-- AddForeignKey
ALTER TABLE "template_workflow_steps" ADD CONSTRAINT "template_workflow_steps_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_step_specific_users" ADD CONSTRAINT "template_step_specific_users_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "template_workflow_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_step_specific_users" ADD CONSTRAINT "template_step_specific_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
