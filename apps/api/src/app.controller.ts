import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/test-protected')
  @UseGuards(ClerkAuthGuard)
  async testProtected(@Req() req: any) {
    return { message: 'You are authenticated!', clerkUserId: req.auth.userId };
  }
}