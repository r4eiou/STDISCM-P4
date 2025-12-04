# STDISCM-P4
Distributed Fault Tolerance

## docker-compose.yml

### 1. Create a docker network (only once):
```bash
    docker network create --subnet 172.20.0.0/16 my-network
```

### 2. Run docker-compose file:
```bash
    docker-compose up -d
```

### 3. If there are changes in the code, rebuild and start again:
```bash
    docker-compose down
    docker-compose up --build
```

### 4. If you only need to restart without rebuilding
```bash
    docker-compose restart
```

### 5. To simulate a server going up or down
- Using Docker Desktop, click Stop or Start on a container.<br>
- Or use the CLI:<br>
```bash
    docker-compose stop <container_name>
    docker-compose start <container_name>
```

### 6. Remove volumes if needed (Optional) 
```bash
    docker-compose down -v
```

## MANUAL RUN

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

    docker run -d --name api1 --net my-network --ip 172.20.0.8 server-image
    docker run -d --name api2 --net my-network --ip 172.20.0.9 server-image

    docker run -d --name frontend --net my-network --ip 172.20.0.10 -p 5173:5173 frontend-image

    docker run -d --name nginx-lb -p 4000:4000 --net my-network -v ./nginx.conf:/etc/nginx/nginx.conf nginx
```

### NOTE:
Ensure your .env files are properly set up for each server (folder/feature) with Supabase URL and service key. 

### FLOW OF REST API MIXED W/ gRPC
![Screenshot](https://drive.google.com/uc?export=view&id=1nboEJj_A7FdZ3HlMswEAhyGLsjxEG9vw)
