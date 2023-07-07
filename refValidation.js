import { createClient } from "@supabase/supabase-js";
// import { output } from "./textsplitter.js";
import * as dotenv from 'dotenv'


dotenv.config();

// Supabase project credentials
const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

// Initialize Supabase client
const supabase = createClient(url, privateKey, {
  auth: {
    persistSession: false
  
}});

export function generateReferralCode(length) {
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
    const id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
    const { data, error } = await supabase.from('ref_token')
      .insert({ 
        id: id, 
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
  