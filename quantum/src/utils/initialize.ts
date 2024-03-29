import { createWalletAddresses } from "./helpers";
import { supabase } from "./supabase";



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

  export async function createNotificationField(userId) {
    try {
      // Check if the user exists in the users_balance table
      const { data: existingUser } = await supabase
        .from('isnotificationread')
        .select()
        .eq('user_id', userId);
        console.log(existingUser)
      // If the user does not exist, create a new row with balances set to 0
      if (!existingUser || existingUser.length === 0) {
        const { data, error } = await supabase
          .from('isnotificationread')
          .insert([{ user_id: userId, newnotification: false }])
          .select();
  
        if (error) {
          console.log(error)
          throw new Error('Error creating Notification field');
        }
        
        console.log(data)
        return data;
      }
  
      // User already exists, no action needed
      return null;
    } catch (error) {
      console.error('Error creating user balance:', error);
      return null;
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