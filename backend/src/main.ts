import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors();

  // Swagger UI - enabled by default in dev, disabled in production
  const swaggerEnabled = process.env.SWAGGER_ENABLED !== 'false';

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('GRA Inventory API')
      .setDescription('Gambia Revenue Authority Inventory Management System API')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
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

    const document = SwaggerModule.createDocument(app, config);

    // Apply global security to all endpoints by default
    document.security = [{ 'JWT-auth': [] }];

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true, // Persist auth between page refreshes
      },
    });

    // Expose OpenAPI JSON at /docs-json
    app.getHttpAdapter().get('/docs-json', (req, res) => {
      res.json(document);
    });

    console.log('📚 Swagger UI enabled at /docs');
    console.log('📄 OpenAPI JSON available at /docs-json');
    console.log('🔐 Bearer Auth configured - use "Authorize" button with JWT token');
  } else {
    console.log('📚 Swagger UI disabled (set SWAGGER_ENABLED=true to enable)');
  }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
