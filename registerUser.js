import { createClient } from "@supabase/supabase-js";
import { signUp, loginUser, logoutUser } from "./signUp.js";

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


export async function registerUser(ref_token, first_name, last_name, email, password) {
  // auth user
  await signUp(email, password);
 
  try {
    // store user data
    const { data, error } = await supabase.from('users').insert([{ id, first_name, last_name, email, ref_token }]);
    console.log(data);
    console.log(error); 

    if (error) {
      console.error('Error during storage:', error);
      return null;
    }
     return { success: data }
  } catch (error) {
    // Return the error
    return { error: 'Failed to store user information.' };
  } 
}

const ref_token = "pbzxepsdpas"
const first_name = "Ife"
const last_name = "Asiadiachi"
const email = "idasiadiachi@gmail.com"
const password = "Flexi241"



//registerUser(id, ref_token, first_name, last_name, email, password);
registerUser( ref_token, first_name, last_name, email, password )
 .then((results) => {
   console.log(results.success)
 })