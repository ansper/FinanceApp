import { createClient } from '@supabase/supabase-js';

alert(process.env.REACT_APP_SUPABASE_URL);

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);