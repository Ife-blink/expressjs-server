import express from 'express';
import bodyParser from 'body-parser';
import { verifyReferralToken } from './refValidation.js';
import { signUp } from './signUp.js';
import { createClient } from "@supabase/supabase-js";
import { createUserBalance } from './initializeuser.js';
import { createWalletAddressesIfNotExists } from './initializeuser.js';
import * as dotenv from 'dotenv'
import cors from 'cors'
const app = express();




const router = express.Router()

app.use(cors())

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', router)

app.get('/', (req, res) => {
    res.send('this is the server for the Grant finder application 🚅');
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
  
    try {
       createUserBalance(uuid);
       createWalletAddressesIfNotExists(uuid)

      if (register.success) {
        // Creation successful
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
  



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Quantum server listening on port ${port}`)
})