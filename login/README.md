
termina1 1: run frontend
```bash
    cd frontend
    npm install
    npm run dev
```

terminal 2: run API gateway
```bash
    npm install express cors dotenv @supabase/supabase-js
    node server.js
```

terminal 3: run grpc server
```bash
    cd login
    npm install express cors dotenv @supabase/supabase-js @grpc/grpc-js @grpc/proto-loader
    node login-server.js
```