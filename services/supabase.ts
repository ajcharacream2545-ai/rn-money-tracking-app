import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dtzxoghidxcwtcjenlkr.supabase.co";
const supabaseKey = "sb_publishable_sZhGyXFkZW2AMCCNHkt7OQ_YMm1GT0P";

export const supabase = createClient(supabaseUrl, supabaseKey);
