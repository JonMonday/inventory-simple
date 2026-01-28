import { PrismaClient } from '@prisma/client';

/**
 * Adapter to resolve physical IDs or instances for logical names during seeding.
 */
export class SeedAdapter {
    constructor(private readonly prisma: PrismaClient) { }

    async getRoleByCode(code: string) {
        return await this.prisma.role.findUnique({ where: { code } });
    }

    async getStatusByCode(code: string) {
        return await this.prisma.requestStatus.findUnique({ where: { code } });
    }

    async getStageByCode(code: string) {
        return await this.prisma.requestStageType.findUnique({ where: { code } });
    }

    async getEventByCode(code: string) {
        return await this.prisma.requestEventType.findUnique({ where: { code } });
    }

    async getMoveTypeByCode(code: string) {
        return await this.prisma.ledgerMovementType.findUnique({ where: { code } });
    }

    async getItemByCode(code: string) {
        return await this.prisma.item.findUnique({ where: { code } });
    }

    async getStoreByCode(code: string) {
        return await this.prisma.storeLocation.findUnique({ where: { code } });
    }

    async getUnitByCode(code: string) {
        return await this.prisma.unit.findUnique({ where: { code } });
    }

    async getDepartmentByCode(code: string) {
        return await this.prisma.department.findUnique({ where: { code } });
    }

    async getUserByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async getAdminUser() {
        return await this.prisma.user.findFirst({
            where: { email: 'superadmin@gra.local' }
        });
    }
}
