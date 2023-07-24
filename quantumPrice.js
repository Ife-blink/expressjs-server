import { CronJob } from 'cron';
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

async function insertPriceIntoTable(price) {
    const tableName = 'quantum_Price'; // Replace 'your_table_name' with the actual name of your Supabase table
    const columnName = 'value';

    try {
      const { data, error } = await supabase.from(tableName).insert({ [columnName]: price });;
  
      if (error) {
        throw new Error(error.message);
      }
  
      console.log('Price inserted successfully:', data);
    } catch (error) {
      console.error('Error inserting price into table:', error.message);
    }
  }

export const simulatePriceFluctuation = (timestamp) => {
    const frequency = 0.1; // Adjust this value to control the frequency of price changes
    const amplitude = 100; // Adjust this value to control the amplitude of price changes
    const minValue = 1300; // Minimum price value
    const maxValue = 987; // Maximum price value
  
    // Calculate the price fluctuation using sine function
    const fluctuation = Math.sin(2 * Math.PI * frequency * timestamp) * amplitude;
  
    // Normalize the fluctuation to be between 0 and 1
    const normalizedFluctuation = (fluctuation + amplitude) / (2 * amplitude);
  
    // Calculate the price within the specified range (minValue to maxValue)
    const price = minValue + normalizedFluctuation * (maxValue - minValue);
   // console.log(price)
    insertPriceIntoTable(price)
    return price;
  };

  const getTokenPrice = async (tokenSymbol) => {
    // Replace this with your token price fetching logic from an API or database
    // For demonstration, let's use a random initial price and simulate fluctuations
    let initialPrice = Math.random() * 1000; // Random initial price between 0 and 1000
    let currentTimestamp = Date.now();
  
    // Simulate price fluctuation over time
    const priceFluctuation = simulatePriceFluctuation(currentTimestamp);
  
    // Calculate the current price by adding the fluctuation to the initial price
    const currentPrice = initialPrice + priceFluctuation;
    console.log(currentPrice)
    return currentPrice;
  };

 export async function getQTMPrice() {
    //Price is Last entry of the quantuim_Price table
    try {
      const tableName = 'quantum_Price';
      const columnName = 'value';
    
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
   
      // console.log(data[data.length - 1].value)
      if (error) {
        throw new Error(error.message);
      }
  
      if (data) {
        const lastEntry = data[data.length - 1].value;
        console.log('Last Entry:', data[data.length - 1].value);
        return lastEntry;
      } else {
        console.log('Table is empty.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching last entry:', error.message);
      return null;
    }
  }
  
  // Call the function to get the last entry
 

  const job = new CronJob('* * * * * *', async () => {
    console.log('Running price update cron job...');
    //await getTokenPrice('QTM')
    console.log('Price update completed.');
  });
  
  // Start the cron job
  // job.start();

  

//   let currentTimestamp = Date.now();
//   simulatePriceFluctuation(currentTimestamp)