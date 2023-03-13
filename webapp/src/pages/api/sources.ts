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
  let { data } = await supabase.from('sources').select('*').order('created_at', { ascending: false }).limit(250);
  res.status(200).json(data)
}
