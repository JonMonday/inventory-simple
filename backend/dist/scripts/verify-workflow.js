"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const requests_service_1 = require("../src/requests/requests.service");
const request_workflow_service_1 = require("../src/requests/request-workflow.service");
const prisma_service_1 = require("../src/prisma/prisma.service");
const organization_service_1 = require("../src/organization/organization.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const prisma = app.get(prisma_service_1.PrismaService);
    const requestsService = app.get(requests_service_1.RequestsService);
    const workflowService = app.get(request_workflow_service_1.RequestWorkflowService);
    const orgService = app.get(organization_service_1.OrganizationService);
    console.log('🚀 Starting Workflow Verification...');
    const users = await prisma.user.findMany({ include: { jobRole: true } });
    const getUserByEmail = (email) => users.find(u => u.email === email);
    const requester = getUserByEmail('req.dt@gra.gm');
    const reviewer = getUserByEmail('rev.dt@gra.gm');
    const approver = getUserByEmail('apr.dt@gra.gm');
    const procReviewer = getUserByEmail('proc.rev@gra.gm');
    const procApprover = getUserByEmail('proc.apr@gra.gm');
    const storekeeper = getUserByEmail('store.main@gra.gm');
    if (!requester || !reviewer || !approver || !procReviewer || !procApprover || !storekeeper) {
        throw new Error('❌ Missing seed users! Run seed first.');
    }
    console.log('✅ Users found');
    const item = await prisma.item.findUnique({ where: { code: 'MED-001' } });
    if (!item)
        throw new Error('Item not found');
    console.log('📝 Creating request...');
    const template = await prisma.requestTemplate.findFirst({ where: { isDefault: true } });
    console.log(`Found template: ${template?.id} (${template?.name})`);
    const request = await requestsService.create(requester.id, {
        lines: [{ itemId: item.id, quantity: 10 }],
        templateId: template?.id
    });
    console.log(`✅ Request created: ${request.readableId} (${request.status.code})`);
    console.log('📤 Submitting request...');
    await workflowService.submit(request.id, requester.id);
    let updated = await requestsService.findOne(request.id);
    console.log(`✅ Submitted -> Status: ${updated.status.code}, Stage: ${updated.currentStageType?.code}`);
    console.log(`   Assigned To: ${updated.assignments[0]?.assignedTo?.fullName}`);
    console.log('👁️ Unit Reviewing...');
    await workflowService.approve(request.id, reviewer.id, 'Looks good to me.');
    updated = await requestsService.findOne(request.id);
    console.log(`✅ Reviewed -> Stage: ${updated.currentStageType?.code}`);
    console.log(`   Assigned To: ${updated.assignments[0]?.assignedTo?.fullName}`);
    console.log('👍 Unit Approving...');
    await workflowService.approve(request.id, approver.id, 'Approved by unit head.');
    updated = await requestsService.findOne(request.id);
    console.log(`✅ Unit Approved -> Stage: ${updated.currentStageType?.code}`);
    console.log(`   Assigned To: ${updated.assignments[0]?.assignedTo?.fullName}`);
    console.log('👁️ Procurement Reviewing...');
    await workflowService.approve(request.id, procReviewer.id, 'Procurement reviewed.');
    updated = await requestsService.findOne(request.id);
    console.log(`✅ Proc Reviewed -> Stage: ${updated.currentStageType?.code}`);
    console.log('👍 Procurement Approving...');
    await workflowService.approve(request.id, procApprover.id, 'Procurement approved. Proceed to issue.');
    updated = await requestsService.findOne(request.id);
    console.log(`✅ Proc Approved -> Stage: ${updated.currentStageType?.code}`);
    console.log(`   Assigned To: ${updated.assignments[0]?.assignedTo?.fullName}`);
    console.log('🔒 Reserving Stock...');
    const store = (await orgService.getStoreLocations())[0];
    await prisma.request.update({ where: { id: request.id }, data: { issueFromStoreId: store.id } });
    await workflowService.reserve(request.id, storekeeper.id);
    console.log('✅ Stock Reserved');
    console.log('📦 Issuing Stock...');
    await workflowService.issue(request.id, storekeeper.id);
    updated = await requestsService.findOne(request.id);
    console.log(`✅ Stock Issued -> Stage: ${updated.currentStageType?.code}`);
    console.log(`   Assigned To: ${updated.assignments[0]?.assignedTo?.fullName}`);
    console.log('✅ Confirming Receipt...');
    await workflowService.confirm(request.id, requester.id, 'Received, thanks!');
    updated = await requestsService.findOne(request.id);
    console.log(`🎉 Request Complete -> Status: ${updated.status.code}`);
    await app.close();
}
bootstrap().catch(err => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=verify-workflow.js.map