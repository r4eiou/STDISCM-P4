<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
  </a>

<h3 align="center">Shiz University (STDISCM-P4 Final Project)</h3>

  <p align="center">
    A fault-tolerant web-based enrollment system with containerized microservices communicating via REST API and gRPC
    <br />
    <br />
    <a href="https://youtu.be/h1Xx22jENek">View Demo</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<img width="1448" height="855" alt="Image" src="https://github.com/user-attachments/assets/ace6f074-96d1-4ddd-9430-8cf5d54a7c4e" />

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [![CSS](https://img.shields.io/badge/CSS-639?logo=css&logoColor=fff)](https://www.w3.org/Style/CSS/Overview.en.html)
* [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
* [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org)
* [![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](https://react.dev)
* [![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org)
* [![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](https://www.docker.com)
* [![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff)](https://supabase.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
Before you proceed, make sure you have:
#### Required Software
- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/en)
- **npm** (v9.0.0 or higher) - comes with Node.js
- **Docker Desktop** - [Download](https://www.docker.com)
  
  Check your versions:
```bash
  node --version
  npm --version
```

#### Required Accounts
- **Supabase** account (free tier works) - [Sign up](https://supabase.com)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/r4eiou/STDISCM-P4
   ```
2. Install NPM packages (both frontend and backend)
  ```sh
  # install backend dependencies
  npm install

  # install frontend dependencies
  cd frontend
  npm install
  ```
3. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

#### Setup Docker
docker-compose.yml

1. Create a docker network (only once):
```bash
    docker network create --subnet 172.20.0.0/16 my-network
```

2. Run docker-compose file:
```bash
    docker-compose up -d
```

3. If there are changes in the code, rebuild and start again:
```bash
    docker-compose down
    docker-compose up --build
```

4. If you only need to restart without rebuilding
```bash
    docker-compose restart
```

5. To simulate a server going up or down
- Using Docker Desktop, click Stop or Start on a container.<br>
- Or use the CLI:<br>
```bash
    docker-compose stop <container_name>
    docker-compose start <container_name>
```

6. Remove volumes if needed (Optional) 
```bash
    docker-compose down -v
```

For manually running docker:

1. Create a docker network
Open a terminal:

```bash
docker network create --subnet 172.20.0.0/16 my-network
```

2. Build Docker images (each folder)
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

3. Run containers with static IPs (each folder)
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

#### Run Frontend
```sh
   cd frontend
   npm run dev
   ```


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Clarissa Albarracin
Miko Santos
Reina Althea Garcia
Peter David

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- Shields.io badges. You can a comprehensive list with many more badges at: https://github.com/inttter/md-badges -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
