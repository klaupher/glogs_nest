import {
    Controller,
    Post,
    Body,
    ValidationPipe,
    Patch,
    Param,
    UseGuards,
    UnauthorizedException,
    Get,
    Req,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UserRole } from '../users/enums/UserRole.enum';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { CredentialsDto } from './dtos/credentials.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { type AuthenticatedRequest } from './types/authenticated-request';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signup')
    async signUp(
        @Body(ValidationPipe) createUserDto: CreateUserDto,
    ): Promise<{ message: string; user: User }> {
        const user = await this.authService.signUp(createUserDto);
        return {
            message: 'Cadastro realizado com sucesso',
            user,
        };
    }

    @Post('/signin')
    async signIn(
        @Body(ValidationPipe) credentiaslsDto: CredentialsDto,
    ): Promise<{ token: string }> {
        return await this.authService.signIn(credentiaslsDto);
    }

    @Patch(':token')
    async confirmEmail(@Param('token') token: string) {
        await this.authService.confirmEmail(token);
        return {
            message: 'Email confirmado',
        };
    }

    @Post('/send-recover-email')
    async sendRecoverPasswordEmail(
        @Body('email') email: string,
    ): Promise<{ message: string }> {
        await this.authService.sendRecoverPasswordEmail(email);
        return {
            message: 'Enviamos um email com instruções para resetar sua senha',
        };
    }

    @Patch('/reset-password/:token')
    async resetPassword(
        @Param('token') token: string,
        @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    ): Promise<{ message: string }> {
        await this.authService.resetPassword(token, changePasswordDto);

        return {
            message: 'Senha alterada com sucesso',
        };
    }

    @Patch(':id/change-password')
    @UseGuards(JwtAuthGuard)
    async changePassword(
        @Param('id') id: string,
        @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
        @Req() req: AuthenticatedRequest,
    ) {
        const user = req.user;
        if (user.role !== UserRole.ADMIN && user!.id!.toString() !== id)
            throw new UnauthorizedException(
                'Você não tem permissão para realizar esta operação',
            );

        await this.authService.changePassword(id, changePasswordDto);
        return {
            message: 'Senha alterada',
        };
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    getMe(@Req() req: AuthenticatedRequest): User {
        return req.user;
    }
}
