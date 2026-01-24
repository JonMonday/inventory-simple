/*
  Warnings:

  - You are about to alter the column `currentStock` on the `forecast_results` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `predictedConsumption` on the `forecast_results` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `reorderSuggestion` on the `forecast_results` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `quantity` on the `inventory_ledger` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `reorderLevel` on the `items` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `reorderQuantity` on the `items` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to drop the column `movementType` on the `reason_codes` table. All the data in the column will be lost.
  - You are about to alter the column `quantityOnHand` on the `stock_snapshots` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `countedQuantity` on the `stocktake_lines` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `systemQuantity` on the `stocktake_lines` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `variance` on the `stocktake_lines` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to drop the column `department` on the `users` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "reason_code_movement_types" (
    "reasonCodeId" TEXT NOT NULL,
    "movementType" TEXT NOT NULL,

    PRIMARY KEY ("reasonCodeId", "movementType"),
    CONSTRAINT "reason_code_movement_types_reasonCodeId_fkey" FOREIGN KEY ("reasonCodeId") REFERENCES "reason_codes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestLineId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reservations_itemId_locationId_fkey" FOREIGN KEY ("itemId", "locationId") REFERENCES "stock_snapshots" ("itemId", "locationId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reservations_requestLineId_fkey" FOREIGN KEY ("requestLineId") REFERENCES "request_lines" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "system_sequences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "nextValue" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "readableId" TEXT NOT NULL,
    "requesterUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "departmentId" TEXT,
    "locationId" TEXT,
    "issueFromLocationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "requests_requesterUserId_fkey" FOREIGN KEY ("requesterUserId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "requests_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "requests_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "requests_issueFromLocationId_fkey" FOREIGN KEY ("issueFromLocationId") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "request_lines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "request_lines_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "request_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "request_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "request_assignments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "request_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "request_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dataJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "request_events_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "request_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_forecast_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "forecastRunId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "predictedConsumption" INTEGER NOT NULL,
    "currentStock" INTEGER NOT NULL,
    "reorderSuggestion" INTEGER NOT NULL,
    CONSTRAINT "forecast_results_forecastRunId_fkey" FOREIGN KEY ("forecastRunId") REFERENCES "forecast_runs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "forecast_results_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "forecast_results_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_forecast_results" ("currentStock", "forecastRunId", "id", "itemId", "locationId", "predictedConsumption", "reorderSuggestion") SELECT "currentStock", "forecastRunId", "id", "itemId", "locationId", "predictedConsumption", "reorderSuggestion" FROM "forecast_results";
DROP TABLE "forecast_results";
ALTER TABLE "new_forecast_results" RENAME TO "forecast_results";
CREATE INDEX "forecast_results_forecastRunId_idx" ON "forecast_results"("forecastRunId");
CREATE INDEX "forecast_results_itemId_idx" ON "forecast_results"("itemId");
CREATE INDEX "forecast_results_locationId_idx" ON "forecast_results"("locationId");
CREATE TABLE "new_inventory_ledger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "fromLocationId" TEXT,
    "toLocationId" TEXT,
    "movementType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "reasonCodeId" TEXT NOT NULL,
    "reasonText" TEXT,
    "referenceNo" TEXT,
    "department" TEXT,
    "useBy" TEXT,
    "suppliedBy" TEXT,
    "receivedBy" TEXT,
    "comments" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "createdAtUtc" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'UI',
    "importJobId" TEXT,
    "correctionOfLedgerId" TEXT,
    "reversalOfLedgerId" TEXT,
    "unitCost" REAL,
    "totalCost" REAL,
    CONSTRAINT "inventory_ledger_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inventory_ledger_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "inventory_ledger_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "inventory_ledger_reasonCodeId_fkey" FOREIGN KEY ("reasonCodeId") REFERENCES "reason_codes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inventory_ledger_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inventory_ledger_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "import_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "inventory_ledger_correctionOfLedgerId_fkey" FOREIGN KEY ("correctionOfLedgerId") REFERENCES "inventory_ledger" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "inventory_ledger_reversalOfLedgerId_fkey" FOREIGN KEY ("reversalOfLedgerId") REFERENCES "inventory_ledger" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_inventory_ledger" ("comments", "correctionOfLedgerId", "createdAtUtc", "createdByUserId", "department", "fromLocationId", "id", "importJobId", "itemId", "movementType", "quantity", "reasonCodeId", "reasonText", "receivedBy", "referenceNo", "source", "suppliedBy", "toLocationId", "unitOfMeasure", "useBy") SELECT "comments", "correctionOfLedgerId", "createdAtUtc", "createdByUserId", "department", "fromLocationId", "id", "importJobId", "itemId", "movementType", "quantity", "reasonCodeId", "reasonText", "receivedBy", "referenceNo", "source", "suppliedBy", "toLocationId", "unitOfMeasure", "useBy" FROM "inventory_ledger";
DROP TABLE "inventory_ledger";
ALTER TABLE "new_inventory_ledger" RENAME TO "inventory_ledger";
CREATE INDEX "inventory_ledger_itemId_idx" ON "inventory_ledger"("itemId");
CREATE INDEX "inventory_ledger_fromLocationId_idx" ON "inventory_ledger"("fromLocationId");
CREATE INDEX "inventory_ledger_toLocationId_idx" ON "inventory_ledger"("toLocationId");
CREATE INDEX "inventory_ledger_movementType_idx" ON "inventory_ledger"("movementType");
CREATE INDEX "inventory_ledger_createdAtUtc_idx" ON "inventory_ledger"("createdAtUtc");
CREATE INDEX "inventory_ledger_importJobId_idx" ON "inventory_ledger"("importJobId");
CREATE TABLE "new_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "reorderLevel" INTEGER,
    "reorderQuantity" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_items" ("categoryId", "code", "createdAt", "description", "id", "name", "reorderLevel", "reorderQuantity", "status", "unitOfMeasure", "updatedAt") SELECT "categoryId", "code", "createdAt", "description", "id", "name", "reorderLevel", "reorderQuantity", "status", "unitOfMeasure", "updatedAt" FROM "items";
DROP TABLE "items";
ALTER TABLE "new_items" RENAME TO "items";
CREATE UNIQUE INDEX "items_code_key" ON "items"("code");
CREATE INDEX "items_categoryId_idx" ON "items"("categoryId");
CREATE INDEX "items_status_idx" ON "items"("status");
CREATE TABLE "new_reason_codes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiresFreeText" BOOLEAN NOT NULL DEFAULT false,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "thresholdValue" REAL,
    "label" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_reason_codes" ("code", "createdAt", "id", "isActive", "name") SELECT "code", "createdAt", "id", "isActive", "name" FROM "reason_codes";
DROP TABLE "reason_codes";
ALTER TABLE "new_reason_codes" RENAME TO "reason_codes";
CREATE UNIQUE INDEX "reason_codes_code_key" ON "reason_codes"("code");
CREATE INDEX "reason_codes_isActive_idx" ON "reason_codes"("isActive");
CREATE TABLE "new_stock_snapshots" (
    "itemId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "quantityOnHand" INTEGER NOT NULL,
    "reservedQuantity" INTEGER NOT NULL DEFAULT 0,
    "lastUpdatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("itemId", "locationId"),
    CONSTRAINT "stock_snapshots_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stock_snapshots_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_stock_snapshots" ("itemId", "lastUpdatedAt", "locationId", "quantityOnHand") SELECT "itemId", "lastUpdatedAt", "locationId", "quantityOnHand" FROM "stock_snapshots";
DROP TABLE "stock_snapshots";
ALTER TABLE "new_stock_snapshots" RENAME TO "stock_snapshots";
CREATE INDEX "stock_snapshots_locationId_idx" ON "stock_snapshots"("locationId");
CREATE TABLE "new_stocktake_lines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stocktakeId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "systemQuantity" INTEGER NOT NULL,
    "countedQuantity" INTEGER,
    "variance" INTEGER,
    "notes" TEXT,
    CONSTRAINT "stocktake_lines_stocktakeId_fkey" FOREIGN KEY ("stocktakeId") REFERENCES "stocktakes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "stocktake_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_stocktake_lines" ("countedQuantity", "id", "itemId", "notes", "stocktakeId", "systemQuantity", "variance") SELECT "countedQuantity", "id", "itemId", "notes", "stocktakeId", "systemQuantity", "variance" FROM "stocktake_lines";
DROP TABLE "stocktake_lines";
ALTER TABLE "new_stocktake_lines" RENAME TO "stocktake_lines";
CREATE INDEX "stocktake_lines_stocktakeId_idx" ON "stocktake_lines"("stocktakeId");
CREATE INDEX "stocktake_lines_itemId_idx" ON "stocktake_lines"("itemId");
CREATE TABLE "new_stocktakes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedByUserId" TEXT,
    "approvedAt" DATETIME,
    CONSTRAINT "stocktakes_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stocktakes_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stocktakes_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_stocktakes" ("completedAt", "createdAt", "createdByUserId", "id", "locationId", "name", "startedAt", "status") SELECT "completedAt", "createdAt", "createdByUserId", "id", "locationId", "name", "startedAt", "status" FROM "stocktakes";
DROP TABLE "stocktakes";
ALTER TABLE "new_stocktakes" RENAME TO "stocktakes";
CREATE INDEX "stocktakes_locationId_idx" ON "stocktakes"("locationId");
CREATE INDEX "stocktakes_status_idx" ON "stocktakes"("status");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "departmentId" TEXT,
    "locationId" TEXT,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "users_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("createdAt", "email", "fullName", "id", "isActive", "mustChangePassword", "passwordHash", "updatedAt") SELECT "createdAt", "email", "fullName", "id", "isActive", "mustChangePassword", "passwordHash", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "reservations_requestLineId_key" ON "reservations"("requestLineId");

-- CreateIndex
CREATE INDEX "reservations_itemId_locationId_idx" ON "reservations"("itemId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "system_sequences_name_year_key" ON "system_sequences"("name", "year");

-- CreateIndex
CREATE UNIQUE INDEX "requests_readableId_key" ON "requests"("readableId");

-- CreateIndex
CREATE INDEX "requests_status_idx" ON "requests"("status");

-- CreateIndex
CREATE INDEX "requests_requesterUserId_idx" ON "requests"("requesterUserId");

-- CreateIndex
CREATE INDEX "request_lines_requestId_idx" ON "request_lines"("requestId");

-- CreateIndex
CREATE INDEX "request_assignments_requestId_idx" ON "request_assignments"("requestId");

-- CreateIndex
CREATE INDEX "request_assignments_userId_idx" ON "request_assignments"("userId");

-- CreateIndex
CREATE INDEX "request_events_requestId_idx" ON "request_events"("requestId");
