import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { supabase } from './utils/supabase';
import { performTokenSwap } from './utils/helpers';
import { generateCode } from './utils/refTokens';
import { sendNotification } from './utils/notification';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AppService {

  constructor(@InjectQueue('initialize') private readonly userTasksQueue: Queue) {}

  getHello(): string {
    return 'This is the server for the Quantum backend!';
  };

  async InitializeUser(userId: string) {
    // Queue the tasks
    await this.userTasksQueue.add('createNotificationField', { userId });
    await this.userTasksQueue.add('createUserBalance', { userId });
    await this.userTasksQueue.add('createWalletAddressesIfNotExists', { userId });
  }

  async signUp(email: string, password: string, first_name: string, last_name: string, ref_token: string): Promise<any> {
    try {
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: `${first_name}`,
            last_name: `${last_name}`,
            ref_token: `${ref_token}`,
          },
        },
      });
  
      if (error) {
        console.error('Error during sign up:', error, data);
        throw new HttpException(
          'Error during sign up',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
  
      if (data?.user?.identities?.length === 0) {
        console.error('Email already taken');
        throw new HttpException(
          {
            status: 'error',
            message:
              'Duplicate entry. The provided quicknode ID already exists.',
          },
          HttpStatus.CONFLICT,
        );
      }
  
      console.log(data);
      // don't return success unless the you added the user to the isIntialized field
      return { success: true, error: null };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error during sign up',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } 
  }

  async init(email: string, password: string, first_name: string, last_name: string, ref_token: string): Promise<any> {
    try {
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: `${first_name}`,
            last_name: `${last_name}`,
            ref_token: `${ref_token}`,
          },
        },
      });
  
      if (error) {
        console.error('Error during sign up:', error, data);
        throw new HttpException(
          'Error during sign up',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
  
      if (data?.user?.identities?.length === 0) {
        console.error('Email already taken');
        throw new HttpException(
          {
            status: 'error',
            message:
              'Duplicate entry. The provided quicknode ID already exists.',
          },
          HttpStatus.CONFLICT,
        );
      }
  
      console.log(data);

      return { success: true, error: null };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error during sign up',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } 
  }

  async swap(userId: string, tokenFrom: string, amountFrom: number, tokenTo: string): Promise<any> {
    try {
      const swap = await performTokenSwap(userId, tokenFrom, amountFrom, tokenTo)

      if (swap.success) {
        // Swap-up successful
        return({ message: true });
      } else {
        // Handle swap error
        throw new HttpException(
          'Error during swap',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
        // return res.status(500).json({ error: swap.error });
      };
      
    } catch (error) {
      throw new HttpException(
        'Error during swap',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  };

  async handleRef(): Promise<any> {
    try {
      const code = generateCode();

      return ({ data: code })

    } catch(err) {
      throw new HttpException(
        'Error generating Referral code',
        HttpStatus.EXPECTATION_FAILED
      )
    }
  }

  async sendNotification(from): Promise<any> {
    try {
      const notifcation = sendNotification(from)
      console.log(notifcation);
      return notifcation
    } catch(err){
      console.log(err)
    }
  }
}
