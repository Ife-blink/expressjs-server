import express from 'express';
import bodyParser from 'body-parser';
import { verifyReferralToken } from './refValidation.js';
import { createClient } from "@supabase/supabase-js";
// import { output } from "./textsplitter.js";
import * as dotenv from 'dotenv'
import cors from 'cors'
const app = express();

// Supabase project credentials
const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

// Initialize Supabase client
const supabase = createClient(url, privateKey);



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
      // Verify the referral token
      const validReferralToken = await verifyReferralToken(referralToken);
      if (validReferralToken !== true) {
        return res.status(400).json({ error: 'Invalid referral token.' });
      }
  
      // Register the user with Supabase
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        return res.status(500).json({ error: 'Failed to register user.' });
      }
  
      // Handle successful user registration
       // Store additional user information in a separate table
    const { data, error: infoError } = await supabase
    .from('user_info')
    .insert({ 
      id: user.id,
      first_name: firstName,
      ref_token: `${referralToken}`, 

       });
    .insert([
      {
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
      },
    ]);

  if (infoError) {
    // Handle error while storing additional user information
    return res.status(500).json({ error: 'Failed to store user information.' });
  }
  
      return res.status(200).json({ message: 'User registered successfully.' });
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred during registration.' });
    }
  });
  



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})