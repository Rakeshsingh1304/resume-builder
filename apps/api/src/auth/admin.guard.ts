import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const clerkId = request.auth?.userId;

        const user = await this.prisma.user.findUnique({ where: { clerkId } });
        if (!user || user.role !== 'ADMIN') {
            throw new ForbiddenException('Admin access required');
        }

        return true;
    }
}