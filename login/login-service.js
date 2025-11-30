import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function login(call, callback) {
  const { email, password, accountType } = call.request;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return callback(null, { error: error.message });
  }

  const user = data.user;

  const { data: profile, error: profileError } = await supabase
    .from("accounts")
    .select("first_name, last_name, role")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    return callback(null, { error: "Account does not exist" });
  }

  if (accountType !== profile.role) {
    return callback(null, {
      error: `Incorrect account type. This account is '${profile.role}'.`
    });
  }

  console.log('Login successful for user:', user.id, 'with account type:', accountType);
  return callback(null, {
    token: data.session.access_token,
    id: user.id,
    email: user.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    accountType: profile.role
  });
}