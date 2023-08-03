import { createClient } from "@supabase/supabase-js";
import { generateOTP } from "./otpGenerator.js";

import * as dotenv from 'dotenv'

dotenv.config();

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const supabase = createClient(url, privateKey, {
  auth: {
    persistSession: false
  
}});

export async function handleOTP(email) {
    const token = generateOTP()
    try {
      const { data: existingData, error: existingError } = await supabase
        .from('otp_tokens')
        .select('email')
        .eq('email', email);
  
      if (existingError) {
        console.error(existingError);
        return { error: 'Error occured while resetting the otp.'}; // Exit early if there's an error while checking for existing email
      }
  
      if (existingData && existingData.length > 0) {
        console.log('Active token already exists in the table.');
        return; // Exit early if the email is already present in the table
      }
  
      const { data, error } = await supabase
        .from('otp_tokens')
        .insert([{ token: `${token}`, email: `${email}` }])
        .select();
  
      if (error) {
        console.error(error);
      } else {
        return { success: true, message: 'Token stored successfully.'}
      }
    } catch (error) {
      console.error(error);
    }
  }

 export async function reStoreOTP(email) {
    try {
      const { data: existingData, error: existingError } = await supabase
        .from('otp_tokens')
        .select('email')
        .eq('email', email);
  
      if (existingError) {
        console.error(existingError);
        return { success: false, error: 'Error while checking for existing email' };
      }
  
      if (existingData && existingData.length > 0) {
        // Delete the existing row if it exists
        const { error: deleteError } = await supabase
          .from('otp_tokens')
          .delete()
          .eq('email', email);
  
        if (deleteError) {
          console.error(deleteError);
          return { success: false, error: 'Error while deleting existing token' };
        }
  
        console.log('Clean up success');
      }
  
      const token = generateOTP();
  
      const { data, error } = await supabase
        .from('otp_tokens')
        .insert([{ token: `${token}`, email: `${email}` }])
        .select();
  
      if (error) {
        console.error(error);
        return { success: false, error: 'Error while inserting new token' };
      } else {
        return { success: true, message: 'Token stored successfully.'};
      }
    } catch (error) {
      console.error(error);
      return { success: false, error: 'An error occurred during the process' };
    }
  }
  

  
  const email = 'idasiadiachi@gmail.com'

//   reStoreOTP(email)
//   .then((res) => {
//     if(res.success){
//         console.log(`${res.message}`)
//     }
//   })



