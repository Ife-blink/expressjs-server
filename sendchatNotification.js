import { createClient } from "@supabase/supabase-js";
import axios from "axios";
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


async function sendNotification(id) {
  // Function to fetch the current price of a token from an API (e.g., CoinGecko API)

  try { 
  const { data, error } = await supabase
  .from('notifications')
  .insert([
  { message: 'You have a new message', user_id: id },
  ])
  .select()

  if(!error){
    updateOrInsertUserNotification(id)
  }

  } catch (error) {
    console.log(error)
    throw new Error('Unable to fetch token price. Please try again later.');
  }
}


async function updateOrInsertUserNotification(userId) {
    // Check if the user with the given userId exists
    const { data: users, error } = await supabase
      .from('isnotificationread')
      .select('user_id')
      .eq('user_id', userId);
     console.log(users)
    if (error) {
      console.error('Error fetching user:', error.message);
      return;
    }
  
    if (users.length === 0) {
      // User doesn't exist, insert a new row
      const { data, error: insertError } = await supabase.from('isnotificationread').insert([
        {
          user_id: userId,
          newnotification: true,
        },
      ]);
  
      if (insertError) {
        console.error('Error inserting new user:', insertError.message);
        return;
      }
  
    } else {
      // User exists, update newnotification field
      const { data, error: updateError } = await supabase
        .from('isnotificationread')
        .update({ newnotification: true })
        .eq('user_id', userId);
  
      if (updateError) {
        console.error('Error updating user:', updateError.message);
        return;
      }
  
      console.log('User updated:', data);
    }
  }

  sendNotification('1c71edf9-5527-42fb-8811-47157f649e1a')