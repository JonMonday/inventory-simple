"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScenarios = createScenarios;
const seed_helpers_1 = require("./seed.helpers");
async function createScenarios(prisma) {
    (0, seed_helpers_1.log)('SCENARIOS', 'Building operational workflow scenarios (S1-S8)...');
    const requester = await prisma.user.findUnique({ where: { email: 'it.requester@gra.local' } });
    const storekeeper = await prisma.user.findUnique({ where: { email: 'storekeeper@gra.local' } });
    const unitHead = await prisma.user.findUnique({ where: { email: 'unit_head@gra.local' } });
    const mainStore = await prisma.storeLocation.findUnique({ where: { code: 'HQ_MAIN' } });
    const itStore = await prisma.storeLocation.findUnique({ where: { code: 'HQ_IT' } });
    const statuses = await prisma.requestStatus.findMany();
    const getStatus = (c) => statuses.find(s => s.code === c);
    const eventTypes = await prisma.requestEventType.findMany();
    const getEvent = (c) => eventTypes.find(e => e.code === c);
    const moveTypes = await prisma.ledgerMovementType.findMany();
    const getMove = (c) => moveTypes.find(m => m.code === c);
    const pRoles = await prisma.participantRoleType.findMany();
    const getPRole = (c) => pRoles.find(r => r.code === c);
    const paper = await prisma.item.findUnique({ where: { code: 'SKU-A4_PAPER_REAM' } });
    const pen = await prisma.item.findUnique({ where: { code: 'SKU-BLUE_PEN' } });
    const mouse = await prisma.item.findUnique({ where: { code: 'SKU-WIRELESS_MOUSE' } });
    const template = await prisma.requestTemplate.findFirst({ where: { isDefault: true } });
    const standardReason = await prisma.reasonCode.upsert({ where: { code: 'NORMAL' }, update: {}, create: { code: 'NORMAL', name: 'Standard Flow' } });
    const s1 = await prisma.request.upsert({
        where: { readableId: 'S1-DRAFT-01' }, update: {},
        create: {
            readableId: 'S1-DRAFT-01', requesterUserId: requester.id, statusId: getStatus('DRAFT').id,
            departmentId: requester.departmentId, unitId: requester.unitId, templateId: template?.id,
            lines: { create: { itemId: paper.id, quantity: 10 } },
            events: { create: { eventTypeId: getEvent('CREATED').id, actedByUserId: requester.id } },
            participants: { create: { userId: requester.id, participantRoleTypeId: getPRole('REQUESTER').id } }
        }
    });
    const s2 = await prisma.request.upsert({
        where: { readableId: 'S2-REJECT-02' }, update: {},
        create: {
            readableId: 'S2-REJECT-02', requesterUserId: requester.id, statusId: getStatus('IN_FLOW').id,
            departmentId: requester.departmentId, unitId: requester.unitId, templateId: template?.id,
            lines: { create: { itemId: pen.id, quantity: 5 } },
            events: {
                createMany: {
                    data: [
                        { eventTypeId: getEvent('CREATED').id, actedByUserId: requester.id },
                        { eventTypeId: getEvent('SUBMITTED').id, actedByUserId: requester.id },
                        { eventTypeId: getEvent('REJECTED').id, actedByUserId: unitHead.id },
                        { eventTypeId: getEvent('UPDATED').id, actedByUserId: requester.id, metadata: 'Corrected quantity' },
                        { eventTypeId: getEvent('SUBMITTED').id, actedByUserId: requester.id },
                    ]
                }
            }
        }
    });
    const s3 = await prisma.request.upsert({
        where: { readableId: 'S3-EDITED-03' }, update: {},
        create: {
            readableId: 'S3-EDITED-03', requesterUserId: requester.id, statusId: getStatus('DRAFT').id,
            departmentId: requester.departmentId, unitId: requester.unitId, templateId: template?.id,
            lines: { create: { itemId: mouse.id, quantity: 1 } },
            events: {
                createMany: {
                    data: [
                        { eventTypeId: getEvent('CREATED').id, actedByUserId: requester.id },
                        { eventTypeId: getEvent('UPDATED').id, actedByUserId: requester.id, metadata: 'Quantity increased from 1 to 2' }
                    ]
                }
            }
        }
    });
    const s4 = await prisma.request.upsert({
        where: { readableId: 'S4-CANCEL-04' }, update: {},
        create: {
            readableId: 'S4-CANCEL-04', requesterUserId: requester.id, statusId: getStatus('CANCELLED').id,
            departmentId: requester.departmentId, unitId: requester.unitId, templateId: template?.id,
            events: { create: { eventTypeId: getEvent('CANCELLED').id, actedByUserId: requester.id } }
        }
    });
    const s5 = await prisma.request.upsert({
        where: { readableId: 'S5-RES-CANCEL-05' }, update: {},
        create: {
            readableId: 'S5-RES-CANCEL-05', requesterUserId: requester.id, statusId: getStatus('CANCELLED').id,
            departmentId: requester.departmentId, unitId: requester.unitId, templateId: template?.id,
            lines: { create: { itemId: mouse.id, quantity: 2 } },
            events: {
                createMany: {
                    data: [
                        { eventTypeId: getEvent('RESERVED').id, actedByUserId: storekeeper.id },
                        { eventTypeId: getEvent('CANCELLED').id, actedByUserId: requester.id, metadata: 'Stock Restored' }
                    ]
                }
            }
        }
    });
    const s6 = await prisma.request.upsert({
        where: { readableId: 'S6-ISSUE-06' }, update: {},
        create: {
            readableId: 'S6-ISSUE-06', requesterUserId: requester.id, statusId: getStatus('FULFILLED').id,
            departmentId: requester.departmentId, unitId: requester.unitId, templateId: template?.id,
            lines: { create: { itemId: paper.id, quantity: 5 } }
        }
    });
    await prisma.inventoryLedger.create({
        data: {
            itemId: paper.id, fromStoreLocationId: mainStore.id, movementTypeId: getMove('ISSUE').id,
            quantity: 5, unitOfMeasure: 'Each', reasonCodeId: standardReason.id, createdByUserId: storekeeper.id,
            referenceNo: 'S6-ISSUE-06'
        }
    });
    await prisma.stockSnapshot.update({
        where: { itemId_storeLocationId: { itemId: paper.id, storeLocationId: mainStore.id } },
        data: { quantityOnHand: { decrement: 5 } }
    });
    const s7 = await prisma.request.upsert({
        where: { readableId: 'S7-REASSIGN-07' }, update: {},
        create: {
            readableId: 'S7-REASSIGN-07', requesterUserId: requester.id, statusId: getStatus('IN_FLOW').id,
            departmentId: requester.departmentId, unitId: requester.unitId, templateId: template?.id,
            assignments: { create: { assignedToId: unitHead.id, status: 'ACTIVE' } }
        }
    });
    const s8 = await prisma.request.upsert({
        where: { readableId: 'S8-REVERSE-08' }, update: {},
        create: {
            readableId: 'S8-REVERSE-08', requesterUserId: requester.id, statusId: getStatus('CONFIRMED').id,
            departmentId: requester.departmentId, unitId: requester.unitId, templateId: template?.id,
        }
    });
    const l8Orig = await prisma.inventoryLedger.create({
        data: {
            itemId: paper.id, toStoreLocationId: mainStore.id, movementTypeId: getMove('RECEIVE').id,
            quantity: 100, unitOfMeasure: 'Each', reasonCodeId: standardReason.id, createdByUserId: storekeeper.id
        }
    });
    await prisma.inventoryLedger.create({
        data: {
            itemId: paper.id, fromStoreLocationId: mainStore.id, movementTypeId: getMove('REVERSE').id,
            quantity: 100, unitOfMeasure: 'Each', reasonCodeId: standardReason.id, createdByUserId: storekeeper.id,
            reversalOfLedgerId: l8Orig.id, comments: 'Mistaken entry'
        }
    });
    const scenarioCount = await prisma.request.count({ where: { readableId: { startsWith: 'S' } } });
    (0, seed_helpers_1.log)('SCENARIOS', `Built ${scenarioCount} operational scenarios.`);
    (0, seed_helpers_1.assert)(scenarioCount >= 7, 'Expected mandatory scenarios build failure');
}
//# sourceMappingURL=scenarios.js.map