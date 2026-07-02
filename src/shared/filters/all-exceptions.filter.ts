import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
    catch(exception: unknown, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();
        const isHttpException = exception instanceof HttpException;
        const isForbiddenException = exception instanceof ForbiddenException;

        const status = isHttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const defaultMessage = 'Erro interno inesperado';
        const defaultError = 'Internal Server Error';
        let messages: string[] = [defaultMessage];
        let errorName = defaultError;

        if (isHttpException) {
            const responseData = exception.getResponse();
            if (typeof responseData === 'string') {
                messages = [responseData];
            }
            if (typeof responseData === 'object' && responseData !== null) {
                const { message, error } = responseData as Record<string, any>;
                if (Array.isArray(message)) {
                    messages = message as string[];
                } else if (typeof message === 'string') {
                    messages = [
                        isForbiddenException
                            ? 'Você não tem autorização para acessar esse recurso'
                            : message,
                    ];
                }
                if (typeof error === 'string') {
                    errorName = error;
                }
            }
        }

        if (!(exception instanceof HttpException)) {
            this.logger.error(
                `Erro interno inesperado`,
                (exception as Error).stack || 'sem stack',
            );
        } else {
            this.logger.warn(
                `${status} - ${errorName}: ${messages.join(' | ')}`,
            );
        }

        return response.status(status).json({
            message: messages,
            error: errorName,
            statusCode: status,
        });
    }
}
