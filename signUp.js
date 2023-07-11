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


export async function signUp(email, password, first_name, last_name, ref_token) {
  try {
    // Register the user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: `${first_name}`,
          last_name: `${last_name}`,
          ref_token: `${ref_token}`,
        },
      },
    });

    if (error) {
      console.error('Error during sign up:', error, data);
      throw new Error('Error during sign up');
    }

    if (data?.user?.identities?.length === 0) {
      console.error('Email already taken');
      throw new Error('Email already taken');
      return { success: false, error: 'Email already taken' };
    }

    console.log(data);
    return { success: true, error: null };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
}


export async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error('Sign-in failed. Please check your credentials and try again.');
    }

    const userId = data; // Retrieve the UUID of the authenticated user

    console.log('User UUID:', error, data);
    return { success: data.user.id };
  } catch (error) {
    console.error('Failed to log in:', error);
    return { error: 'Failed to log in.' };
  }
}



export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      // Handle error during logout
      console.error('Error logging out:', error);
      return { error: 'Failed to log out.' };
    }

    // User logged out successfully
    return { success: true };
  } catch (error) {
    // Return the error
    return { error: 'Failed to log out.' };
  }
}

async function getUser(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user data:', error);
    return;
  }

  const user = data;
  console.log('User data:', user);
}

// getUser('1c822351-3a2b-4066-b7df-28a9535348cf')

const email = "idasiadiachi@gmail.com"
const first_name = 'Ife'
const last_name = 'Baby'
const ref_token = 'HF440I'
const password = "Flexi241"
loginUser(email, password)
// signUp( email, password, first_name, last_name, ref_token )
// .then(results =>{
//   console.log(results)
// })
  