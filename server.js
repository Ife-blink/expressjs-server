import express from 'express';
import bodyParser from 'body-parser';
import { CronJob } from 'cron';
import { verifyReferralToken } from './refValidation.js';
import { signUp } from './signUp.js';
import { createClient } from "@supabase/supabase-js";
import { createUserBalance } from './initializeuser.js';
import { performTokenSwap } from './swap.js';
import { generateQTMPrice } from './quantumPrice.js';
import { handleOTP } from './otphandler.js';
import { reStoreOTP } from './otphandler.js';
import { verifyOTP } from './verifyOtp.js';
import { createWalletAddressesIfNotExists } from './initializeuser.js';
import * as dotenv from 'dotenv'
import cors from 'cors'
const app = express();

// const job = new CronJob('0 0 * * *', async () => {
//   console.log('Running price update cron job...');
//   await generateQTMPrice()
//   console.log('Price update completed.');
// });

// // Start the cron job
// job.start();


const router = express.Router()

app.use(cors())

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', router)

app.get('/', (req, res) => {
    res.send('this is the server for the Quantum swap application 🚅');
})


router.post('/signup', async (req, res) => {
    const { email, firstName, lastName, password, referralToken } = req.body;
    // Additional validation and error handling can be done here
  
    try {
      const validReferralToken = await verifyReferralToken(referralToken);
      

      if (!validReferralToken) {
      return res.status(400).json({ error: 'Invalid referral token.' });
      }
  
      // Register the user with Supabase
      const register = await signUp( email, password, firstName, lastName, referralToken ) 
      console.log(register)

      if (register.success) {
        // Sign-up successful
        return res.status(200).json({ message: 'Sign-up successful' });
      } else {
        // Handle sign-up error
        return res.status(500).json({ error: register.error });
      };
      
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred during registration.' });
      console.log(error)
    }
  });

  router.post('/init', async (req, res) => {
    const { uuid } = req.body;
    // Additional validation and error handling can be done here
    console.log(req.body)
    try {
      createUserBalance(uuid);
      createWalletAddressesIfNotExists(uuid)
        .then((response) => {
          if (response.success) {
            // Creation successful
            return res.status(200).json({ message: 'Successfully Initialized' });
          } else {
            // Handle sign-up error
            return res.status(500).json({ error: response.error });
          }
        });
    } catch (error) {
      console.error('An error occurred during initialization:', error);
      return res.status(500).json({ error: 'An error occurred during initialization.' });
    }
  });

  router.post('/swap', async (req, res) => {
    const { userId, tokenFrom, amountFrom, tokenTo } = req.body;
    // Additional validation and error handling can be done here
    try {
      const swap = await performTokenSwap(userId, tokenFrom, amountFrom, tokenTo)

      if (swap.success) {
        // Swap-up successful
        return res.status(200).json({ message: true });
      } else {
        // Handle swap error
        return res.status(500).json({ error: swap.error });
      };
      
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred during swap.' });
      console.log(error)
    }
  });
  

  router.post('/handle-otp', async (req, res) => {
    const { email } = req.body;
    // Additional validation and error handling can be done here
  
    try {
      const otp = await handleOTP(email)

      if (otp.success) {
        // Swap-up successful
        return res.status(200).json({ message: otp.message });
      } else {
        // Handle swap error
        return res.status(500).json({ error: otp.error });
      };
      
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred with token creation.' });
      console.log(error)
    }
  });

  router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;
    // Additional validation and error handling can be done here
  
    try {
      const otp = await reStoreOTP(email)

      if (otp.success) {
        // Swap-up successful
        return res.status(200).json({ message: otp.message });
      } else {
        // Handle swap error
        return res.status(500).json({ error: otp.error });
      };
      
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred with token reset.' });
      console.log(error)
    }
  });

  router.post('/verify-otp', async (req, res) => {
    const { email, token } = req.body;
    // Additional validation and error handling can be done here
  
    try {
      const swap = await verifyOTP(token, email)

      if (swap.success) {
        // Swap-up successful
        return res.status(200).json({ message: true });
      } else {
        // Handle swap error
        return res.status(500).json({ error: swap.error });
      };
      
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred during verification.' });
      console.log(error)
    }
  });
  






const port = process.env.PORT || 3000;
// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0", function () {
  console.log(`Quantum server listening on port ${port}`)
});

