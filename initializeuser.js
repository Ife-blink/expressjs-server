import { createClient } from "@supabase/supabase-js";
import { createWalletAddresses } from "./storeAddresses.js";
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


async function checkUserBalance(uuid) {
    try {
      // Perform a SELECT query to fetch records with matching UUID
      const { data, error } = await supabase
        .from('users_balance')
        .select()
        .eq('uuid', uuid)
        .limit(1); // Limit to 1 record
  
      if (error) {
        throw new Error('Error querying Supabase');
      }
  
      // Check if any record(s) with the UUID exist
      return data.length > 0 ? true : false;
    } catch (error) {
      console.error('Error checking UUID:', error);
      return false;
    }
  }
  
  // Usage example
//   const uuid = 'your-uuid';
  
//   checkUUIDExists(uuid)
//     .then((exists) => {
//       console.log('UUID exists:', exists);
//     })
//     .catch((error) => {
//       console.error('Error checking UUID:', error);
//     });

   export async function createUserBalance(userId) {
        try {
          // Check if the user exists in the users_balance table
          const { data: existingUser } = await supabase
            .from('users_balance')
            .select()
            .eq('user_id', userId);
          console.log(existingUser)
          // If the user does not exist, create a new row with balances set to 0
          if (!existingUser || existingUser.length === 0) {
            const { data, error } = await supabase
              .from('users_balance')
              .insert([{ user_id: userId, bitcoin: 0, ethereum: 0, solana: 0, quantum: 0 }])
              .select();
      
            if (error) {
              console.log(error)
              throw new Error('Error creating user balance');
            }
            
            console.log(data)
            // Return the newly created user balance row
            return data;
          }
      
          // User already exists, no action needed
          return null;
        } catch (error) {
          console.error('Error creating user balance:', error);
          return null;
        }
      }

export async function createWalletAddressesIfNotExists(userId) {
    try {
      // Check if the user exists in the wallets table
      const { data: existingUser } = await supabase
        .from('wallets')
        .select()
        .eq('user_id', userId);
       console.log(existingUser)
      // If the user does not exist, create and store wallet addresses
      if (!existingUser || existingUser.length === 0) {
        await createWalletAddresses(userId);
        
        const { data, error } = await supabase
        .from('initialized')
        .insert([
        { id: userId, init: true },
        ])
        .select()
        
         if(error){
           return { error: error }
         }
         return{ success: true }
      } else {
        console.log('Wallet addresses already exist for the user');
        return { error: "User already initialized" };
      }
    } catch (error) {
      console.error('Error checking wallet existence:', error.message);
    }
  }
  
//   const userId = '0b779ba2-656e-46af-ac06-35a1855b0bd9'
//  const initialize = await createWalletAddressesIfNotExists(userId)
//   //.then((res) => console.log(res)) 
//   console.log(initialize)