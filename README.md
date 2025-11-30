# STDISCM-P4
Distributed Fault Tolerance

### 1. Run the Frontend
Open a terminal:

```bash
cd frontend
npm install
npm run dev
```
Then open localhost link

### 2. Run API Gateway (server.js)
Open a terminal:
```bash
    npm install express cors dotenv @supabase/supabase-js
    node server.js
```

### 3. Run gRPC Servers (One per Feature)
Open a terminal:
```bash
    cd <feature-folder>  # e.g., login, courses
    npm install express cors dotenv @supabase/supabase-js @grpc/grpc-js @grpc/proto-loader
    node <feature>-server.js  # e.g., login-server.js
```

### NOTE:
Ensure your .env files are properly set up for each server with your Supabase URL and service key:

SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_KEY=<your-supabase-service-key>
