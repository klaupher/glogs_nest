import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonConfig } from './configs/winston.config';
import { WinstonModule } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const logger = WinstonModule.createLogger(winstonConfig);
    const app = await NestFactory.create(AppModule, { logger });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            // whitelist: true,
        }),
    );
    const portRunning = process.env.PORT ?? 3005;
    await app.listen(portRunning);
    console.log(`Server running in localhost:${portRunning}`);
}
bootstrap();
