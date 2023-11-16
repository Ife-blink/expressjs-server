import { supabase } from "./supabase";

export function generateReferralCode(length?: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = length || 6; // Default length is 6 characters
  let referralCode = '';

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters[randomIndex];
  }

  return referralCode;
}

// Generate a referral code with default length

async function storeToken(referralToken) {
  try {
    const { data, error } = await supabase.from('ref_token')
      .insert({ 
        ref_token: `${referralToken}`, 
         });
    console.log(data);
    console.log(error)

    if (error) {
      throw new Error('Error storing referral token.');
    }
    
    return data !== null; // Returns true if a matching referral token was found
  } catch (error) {
    throw new Error('Error storing referral token.');
  }
}

// const code = generateReferralCode();
// console.log(code); // Example output: "AB3R7X"
// storeToken(code)

export function generateCode() {
  try{
    const code = generateReferralCode();
    console.log(code); // Example output: "AB3R7X"
    storeToken(code)

    return code;
  } catch(error) {
    return error
    throw new Error('Error generating referral token.')
  }
}



export async function verifyReferralToken(referralToken) {
    try {
      const { data, error } = await supabase
        .from('ref_token')
        .select('id')
        .eq('ref_token', referralToken)
        .single();

  
      if (error) {
        console.error('Referral token not found.');
        return false
      }

      
      return data !== null;// Returns true if a matching referral token was found
    } catch (error) {
      throw new Error('Error verifying referral token.');
    }
  }
  
  // const id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
  // verifyReferralToken('HF440I')
  //  .then(results => {
  //   console.log(results)
  //  }) 