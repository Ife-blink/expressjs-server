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

async function recordSwapTransaction(userId, tokenFrom, amountFrom, tokenTo, amountTo) {
    try {
      const { data, error } = await supabase
        .from('swap_transactions')
        .insert({
          user_id: userId,
          token_from: tokenFrom,
          amount_from: amountFrom,
          token_to: tokenTo,
          amount_to: amountTo,
        });
  
      console.log([
        { user_id: userId },
        { token_from: tokenFrom },
        { amount_from: amountFrom },
        { token_to: tokenTo },
        { amount_to: amountTo },
      ]);
  
      if (error) {
        throw new Error('Unable to record swap transaction.');
      }
  
      console.log('Swap transaction recorded successfully');
    } catch (error) {
      console.error('Error recording swap transaction:', error);
    }
  }
  
  // Test values
  const userId = "4abb6b11-3768-4b86-9515-8d1cd4a9b4cb";
  const tokenFrom = "ETH";
  const amountFrom = 5;
  const tokenTo = "BTC";
  const amountTo = 0.2;
  
  // Call the function with test values
  recordSwapTransaction(userId, tokenFrom, amountFrom, tokenTo, amountTo);
  