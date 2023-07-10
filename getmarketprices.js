import axios from 'axios'

async function fetchHistoricalPrices(symbol, interval, limit) {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/klines', {
        params: {
          symbol: symbol, // e.g., 'BTCUSDT' for Bitcoin/USDT pair
          interval: interval, // e.g., '1h' for 1-hour interval
          limit: limit, // number of data points to fetch
        },
      });
  
      const historicalPrices = response.data.map((item) => {
        return {
          timestamp: item[0], // Open time
          open: parseFloat(item[1]), // Open price
          high: parseFloat(item[2]), // High price
          low: parseFloat(item[3]), // Low price
          close: parseFloat(item[4]), // Close price
          volume: parseFloat(item[5]), // Trade volume
          closeTime: item[6], // Close time
        };
      });
  
      console.log(historicalPrices);
      // Process the historical price data as needed
    } catch (error) {
      console.error('Error fetching historical prices:', error);
    }
  }


  async function fetchHistoricalUSDTPrice() {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/binancecoin/market_chart', {
        params: {
          vs_currency: 'usd',
          days: 0, // Number of days of historical data to fetch
          interval: 'hourly',
        },
      });
  
      const historicalPrices = response.data.prices;
      console.log(historicalPrices);
      // Process the historical price data as needed
    } catch (error) {
      console.error('Error fetching historical USDT price:', error);
    }
  }
  
  fetchHistoricalUSDTPrice();

//  fetchHistoricalPrices('USDTBUSD', '1h', 100);