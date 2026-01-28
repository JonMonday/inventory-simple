"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors();
    const swaggerEnabled = process.env.SWAGGER_ENABLED !== 'false';
    if (swaggerEnabled) {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('GRA Inventory API')
            .setDescription('Gambia Revenue Authority Inventory Management System API')
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        }, 'JWT-auth')
            .addTag('requests', 'Staff requisition requests')
            .addTag('inventory', 'Inventory operations (receive, issue, transfer, adjust)')
            .addTag('ledger', 'Inventory ledger and movement tracking')
            .addTag('stocktakes', 'Physical inventory audits')
            .addTag('reports', 'Reporting and analytics')
            .addTag('lookups', 'System lookup tables and constants')
            .addTag('org', 'Organization structure (branches, departments, units, roles, locations)')
            .addTag('rbac', 'Role-based access control (users, roles, permissions)')
            .addTag('catalog', 'Item catalog (items, categories, reason codes)')
            .addTag('templates', 'Workflow templates')
            .addTag('auth', 'Authentication and authorization')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        document.security = [{ 'JWT-auth': [] }];
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
        app.getHttpAdapter().get('/docs-json', (req, res) => {
            res.json(document);
        });
        console.log('📚 Swagger UI enabled at /docs');
        console.log('📄 OpenAPI JSON available at /docs-json');
        console.log('🔐 Bearer Auth configured - use "Authorize" button with JWT token');
    }
    else {
        console.log('📚 Swagger UI disabled (set SWAGGER_ENABLED=true to enable)');
    }
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map