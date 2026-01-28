import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationService {
    constructor(private prisma: PrismaService) { }

    async reserve(data: any) {
        throw new Error('Using RequestWorkflowService for reservations in this version.');
    }

    async release(data: any) {
        throw new Error('Using workflow cancellation for release.');
    }
}
