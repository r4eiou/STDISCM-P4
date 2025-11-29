import { createClient } from '@supabase/supabase-js'; 
import dotenv from 'dotenv'; dotenv.config(); 

// Use service_role key from Supabase settings 
export const supabase = createClient( 
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_KEY 
);