import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('api/users')
@UseGuards(ClerkAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Returns the CURRENT logged-in user's own record (role, tier, etc).
    // Only ClerkAuthGuard here — NOT AdminGuard — because every logged-in
    // user needs this to know their own role (e.g. the frontend uses it to
    // decide whether to show the "Admin" link in the sidebar).
    @Get('me')
    getMe(@Req() req: any) {
        return this.usersService.getMe(req.auth.userId);
    }
}