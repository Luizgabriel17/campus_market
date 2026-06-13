"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const fs_1 = require("fs");
const app_module_1 = require("./app.module");
const prisma_exception_filters_1 = require("./common/filters/prisma-exception.filters");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    const uploadsPath = (0, path_1.join)(__dirname, '..', 'uploads');
    if (!(0, fs_1.existsSync)(uploadsPath)) {
        (0, fs_1.mkdirSync)(uploadsPath, { recursive: true });
    }
    app.useStaticAssets(uploadsPath, {
        prefix: '/uploads',
        maxAge: '1d',
        index: false,
    });
    app.enableCors({
        origin: [
            'http://localhost:4200',
            'http://127.0.0.1:4200',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new prisma_exception_filters_1.PrismaExceptionFilter());
    const port = Number(process.env.PORT || 3001);
    await app.listen(port, '0.0.0.0');
    logger.log(`Campus Market API rodando em http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map