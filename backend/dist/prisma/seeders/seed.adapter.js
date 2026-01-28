"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedAdapter = void 0;
class SeedAdapter {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRoleByCode(code) {
        return await this.prisma.role.findUnique({ where: { code } });
    }
    async getStatusByCode(code) {
        return await this.prisma.requestStatus.findUnique({ where: { code } });
    }
    async getStageByCode(code) {
        return await this.prisma.requestStageType.findUnique({ where: { code } });
    }
    async getEventByCode(code) {
        return await this.prisma.requestEventType.findUnique({ where: { code } });
    }
    async getMoveTypeByCode(code) {
        return await this.prisma.ledgerMovementType.findUnique({ where: { code } });
    }
    async getItemByCode(code) {
        return await this.prisma.item.findUnique({ where: { code } });
    }
    async getStoreByCode(code) {
        return await this.prisma.storeLocation.findUnique({ where: { code } });
    }
    async getUnitByCode(code) {
        return await this.prisma.unit.findUnique({ where: { code } });
    }
    async getDepartmentByCode(code) {
        return await this.prisma.department.findUnique({ where: { code } });
    }
    async getUserByEmail(email) {
        return await this.prisma.user.findUnique({ where: { email } });
    }
    async getAdminUser() {
        return await this.prisma.user.findFirst({
            where: { email: 'superadmin@gra.local' }
        });
    }
}
exports.SeedAdapter = SeedAdapter;
//# sourceMappingURL=seed.adapter.js.map