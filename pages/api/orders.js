import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { menu, size, options, slip_url, ref_code, order_id } = req.body;
    const { error } = await supabase
      .from('orders')
      .insert([{ menu, size, options, slip_url, ref_code, order_id }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Order placed' });
  }
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('orders')
      .select('id, menu, size, options, status, created_at, slip_url, ref_code, order_id')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }
  res.status(405).end();
} 