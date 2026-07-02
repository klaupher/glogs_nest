import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'super-secret',
        });
    }

    async validate(payload: { id: number }) {
        const { id } = payload;
        const user = await User.findOne({
            where: { id: String(id) },
            select: {
                email: true,
                name: true,
                role: true,
                id: true,
                status: true,
            },
        });
        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado');
        }

        return user;
    }
}
