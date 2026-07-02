import { createParamDecorator } from '@nestjs/common';
import { User } from '../users/user.entity';

export const GetUser = createParamDecorator((req) => {
    console.log('User Decorator', req?.user);
    const user = req?.user;
    return user;
});
