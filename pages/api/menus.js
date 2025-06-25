import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('menus')
      .select('id, name, price, image, category');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }
  if (req.method === 'POST') {
    const { name, price, image, category } = req.body;
    const { error } = await supabase
      .from('menus')
      .insert([{ name, price, image, category }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Menu added' });
  }
  if (req.method === 'PATCH') {
    const { name, price, image, category } = req.body;
    const { id } = req.query;
    const { error } = await supabase
      .from('menus')
      .update({ name, price, image, category })
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Menu updated' });
  }
  res.status(405).end();
} 