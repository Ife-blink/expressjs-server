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


async function getTokenPrice(tokenSymbol) {
    // Function to fetch the current price of a token from an API (e.g., CoinGecko API)
    const apiURL = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenSymbol}&vs_currencies=usd`;
    
    try {
      const response = await fetch(apiURL);
      
      if (response.ok) {
        const data = await response.json();
        return data[tokenSymbol.toLowerCase()]['usd'];
      } else {
        throw new Error("Unable to fetch token price. Please try again later.");
      }
    } catch (error) {
      throw new Error("Unable to fetch token price. Please try again later.");
    }
  }

  async function getUserBalance(userId, tokenName) {
    try {
      // Fetch the user's balance from Supabase
      const { data, error } = await supabase
        .from('balance')
        .select('balance')
        .eq('user_id', userId)
        .eq('token_name', tokenName)
        .single();
  
      if (error) {
        throw new Error('Unable to fetch user balance.');
      }
  
      return data.balance;
    } catch (error) {
      console.error(error);
    }
  }

  
  
  
  
  


async function performTokenSwap(userAddress, tokenFrom, amountFrom, tokenTo) {
  try {
    // Check if the user has enough balance of the 'tokenFrom' to perform the swap
    const userBalance = await getUserBalance(userAddress, tokenFrom);
    
    if (userBalance < amountFrom) {
      throw new Error("Insufficient balance to perform the swap.");
    }
    
    // Fetch the current prices of tokens
    const priceTokenFrom = await getTokenPrice(tokenFrom);
    const priceTokenTo = await getTokenPrice(tokenTo);
    
    // Calculate the amount of 'tokenTo' received for the given 'amountFrom'
    const amountTo = (amountFrom * priceTokenFrom) / priceTokenTo;
    
    // Perform the swap by deducting 'amountFrom' of 'tokenFrom' and adding 'amountTo' of 'tokenTo'
    await updateUserBalance(userAddress, tokenFrom, -amountFrom);
    await updateUserBalance(userAddress, tokenTo, amountTo);
  } catch (error) {
    console.error(error);
  }
}
