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


async function getTokenPrice(tokenName) {
  // Function to fetch the current price of a token from an API (e.g., CoinGecko API)
  const apiURL = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd`;

  try {
    const response = await axios.get(apiURL);

    if (response.status === 200) {
      const data = response.data;
      //console.log(data[tokenName.toLowerCase()].usd)
      return data[tokenName.toLowerCase()].usd;
    } else {
      throw new Error('Unable to fetch token price. Please try again later.');
    }
  } catch (error) {
    throw new Error('Unable to fetch token price. Please try again later.');
  }
}


  getTokenPrice('bitcoin')

  async function getUserBalance(userId) {
    try {
      // Fetch the user's balance from Supabase
      const { data, error } = await supabase
        .from('users_balance')
        .select('*')
        .eq('user_id', userId)
        .single();
     // console.log(data)
      if (error) {
        throw new Error('Unable to fetch user balance.');
      }
  
      return data.balance;
    } catch (error) {
      console.error(error);
    }
  }

  getUserBalance("4abb6b11-3768-4b86-9515-8d1cd4a9b4cb");

  async function updateUserBalance(userId, tokenName, amount) {
    try {
      // Fetch the user's balance from Supabase
      const { data: userData, error: fetchError } = await supabase
        .from('users_balance')
        .select(tokenName)
        .eq('user_id', userId)
        .single();
       console.log(userData)
      if (fetchError) {
        throw new Error('Unable to fetch user balance.');
      }
  
      const currentBalance = userData[tokenName] || 0;
      const updatedBalance = currentBalance + amount;
  
      // Update the user's balance in Supabase
      const { data: updateData, error: updateError } = await supabase
        .from('users_balance')
        .update({ [tokenName]: updatedBalance })
        .eq('user_id', userId);
  
      if (updateError) {
        throw new Error('Unable to update user balance.');
      }
  
      console.log('User balance updated successfully');
    } catch (error) {
      console.error('Error updating user balance:', error.message);
    }
  }
  
  
  
  
  


export async function performTokenSwap(userId, tokenFrom, amountFrom, tokenTo) {
  try {
    // Check if the user has enough balance of the 'tokenFrom' to perform the swap
    const userBalance = await getUserBalance(userId, tokenFrom);
    
    if (userBalance < amountFrom) {
      throw new Error("Insufficient balance to perform the swap.");
    }
    
    // Fetch the current prices of tokens
    const priceTokenFrom = await getTokenPrice(tokenFrom);
    const priceTokenTo = await getTokenPrice(tokenTo);
    
    // Calculate the amount of 'tokenTo' received for the given 'amountFrom'
    const amountTo = (amountFrom * priceTokenFrom) / priceTokenTo;
    
    // Perform the swap by deducting 'amountFrom' of 'tokenFrom' and adding 'amountTo' of 'tokenTo'
    await updateUserBalance(userId, tokenFrom, -amountFrom);
    await updateUserBalance(userId, tokenTo, amountTo);

      // Record the swap transaction in the "swap_transactions" table
      
      const { data, error } = await supabase
      .from('swap-transactions')
      .insert({
        user_id: userId,
        token_to: tokenTo,
        amount_to: amountTo,
        token_from: tokenFrom,
        amount_from: amountFrom,
      });
    
    console.log([
      {user_id: userId},
      {token_to: tokenTo},
      {amount_to: amountTo},
      {token_from: tokenFrom},
      {amount_from: amountFrom},
    ])
    
    if (error) {
      throw new Error('Unable to record swap transaction.' );
      return { success: false, error: error }
    }

    console.log('Swap transaction recorded successfully');
    return { success: true, error: null }
  } catch (error) {
    console.error(error);
  }
}

const tokenTo = 'ethereum'
const amountFrom = 0.3
const tokenFrom = 'bitcoin'
const userId = "4abb6b11-3768-4b86-9515-8d1cd4a9b4cb"
// performTokenSwap(userId, tokenFrom, amountFrom, tokenTo)
