export function generateOTP() {
    const otpLength = 5;
    let otp = '';
  
    for (let i = 0; i < otpLength; i++) {
      // Generate a random number between 0 and 9 (inclusive)
      const randomDigit = Math.floor(Math.random() * 10);
  
      // Append the random digit to the OTP string
      otp += randomDigit.toString();
    }
    
    console.log(otp)
    return otp;
  }

//  generateOTP()
  
