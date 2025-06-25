import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'PATCH') {
    const { status } = req.body;
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Status updated' });
  }
  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Order deleted' });
  }
  res.status(405).end();
} 