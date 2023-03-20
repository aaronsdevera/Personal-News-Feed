// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!; 
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

type Data = {
  id: string,
  created_at: string,
  source_name: string,
  source_type: string,
  url: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let headlines_array: Array<any> = [];
  let { data } = await supabase.from('sources').select('source_name').order('rank', { ascending: true }).limit(250);
  headlines_array = data;
  let headlines_object: Object = {};
  let headlines_object_array: Array<any> = [];
 for await (const entry of headlines_array) {
    let { data } = await supabase.from('headlines').select('*').eq('source_name',entry.source_name).order('created_at', { ascending: false }).limit(50);
    headlines_object[entry.source_name] = data;
  }
  res.status(200).json(headlines_object)
}
