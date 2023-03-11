import { supabase } from '../supabaseClient'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const { data, error } = await supabase.from('headlines').select('*').limit(10);
    res.status(200).json(data)
}
