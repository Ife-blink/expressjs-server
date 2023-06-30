import { createClient } from "@supabase/supabase-js";
// import { output } from "./textsplitter.js";
import * as dotenv from 'dotenv'


dotenv.config();

// First, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const supabase = createClient(url, privateKey);

export const run = async () => {

  // const embeddings = await new OpenAIEmbeddings().embedQuery(`You are eligible for this grant if: 
  // - Your program currently (as of 7/18/2022) has at least 50 daily unique signers, as measured by chaincrunch.cc 
  // - You anchor verify with your IDL on apr.dev or add an IDL working with one of the SPL programs, on or after 7/18/2022`

  // const { data, error } = await client
  // .from('user')
  // .insert({ 
  //    content: `You are eligible for this grant if: 
  //    - Your program currently (as of 7/18/2022) has at least 50 daily unique signers, as measured by chaincrunch.cc 
  //    - You anchor verify with your IDL on apr.dev or add an IDL working with one of the SPL programs, on or after 7/18/2022`,
  //    metadata: [{ id: 1 , source: "https://docs.google.com/document/d/1PYYFazs9XxcidJn0Q0zl-XZEHWTaWZh_KX72Ym6qS0Y/edit?ref=blockworks&ref=blockworks"}],
  //    embedding: embeddings,
  //    category: ["Developer Tooling",],
  //    timespent: "6 months",
  //    traction: "At least 60 daily users",
  //    choiceblockchain: "Solana",
  //    teamsize: "2"
  //    })
   
};

export async function registerUser() {
  const pass_token = "passypaspas"
  const first_name = "Erus"
  const last_name = "Asia"
  const email = "idasiadiachi@gmail.com"
  const id = "4d2531b9-fca6-4d49-888e-b712570a8996"

  const { data, error } = await supabase.from('users').insert({ id, first_name, last_name, email, pass_token });
  // Handle registration success or error
  console.log(data, error)
}
registerUser();
//registerUser("idasiadiachi@gmail.com", "password")