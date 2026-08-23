import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('api/payments')
@UseGuards(ClerkAuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    // ⚠️ DEMO endpoint — instantly upgrades the logged-in user to PRO.
    // TODO: before going live, replace this with a real Razorpay/Stripe
    // checkout flow + webhook/signature verification (see PaymentsService).
    @Post('demo-checkout')
    async demoCheckout(@Req() req: any) {
        const user = await this.paymentsService.demoUpgradeToPro(req.auth.userId);
        return { success: true, subscriptionTier: user.subscriptionTier };
    }
}