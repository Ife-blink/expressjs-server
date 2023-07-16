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
  }})

async function deposit(userId, depositAmount) {
  try {
    // Fetch the current balance row from the table
    const { data, error } = await supabase
      .from('users_balance')
      .select('bitcoin')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Row not found');
    }
    console.log(depositAmount)
    // Increment the balance by the deposit amount
    const updatedBalance = data.bitcoin + depositAmount;

    // Update the balance row with the new value
    const { data: updataData, error: updateError } = await supabase
      .from('users_balance')
      .update({ bitcoin: updatedBalance })
      .eq('user_id', userId);

    if (updateError) {
      throw new Error(updateError.message);
    }
    console.log(updataData)
    console.log('Balance updated successfully');
  } catch (error) {
    console.error('Error updating balance:', error.message);
  }
}

deposit("4abb6b11-3768-4b86-9515-8d1cd4a9b4cb", 5);