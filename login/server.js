import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.post('/login', async (req, res) => {
    // console.log('Login request:', req.body);
    const { email, password, accountType } = req.body;

    // Authenticate using Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // Debug Check: Print data and error
    // console.log("Supabase data:", data);
    // console.log("Supabase error:", error);

    // if (!data.session) {
    //     return res.status(401).json({ error: "No session returned" });
    // }

    if (error) return res.status(401).json({ error: error.message });

    const user = data.user;

    // Check if user exists in Supabase
    const { data: profile, error: profileError } = await supabase
        .from("accounts")
        .select("first_name, last_name, role")
        .eq("user_id", user.id)
        .single();

    // Debug Check: Print error if user not found
    if (profileError) {
        console.log("Not authorize to access profile:", profileError);
        return res.status(500).json({ error: "Failed to fetch account type" });
    }

    // Validate that the selected accountType matches the stored one
    if (profile.role !== accountType) {
        console.log(`Account type mismatch: expected ${profile.role}, got ${accountType}`);
        return res.status(401).json({
            error: `Account type mismatch. This account is registered as '${profile.role}', not '${accountType}'.`
        });
    }

    // Step 4: Continue login
    console.log('Login successful for user:', user.id, 'with account type:', accountType);
    res.json({
        token: data.session.access_token,
        user: {
            id: user.id,
            email: user.email,
            accountType: profile.role,
            firstName: profile.first_name,
            lastName: profile.last_name
        }
    });
});

app.listen(4000, () => console.log('Login service running on port 4000'));