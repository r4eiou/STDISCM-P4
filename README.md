# STDISCM-P4
Distributed Fault Tolerance

### 1. Create a docker network
Open a terminal:

```bash
docker network create --subnet 172.20.0.0/16 my-network
```

### 2. Build Docker images (each folder)
Open a terminal:
```bash
    docker build -t frontend-image .
    docker build -t server-image .
    docker build -t login-image .
    docker build -t courses-image .
    docker build -t enroll-image .
    docker build -t grade-image .
    docker build -t encode-image .
```

### 3. Run containers with static IPs (each folder)
Open a terminal:
```bash
    docker run -d --name login-server --net my-network --ip 172.20.0.2 login-image
    docker run -d --name courses-server --net my-network --ip 172.20.0.3 courses-image
    docker run -d --name enroll-server --net my-network --ip 172.20.0.4 enroll-image
    docker run -d --name grade-server --net my-network --ip 172.20.0.5 grade-image

    docker run -d --name encode-server --net my-network --ip 172.20.0.6 encode-image

    docker run -d --name server --net my-network --ip 172.20.0.8 -p 4000:4000 server-image
    docker run -d --name frontend --net my-network --ip 172.20.0.10 -p 5173:5173 frontend-image
```

### NOTE:
Ensure your .env files are properly set up for each server (folder/feature) with Supabase URL and service key. 

### FLOW OF REST API MIXED W/ gRPC
![Screenshot](https://drive.google.com/uc?export=view&id=1nboEJj_A7FdZ3HlMswEAhyGLsjxEG9vw)
