// your.processor.ts

import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { createUserBalance } from 'src/utils/initialize';
import { createWalletAddressesIfNotExists } from 'src/utils/initialize';
import { createNotificationField } from 'src/utils/initialize';

@Processor('initialize')
export class InitProcessor {
  private readonly logger = new Logger(InitProcessor.name);

  constructor(private readonly appService: AppService) {}

  @Process('createNotificationField')
  async createNotificationField(job) {
    const userId = job.data.userId;
    try {
      await createNotificationField(userId);
    } catch (error) {
      this.logger.error(`Error create notification field: ${error.message}`);
      throw new Error('Retry later'); // You can customize the error handling and retry logic here
    }
  }

  @Process('createUserBalance')
  async createUserBalance(job) {
    const userId = job.data.userId;
    console.log(userId + "here")
    try {
      await createUserBalance(userId);
    } catch (error) {
      this.logger.error(`Error creating user balance: ${error.message}`);
      throw new Error('Retry later');
    }
  }

  @Process('createWalletAddressesIfNotExists')
  async createWalletAddressesIfNotExists(job) {
    const userId = job.data.userId;
    try {
      await createWalletAddressesIfNotExists(userId);
    } catch (error) {
      this.logger.error(`Error creating wallet addresses: ${error.message}`);
      throw new Error('Retry later');
    }
  }
}
