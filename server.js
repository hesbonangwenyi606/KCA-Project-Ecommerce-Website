import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://qpekiijspwbhxqcjlobc.databasepad.com';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImI3NzdmZTQ4LTJlZjEtNDE4Mi04ZjdjLWNjZjg3ZWVmMmJjZCJ9.eyJwcm9qZWN0SWQiOiJxcGVraWlqc3B3Ymh4cWNqbG9iYyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgwODEwNDgwLCJleHAiOjIwOTYxNzA0ODAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.x2-QF6rbq7dRz9PkXE85VPpX19geZwSlFOWRRi3AZc8';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'dynamic-products-catalog-backend' });
});

app.get('/api/products', async (req, res) => {
  try {
    let query = supabase
      .from('ecom_products')
      .select('*, variants:ecom_product_variants(*)')
      .eq('status', 'active');

    if (req.query.featured === 'true') {
      query = query.contains('tags', ['featured']);
    }

    if (req.query.product_type) {
      query = query.eq('product_type', req.query.product_type);
    }

    const limit = Number(req.query.limit || 0);
    if (limit > 0) query = query.limit(limit);

    const { data, error } = await query;

    if (error) throw error;
    res.json({ products: data || [] });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unable to fetch products' });
  }
});

app.get('/api/collections', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('ecom_collections')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order');

    if (error) throw error;
    res.json({ collections: data || [] });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unable to fetch collections' });
  }
});

app.get('/api/products/:handle', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ecom_products')
      .select('*, variants:ecom_product_variants(*)')
      .eq('handle', req.params.handle)
      .eq('status', 'active')
      .single();

    if (error) throw error;
    res.json({ product: data });
  } catch (error) {
    res.status(404).json({ error: error.message || 'Product not found' });
  }
});

app.get('/api/collections/:handle', async (req, res) => {
  try {
    const { data: collection, error: collectionError } = await supabase
      .from('ecom_collections')
      .select('*')
      .eq('handle', req.params.handle)
      .single();

    if (collectionError) throw collectionError;

    const { data: links = [], error: linkError } = await supabase
      .from('ecom_product_collections')
      .select('product_id, position')
      .eq('collection_id', collection.id)
      .order('position');

    if (linkError) throw linkError;

    const ids = links.map((item) => item.product_id);
    const { data: products = [], error: productsError } = await supabase
      .from('ecom_products')
      .select('*, variants:ecom_product_variants(*)')
      .in('id', ids)
      .eq('status', 'active');

    if (productsError) throw productsError;

    res.json({ collection, products });
  } catch (error) {
    res.status(404).json({ error: error.message || 'Collection not found' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    res.json({ session: data.session, user: data.user });
  } catch (error) {
    res.status(401).json({ error: error.message || 'Sign in failed' });
  }
});

app.post('/api/auth/signout', async (req, res) => {
  try {
    const { userId } = req.body || {};

    if (!userId) {
      return res.status(400).json({ error: 'userId is required.' });
    }

    const { error } = await supabase.auth.admin.signOut(userId);

    if (error) throw error;

    res.json({ ok: true, message: 'Signed out successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Sign out failed' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
      return res.status(401).json({ error: 'Missing bearer token.' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) throw error;

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: error.message || 'Invalid session.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
