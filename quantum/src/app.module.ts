import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BullModule } from '@nestjs/bull'
import { AppService } from './app.service';
import { TotpService } from './services/totp.service';
import { WebsocketGateway } from './websocket.gateway';
import { InitProcessor } from './processors/init.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'initialize',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TotpService, WebsocketGateway, InitProcessor],
})
export class AppModule {}
