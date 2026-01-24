"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const reservation_service_1 = require("./reservation.service");
const inventory_controller_1 = require("./inventory.controller");
const ledger_controller_1 = require("./ledger.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [inventory_service_1.InventoryService, reservation_service_1.ReservationService],
        controllers: [inventory_controller_1.InventoryController, ledger_controller_1.LedgerController],
        exports: [inventory_service_1.InventoryService, reservation_service_1.ReservationService],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map