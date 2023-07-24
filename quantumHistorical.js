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


async function generateCoinData() {
    const priceData = [];
    const allTimeHigh = 1617;
    const finalPrice = 1210;
    const maxDifference = 50;
    const specialCasePercentage = 0.7;
  
    // Function to generate random number between two values
    const getRandomValue = (min, max) => {
      return Math.random() * (max - min) + min;
    };
  
    // Generate first number starting from 1.2
    let prevValue = 1.2;
    priceData.push({ time: getTimestamp(365), value: prevValue.toFixed(2) });
  
    let specialCaseCount = 0;
    for (let i = 1; i < 365; i++) {
      let newValue;
  
      if (i <= 50) {
        // For the first 50 entries, ensure the difference doesn't exceed 50
        newValue = getRandomValue(Math.max(prevValue - maxDifference, 1.2), prevValue + maxDifference);
      } else {
        // For the remaining entries, allow a larger difference up to the all-time high
        newValue = getRandomValue(Math.max(prevValue - allTimeHigh, 1.2), allTimeHigh);
      }
  
      if (newValue > prevValue) {
        // Record special cases where new value is greater than previous value
        specialCaseCount++;
      }
  
      prevValue = newValue;

    const  timeStamp = getTimestamp(365 - i)
    const  price = newValue.toFixed(2)

    const { data, error } = await supabase.from('quantum_rice').insert([{
        time: timeStamp,
        value: price
      }]);
      priceData.push({ time: getTimestamp(365 - i), value: newValue.toFixed(2) });
    }
  
    // Check if the special case percentage is met, and if not, adjust the last value accordingly
    const specialCaseThreshold = Math.floor(365 * specialCasePercentage);
    if (specialCaseCount < specialCaseThreshold) {
      // Set the last value as 70% of the all-time high
      priceData[364].value = (allTimeHigh * 0.7).toFixed(2);
    }
  
    // Set the final value to 1210 with today's date as the timestamp
    priceData.push({ time: getTodayTimestamp(), value: finalPrice.toFixed(2) });
  
    // Ensure there are no negative values
    priceData.forEach((entry) => {
      entry.value = Math.max(parseFloat(entry.value), 0).toFixed(2);
    });
  
    return priceData;
  }
  
  // Function to get the timestamp for a given number of days ago from the current date
  function getTimestamp(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  }
  
  // Function to get today's timestamp
  function getTodayTimestamp() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  
  // Example usage:
  
  
  // Log the coin data
  
  
  