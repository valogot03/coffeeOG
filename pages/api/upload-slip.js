import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const busboy = require('busboy');
  const bb = busboy({ headers: req.headers });
  let fileBuffer = Buffer.alloc(0);
  let fileName = '';

  bb.on('file', (name, file, info) => {
    fileName = info.filename;
    file.on('data', (data) => {
      fileBuffer = Buffer.concat([fileBuffer, data]);
    });
  });

  bb.on('finish', async () => {
    const ext = fileName.split('.').pop();
    const storagePath = `slips/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from('slips')
      .upload(storagePath, fileBuffer, { contentType: 'image/' + ext });
    if (error) return res.status(500).json({ error: error.message });
    const { publicUrl } = supabase.storage.from('slips').getPublicUrl(storagePath).data;
    res.status(200).json({ url: publicUrl });
  });

  req.pipe(bb);
} 