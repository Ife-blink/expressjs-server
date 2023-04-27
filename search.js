import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
// import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import * as dotenv from 'dotenv'


dotenv.config();

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);


// {category, description, timespent, teamsize, choiceblockchain, traction}
export const search = async ({category, description, timespent, teamsize, choiceblockchain, traction}) => {
  
  const supabase = createClient(url, privateKey);

  const embeddings = await new OpenAIEmbeddings().embedQuery(`We are a ${category} project building a ${description} for at least ${timespent}.
  We are a team of ${teamsize} building on ${choiceblockchain}. We currently have ${traction} and looking for the best grants for us`)
  /*
  We are a ${category} project building a ${description} for at least ${timespent}.
  We are a team of ${teamsize} building on ${choiceblockchain}. We currently have ${traction} and looking for the best grants for us
  */
  // const { data, error } = await supabase.from('documents').select().textSearch('content', `'this?'`)
  // console.log(data)

  // const { data, error } = await supabase.rpc('documents').select().textSearch('embeddings', `${embeddings}`)
  // console.log(data)

  const matchDocumentsParams = {
    query_embedding: embeddings,
    match_count: 1,
};

  const { data, error } = await supabase.rpc("match_documents", matchDocumentsParams)

  return data
  console.log(data)
};

