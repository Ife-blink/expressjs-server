import { createClient } from "@supabase/supabase-js";

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

export async function verifyOTP(token, email) {
    try {
      const { data, error } = await supabase
        .from('otp_tokens')
        .select('token')
        .eq('email', email);
  
      if (error) {
        console.error(error);
        return { success: false }; // Return false if there's an error
      }
     
      if (data && data.length > 0) {
        const storedToken = data[0].token;
        
        if (storedToken.toString() === token.toString()) {
            return { success: true }; // Return true if tokens match after converting to strings
          } else {
            return { success: false }; // Return false if tokens don't match
          }
      } else {
        return { success: false }; // Return false if no data found for the given email
      }
    } catch (error) {
      console.error(error);
      return { success: false }; // Return false if an exception occurs
    }
  }
  

  
// const email = 'idasiadiachi@gmail.com'
// const token = '125490'
// verifyOTP(token, email)
// .then((res) => {
//     console.log(res)
// })