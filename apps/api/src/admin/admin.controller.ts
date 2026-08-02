import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/admin')
@UseGuards(ClerkAuthGuard, AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('overview')
    getOverview() {
        return this.adminService.getOverview();
    }

    @Get('users')
    getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @Patch('users/:id/tier')
    updateUserTier(@Param('id') id: string, @Body('tier') tier: 'FREE' | 'PRO') {
        return this.adminService.updateUserTier(id, tier);
    }
}