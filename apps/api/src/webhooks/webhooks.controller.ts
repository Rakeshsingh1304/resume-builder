import { Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Webhook } from 'svix';
import { PrismaService } from '../prisma/prisma.service';

@Controller('webhooks')
export class WebhooksController {
    constructor(private prisma: PrismaService) { }

    @Post('clerk')
    async handleClerkWebhook(@Req() req: Request, @Res() res: Response) {
        const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

        if (!webhookSecret) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'Webhook secret not configured',
            });
        }

        const svixId = req.headers['svix-id'] as string;
        const svixTimestamp = req.headers['svix-timestamp'] as string;
        const svixSignature = req.headers['svix-signature'] as string;

        if (!svixId || !svixTimestamp || !svixSignature) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                error: 'Missing svix headers',
            });
        }

        const wh = new Webhook(webhookSecret);
        let event: any;

        try {
            event = wh.verify((req as any).rawBody as Buffer, {
                'svix-id': svixId,
                'svix-timestamp': svixTimestamp,
                'svix-signature': svixSignature,
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                error: 'Webhook verification failed',
            });
        }

        // Handle the event
        if (event.type === 'user.created') {
            try {
                const { email_addresses, first_name, last_name } = event.data;
                console.log('Creating user with data:', { email_addresses, first_name, last_name });

                const newUser = await this.prisma.user.create({
                    data: {
                        email: email_addresses[0]?.email_address ?? '',
                        fullName: `${first_name ?? ''} ${last_name ?? ''}`.trim(),
                        authProvider: 'EMAIL',
                    },
                });

                console.log('User created successfully:', newUser);
            } catch (err) {
                console.error('ERROR CREATING USER:', err);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: 'Failed to create user',
                });
            }
        }

        return res.status(HttpStatus.OK).json({ received: true });
    }
}
