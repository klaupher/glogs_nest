/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from 'winston';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(@Inject('winston') private readonly logger: Logger) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        this.log(context.switchToHttp().getRequest());
        return next.handle();
    }

    private log(req: any) {
        const requestBody =
            req.body && typeof req.body === 'object' ? req.body : {};
        const { password, passwordConfirmation, ...body } = requestBody;
        const user = req.user;
        const userEmail = user ? user.email : null;

        this.logger.info({
            timestamp: new Date().toISOString(),
            method: req.method,
            route: req.route?.path ?? req.path,
            data: {
                body,
                query: req.query ?? {},
                params: req.params ?? {},
            },
            from: req.ip,
            madeBy: userEmail,
        });
    }
}
