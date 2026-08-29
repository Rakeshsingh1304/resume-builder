import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ResumesModule } from './resumes/resumes.module';
import { AiModule } from './ai/ai.module';
import { CoverLettersModule } from './cover-letters/cover-letters.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { InterviewModule } from './interview/interview.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    WebhooksModule,
    ResumesModule,
    AiModule,
    CoverLettersModule,
    AdminModule,
    UsersModule,
    PaymentsModule,
    InterviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }