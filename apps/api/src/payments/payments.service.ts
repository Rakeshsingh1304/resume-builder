import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

    /**
     * ⚠️ DEMO CHECKOUT ONLY.
     *
     * This is a placeholder for a real payment gateway (Razorpay/Stripe).
     * Right now it just marks the user as PRO immediately — no real money
     * changes hands.
     *
     * When you're ready to go live, replace the body of this method with:
     *   1. Create an order with the payment gateway (Razorpay/Stripe SDK)
     *   2. Verify the payment signature sent back from the gateway
     *   3. Only THEN update subscriptionTier to 'PRO'
     * Everywhere else in the app (frontend, this module's controller)
     * should NOT need to change — they just call this service.
     */
    async demoUpgradeToPro(clerkId: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId } });
        if (!user) throw new NotFoundException('User not found');

        return this.prisma.user.update({
            where: { clerkId },
            data: { subscriptionTier: 'PRO' },
        });
    }
}