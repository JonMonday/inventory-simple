"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedStatic = seedStatic;
const seed_helpers_1 = require("./seed.helpers");
async function seedStatic(prisma) {
    (0, seed_helpers_1.log)('STATIC', 'Starting system foundation seed...');
    (0, seed_helpers_1.log)('STATIC', 'Seeding permissions from shared JSON...');
    const fs = require('fs');
    const path = require('path');
    const permissionsPath = path.join(__dirname, '../../../shared/permissions.json');
    const permsData = JSON.parse(fs.readFileSync(permissionsPath, 'utf8'));
    if (!permsData.permissions)
        throw new Error('Invalid permissions.json structure');
    const pRecords = {};
    const permissions = [];
    for (const pDef of permsData.permissions) {
        const { key, label, group } = pDef;
        const p = await prisma.permission.upsert({
            where: { key },
            update: { label, group },
            create: { key, label, group },
        });
        pRecords[key] = p.id;
        permissions.push(key);
    }
    (0, seed_helpers_1.log)('STATIC', 'Seeding system roles...');
    const roles = [
        { code: 'super_admin', name: 'Super Administrator', perms: permissions },
        { code: 'org_admin', name: 'Organization Admin', perms: ['users.read', 'users.create', 'users.update', 'users.roles', 'roles.read', 'permissions.read', 'branches.read', 'departments.read', 'units.read', 'jobRoles.read'] },
        { code: 'inventory_admin', name: 'Inventory Admin', perms: ['stock.read', 'items.read', 'items.create', 'items.update', 'categories.read', 'reasonCodes.read', 'inventory.receive', 'inventory.return', 'inventory.transfer', 'inventory.adjust', 'ledger.read', 'reservations.read', 'lookups.read', 'stocktake.read', 'stocktake.create', 'reports.view'] },
        { code: 'storekeeper', name: 'Storekeeper', perms: ['requests.read', 'requests.reserve', 'requests.issue', 'stock.read', 'ledger.read', 'reservations.read', 'comments.read', 'comments.create'] },
        { code: 'procurement_officer', name: 'Procurement Officer', perms: ['requests.read', 'requests.approve', 'requests.reject', 'comments.read', 'comments.create', 'reports.view'] },
        { code: 'unit_head', name: 'Unit Head', perms: ['requests.read', 'requests.approve', 'requests.reject', 'requests.reassign', 'requests.cancel', 'comments.read', 'comments.create'] },
        { code: 'requester', name: 'Staff Requester', perms: ['requests.create', 'requests.read', 'requests.update', 'requests.submit', 'requests.cancel', 'requests.confirm', 'requests.lines.manage', 'comments.read', 'comments.create', 'stock.read'] },
        { code: 'auditor', name: 'Internal Auditor', perms: ['requests.read', 'ledger.read', 'reports.view', 'stock.read', 'reservations.read', 'comments.read'] },
    ];
    for (const r of roles) {
        (0, seed_helpers_1.log)('STATIC', `   -> Seeding role: ${r.code}`);
        const roleRecord = await prisma.role.upsert({
            where: { code: r.code },
            update: { name: r.name, isSystemRole: true },
            create: { code: r.code, name: r.name, isSystemRole: true },
        });
        for (const p of r.perms) {
            if (pRecords[p]) {
                await prisma.rolePermission.upsert({
                    where: { roleId_permissionId: { roleId: roleRecord.id, permissionId: pRecords[p] } },
                    update: {},
                    create: { roleId: roleRecord.id, permissionId: pRecords[p] },
                });
            }
        }
    }
    (0, seed_helpers_1.log)('STATIC', 'Seeding workflow metadata...');
    const statuses = [
        { code: 'DRAFT', label: 'Draft', isEditable: true, isTerminal: false, sortOrder: 1 },
        { code: 'IN_FLOW', label: 'In Flow', isEditable: false, isTerminal: false, sortOrder: 2 },
        { code: 'REJECTED', label: 'Rejected', isEditable: true, isTerminal: false, sortOrder: 3 },
        { code: 'CANCELLED', label: 'Cancelled', isEditable: false, isTerminal: true, sortOrder: 4 },
        { code: 'CONFIRMED', label: 'Confirmed', isEditable: false, isTerminal: true, sortOrder: 5 },
        { code: 'FULFILLED', label: 'Fulfilled', isEditable: false, isTerminal: false, sortOrder: 6 },
    ];
    for (const s of statuses)
        await (0, seed_helpers_1.upsertByCode)(prisma.requestStatus, s.code, s);
    const stages = [
        { code: 'UNIT_REVIEW', label: 'Unit Review', sortOrder: 1 },
        { code: 'UNIT_APPROVAL', label: 'Unit Approval', sortOrder: 2 },
        { code: 'PROC_REVIEW', label: 'Procurement Review', sortOrder: 3 },
        { code: 'PROC_APPROVAL', label: 'Procurement Approval', sortOrder: 4 },
        { code: 'FULFILLMENT', label: 'Fulfillment', sortOrder: 5 },
        { code: 'CONFIRMATION', label: 'Confirmation', sortOrder: 6 },
    ];
    for (const st of stages)
        await (0, seed_helpers_1.upsertByCode)(prisma.requestStageType, st.code, st);
    const eventTypes = [
        'CREATED', 'SUBMITTED', 'RESUBMITTED', 'REVIEWED', 'APPROVED',
        'REJECTED', 'CANCELLED', 'REASSIGNED', 'RESERVED', 'ISSUED',
        'RESERVATION_FAILED', 'CONFIRMED', 'COMMENT_ADDED', 'UPDATED'
    ];
    for (const et of eventTypes)
        await (0, seed_helpers_1.upsertByCode)(prisma.requestEventType, et, { label: et.replace(/_/g, ' ') });
    const moveTypes = ['RECEIVE', 'RETURN', 'TRANSFER', 'ADJUST', 'ISSUE', 'REVERSE'];
    for (const mt of moveTypes)
        await (0, seed_helpers_1.upsertByCode)(prisma.ledgerMovementType, mt, { label: mt.charAt(0) + mt.slice(1).toLowerCase() });
    const itemStats = ['ACTIVE', 'INACTIVE', 'DISCONTINUED'];
    for (const is of itemStats)
        await (0, seed_helpers_1.upsertByCode)(prisma.itemStatus, is, { label: is.charAt(0) + is.slice(1).toLowerCase() });
    const commentTypes = [
        'GENERAL', 'REJECTION_COMMENT', 'APPROVAL_NOTE', 'REVIEW_NOTE',
        'CANCELLATION_COMMENT', 'SYSTEM_NOTE'
    ];
    for (const ct of commentTypes)
        await (0, seed_helpers_1.upsertByCode)(prisma.commentType, ct, { label: ct.replace(/_/g, ' ') });
    const participantRoles = ['REQUESTER', 'REVIEWER', 'APPROVER', 'STOREKEEPER', 'ADMIN'];
    for (const pr of participantRoles)
        await (0, seed_helpers_1.upsertByCode)(prisma.participantRoleType, pr, { label: pr.charAt(0) + pr.slice(1).toLowerCase() });
    const stakeStats = ['DRAFT', 'STARTED', 'SUBMITTED', 'APPROVED', 'APPLIED', 'CANCELLED'];
    for (const ss of stakeStats)
        await (0, seed_helpers_1.upsertByCode)(prisma.stocktakeStatus, ss, { label: ss.charAt(0) + ss.slice(1).toLowerCase(), sortOrder: stakeStats.indexOf(ss) + 1 });
    (0, seed_helpers_1.log)('STATIC', 'Seeding system user and default template...');
    const systemEmail = 'system@gra.local';
    let branch = await prisma.branch.findFirst();
    if (!branch)
        branch = await (0, seed_helpers_1.upsertByCode)(prisma.branch, 'SYS', { name: 'System Entities' });
    let dept = await prisma.department.findFirst();
    if (!dept)
        dept = await (0, seed_helpers_1.upsertByCode)(prisma.department, 'SYS', { name: 'System Operations', branchId: branch.id });
    let unit = await prisma.unit.findFirst();
    if (!unit)
        unit = await (0, seed_helpers_1.upsertByCode)(prisma.unit, 'SYS_UNIT', { name: 'System Unit', departmentId: dept.id });
    let jobRole = await prisma.jobRole.findFirst();
    if (!jobRole)
        jobRole = await (0, seed_helpers_1.upsertByCode)(prisma.jobRole, 'SYS_ROLE', { name: 'System Service', unitId: unit.id });
    const bcrypt = require('bcrypt');
    const systemPasswordHash = await bcrypt.hash('password123', 10);
    const systemUser = await prisma.user.upsert({
        where: { email: systemEmail },
        update: {
            isActive: true,
            passwordHash: systemPasswordHash,
            mustChangePassword: false,
        },
        create: {
            email: systemEmail,
            fullName: 'System Engine',
            passwordHash: systemPasswordHash,
            isActive: true,
            mustChangePassword: false,
            branchId: branch.id,
            departmentId: dept.id,
            unitId: unit.id,
            jobRoleId: jobRole.id,
        }
    });
    const template = await prisma.requestTemplate.upsert({
        where: { id: 'default-request-template-static' },
        update: { name: 'Standard GRA Request Template', isDefault: true },
        create: {
            id: 'default-request-template-static', name: 'Standard GRA Request Template',
            description: 'The standard 6-stage relay workflow for all office supply requests.',
            isDefault: true, createdById: systemUser.id
        }
    });
    const stdSteps = [
        { code: 'UNIT_REVIEW', role: 'unit_head', mode: 'AUTO_POOL' },
        { code: 'UNIT_APPROVAL', role: 'unit_head', mode: 'AUTO_POOL' },
        { code: 'PROC_REVIEW', role: 'procurement_officer', mode: 'AUTO_POOL' },
        { code: 'PROC_APPROVAL', role: 'procurement_officer', mode: 'AUTO_POOL' },
        { code: 'FULFILLMENT', role: 'storekeeper', mode: 'AUTO_POOL' },
        { code: 'CONFIRMATION', role: 'requester', mode: 'AUTO_POOL' },
    ];
    for (let i = 0; i < stdSteps.length; i++) {
        const s = stdSteps[i];
        const stageType = (await prisma.requestStageType.findUnique({ where: { code: s.code } }));
        await prisma.templateWorkflowStep.upsert({
            where: { templateId_stepOrder: { templateId: template.id, stepOrder: i + 1 } },
            update: { stageTypeId: stageType.id, assignmentMode: s.mode, roleKey: s.role },
            create: {
                templateId: template.id, stageTypeId: stageType.id, stepOrder: i + 1,
                isRequired: true, assignmentMode: s.mode, roleKey: s.role
            }
        });
    }
    const dtTemplate = await prisma.requestTemplate.upsert({
        where: { id: 'dt-assessment-template' },
        update: { name: 'Internal Requisition (Desktop/Tablet)', isDefault: false },
        create: {
            id: 'dt-assessment-template', name: 'Internal Requisition (Desktop/Tablet)',
            description: 'Specialized workflow for IT equipment assessment.',
            isDefault: false, createdById: systemUser.id
        }
    });
    const dtStepsData = [
        { code: 'UNIT_REVIEW', role: 'unit_head', mode: 'AUTO_POOL' },
        { code: 'UNIT_APPROVAL', role: 'unit_head', mode: 'MANUAL_FROM_POOL' },
        { code: 'PROC_REVIEW', role: 'procurement_officer', mode: 'AUTO_POOL' },
        { code: 'FULFILLMENT', role: 'storekeeper', mode: 'AUTO_POOL' },
        { code: 'CONFIRMATION', role: 'requester', mode: 'AUTO_POOL' },
    ];
    for (let i = 0; i < dtStepsData.length; i++) {
        const s = dtStepsData[i];
        const stageType = (await prisma.requestStageType.findUnique({ where: { code: s.code } }));
        await prisma.templateWorkflowStep.upsert({
            where: { templateId_stepOrder: { templateId: dtTemplate.id, stepOrder: i + 1 } },
            update: { stageTypeId: stageType.id, assignmentMode: s.mode, roleKey: s.role },
            create: {
                templateId: dtTemplate.id, stageTypeId: stageType.id, stepOrder: i + 1,
                isRequired: true, assignmentMode: s.mode, roleKey: s.role
            }
        });
    }
    (0, seed_helpers_1.log)('STATIC', 'Finalizing static validation...');
    (0, seed_helpers_1.assert)(await prisma.requestTemplate.count({ where: { id: 'default-request-template-static' } }) === 1, 'Default template missing');
    (0, seed_helpers_1.assert)(await prisma.templateWorkflowStep.count({ where: { templateId: template.id } }) === 6, 'Template steps count mismatch');
    (0, seed_helpers_1.log)('STATIC', 'System foundation seeded successfully.');
}
//# sourceMappingURL=static.seeder.js.map