import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { winstonConfig } from './configs/winston.config';
import { WinstonModule } from 'nest-winston';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './configs/mailer.config';
import { LogsModule } from './logs/logs.module';
import { typeOrmConfig } from './configs/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // opcional, mas útil
        }),
        TypeOrmModule.forRootAsync({
            useFactory: typeOrmConfig,
        }),
        WinstonModule.forRoot(winstonConfig),
        MailerModule.forRoot(mailerConfig),
        UsersModule,
        AuthModule,
        LogsModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggerInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {}
