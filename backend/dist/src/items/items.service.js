"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ItemsService = class ItemsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        return this.prisma.item.findMany({
            where: {
                ...(filters?.categoryId && { categoryId: filters.categoryId }),
                ...(filters?.status && { status: filters.status }),
                ...(filters?.search && {
                    OR: [
                        { code: { contains: filters.search } },
                        { name: { contains: filters.search } },
                        { description: { contains: filters.search } },
                    ],
                }),
            },
            include: {
                category: true,
            },
            orderBy: {
                code: 'asc',
            },
        });
    }
    async findOne(id) {
        return this.prisma.item.findUnique({
            where: { id },
            include: {
                category: true,
                stockSnapshots: {
                    include: {
                        location: true,
                    },
                },
            },
        });
    }
    async create(data) {
        return this.prisma.item.create({
            data: {
                ...data,
                status: 'ACTIVE',
            },
            include: {
                category: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.item.update({
            where: { id },
            data,
            include: {
                category: true,
            },
        });
    }
    async delete(id) {
        return this.prisma.item.update({
            where: { id },
            data: { status: 'DISCONTINUED' },
        });
    }
    async getStockLevels(itemId) {
        return this.prisma.stockSnapshot.findMany({
            where: { itemId },
            include: {
                location: true,
            },
        });
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ItemsService);
//# sourceMappingURL=items.service.js.map