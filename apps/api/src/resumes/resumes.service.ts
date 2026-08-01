import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Injectable()
export class ResumesService {
    constructor(private prisma: PrismaService) { }

    // Helper: Clerk ID se humara internal User record dhundo
    private async getInternalUser(clerkId: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId } });
        if (!user) throw new NotFoundException('User not found in database');
        return user;
    }

    async create(clerkId: string, dto: CreateResumeDto) {
        const user = await this.getInternalUser(clerkId);
        return this.prisma.resume.create({
            data: {
                userId: user.id,
                title: dto.title,
                content: {},
            },
        });
    }

    async findAll(clerkId: string) {
        const user = await this.getInternalUser(clerkId);
        return this.prisma.resume.findMany({
            where: { userId: user.id, deletedAt: null },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async findOne(clerkId: string, id: string) {
        const user = await this.getInternalUser(clerkId);
        const resume = await this.prisma.resume.findFirst({
            where: { id, userId: user.id, deletedAt: null },
        });
        if (!resume) throw new NotFoundException('Resume not found');
        return resume;
    }

    async update(clerkId: string, id: string, dto: UpdateResumeDto) {
        await this.findOne(clerkId, id); // ownership check bhi ho jaata hai isse
        return this.prisma.resume.update({
            where: { id },
            data: dto,
        });
    }

    async remove(clerkId: string, id: string) {
        await this.findOne(clerkId, id);
        return this.prisma.resume.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}