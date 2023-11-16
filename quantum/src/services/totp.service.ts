import * as speakeasy from 'speakeasy';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TotpService {
  generateTotpSecret(): string {
    // Generate a new TOTP secret
    const secret = speakeasy.generateSecret({ length: 20 });

    return secret.base32;
  }

  generateTotpCode(secret: string): string {
    // Generate a TOTP code based on the secret
    const totpCode = speakeasy.totp({
      secret: secret,
      encoding: 'base32',
      step: 60
    });

    return totpCode;
  }

  verifyTotpCode(secret: string, code: string): boolean {
    // Verify the entered TOTP code against the stored secret
    const verificationResult = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: code,
      window: 1
    });
  
    console.log('Verification Result:', verificationResult);
  
    if(verificationResult){
      return true
    } else {
      return false
    }
    
  }
  
}