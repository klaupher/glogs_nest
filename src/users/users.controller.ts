import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ReturnUserDto } from './dtos/return-user.dto';
import { Role } from '../auth/role.decorator';
import { UserRole } from './enums/UserRole.enum';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { FindUsersQueryDto } from './dtos/find-users-query.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { type AuthenticatedRequest } from '../auth/types/authenticated-request';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Role(UserRole.ADMIN)
    async findUsers(@Query() query: FindUsersQueryDto) {
        const found = await this.usersService.findUsers(query);
        return {
            found,
            message: 'Usuários encontrados',
        };
    }

    @Get(':id')
    @Role(UserRole.ADMIN)
    async findUserById(@Param('id') id: string): Promise<ReturnUserDto> {
        const user = await this.usersService.findUserById(id);
        return {
            user,
            message: 'Usuário encontrado',
        };
    }

    @Post()
    @Role(UserRole.ADMIN)
    async createAdminUser(
        @Body(ValidationPipe) createUserDto: CreateUserDto,
    ): Promise<ReturnUserDto> {
        const user = await this.usersService.createAdminUser(createUserDto);
        return {
            user,
            message: 'Administrador cadastrado com sucesso',
        };
    }

    @Patch(':id')
    async updateUser(
        @Body(ValidationPipe) updateUserDto: UpdateUserDto,
        @Req() req: AuthenticatedRequest,
        @Param('id') id: string,
    ) {
        const user = req.user;
        if (user.role != UserRole.ADMIN && user!.id!.toString() != id) {
            throw new ForbiddenException(
                'Você não tem autorização para acessar esse recurso',
            );
        } else {
            return this.usersService.updateUser(updateUserDto, id);
        }
    }

    @Delete(':id')
    async removeUser(
        @Param('id') id: string,
        @Req() req: AuthenticatedRequest,
    ): Promise<ReturnUserDto> {
        if (req.user.role != UserRole.ADMIN && req.user!.id!.toString() != id) {
            throw new ForbiddenException(
                'Você não tem autorização para acessar esse recurso',
            );
        }
        const user = await this.usersService.removeUser(id);
        return {
            user,
            message: 'Usuário excluído com sucesso',
        };
    }
}
