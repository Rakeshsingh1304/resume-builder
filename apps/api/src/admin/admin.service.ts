import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getOverview() {
        const totalUsers = await this.prisma.user.count();
        const proUsers = await this.prisma.user.count({ where: { subscriptionTier: 'PRO' } });
        const totalResumes = await this.prisma.resume.count();
        const totalCoverLetters = await this.prisma.coverLetter.count();

        return { totalUsers, proUsers, totalResumes, totalCoverLetters };
    }

    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                subscriptionTier: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateUserTier(userId: string, tier: 'FREE' | 'PRO') {
        return this.prisma.user.update({
            where: { id: userId },
            data: { subscriptionTier: tier },
        });
    }
}