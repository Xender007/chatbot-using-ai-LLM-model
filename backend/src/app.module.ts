import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { FaqModule } from './faq/faq.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UploadModule, FaqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
