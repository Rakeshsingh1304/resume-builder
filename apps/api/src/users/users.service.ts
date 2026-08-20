import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getMe(clerkId: string) {
        const user = await this.prisma.user.findUnique({
            where: { clerkId },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                subscriptionTier: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}
