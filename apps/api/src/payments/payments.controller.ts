import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('api/payments')
@UseGuards(ClerkAuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    // ⚠️ DEMO endpoint — instantly upgrades the logged-in user to PRO.
    //
    // `price`/`currency` are accepted here (from the frontend's region-based
    // pricing table — see lib/pricing.ts) so this endpoint's shape already
    // matches what a REAL integration will need later. For now they are
    // just accepted, not verified or charged.
    //
    // TODO before going live: replace the body of this method with a real
    // Razorpay/Stripe checkout — create an order using `price`/`currency`,
    // verify the payment signature/webhook the gateway sends back, and only
    // THEN call paymentsService.demoUpgradeToPro (or its real equivalent).
    // Never trust `price` from the client as the actual amount charged —
    // always use the amount the gateway confirms was paid.
    @Post('demo-checkout')
    async demoCheckout(
        @Req() req: any,
        @Body() body: { price?: number; currency?: string },
    ) {
        const user = await this.paymentsService.demoUpgradeToPro(req.auth.userId);
        return {
            success: true,
            subscriptionTier: user.subscriptionTier,
            // Echoed back for the frontend's confirmation UI — not the
            // source of truth once real payments are wired up.
            charged: { price: body.price, currency: body.currency },
        };
    }
}