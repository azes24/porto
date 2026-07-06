/* ================================================
   supabase-config.js — Konfigurasi Supabase
   ================================================
   
   CARA MENGISI:
   1. Buka https://supabase.com/ → Login dengan GitHub
   2. Buat New Project → Tunggu selesai
   3. Pergi ke Project Settings > API
   4. Copy "Project URL" dan "anon/public key"
   5. Paste di bawah ini
   ================================================ */

const SUPABASE_URL = 'https://xufdsahxomccepetmdgu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7Kv04furGIBlg3rkDqIZfA_Y3OrWWaJ';
const SUPABASE_BUCKET = 'portfolio-images';

// Initialize Supabase client
let supabase = null;
function getSupabase() {
  if (!supabase && SUPABASE_URL !== 'ISI_SUPABASE_URL_DISINI') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}

function isSupabaseConfigured() {
  return SUPABASE_URL !== 'ISI_SUPABASE_URL_DISINI' && SUPABASE_ANON_KEY !== 'ISI_SUPABASE_ANON_KEY_DISINI';
}
