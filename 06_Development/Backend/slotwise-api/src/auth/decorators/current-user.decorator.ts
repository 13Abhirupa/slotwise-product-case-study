import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  fullName: string;
  businessId: string;
  membershipId: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    return data ? user?.[data] : user;
  },
);
