import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { TotpService } from './services/totp.service';
import { AppService } from './app.service';
import { Totp, generateConfig } from "time2fa";

@Controller()
export class AppController {
  temporarySecrets: Map<string, string>;

  constructor(
    private readonly appService: AppService,
    private readonly totpService: TotpService,
    private readonly websocketGateway: WebsocketGateway,
  ) {
    this.temporarySecrets = new Map();
    }

  @Get()
  ping(): string {
    return this.appService.getHello();
  }

  @Post('swap')
  swap(
    @Body() body: { userId: string, tokenFrom: string, amountFrom: number, tokenTo: string }): any {

    const { userId, tokenFrom, amountFrom, tokenTo } = body

    try {
     const swap = this.appService.swap(userId, tokenFrom, amountFrom, tokenTo)
    } catch(err) {
      throw new HttpException(
        'Something happened during swap',
        HttpStatus.EXPECTATION_FAILED
      )
    }
  }

  @Post('sendOTP')
  sendOTPCode(@Body() body: { userId: string }): { code: string } {
    const userId = body.userId || "asdfrekd24t4pid3nd";

    const key = Totp.generateKey({ issuer: "Quantum", user: "admin@quantum-xch.com" });

    const config = generateConfig({ digits: 6, period: 10 });
    
    const codes = Totp.generatePasscodes({ secret: key.secret }, config);

    this.temporarySecrets.set(userId, key.secret);

    //Add send otp email code here
    return { code: codes[0] };
  }

  @Post('verify')
  verifyTotpCode(
    @Body() body: { userId: string, code: string }
  ): any {
    const { userId, code } = body

    const secret = this.temporarySecrets.get(userId);

    const valid = Totp.validate({ passcode: code, secret: secret });

    console.log(valid);
    
    return valid;
  }

  @Post('signup')
  initialize(@Body() body: { email: string, password: string, first_name: string, last_name: string, ref_token: string }): any {

   const { email, password, first_name, last_name, ref_token } = body
   
   const signUp = this.appService.signUp(email, password, first_name, last_name, ref_token)

   return signUp;
  }

  @Post('initialize')
  async initializeUser(@Body() body: any) {
    const { record: {id}} = body
    console.log(id)
    await this.appService.InitializeUser(id);
    return { success: true };
  }

  @Post('generateRefToken')
  generateRefToken( ): any {
   try {
    const ref = this.appService.handleRef()
    return ref;
   } catch(error) {
    throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
   }
  }

  @Post('sendnotification')
  sendNotification(@Body() body: any ): any {
  const { record: { from }} = body
   try {
    const ref = this.appService.sendNotification(from)
    return ref;
   } catch(error) {
    throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
   }
  }


  @Get('send-message')
  sendMessage(): string {
    this.websocketGateway.sendMessage('Hello from Nest WebSocket!');
    return 'Message sent';
  }
}
